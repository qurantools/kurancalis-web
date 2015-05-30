angular.module('ionicApp')
    .controller('AnnotationsCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService, $window) {
console.log("annotations ctrl")

        // all annotations
        $scope.annotations = [];
        $scope.allAnnotationsOpts = [];
        $scope.allAnnotationsOpts.hasMore = true;
        $scope.allAnnotationsOpts.start = 0;
        $scope.allAnnotationsOpts.limit = 10;
        $scope.allAnnotationsSortBy = "verse";


        $scope.get_all_annotations = function () {
            var usersRestangular = Restangular.all("annotations");
            $scope.allAnnotationsParams = [];
            $scope.allAnnotationsParams.start = $scope.allAnnotationsOpts.start;
            $scope.allAnnotationsParams.limit = $scope.allAnnotationsOpts.limit;
            //   $scope.allAnnotationsParams.author = $scope.author_mask;


            if ($scope.allAnnotationsSearch == true) {
                //filter
                $scope.allAnnotationsParams.author = 0;
                for (var index in $scope.annotationSearchAuthorSelection) {
                    $scope.allAnnotationsParams.author = $scope.allAnnotationsParams.author | $scope.annotationSearchAuthorSelection[index];
                }

                $scope.allAnnotationsParams.verse_keyword = $scope.allAnnotationsSearchInput;
                $scope.allAnnotationsParams.verse_tags = "";

                var newTags = "";
                var filterTags = $scope.filterTags;
                for (var i = 0; i < filterTags.length; i++) {
                    if (i != 0)newTags += ",";
                    newTags += filterTags[i].name;
                }
                $scope.allAnnotationsParams.verse_tags = newTags;
            }
            $scope.allAnnotationsParams.orderby = $scope.allAnnotationsOrderBy;

            usersRestangular.customGET("", $scope.allAnnotationsParams, {'access_token': $scope.access_token}).then(function (annotations) {
                    if ($scope.allAnnotationsParams.start == 0) {
                        $scope.annotations = [];
                    }
                    if (annotations != "") {
                        $scope.annotations = $scope.annotations.concat(annotations)
                        $scope.allAnnotationsOpts.start += $scope.allAnnotationsOpts.limit;

                        if (annotations.length < $scope.allAnnotationsOpts.limit) {
                            $scope.allAnnotationsOpts.hasMore = false;
                        } else {
                            $scope.allAnnotationsOpts.hasMore = true;
                        }
                    } else {
                        $scope.allAnnotationsOpts.hasMore = false;
                    }
                }
            );
            $scope.allAnnotationsSearch = false;
        }

        $scope.search_all_annotations = function () {
            $scope.allAnnotationsOpts.start = 0;
            $scope.allAnnotationsSearch = true;
            $scope.get_all_annotations();
        }

        $scope.allAnnotationsOrderByChanged = function (selectedOrderOption) {
            $scope.allAnnotationsOrderBy = selectedOrderOption;
            $scope.allAnnotationsOpts.start = 0;
            $scope.get_all_annotations();
        }

        $scope.get_all_annotations();
    });