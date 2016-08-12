angular.module('ionicApp')
    .controller('LoginController', function($scope, $state, $q, $ionicLoading, localStorageService, authorization, $location) {

        $scope.facebookSignIn = function(){
            var nativeApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            if (!nativeApp) {
                authorization.login($scope.onFacebookLoginSuccess);
                $location.path('/');
            }else{
                authorization.facebookSignIn($scope.onFacebookLoginSuccess);
                $location.path('/');
            }
        }

    });