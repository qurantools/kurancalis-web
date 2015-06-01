angular.module('ionicApp')
    .controller('HomeCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {
        console.log("HomeCtrl");


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

        /*
         $scope.api = function () {
         Facebook.api('/me', {fields: 'email'}, function (response) {
         //   $scope.user = response.email;
         });
         };
         */
        $scope.$watch(function () {
                return Facebook.isReady();
            }, function (newVal) {
                if (newVal) {
                    $scope.facebookIsReady = true;
                }
            }
        );
        $scope.checkUserLoginStatus = function () {
            var status = false;
            var access_token = authorization.getAccessToken();
            if (access_token != null && access_token != "") {
                $scope.access_token = access_token;
                $scope.loggedIn = true;
                $scope.get_user_info();
                status = true;
            }
            return status;
        }

        //get user info
        $scope.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;
                }
            );
        }

        $scope.loggedIn = false;
        $scope.checkUserLoginStatus();
        /* end of facebook login */
        /* end of auth */


        $scope.authorization = authorization;


        /* end of init */



//tutorial
        $scope.showTutorial = 0;
        if ($location.path() == "/") {
            $scope.showTutorial = 1;
        }
        $scope.tutorialCarouselActive = 0;
        $scope.tutorial = function (parameter) {
            if (parameter == 'init') {
                if ($scope.loggedIn == false) {
                    $('#tutorialModal').modal('show');
                }
            } else if (parameter == 'next') {
                $('#tutorialCarousel').carousel('next');
                $scope.tutorialCarouselActive++;
            } else if (parameter == 'previous') {
                $('#tutorialCarousel').carousel('prev');
                $scope.tutorialCarouselActive--;
            }

        }
//end of tutorial


        if (config_data.isMobile) {
            $scope.currentState = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.currentState = toState.name;
                    $scope.scopeApply();
                })


            $ionicModal.fromTemplateUrl('components/partials/annotations_on_page_modal.html', {
                scope: $scope,
                animation: 'slide-in-right',
                id: 'annotations_on_page'
            }).then(function (modal) {
                $scope.modal_annotations_on_page = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/editor_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'editor'
            }).then(function (modal) {
                $scope.modal_editor = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/chapter_selection_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'chapter_selection'
            }).then(function (modal) {
                $scope.modal_chapter_selection = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/authors_list_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'authors_list'
            }).then(function (modal) {
                $scope.modal_authors_list = modal
            });

            $scope.openModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.show();
                } else if (id == 'editor') {
                    $scope.modal_editor.show();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.show();
                } else if (id == 'authors_list') {
                    $scope.modal_authors_list.show();
                }
            };

            $scope.closeModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.hide();
                } else if (id == 'editor') {
                    $scope.modal_editor.hide();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.hide();
                } else if (id == 'authors_list') {
                    $scope.modal_authors_list.hide();
                }
            }


            $scope.annotationAddable = false;
            $scope.selectionEnded = function () {
                $scope.annotationAddable = true;
                $scope.scopeApply();
            }

            $scope.selectionCancel = function () {
                $scope.annotationAddable = false;
                $scope.scopeApply();
            }
        }

    });