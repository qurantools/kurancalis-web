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

        factory.login = function (faceBookResponseMethod) {
            if (config_data.isMobile) {
                var permissions = 'email';
                var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + "400142910165594" + "&response_type=code&redirect_uri=" + encodeURIComponent(config_data.mobileAddress+ "/components/mobile_auth/login_callback.html") + "&scope=" + permissions;
                window.location = permissionUrl;
                return;
            }

            var responseData = {loggedIn: false, token: ""};

            Facebook.login(function (response) {
                fbLoginStatus = response.status;
                tokenFb = response.authResponse.accessToken;
                if (tokenFb != "") {
                    access_token = "";
                    var user = new User();

                    user.fb_access_token = tokenFb;
                    user.$save({fb_access_token: tokenFb},
                        function (data, headers) {
                            //get token
                            responseData.token = data.token;
                            responseData.loggedIn = true;
                            faceBookResponseMethod(responseData);
                        },
                        function (error) {
                            if (error.data.code == '209') {
                                alert("Sisteme giriş yapabilmek için e-posta adresi paylaşımına izin vermeniz gerekmektedir.");
                            }

                            //factory.log_out();
                            responseData.loggedIn = false;
                            responseData.token = "error";
                            faceBookResponseMethod(responseData);
                        }
                    );
                }
            }, {scope: 'email'});
        };


        factory.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': access_token}).then(function (theUser) {
                    user = theUser;
                }
            );
        };

        factory.logOut = function (faceBookResponseMethod) {
            var responseData = {loggedOut: false};
            if (typeof annotator != 'undefined') {
                annotator.destroy();
            }


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