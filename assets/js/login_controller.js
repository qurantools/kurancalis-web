angular.module('ionicApp')
    .controller('LoginController', function($scope, $state, $q, $ionicLoading, localStorageService, authorization) {

        var onFacebookLoginSuccess = function(){};
        var onFacebookLogOutSuccess = function(){};

        $scope.facebookSignIn = function(){
            authorization.facebookSignIn($scope.onFacebookLoginSuccess);
        }

        $scope.facebookSignOut = function () {
            authorization.facebookSignOut($scope.onFacebookLogOutSuccess);
        }
    });