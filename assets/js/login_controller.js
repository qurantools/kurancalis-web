angular.module('ionicApp')
    .controller('LoginController', function($scope, $state, $q, $ionicLoading, localStorageService, authorization, $location) {

        var onFacebookLogOutSuccess = function(){};

        $scope.facebookSignIn = function(){
            var nativeApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            if (!nativeApp) {
                authorization.login($scope.onFacebookLoginSuccess);
            }else{
                authorization.facebookSignIn($scope.onFacebookLoginSuccess);
            }
        }

        $scope.onFacebookLoginSuccess = function(responseData){
            if (responseData.loggedIn == false) {
                $scope.loggedIn = false;
                $scope.logOut();
            } else {
                $scope.access_token = responseData.token;
                $scope.user = responseData.user;
                $scope.loggedIn = true;

                $scope.$broadcast('login', responseData);
                $scope.$broadcast('userInfoReady');
                $location.path('translations/');
            }
        };

        $scope.facebookSignOut = function () {
            authorization.facebookSignOut($scope.onFacebookLogOutSuccess);
        }
    });