angular.module('ionicApp')
    .controller('HomeCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {
        console.log("HomeCtrl");
        $scope.currentPage = $scope.getCurrentPage();




        var chapterId = 1;
        var authorMask = 1040;
        var verseNumber = 1;

        if (typeof $routeParams.chapterId !== 'undefined') {
            chapterId = $routeParams.chapterId;
            $scope.initChapterSelect = true;
        }
        if (typeof $routeParams.authorMask !== 'undefined') {
            authorMask = $routeParams.authorMask;
        }
        if (typeof $routeParams.verseNumber !== 'undefined') {
            verseNumber = $routeParams.verseNumber;
        }


        $scope.chapter_id = chapterId;
        $scope.setChapterId(chapterId);

        $scope.author_mask = authorMask;
        $scope.setAuthorMask(authorMask);
        localStorageService.set('author_mask', $scope.author_mask);

        $scope.verse = {};
        $scope.verse.number = verseNumber;
        $scope.setVerse($scope.verse);


        $scope.list_translations();
        $scope.checkUserLoginStatus();

        $scope.filteredAnnotations = [];
        $scope.resetAnnotationFilter = function () {
            $scope.filteredAnnotations = [];
            $scope.searchText = '';
        }

        $scope.annotationTextSearch = function (item) {
            if (config_data.isMobile) {
                if (document.getElementById("searchText") && document.getElementById("searchText").value) {
                    var searchText = document.getElementById("searchText").value;
                    $scope.searchText = searchText;
                }
            }
            var searchText = $scope.searchText.toLowerCase();

            var tags = '';
            if (typeof item.tags != 'undefined' && typeof item.tags[0] != 'undefined'){
                tags = item.tags[0].toLowerCase();
            }
            if (item.quote.toLowerCase().indexOf(searchText) > -1 || item.text.toLowerCase().indexOf(searchText) > -1 || tags.indexOf(searchText) > -1) {
                return true;
            } else {
                return false;
            }
        }

        $scope.getAnnotationIndexFromFilteredAnnotationIndex = function (filteredAnnotationIndex) {
            //TODO use getIndexOfArrayByElement
            var arrLen = $scope.annotations.length;
            var filteredAnnotationId = $scope.filteredAnnotations[filteredAnnotationIndex].annotationId;
            var annotationIndex = -1;
            for (var i = 0; i < arrLen; i++) {
                if ($scope.annotations[i].annotationId == filteredAnnotationId) {
                    annotationIndex = i;
                }
            }
            return annotationIndex;
        }
        $scope.annotationFilter = function (item) {
            console.log("filteredAnnotations:" + $scope.filteredAnnotations);
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

        if(config_data.isMobile) {
            $ionicModal.fromTemplateUrl('components/partials/annotations_on_page_modal.html', {
                scope: $scope,
                animation: 'slide-in-right',
                id: 'annotations_on_page'
            }).then(function (modal) {
                $scope.modal_annotations_on_page = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/chapter_selection_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'chapter_selection'
            }).then(function (modal) {
                $scope.modal_chapter_selection = modal
            });

            $scope.openModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.show();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.show();
                }
            };

            $scope.closeModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.hide();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.hide();
                }
            }
        }



    });