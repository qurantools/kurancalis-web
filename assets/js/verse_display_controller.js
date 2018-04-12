angular.module('ionicApp')
 .controller('VerseDisplayCtrl', function ($scope, $timeout, $routeParams, Restangular, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider, $ionicScrollDelegate, $ionicPopup, localStorageService, navigationManager, $translate) {

    $scope.init = function () {
        if (url.indexOf("/verse/display/") > -1) {

            $timeout(function () {
                if ($routeParams.hasOwnProperty("verseId")) {
                    $scope.showVerseDetail($routeParams.verseId, [], [$scope.CIRCLE_PUBLIC]);
                } else {
                    console.log("verseId could not found")
                }
            });

            $timeout(function(){
                //show login panel if user not login yet
                if(!$scope.loggedIn && $scope.user == null){
                    if(!config_data.isMobile) {
                        $("#loginModal").modal("show");
                    } else {
                        $scope.openModal('user_login')
                    }
                }
            },3000)
        }
    };

    $scope.init();
});

