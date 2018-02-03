/**
 * Created by Erata on 30/01/18.
 */

var mymodal = angular.module('ionicApp')
    .controller('AccountCtrl', function ($rootScope,$scope,$q, $routeParams, $location, $timeout,$ionicModal, authorization, localStorageService, Restangular, $translate) {

        $scope.accountCreateRequestSent = false;
        $scope.resetPasswordRequestSent = false;
        $scope.isUserExist = true;

        $scope.user = {};

        $scope.initParams = function () {
            $scope.accountCreateRequestSent = false;
            $scope.resetPasswordRequestSent = false;

            $scope.user.name = "";
            $scope.user.email = "";
            $scope.user.password = "";
            $scope.user.confirm_password = "";
        };

        $scope.resetForm = function (form) {
            form.$setPristine();
            form.$setUntouched();
        };

        $scope.loginWithEmail = function () {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
            var postData = [];
            postData.push(encodeURIComponent("email") + "=" + encodeURIComponent($scope.user.email));
            postData.push(encodeURIComponent("password") + "=" + encodeURIComponent($scope.user.password));
            var data = postData.join("&");
            var loginWithEmail = Restangular.one("users/login");

            loginWithEmail.customPOST(data, '', '', headers).then(function (response) {
                console.log("result", response);
                authorization.login($scope.onEmailLoginSuccess);

            }, function(error) {
                console.log("There was an error", error);
            });

            //$scope.initParams();
        };

        $scope.onEmailLoginSuccess = function (responseData) {

            $scope.access_token = responseData.token;
            $scope.user = responseData.user;
            $scope.loggedIn = true;

            console.log("access_token::", $scope.access_token);

            $scope.$broadcast('login', responseData);
            $scope.$broadcast('userInfoReady');
            console.log("location:"+$location.path() );
            if($location.path() == "/login/"){
                $location.path('/');
            }

        }

        $scope.createAccount = function () {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var postData = [];
            postData.push(encodeURIComponent("name") + "=" + encodeURIComponent($scope.user.name));
            postData.push(encodeURIComponent("email") + "=" + encodeURIComponent($scope.user.email));
            postData.push(encodeURIComponent("password") + "=" + encodeURIComponent($scope.user.password));
            var data = postData.join("&");
            var createUser = Restangular.one("users/register");

            createUser.customPOST(data, '', '', headers).then(function (result) {
                $scope.accountCreateRequestSent = true;
            });
        };

        $scope.resetPassword = function () {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
            var postData = [];
            postData.push(encodeURIComponent("email") + "=" + encodeURIComponent($scope.user.email));
            var data = postData.join("&");
            var resetPassword = Restangular.one("users/reset_password");

            resetPassword.customPOST(data, '', '', headers).then(function (result) {
                console.log("result", result);
                $scope.resetPasswordRequestSent = true;
            }, function(error) {
                console.log("There was an error", error);

                if(error.hasOwnProperty("data") && error.data.code == 210){
                    $scope.isUserExist = false;
                }

            });
            //$scope.initParams();
        };

        $scope.getLoginMenu = function(){
            $scope.item = {};
            $scope.item.name = "";
            var promptPopup = $ionicPopup.prompt({
                template: '<input type="text" ng-model="item.name">',
                title: $translate.instant('Login'),
                scope : $scope,
                inputType: 'text',
                inputPlaceholder: $translate.instant('Çevre Tanımı')
            });

            promptPopup.then(function(res) {
                if (isDefined(res) && $scope.item.name != ""){
                    $scope.cevrekle($scope.item.name);
                }
            });
        };

        $scope.initParams();

    });