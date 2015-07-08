angular.module('ionicApp')
    .controller('AnnotationsCtrl', function ($scope, $routeParams, Facebook, Restangular, authorization, localStorageService, $ionicModal) {
        console.log("annotations ctrl")
        $scope.allAnnotationsOrderBy='verse'
        $scope.currentPage = $scope.getCurrentPage();


        /* facebook login */

        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        //    $scope.user = null;

        $scope.usersForSearch=[];
        $scope.circlesForSearch=[];

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
        $scope.allAnnotationsOpts.own_annotations = true;


        $scope.allAnnotationsSortBy = "verse";
        $scope.annotationSearchAuthorSelection = $scope.selection;


        $scope.setAnnotationSearchKeyword = function(keyword){
            $scope.allAnnotationsSearchInput = keyword;
        }
        $scope.setAnnotationSearchTags = function(tags){
            $scope.filterTags = tags;
        }


  
        $scope.toggleAnnotationSearchOwnAnnotations = function(){
            $scope.allAnnotationsOpts.own_annotations =! $scope.allAnnotationsOpts.own_annotations;
        }

        $scope.get_all_annotations = function () {
            var usersRestangular = Restangular.all("annotations");
            $scope.allAnnotationsParams = [];
            $scope.allAnnotationsParams.start = $scope.allAnnotationsOpts.start;
            $scope.allAnnotationsParams.limit = $scope.allAnnotationsOpts.limit;
            $scope.allAnnotationsParams.own_annotations = $scope.allAnnotationsOpts.own_annotations;

            //kapaliydi

            $scope.allAnnotationsParams.author = 0;
            for (var index in $scope.annotationSearchAuthorSelection) {
                $scope.allAnnotationsParams.author = $scope.allAnnotationsParams.author | $scope.annotationSearchAuthorSelection[index];
            }

            if($scope.allAnnotationsParams.author == 0) { //no author filter
                $scope.allAnnotationsParams.author = "67108863";
            }

            $scope.allAnnotationsParams.verse_keyword = $scope.allAnnotationsSearchInput;
            $scope.allAnnotationsParams.verse_tags = "";

            var newTags = "";

            if(typeof $scope.filterTags =='undefined'){
                $scope.filterTags=[];
            }
            for (var i = 0; i < $scope.filterTags.length; i++) {
                if (i != 0)newTags += ",";
                newTags += $scope.filterTags[i].name;
            }
            $scope.allAnnotationsParams.verse_tags = newTags;

            //Volkan Ekledi.
             var kisiTags = "";
             var cevreTags = "";

            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                if (i != 0)kisiTags += ",";
                kisiTags += $scope.usersForSearch[i].id;
            }


            for (var i = 0; i < $scope.circlesForSearch.length; i++) {
                if (i != 0)cevreTags += ",";
                cevreTags += $scope.circlesForSearch[i].id;
            }

            $scope.allAnnotationsParams.users = kisiTags;
            $scope.allAnnotationsParams.circles = cevreTags;
            $scope.allAnnotationsParams.chapter = $scope.sureler;
            $scope.allAnnotationsParams.verse = $scope.ayetler;

               


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
        }

        //go to chapter / verse from navigation header
        $scope.goToVerse = function () {
            $scope.goToChapterWithParameters($scope.goToVerseParameters.chapter.id,"1040",$scope.goToVerseParameters.verse);
        };


        $scope.toggleAnnotationSearchOwnAnnotations = function(){
            $scope.allAnnotationsOpts.own_annotations = !$scope.allAnnotationsOpts.own_annotations;
        }

        //
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
            $scope.get_all_annotations();
        }

        $scope.allAnnotationsOrderByChanged = function (selectedOrderOption) {
            $scope.allAnnotationsOrderBy = selectedOrderOption;
            $scope.allAnnotationsOpts.start = 0;
            $scope.get_all_annotations();
        }

        $scope.get_all_annotations();

        if (config_data.isMobile) {
            $ionicModal.fromTemplateUrl('components/partials/all_annotations_filter_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'all_annotations_filter'
            }).then(function (modal) {
                $scope.modal_all_annotations_filter = modal
            });
            $ionicModal.fromTemplateUrl('components/partials/all_annotations_sort_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'all_annotations_sort'
            }).then(function (modal) {
                $scope.modal_all_annotations_sort = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/editor_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'editor'
            }).then(function (modal) {
                $scope.$parent.modal_editor = modal;
            });

            $scope.openModal = function (id) {
                if (id == 'all_annotations_filter') {
                    $scope.modal_all_annotations_filter.show();
                }else if (id == 'all_annotations_sort') {
                    $scope.modal_all_annotations_sort.show();
                } else  if (id == 'editor') {
                    $scope.$parent.modal_editor.show();
                }
            };
            $scope.closeModal = function (id) {
                if (id == 'all_annotations_filter') {
                    $scope.modal_all_annotations_filter.hide();
                }else if (id == 'all_annotations_sort') {
                    $scope.modal_all_annotations_sort.hide();
                } else  if (id == 'editor') {
                    clearTextSelection();
                    $scope.$parent.modal_editor.hide();
                }
            }
        }

        //delete operation for annotations page
        $scope.deleteAnnotation = function (annotation) {
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




        $scope.submitEditor = function () {

            //get tag Parameters
            var tagParameters = $scope.getTagParametersForAnnotatorStore($scope.cevres,$scope.yrmcevres,$scope.kisis,$scope.yrmkisis,$scope.annotationModalDataTagsInput)
            //now annotationModalData belogs to root scope, may be we can get it later
            $scope.annotationModalData.canViewCircles = tagParameters.canViewCircles;
            $scope.annotationModalData.canCommentCircles = tagParameters.canCommentCircles;
            $scope.annotationModalData.canViewUsers = tagParameters.canViewUsers;
            $scope.annotationModalData.canCommentUsers = tagParameters.canCommentUsers;
            $scope.annotationModalData.tags = tagParameters.tags;

            $scope.editorSubmitted = 1;

            $scope.updateAnnotation($scope.annotationModalData);

            //coming from another page fix
            if ($scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', $scope.annotationModalData.annotationId) == -1) {
                $scope.addAnnotation($scope.annotationModalData);
            }
            if (config_data.isMobile) {
                $scope.closeModal('editor');
            }

        };

        //update  annotation fro Annotations page
        $scope.updateAnnotation = function (annotation) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("start") + "=" + encodeURIComponent(jsonData.ranges[0].start));
            postData.push(encodeURIComponent("end") + "=" + encodeURIComponent(jsonData.ranges[0].end));
            postData.push(encodeURIComponent("startOffset") + "=" + encodeURIComponent(jsonData.ranges[0].startOffset));
            postData.push(encodeURIComponent("endOffset") + "=" + encodeURIComponent(jsonData.ranges[0].endOffset));
            postData.push(encodeURIComponent("quote") + "=" + encodeURIComponent(jsonData.quote));
            // postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData.content));
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData.text));
            postData.push(encodeURIComponent("colour") + "=" + encodeURIComponent(jsonData.colour));
            postData.push(encodeURIComponent("translationVersion") + "=" + encodeURIComponent(jsonData.translationVersion));
            postData.push(encodeURIComponent("translationId") + "=" + encodeURIComponent(jsonData.translationId));
            postData.push(encodeURIComponent("verseId") + "=" + encodeURIComponent(jsonData.verseId));
            var tags = jsonData.tags.join(",");
            postData.push(encodeURIComponent("tags") + "=" + encodeURIComponent(tags));

            //Volkan Ekledi
            var canViewCircles = jsonData.canViewCircles.join(",");
            postData.push(encodeURIComponent("canViewCircles") + "=" + encodeURIComponent(canViewCircles));

            var canViewUsers = jsonData.canViewUsers.join(",");
            postData.push(encodeURIComponent("canViewUsers") + "=" + encodeURIComponent(canViewUsers));

            var canCommentCircles = jsonData.canCommentCircles.join(",");
            postData.push(encodeURIComponent("canCommentCircles") + "=" + encodeURIComponent(canCommentCircles));

            var canCommentUsers = jsonData.canCommentUsers.join(",");
            postData.push(encodeURIComponent("canCommentUsers") + "=" + encodeURIComponent(canCommentUsers));

            //
            var data = postData.join("&");
            var annotationRestangular = Restangular.one("annotations", jsonData.annotationId);
            return annotationRestangular.customPUT(data, '', '', headers);
        }



    });