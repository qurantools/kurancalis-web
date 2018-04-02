 angular.module('ionicApp')
    .controller('SocialShareCtrl', function ($scope, $timeout, $routeParams, Restangular, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider, $ionicScrollDelegate, $ionicPopup, localStorageService, navigationManager, $translate) {

        $scope.shareUrl = "";
        $scope.shareTitle = "Ayet Paylaşma";

        $scope.initController = function () {

            $scope.url = "kurancalis";
            if(config_data.webAddress.indexOf("localhost") > -1)
                $scope.url  = "localhost";
            else
                $scope.url ="test.kurancalis";

            $scope.openInnerPopover = function (verseId) {
                console.log("verseId ", verseId)
                $scope.verseId = verseId;
                $scope.shareUrl =  config_data.webAddress + "/__/verse/display/" + verseId;
                $scope.scopeApply();

            };

            // listen for Offline event
            $scope.$on('social_share_verse_id', function(evt, data){

                $scope.openInnerPopover(data);
            });

        }


        //initialization
        $scope.initController();
  });