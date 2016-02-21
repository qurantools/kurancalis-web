angular.module('ionicApp')
    .controller('AnnotationsCtrl', function ($scope, $routeParams, Facebook, Restangular, $location, authorization, localStorageService, $ionicModal,$ionicPopup, $timeout, $ionicScrollDelegate) {
        console.log("annotations ctrl");
        $scope.allAnnotationsOrderBy='verse';

        /* facebook login */

        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        //    $scope.user = null;

        $scope.usersForSearch=[];
        $scope.circlesForSearch=[];

        // all annotations
        $scope.annotations = [];
        $scope.allAnnotationsOpts = [];
        $scope.allAnnotationsOpts.hasMore = true;
        $scope.allAnnotationsOpts.start = 0;
        $scope.allAnnotationsOpts.limit = 10;
        $scope.allAnnotationsOpts.own_annotations = true;
        $scope.allAnnotationsOpts.keyword = "";
        $scope.sureler="";
        $scope.ayetler="";
        $scope.pagePurpose = "annotations"; //may be annotations or inferences

        $scope.annotationSearchAuthorSelection = $scope.selection;


        $scope.restoreAnnotationsViewParameters = function (localParameterData) {
            $scope.allAnnotationsOpts.own_annotations = localParameterData.ownAnnotations;
            $scope.allAnnotationsOrderBy = localParameterData.orderby;
            $scope.setAnnotationSearchAuthorSelection(localParameterData.authorMask);
            $scope.allAnnotationsOpts.keyword = localParameterData.verseKeyword;
            $scope.setAnnotationSearchTags(localParameterData.verseTags);

            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.sureler = localParameterData.chapters;
            $scope.ayetler = localParameterData.verses;

        };

        $scope.storeAnnotationsViewParameters  = function () {

            var localParameterData = {};

            localParameterData.ownAnnotations = $scope.allAnnotationsOpts.own_annotations;
            localParameterData.orderby = $scope.allAnnotationsOrderBy;

            localParameterData.authorMask=$scope.getAnnotationSearchAuthorMask();
            localParameterData.verseKeyword = $scope.allAnnotationsOpts.keyword;
            localParameterData.verseTags = $scope.getAnnotationSearchTags();

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            localParameterData.chapters = $scope.sureler;
            localParameterData.verses = $scope.ayetler;

            localStorageService.set('annotations_view_parameters', localParameterData);
        };


        //reflects the scope parameters to URL
        $scope.setAnnotationsPageURL = function () {
            var parameters =
            {
                authorMask: $scope.getAnnotationSearchAuthorMask(),
                verseTags: $scope.getAnnotationSearchTags(),
                verseKeyword: $scope.allAnnotationsOpts.keyword,
                ownAnnotations: $scope.allAnnotationsOpts.own_annotations,
                orderby: $scope.allAnnotationsOrderBy,
                chapters: $scope.sureler,
                verses: $scope.ayetler,
                circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                users: Base64.encode(JSON.stringify($scope.usersForSearch))

            }
            $location.path("/"+$scope.pagePurpose+"/", false).search(parameters);
        };




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

        /* end of facebook login */
        /* end of auth */

        $scope.setAnnotationSearchTags = function(tagsString){
            $scope.filterTags = [];
            if(tagsString!=""){
                var tagNames = tagsString.split(",");

                for (var i = 0; i < tagNames.length; i++) {
                    $scope.filterTags[i] = {};
                    $scope.filterTags[i].name = tagNames[i];
                }
            }
        };

        $scope.getAnnotationSearchTags = function(){
            var verse_tags = "";
            if(typeof $scope.filterTags =='undefined'){
                $scope.filterTags=[];
            }
            for (var i = 0; i < $scope.filterTags.length; i++) {
                if (i != 0){
                    verse_tags += ",";
                }
                verse_tags += $scope.filterTags[i].name;
            }
            return verse_tags;

        };


        //selected authors
        $scope.setAnnotationSearchAuthorSelection = function (authorMask) {
            $scope.annotationSearchAuthorSelection = [];
            for (var index in $scope.authorMap) {
                if (authorMask & $scope.authorMap[index].id) {
                    $scope.annotationSearchAuthorSelection.push($scope.authorMap[index].id);
                }
            }
        };

        $scope.getAnnotationSearchAuthorMask = function () {
            var authorMask = 0;
            for (var index in $scope.annotationSearchAuthorSelection) {
                authorMask = authorMask | $scope.annotationSearchAuthorSelection[index];
            }

            if(authorMask == 0) { //no author filter
                authorMask = "67108863";
            }

            return authorMask;

        };



        $scope.toggleAnnotationSearchOwnAnnotations = function(){
            $scope.allAnnotationsOpts.own_annotations =! $scope.allAnnotationsOpts.own_annotations;
        }

        $scope.get_all_annotations = function () {
            var usersRestangular = Restangular.all("annotations");
            $scope.allAnnotationsParams = [];
            $scope.allAnnotationsParams.start = $scope.allAnnotationsOpts.start;
            $scope.allAnnotationsParams.limit = $scope.allAnnotationsOpts.limit;
            $scope.allAnnotationsParams.own_annotations = $scope.allAnnotationsOpts.own_annotations;

            $scope.allAnnotationsParams.author = $scope.getAnnotationSearchAuthorMask();

            $scope.allAnnotationsParams.verse_keyword = $scope.allAnnotationsOpts.keyword;
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
            $scope.allAnnotationsParams.chapters = $scope.sureler;
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

            $scope.setAnnotationsPageURL();
            $scope.storeAnnotationsViewParameters();
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

            if(isMobile()){ //set query_circles from mobile selection
                $scope.circlesForSearch=[];
                for (var index = 0; index < $scope.mobileAllAnnotationsSearchCircleListForSelection.length; ++index) {
                    if($scope.mobileAllAnnotationsSearchCircleListForSelection[index].selected==true){
                        $scope.circlesForSearch.push($scope.mobileAllAnnotationsSearchCircleListForSelection[index]);
                    }
                }
            }
            $scope.allAnnotationsOpts.start = 0;
            $scope.get_all_annotations();
        }

        $scope.allAnnotationsOrderByChanged = function (selectedOrderOption) {
            $scope.allAnnotationsOrderBy = selectedOrderOption;
            $scope.allAnnotationsOpts.start = 0;
            $scope.get_all_annotations();
        }



        $scope.tempAnnotation
        //delete operation for annotations page
        $scope.deleteAnnotation = function (annotation) {


            var annotationRestangular = Restangular.one("annotations", annotation.annotationId);

                   if (config_data.isMobile) {
                var confirmPopup = $ionicPopup.confirm({
                     title: 'Ayet Notu Sil',
                     template: 'Ayet notu silinecektir, onaylıyor musunuz?',
                     cancelText: 'VAZGEC',
                     okText: 'TAMAM',
                     okType: 'button-assertive'
                   });
                   confirmPopup.then(function(res) {
                     if(res) {
                        annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {

                if (result.code == '200') {
                    var annotationIndex = $scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', annotation.annotationId);
                         if (annotationIndex > -1) {
                         $scope.annotations.splice(annotationIndex, 1);
                         }
                 }
                    });
                     } else {
                     }
                   });
            }else{
                
                 $("#deleteAnnotationModal").modal("show");
                 $scope.tempAnnotation =annotation;
            }
        }

         $scope.closeAnnotationModal = function(){
            $("#deleteAnnotationModal").modal("hide");
        }

        $scope.mdeleteAnnotation = function(){
             var annotationRestangular = Restangular.one("annotations", $scope.tempAnnotation.annotationId);
             annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {

                if (result.code == '200') {
                    var annotationIndex = $scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', $scope.tempAnnotation.annotationId);
                         if (annotationIndex > -1) {
                         $scope.annotations.splice(annotationIndex, 1);
                         }
                 }
                    });
            $("#deleteAnnotationModal").modal("hide");
        }


        $scope.submitEditor = function () {

            if (config_data.isMobile) {
                //prepare canView circle list
                $scope.ViewCircles=[];
                for (var index = 0; index < $scope.mobileAnnotationEditorCircleListForSelection.length; ++index) {
                    if($scope.mobileAnnotationEditorCircleListForSelection[index].selected==true){
                        $scope.ViewCircles.push($scope.mobileAnnotationEditorCircleListForSelection[index]);
                    }
                }
            }

            //get tag Parameters
            var tagParameters = $scope.getTagParametersForAnnotatorStore($scope.ViewCircles, $scope.yrmcevres, $scope.ViewUsers, $scope.yrmkisis, $scope.annotationModalDataTagsInput)
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

        $scope.initAnnotationsParameters = function(){
            var orderby = "verse";
            var authorMask = 67108863;
            var chapters="";
            var verseKeyword = "";
            var verses = "";
            var ownAnnotations = true;
            var circles = []; //id array
            var users = []; //id array
            var verseTags = [];

            var orderbyFromRoute = false;
            var authorMaskFromRoute = false;
            var chaptersFromRoute = false;
            var verseKeywordFromRoute = false;
            var versesFromRoute = false;
            var ownAnnotationsFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;
            var verseTagsFromRoute = false;



            if($location.path() == "/annotations/"){
                $scope.pagePurpose = "annotations";
            }
            else if($location.path() == "/inferences/"){
                $scope.pagePurpose = "inferences";
            }
            else{
                alert("pagePurpose undefined");
            }

            if (typeof $routeParams.orderby !== 'undefined') {
                orderby = $routeParams.orderby;
                orderbyFromRoute = true;
            }

            if (typeof $routeParams.authorMask !== 'undefined') {
                authorMask = $routeParams.authorMask;
                authorMaskFromRoute = true;
            }

            if (typeof $routeParams.chapters !== 'undefined') {
                chapters = $routeParams.chapters;
                chaptersFromRoute = true;
            }

            if (typeof $routeParams.verseKeyword !== 'undefined') {
                verseKeyword = $routeParams.verseKeyword;
                verseKeywordFromRoute = true;
            }

            if (typeof $routeParams.verses !== 'undefined') {
                verses = $routeParams.verses;
                versesFromRoute = true;
            }

            if (typeof $routeParams.ownAnnotations !== 'undefined') {
                ownAnnotations = $routeParams.ownAnnotations;
                ownAnnotationsFromRoute = true;
            }

            if (typeof $routeParams.circles !== 'undefined') {
                try {
                    circles = JSON.parse(Base64.decode($routeParams.circles));
                    circlesFromRoute = true;
                }
                catch (err) {

                }
            }

            if (typeof $routeParams.users !== 'undefined') {
                try {
                    users = JSON.parse(Base64.decode($routeParams.users));
                    usersFromRoute = true;
                }
                catch (err) {

                }
            }

            if (typeof $routeParams.verseTags !== 'undefined') {
                verseTags = $routeParams.verseTags;
                verseTagsFromRoute = true;
            }

            var localParameterData = localStorageService.get('annotations_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.orderby = orderby;
                localParameterData.authorMask = authorMask;
                localParameterData.chapters = chapters;
                localParameterData.verseKeyword = verseKeyword;
                localParameterData.verses = verses;
                localParameterData.ownAnnotations = ownAnnotations;
                localParameterData.circles = [];
                localParameterData.users = [];
                localParameterData.verseTags = verseTags;

            }
            else {
                //get defaults or router params for lack of local
                if (orderbyFromRoute || !isDefined(localParameterData.orderby)) {
                    localParameterData.orderby = orderby;
                }
                if (authorMaskFromRoute || !isDefined(localParameterData.authorMask)) {
                    localParameterData.authorMask = authorMask;
                }
                if (chaptersFromRoute || !isDefined(localParameterData.chapters)) {
                    localParameterData.chapters = chapters;
                }
                if (verseKeywordFromRoute || !isDefined(localParameterData.verseKeyword)) {
                    localParameterData.verseKeyword = verseKeyword;
                }
                if (versesFromRoute || !isDefined(localParameterData.verses)) {
                    localParameterData.verses = verses;
                }
                if (ownAnnotationsFromRoute || !isDefined(localParameterData.ownAnnotations)) {
                    localParameterData.ownAnnotations = ownAnnotations;
                }
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }
                if (verseTagsFromRoute || !isDefined(localParameterData.verseTags)) {
                    localParameterData.verseTags = verseTags;
                }

            }

            $scope.restoreAnnotationsViewParameters(localParameterData);
            $scope.storeAnnotationsViewParameters();

            $scope.setAnnotationsPageURL();

            $scope.checkUserLoginStatus();


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
                    $scope.setModalEditor(modal);
                });

                $ionicModal.fromTemplateUrl('components/partials/add_canviewuser.html', {
                    scope: $scope,
                    //animation: 'slide-in-right',
                    //animation: 'slide-left-right',
                    animation: 'slide-in-up',
                    id: 'viewusersearch'
                }).then(function (modal) {
                    $scope.modal_add_canviewuser = modal
                });

                $ionicModal.fromTemplateUrl('components/partials/add_user_to_all_annotations_search.html', {
                    scope: $scope,
                    //animation: 'slide-in-right',
                    //animation: 'slide-left-right',
                    animation: 'slide-in-up',
                    id: 'addUserToAllAnnotationsSearch'
                }).then(function (modal) {
                    $scope.modal_addUserToAllAnnotationsSearch = modal
                });

                $ionicModal.fromTemplateUrl('components/partials/add_tag_to_annotation.html', {
                    scope: $scope,
                    //animation: 'slide-in-right',
                    //animation: 'slide-left-right',
                    animation: 'slide-in-up',
                    id: 'tagsearch'
                }).then(function (modal) {
                    $scope.modal_tag_search = modal
                });

                $ionicModal.fromTemplateUrl('components/partials/add_tag_to_search.html', {
                    scope: $scope,
                    //animation: 'slide-in-right',
                    //animation: 'slide-left-right',
                    animation: 'slide-in-up',
                    id: 'addtagtosearch'
                }).then(function (modal) {
                    $scope.modal_addtagtosearch = modal
                });


                $scope.openModal = function (id) {
                    if (id == 'all_annotations_filter') {
                        $scope.modal_all_annotations_filter.show();
                    }else if (id == 'all_annotations_sort') {
                        $scope.modal_all_annotations_sort.show();
                    } else  if (id == 'editor') {
                        $scope.getModalEditor().show();
                    } else  if (id == 'viewusersearch') {
                        $scope.modal_add_canviewuser.show();
                    } else  if (id == 'addUserToAllAnnotationsSearch') {
                        $scope.modal_addUserToAllAnnotationsSearch.show();
                    } else  if (id == 'tagsearch') {
                        $scope.modal_tag_search.show();
                        focusToInput('tagsearch_input');
                    } else  if (id == 'addtagtosearch') {
                        $scope.modal_addtagtosearch.show();
                        focusToInput('addtagtosearch_input');
                    }




                };
                $scope.closeModal = function (id) {
                    $timeout(function() {

                        if (id == 'all_annotations_filter') {
                            $scope.modal_all_annotations_filter.hide();
                        } else if (id == 'all_annotations_sort') {
                            $scope.modal_all_annotations_sort.hide();
                        } else if (id == 'editor') {
                            clearTextSelection();
                            $scope.getModalEditor().hide();
                        } else if (id == 'viewusersearch') {
                            $scope.modal_add_canviewuser.hide();
                        } else if (id == 'addUserToAllAnnotationsSearch') {
                            $scope.modal_addUserToAllAnnotationsSearch.hide();
                        } else if (id == 'tagsearch') {
                            $scope.modal_tag_search.hide();
                        } else if (id == 'addtagtosearch') {
                            $scope.modal_addtagtosearch.hide();
                        }
                    },300);
                }
            }

            $scope.$on('modal.shown', function(event, modal) {
                if(config_data.isMobile) {
                    $timeout(function () {
                        $scope.scrollDelegateTop(modal.id);
                    });
                }
            });

        };

        $scope.editAnnotation= function (annotation){

            $scope.showEditor(annotation);
        }



        $scope.scrollDelegateTop = function(id){
            $ionicScrollDelegate.$getByHandle(id).scrollTop();
        };

        $scope.initAnnotationsParameters();
        $timeout(function(){
            $scope.$broadcast("displayTutorial",{id:"annotations"})

        },2000);

    });