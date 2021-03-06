var authorizationModule = angular.module('authorizationModule', ['facebook', 'LocalStorageModule', 'restangular']);

authorizationModule.factory("authorization", function (Facebook, User, localStorageService, Restangular, $ionicLoading, $q) {

        var fbLoginStatus = 'disconnected';
        var factory = {};
        factory.access_token="";
        factory.faceBookResponseMethod = function(){};

        factory.login = function (faceBookResponseMethod) {

            var permissions = 'email,user_friends';

            if (config_data.isMobile && !config_data.isNative) {
                //different FB login for mobile web app
                var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + config_data.FBAppID + "&response_type=code&redirect_uri=" + encodeURIComponent(config_data.mobileLoginCallbackAddress) + "&scope=" + permissions;
                window.location = permissionUrl;
                return;
            }else if(config_data.isMobile && config_data.isNative) {
                //different FB login for cordoba
                // Settings

                /*openFB.login(
                    function(response) {
                        if(response.status === 'connected') {
                            var token = response.authResponse.accessToken;
                            factory.onFBLoginResponse(token, faceBookResponseMethod);
                        } else {
                            alert('Facebook girişi başarısız');
                        }
                    }, {scope: permissions});*/
                factory.facebookSignIn(faceBookResponseMethod);
                return;
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

                var headers = {'Content-Type': 'application/x-www-form-urlencoded'};

                var postData = [];
                postData.push(encodeURIComponent("fb_access_token") + "=" + tokenFb);
                var data = postData.join("&");
                var userRestangular = Restangular.all("users");

                userRestangular.customPOST(data, '', '', headers).then(
                    function(response){
                        //get token
                        responseData.token = response.token;
                        responseData.loggedIn = true;
                        responseData.user = response.user;

                        //set cookie
                        localStorageService.set('access_token', response.token);
                        faceBookResponseMethod(responseData);
                    },
                    function(resp) {
                        if (resp.data.code == '209') {
                            alert("Sisteme giriş yapabilmek için e-posta adresi paylaşımına izin vermeniz gerekmektedir.");
                        }
                        else if( resp.data.code == '217') {
                            alert("Sisteme giriş yapabilmek için arkadaş listesi paylaşımına izin vermeniz gerekmektedir.");
                        }

                        //factory.log_out();
                        responseData.loggedIn = false;
                        responseData.token = "error";
                        //remove cookie if exist
                        localStorageService.remove('access_token');
                        faceBookResponseMethod(responseData);
                    });
            }
        }

        factory.logOut = function (faceBookResponseMethod) {
            var responseData = {loggedOut: false};
            if (config_data.isNative){
                facebookConnectPlugin.getLoginStatus(function(response){
                    fbLoginStatus = response.status;
                });
            }else{
                //remove auth
                Facebook.api({
                    method: 'Auth.revokeAuthorization'
                }, function (response) {
                    Facebook.getLoginStatus(function (response) {
                        fbLoginStatus = response.status;
                    });
                });
            }

            localStorageService.remove('access_token');
            //localStorageService.clear();
            responseData.loggedOut=true;
            faceBookResponseMethod(responseData);
        };

        factory.getAccessToken = function(){
            return localStorageService.get('access_token');
        }
/****************************NATIVE LOGIN**********************************************************************/
        factory.fbLoginSuccess = function(response, faceBookResponseMethod) {
            $ionicLoading.hide();
            if (!response.authResponse){
                console.log(response);
                alert('Facebook girişi başarısız');
                return;
            }
            factory.onFBLoginResponse(response.authResponse.accessToken, faceBookResponseMethod);
        };

        factory.fbLoginError = function(error, faceBookResponseMethod){
            $ionicLoading.hide();
            alert('Facebook girişi başarısız');
        };

        //This method is executed when the user press the "Login with facebook" button
        factory.facebookSignIn = function(faceBookResponseMethod) {
            $ionicLoading.show({
                template: 'Logging in...'
            });
            facebookConnectPlugin.logout(); //cleaning for a bug on IOS
            facebookConnectPlugin.login(['email', 'user_friends'], function(response){
                factory.fbLoginSuccess (response, faceBookResponseMethod);
            }, function(response){
                console.log(response);
                factory.fbLoginError (response, faceBookResponseMethod);
            });
        };

        return factory;
    });