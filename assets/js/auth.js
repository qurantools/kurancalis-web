var authorizationModule = angular.module('authorizationModule', ['facebook', 'LocalStorageModule', 'restangular']);

authorizationModule.factory("authorization", function (Facebook, User, localStorageService, Restangular, $ionicLoading, $q) {

        var fbLoginStatus = 'disconnected';
        var factory = {};
        factory.access_token="";
        factory.faceBookResponseMethod = function(){};

        factory.login = function (faceBookResponseMethod) {

            var nativeApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            var permissions = 'email,user_friends';

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

                var headers = {'Content-Type': 'application/x-www-form-urlencoded'};

                var postData = [];
                postData.push(encodeURIComponent("fb_access_token") + "=" + tokenFb);
                var data = postData.join("&");
                var userRestangular = Restangular.all("users");

                userRestangular.customPOST(data, '', '', headers).then(
                    function(data){

                        //get token
                        responseData.token = data.token;
                        responseData.loggedIn = true;
                        responseData.user = data.user;

                        //set cookie
                        localStorageService.set('access_token', data.token);
                        faceBookResponseMethod(responseData);
                    },
                    function(response) {
                        if (error.data.code == '209') {
                            alert("Sisteme giriş yapabilmek için e-posta adresi paylaşımına izin vermeniz gerekmektedir.");
                        }
                        else if( error.data.code == '217') {
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
/****************************NATIVE LOGIN**********************************************************************/
        factory.fbLoginSuccess = function(response, faceBookResponseMethod) {
            if (!response.authResponse){
                factory.fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;
            factory.getFacebookProfileInfo(authResponse)
                .then(function(profileInfo) {
                    // For the purpose of this example I will store user data on local storage
                    localStorageService.set ("facebook_user_info",JSON.stringify({
                        authResponse: authResponse,
                        id: profileInfo.id,
                        name: profileInfo.name,
                        email: profileInfo.email,
                        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                    }));
                    localStorageService.set('access_token', authResponse.accessToken);
                    factory.callBack(true, faceBookResponseMethod);
                }, function(fail){
                    factory.callBack(false, faceBookResponseMethod);
                });
        };

        // This is the fail callback from the login method
        factory.fbLoginError = function(error, faceBookResponseMethod){
            factory.callBack(false, faceBookResponseMethod);
        };

        // This method is to get the user profile info from the facebook api
        factory.getFacebookProfileInfo = function (authResponse) {
            var info = $q.defer();
            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
                function (response) {
                    console.log(response);
                    info.resolve(response);
                },
                function (response) {
                    console.log(response);
                    info.reject(response);
                }
            );
            return info.promise;
        };

        //This method is executed when the user press the "Login with facebook" button
        factory.facebookSignIn = function(faceBookResponseMethod) {
            $ionicLoading.show({
                template: 'Logging in...'
            });
            facebookConnectPlugin.getLoginStatus(function(success){
                if(success.status === 'connected'){
                    // The user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success.status);

                    // Check if we have our user saved
                    var user = localStorageService.get('facebook_user_info');
                    var responseData = {};
                    if(!user.userID){
                        factory.getFacebookProfileInfo(success.authResponse)
                            .then(function(profileInfo) {
                                // For the purpose of this example I will store user data on local storage
                                localStorageService.set("facebook_user_info",JSON.stringify({
                                    authResponse: success.authResponse,
                                    id: profileInfo.id,
                                    name: profileInfo.name,
                                    email: profileInfo.email,
                                    picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                                }));

                                //get token
                                localStorageService.set('access_token', success.authResponse.accessToken);
                                factory.callBack(true, faceBookResponseMethod);
                            }, function(fail){
                                factory.callBack(false, faceBookResponseMethod);
                            });
                    }else{
                        factory.callBack(false, faceBookResponseMethod);
                    }
                } else {
                    // If (success.status === 'not_authorized') the user is logged in to Facebook,
                    // but has not authenticated your app
                    // Else the person is not logged into Facebook,
                    // so we're not sure if they are logged into this app or not.
                    console.log('getLoginStatus', success.status);

                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'user_friends'], function(response){
                        factory.fbLoginSuccess (response,faceBookResponseMethod);
                    }, function(response){
                        factory.fbLoginError (response, faceBookResponseMethod);
                    });
                }
            });
        };

       factory.callBack = function(isSuccess, faceBookResponseMethod){
           var responseData = {};
            if (isSuccess){
                responseData.token = localStorageService.get('access_token');
                responseData.loggedIn = true;
                responseData.user = localStorageService.get('facebook_user_info');
                //set cookie
                localStorageService.set('access_token', responseData.token);
                faceBookResponseMethod(responseData);
            }else{
                responseData.loggedIn = false;
                responseData.token = "error";
                //remove cookie if exist
                localStorageService.remove('access_token');
                faceBookResponseMethod(responseData);
            }
            $ionicLoading.hide();
       };

        return factory;
    });