angular.module('ionicApp')
    .controller('HomeCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {
        console.log("HomeCtrl");
        $scope.currentPage = $scope.getCurrentPage();

        $scope.list_translations();


        $scope.checkUserLoginStatus();
        $scope.submitEditor2 = function () {
            $scope.submitEditor($scope.theTags);
        }

        $scope.resetAnnotationFilter = function () {
            $scope.filteredAnnotations = [];
            $scope.searchText = '';
        }


        $scope.annotationTextSearch = function (item) {
//TODO: filtre mobilde çalışmıyor
            if (config_data.isMobile) {
                if (document.getElementById("searchText") && document.getElementById("searchText").value) {
                    var searchText = document.getElementById("searchText").value.toLowerCase();
                    console.log("searchText" + searchText)
                    $scope.searchText = searchText;
                }
            } else {
                var searchText = $scope.searchText.toLowerCase();
            }
            var tags = '';
            if (typeof item.tags[0] != 'undefined')tags = item.tags[0].toLowerCase();
            if (item.quote.toLowerCase().indexOf(searchText) > -1 || item.text.toLowerCase().indexOf(searchText) > -1 || tags.indexOf(searchText) > -1) {
                console.log("true")
                return true;
            } else {
                console.log("false")
                return false;
            }
        }

        $scope.annotationFilter = function (item) {
            if (typeof $scope.filteredAnnotations == 'undefined' || $scope.filteredAnnotations.length == 0) {
                return true;
            } else {
                var found = 0;
                for (i = 0; i < $scope.filteredAnnotations.length; i++) {
                    if (item.annotationId == $scope.filteredAnnotations[i].annotationId) {
                        found++;
                    }
                }
                if (found > 0)return true; else return false;
            }
        }
    });