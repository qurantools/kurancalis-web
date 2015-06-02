angular.module('ionicApp')
    .controller('AnnotationsCtrl', function ($scope, $routeParams, Facebook, Restangular, authorization, localStorageService) {
        console.log("annotations ctrl")

        /* auth */
        $scope.onFacebookLoginSuccess = function (responseData) {
            if (responseData.loggedIn == false) {
                $scope.loggedIn = false;
                $scope.logOut();
            }
            else {
                $scope.access_token = responseData.token;
                //set cookie
                localStorageService.set('access_token', $scope.access_token);
                //get user information
                $scope.get_user_info();

                $scope.loggedIn = true;
                // $scope.list_translations();
                if ($scope.getCurrentPage() == 'home') {
                    $scope.list_translations();
                }
            }
        }

        $scope.onFacebookLogOutSuccess = function (responseData) {
            if (responseData.loggedOut == true) {
                $scope.user = null;
                if (typeof annotator != 'undefined') {
                    annotator.destroy();
                }

                $scope.verseTagsJSON = {};
                if ($scope.getCurrentPage() != "home") {

                    $scope.chapter_id = 1;
                    $scope.setChapterId();
                    $scope.goToChapter();

                }
            }
        }

        /* facebook login */

        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        //    $scope.user = null;

        $scope.login = function () { //new
            authorization.login($scope.onFacebookLoginSuccess);
        }

        $scope.logOut = function () { //new
            authorization.logOut($scope.onFacebookLogOutSuccess);
        }


        $scope.$watch(function () {
                return Facebook.isReady();
            }, function (newVal) {
                if (newVal) {
                    $scope.facebookIsReady = true;
                }
            }
        );
        $scope.checkUserLoginStatus();

        /* end of facebook login */
        /* end of auth */


        // all annotations
        $scope.annotations = [];
        $scope.allAnnotationsOpts = [];
        $scope.allAnnotationsOpts.hasMore = true;
        $scope.allAnnotationsOpts.start = 0;
        $scope.allAnnotationsOpts.limit = 10;
        $scope.allAnnotationsSortBy = "verse";
        $scope.annotationSearchAuthorSelection = $scope.selection;

        $scope.updateAuthors = function () {
            if (!config_data.isMobile) {
                    $scope.allAnnotationsOpts.start = 0;
                    $scope.get_all_annotations();
            } else {
                $scope.author_mask = localStorageService.get('author_mask');
                $scope.setAuthorMask();
                $scope.goToChapter();
            }
        }

        $scope.get_all_annotations = function () {
            var usersRestangular = Restangular.all("annotations");
            $scope.allAnnotationsParams = [];
            $scope.allAnnotationsParams.start = $scope.allAnnotationsOpts.start;
            $scope.allAnnotationsParams.limit = $scope.allAnnotationsOpts.limit;

            //kapalýydý
               $scope.allAnnotationsParams.author = $scope.author_mask;


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
            usersRestangular.customGET("", $scope.allAnnotationsParams, {'access_token': authorization.getAccessToken()}).then(function (annotations) {
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

        $scope.annotationSearchAuthorToggleSelection = function annotationSearchAuthorToggleSelection(author_id) {
            var idx = $scope.annotationSearchAuthorSelection.indexOf(author_id);
            if (idx > -1) {
                $scope.annotationSearchAuthorSelection.splice(idx, 1);
            }
            else {
                $scope.annotationSearchAuthorSelection.push(author_id);
            }
            $scope.annotationSearchAuthorMask = 0;
            for (var index in $scope.annotationSearchAuthorSelection) {
                $scope.annotationSearchAuthorMask = $scope.annotationSearchAuthorMask | $scope.annotationSearchAuthorSelection[index];
            }
        };
        $scope.toggleSelection = function toggleSelection(author_id) {
            $scope.annotationSearchAuthorToggleSelection(author_id);
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