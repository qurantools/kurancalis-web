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
                    $("#loginModal").modal("show");
                }
            },3000)
        }
    };

    $scope.init();
});

