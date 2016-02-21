angular.module('ionicApp')
    .controller('LoginController', function($scope, $state, $q, $ionicLoading, localStorageService, authorization, $location) {

        var onFacebookLogOutSuccess = function(){};

        $scope.facebookSignIn = function(){
            authorization.facebookSignIn($scope.onFacebookLoginSuccess);
        }

        $scope.onFacebookLoginSuccess = function(responseData){
            alert("login controller onFacebookLoginSuccess loggedIn : "+ responseData.loggedIn);
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