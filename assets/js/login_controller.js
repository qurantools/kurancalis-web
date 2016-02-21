angular.module('ionicApp')
    .controller('LoginController', function($scope, $state, $q, $ionicLoading, localStorageService) {
        // This is the success callback from the login method
        var fbLoginSuccess = function(response) {
            if (!response.authResponse){
                fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse)
                .then(function(profileInfo) {
                    // For the purpose of this example I will store user data on local storage
                    localStorageService.set ("facebook_user_info",JSON.stringify({
                        authResponse: authResponse,
                        id: profileInfo.id,
                        name: profileInfo.name,
                        email: profileInfo.email,
                        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                    }));
                    $scope.loginSuccessSetParamAndRedirect(profileInfo);
                }, function(fail){
                    $scope.loginFailSetParam();
                });
        };

        // This is the fail callback from the login method
        var fbLoginError = function(error){
            $scope.loginFailSetParam();
        };

        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function (authResponse) {
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
        $scope.facebookSignIn = function() {
            facebookConnectPlugin.getLoginStatus(function(success){
                if(success.status === 'connected'){
                    // The user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success.status);

                    // Check if we have our user saved
                    var user = localStorageService.get('facebook_user_info');
                    if(!user.userID){
                        getFacebookProfileInfo(success.authResponse)
                            .then(function(profileInfo) {
                                // For the purpose of this example I will store user data on local storage
                                localStorageService.set("facebook_user_info",JSON.stringify({
                                    authResponse: success.authResponse,
                                    id: profileInfo.id,
                                    name: profileInfo.name,
                                    email: profileInfo.email,
                                    picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                                }));
                                $scope.loginSuccessSetParamAndRedirect(profileInfo);
                            }, function(fail){
                                $scope.loginFailSetParam();
                            });
                    }else{
                        $scope.loginFailSetParam();
                    }
                } else {
                    // If (success.status === 'not_authorized') the user is logged in to Facebook,
                    // but has not authenticated your app
                    // Else the person is not logged into Facebook,
                    // so we're not sure if they are logged into this app or not.

                    console.log('getLoginStatus', success.status);
                    $ionicLoading.show({
                        template: 'Logging in...'
                    });

                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'user_friends'], fbLoginSuccess, fbLoginError);
                }
            });
        };

        $scope.initLoginController = function () {
            var user = localStorageService.get('facebook_user_info');
            if (user !== null){
                $scope.loginSuccessSetParamAndRedirect(user);
                return;
            }
        }

        $scope.gotoTranslations = function () {
            window.location.href =  "#/translations/";
        }

        $scope.loginSuccessSetParamAndRedirect = function (data) {
            facebookConnectPlugin.getAccessToken(function(response){
                return localStorageService.set('access_token', response);
            });
            $scope.user = data;
            $scope.loggedIn = true;
            $ionicLoading.hide();
            $scope.gotoTranslations();
            $scope.$broadcast('login', responseData);
            $scope.$broadcast('userInfoReady');
        }

        $scope.loginFailSetParam = function () {
            $scope.user = null;
            $scope.loggedIn = false;
            $ionicLoading.hide();
        }

        $scope.initLoginController();
    });