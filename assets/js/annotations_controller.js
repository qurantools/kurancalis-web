angular.module('ionicApp')
    .controller('AnnotationsCtrl', function ($scope, $routeParams, Facebook, Restangular, authorization, localStorageService, $ionicModal) {
        console.log("annotations ctrl")
        $scope.currentPage = $scope.getCurrentPage();

        $scope.get_user_info2 = function () {
            var usersRestangular = Restangular.all("users");
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;
                    $scope.get_all_annotations();
                }
            );
        }


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
            console.log("updateAuthors - annotations controller");
            if (!config_data.isMobile) {
                $scope.allAnnotationsOpts.start = 0;
                $scope.get_all_annotations();
            } else {
                /*
                 $scope.author_mask = localStorageService.get('author_mask');
                 $scope.setAuthorMask();
                 $scope.goToChapter();
                 */
                $scope.allAnnotationsSearch=1;
                $scope.annotationSearchAuthorSelection = $scope.selection;

                $scope.allAnnotationsOpts.start = 0;
                $scope.author_mask = localStorageService.get('author_mask');
                $scope.setAuthorMask();
                $scope.get_all_annotations();
            }
        }
        $scope.setAnnotationSearchKeyword = function(keyword){
            $scope.allAnnotationsSearchInput = keyword;
        }
        $scope.setAnnotationSearchTags = function(tags){
            console.log("setAnnotationSearchTags"+tags);
            $scope.filterTags = tags;
        }

        $scope.get_all_annotations = function () {
            var usersRestangular = Restangular.all("annotations");
            $scope.allAnnotationsParams = [];
            $scope.allAnnotationsParams.start = $scope.allAnnotationsOpts.start;
            $scope.allAnnotationsParams.limit = $scope.allAnnotationsOpts.limit;

            //kapaliydi
            $scope.allAnnotationsParams.author = $scope.author_mask;
            $scope.allAnnotationsParams.users = $scope.user.id;

            console.log("$scope.allAnnotationsSearch: "+$scope.allAnnotationsSearch);
            if ($scope.allAnnotationsSearch == true) {
                //filter
                $scope.allAnnotationsParams.author = 0;
                for (var index in $scope.annotationSearchAuthorSelection) {
                    $scope.allAnnotationsParams.author = $scope.allAnnotationsParams.author | $scope.annotationSearchAuthorSelection[index];
                }

                $scope.allAnnotationsParams.verse_keyword = $scope.allAnnotationsSearchInput;
                $scope.allAnnotationsParams.verse_tags = "";

                var newTags = "";

                if(typeof $scope.filterTags =='undefined'){
                    $scope.filterTags=[];
                }
                console.log($scope.filterTags);
                for (var i = 0; i < $scope.filterTags.length; i++) {
                    if (i != 0)newTags += ",";
                    newTags += $scope.filterTags[i].name;
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

        //     $scope.get_all_annotations();
        $scope.get_user_info2();

        if (config_data.isMobile) {
            $ionicModal.fromTemplateUrl('components/partials/all_annotations_filter_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'all_annotations_filter'
            }).then(function (modal) {
                $scope.modal_all_annotations_filter = modal
            });
            $scope.openModal = function (id) {
                if (id == 'all_annotations_filter') {
                    $scope.modal_all_annotations_filter.show();
                }
            };
            $scope.closeModal = function (id) {
                if (id == 'all_annotations_filter') {
                    $scope.modal_all_annotations_filter.hide();
                }
            }
        }

        $scope.submitEditor2 = function () {
            $scope.submitEditor($scope.theTags);
        }
        $scope.deleteAnnotation2 = function (annotation) {
            var annotationRestangular = Restangular.one("annotations", annotation.annotationId);
            annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {

                if (result.code == '200') {
                    var annotationIndex = $scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', annotation.annotationId);
                    if (annotationIndex > -1) {
                        $scope.annotations.splice(annotationIndex, 1);
                    }
                }
            });
        }
    });