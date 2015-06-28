var authorizationModule = angular.module('authorizationModule', ['facebook', 'LocalStorageModule', 'restangular']);

authorizationModule.factory('User', function ($resource) {

    return $resource(config_data.webServiceUrl + '/users',
        {},

        {
            query: {
                method: 'GET',
                headers: {
                    "access_token": this.accessToken
                },
                isArray: false
            },
            save: {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                isArray: false
            }
        }
    );
}).


    factory("authorization", function (Facebook, User, localStorageService, Restangular) {

        fbLoginStatus = 'disconnected';
        facebookIsReady = false;
        var factory = {};
        factory.access_token="";
        factory.faceBookResponseMethod = function(){};

        factory.login = function (faceBookResponseMethod) {

            var nativeApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            var permissions = 'email';

            if (config_data.isMobile && !nativeApp) {
                //different FB login for mobile web app
                var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + config_data.FBAppID + "&response_type=code&redirect_uri=" + encodeURIComponent(config_data.mobileLoginCallbackAddress) + "&scope=" + permissions;
                window.location = permissionUrl;
                return;
            }
            else if(config_data.isMobile && nativeApp) {
                //different FB login for cordoba
                // Settings

                openFB.login(
                    function(response) {
                        if(response.status === 'connected') {
                            var token = response.authResponse.accessToken;
                            factory.onFBLoginResponse(token, faceBookResponseMethod);
                        } else {
                            alert('Facebook girişi başarısız');
                        }
                    }, {scope: permissions});

            }


            Facebook.login(
                function(response){
                    var token = response.authResponse.accessToken;
                    factory.onFBLoginResponse(token, faceBookResponseMethod);
                } , {scope: permissions});
        };


        factory.onFBLoginResponse=function (tokenFb, faceBookResponseMethod ) {
            var responseData = {loggedIn: false, token: ""};

            if (tokenFb != "") {
                var user = new User();

                user.fb_access_token = tokenFb;
                user.$save({fb_access_token: tokenFb},
                    function (data, headers) {
                        //get token
                        responseData.token = data.token;
                        responseData.loggedIn = true;
                        responseData.user = data.user;

                        //set cookie
                        localStorageService.set('access_token', data.token);
                        faceBookResponseMethod(responseData);
                    },
                    function (error) {
                        if (error.data.code == '209') {
                            alert("Sisteme giriş yapabilmek için e-posta adresi paylaşımına izin vermeniz gerekmektedir.");
                        }

                        //factory.log_out();
                        responseData.loggedIn = false;
                        responseData.token = "error";
                        //remove cookie if exist
                        localStorageService.remove('access_token');
                        faceBookResponseMethod(responseData);
                    }
                );
            }
        }


        /*
        factory.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': access_token}).then(function (theUser) {
                    user = theUser;
                }
            );
        };

        */

        factory.logOut = function (faceBookResponseMethod) {
            var responseData = {loggedOut: false};

            //remove auth
            Facebook.api({
                method: 'Auth.revokeAuthorization'
            }, function (response) {
                Facebook.getLoginStatus(function (response) {
                    fbLoginStatus = response.status;
                });
            });

            localStorageService.remove('access_token');
            responseData.loggedOut=true;
            faceBookResponseMethod(responseData);
        };

        factory.getAccessToken = function(){
            return localStorageService.get('access_token');
        }

        return factory;
    });