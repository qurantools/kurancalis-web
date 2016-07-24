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

    });