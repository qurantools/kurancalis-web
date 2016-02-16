angular.module('ionicApp')

    .controller('InferenceListController', function ($scope, $routeParams, Facebook, Restangular, $location, authorization, localStorageService, $ionicModal, $timeout, $ionicScrollDelegate) {
        console.log("Inference List Controller");
        /* facebook login */
        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        //    $scope.user = null;

        $scope.usersForSearch=[];
        $scope.circlesForSearch=[];

        // inferences
        $scope.inferences = [];
        $scope.allInferencesOpts = [];
        $scope.allInferencesOpts.hasMore = true;
        $scope.allInferencesOpts.start = 0;
        $scope.allInferencesOpts.limit = 10;
        $scope.allInferencesOpts.own_inferences = true;
        $scope.allInferencesOpts.keyword = "";
        $scope.sureler="";
        $scope.ayetler="";

        $scope.inferenceSearchAuthorSelection = $scope.selection;


        $scope.restoreInferencesViewParameters = function (localParameterData) {
            $scope.allInferencesOpts.own_inferences = localParameterData.ownInferences;
            $scope.allInferencesOrderBy = localParameterData.orderby;
            $scope.allInferencesOpts.keyword = localParameterData.verseKeyword;
            $scope.setInferenceSearchTags(localParameterData.verseTags);

            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;

        };

        $scope.storeInferencesViewParameters  = function () {

            var localParameterData = {};

            localParameterData.ownInferences = $scope.allInferencesOpts.own_inferences;
            localParameterData.orderby = $scope.allInferencesOrderBy;

            localParameterData.verseKeyword = $scope.allInferencesOpts.keyword;
            localParameterData.verseTags = $scope.getInferenceSearchTags();

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            localParameterData.chapters = $scope.sureler;
            localParameterData.verses = $scope.ayetler;

            localStorageService.set('inferences_view_parameters', localParameterData);
        };


        //reflects the scope parameters to URL
        $scope.setInferencesPageURL = function () {
            var parameters =
            {
                verseTags: $scope.getInferenceSearchTags(),
                verseKeyword: $scope.allInferencesOpts.keyword,
                ownInferences: $scope.allInferencesOpts.own_inferences,
                orderby: $scope.allInferencesOrderBy,
                chapters: $scope.sureler,
                circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                users: Base64.encode(JSON.stringify($scope.usersForSearch))

            }
            if (!config_data.isMobile) {
                $location.path("/inferences/", false).search(parameters);
            }else{
                $location.path("/m_inference/", false).search(parameters);
            }
            
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

        $scope.setInferenceSearchTags = function(tagsString){
            $scope.filterTags = [];
            if(tagsString!=""){
                var tagNames = tagsString.split(",");

                for (var i = 0; i < tagNames.length; i++) {
                    $scope.filterTags[i] = {};
                    $scope.filterTags[i].name = tagNames[i];
                }
            }
        };

        $scope.getInferenceSearchTags = function(){
            var tags = "";
            if(typeof $scope.filterTags =='undefined'){
                $scope.filterTags=[];
            }
            for (var i = 0; i < $scope.filterTags.length; i++) {
                if (i != 0){
                    tags += ",";
                }
                tags += $scope.filterTags[i].name;
            }
            return tags;

        };


        $scope.toggleInferenceSearchOwnInferences = function(){
            $scope.allInferencesOpts.own_inferences =! $scope.allInferencesOpts.own_inferences;
        }

        $scope.get_all_inferences = function () {
            var usersRestangular = Restangular.all("inferences");
            $scope.allInferencesParams = [];
            $scope.allInferencesParams.start = $scope.allInferencesOpts.start;
            $scope.allInferencesParams.limit = $scope.allInferencesOpts.limit;
            $scope.allInferencesParams.own_inferences = $scope.allInferencesOpts.own_inferences;

            $scope.allInferencesParams.keyword = $scope.allInferencesOpts.keyword;
            $scope.allInferencesParams.tags = "";

            var newTags = "";

            if(typeof $scope.filterTags =='undefined'){
                $scope.filterTags=[];
            }
            for (var i = 0; i < $scope.filterTags.length; i++) {
                if (i != 0)newTags += ",";
                newTags += $scope.filterTags[i].name;
            }
            $scope.allInferencesParams.tags = newTags;

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

            $scope.allInferencesParams.users = kisiTags;
            $scope.allInferencesParams.circles = cevreTags;

            $scope.allInferencesParams.orderby = $scope.allInferencesOrderBy;

            usersRestangular.customGET("", $scope.allInferencesParams, {'access_token': authorization.getAccessToken()}).then(function (inferences) {
                    if ($scope.allInferencesParams.start == 0) {
                        $scope.inferences = [];
                    }
                    if (inferences != "") {
                        $scope.inferences = $scope.inferences.concat(inferences)
                        $scope.allInferencesOpts.start += $scope.allInferencesOpts.limit;

                        if (inferences.length < $scope.allInferencesOpts.limit) {
                            $scope.allInferencesOpts.hasMore = false;
                        } else {
                            $scope.allInferencesOpts.hasMore = true;
                        }
                    } else {
                        $scope.allInferencesOpts.hasMore = false;
                    }
                }
            );

            $scope.setInferencesPageURL();
            $scope.storeInferencesViewParameters();
        }

        //go to chapter / verse from navigation header
        $scope.goToVerse = function () {
            $scope.goToChapterWithParameters($scope.goToVerseParameters.chapter.id,"1040",$scope.goToVerseParameters.verse);
        };


        $scope.toggleInferenceSearchOwnInferences = function(){
            $scope.allInferencesOpts.own_inferences = !$scope.allInferencesOpts.own_inferences;
        }



        $scope.search_all_inferences = function () {

            if(isMobile()){ //set query_circles from mobile selection
                $scope.circlesForSearch=[];
                for (var index = 0; index < $scope.mobileAllInferencesSearchCircleListForSelection.length; ++index) {
                    if($scope.mobileAllInferencesSearchCircleListForSelection[index].selected==true){
                        $scope.circlesForSearch.push($scope.mobileAllInferencesSearchCircleListForSelection[index]);
                    }
                }
            }
            $scope.allInferencesOpts.start = 0;
            $scope.get_all_inferences();
        }

        $scope.allInferencesOrderByChanged = function (selectedOrderOption) {
            $scope.allInferencesOrderBy = selectedOrderOption;
            $scope.allInferencesOpts.start = 0;
            $scope.get_all_inferences();
        }



        //delete operation for inferences page
        $scope.deleteInference = function (inference) {
            var inferenceRestangular = Restangular.one("inferences", inference.inferenceId);
            inferenceRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {

                if (result.code == '200') {
                    var inferenceIndex = $scope.getIndexOfArrayByElement($scope.inferences, 'inferenceId', inference.inferenceId);
                    if (inferenceIndex > -1) {
                        $scope.inferences.splice(inferenceIndex, 1);
                    }
                }
            });
        }




        $scope.submitEditor = function () {

            if (config_data.isMobile) {
                //prepare canView circle list
                $scope.ViewCircles=[];
                for (var index = 0; index < $scope.mobileInferenceEditorCircleListForSelection.length; ++index) {
                    if($scope.mobileInferenceEditorCircleListForSelection[index].selected==true){
                        $scope.ViewCircles.push($scope.mobileInferenceEditorCircleListForSelection[index]);
                    }
                }
            }

            //get tag Parameters
            var tagParameters = $scope.getTagParametersForAnnotatorStore($scope.ViewCircles, $scope.yrmcevres, $scope.ViewUsers, $scope.yrmkisis, $scope.inferenceModalDataTagsInput)
            //now inferenceModalData belogs to root scope, may be we can get it later
            $scope.inferenceModalData.canViewCircles = tagParameters.canViewCircles;
            $scope.inferenceModalData.canCommentCircles = tagParameters.canCommentCircles;
            $scope.inferenceModalData.canViewUsers = tagParameters.canViewUsers;
            $scope.inferenceModalData.canCommentUsers = tagParameters.canCommentUsers;
            $scope.inferenceModalData.tags = tagParameters.tags;

            $scope.editorSubmitted = 1;

            $scope.updateInference($scope.inferenceModalData);

            //coming from another page fix
            if ($scope.getIndexOfArrayByElement($scope.inferences, 'inferenceId', $scope.inferenceModalData.inferenceId) == -1) {
                $scope.addInference($scope.inferenceModalData);
            }
            if (config_data.isMobile) {
                $scope.closeModal('editor');
            }

        };

        //update  inference fro Inferences page
        $scope.updateInference = function (inference) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = inference;
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
            var inferenceRestangular = Restangular.one("inferences", jsonData.inferenceId);
            return inferenceRestangular.customPUT(data, '', '', headers);
        }

        $scope.initInferencesParameters = function(){
            var orderby = "verse";
            var verseKeyword = "";
            var ownInferences = true;
            var circles = []; //id array
            circles.push(
                {
                    id: -2,
                    name: "Tüm Çevrelerim"
                }
                );
            var users = []; //id array
            var verseTags = [];

            var orderbyFromRoute = false;
            var verseKeywordFromRoute = false;
            var ownInferencesFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;
            var verseTagsFromRoute = false;


            if (typeof $routeParams.orderby !== 'undefined') {
                orderby = $routeParams.orderby;
                orderbyFromRoute = true;
            }

            if (typeof $routeParams.verseKeyword !== 'undefined') {
                verseKeyword = $routeParams.verseKeyword;
                verseKeywordFromRoute = true;
            }

            if (typeof $routeParams.ownInferences !== 'undefined') {
                ownInferences = $routeParams.ownInferences;
                ownInferencesFromRoute = true;
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

            var localParameterData = localStorageService.get('inferences_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.orderby = orderby;
                localParameterData.verseKeyword = verseKeyword;
                localParameterData.ownInferences = ownInferences;
                localParameterData.circles = circles;
                localParameterData.users = users;
                localParameterData.verseTags = verseTags;

            }
            else {
                //get defaults or router params for lack of local
                if (orderbyFromRoute || !isDefined(localParameterData.orderby)) {
                    localParameterData.orderby = orderby;
                }
                if (verseKeywordFromRoute || !isDefined(localParameterData.verseKeyword)) {
                    localParameterData.verseKeyword = verseKeyword;
                }
                if (ownInferencesFromRoute || !isDefined(localParameterData.ownInferences)) {
                    localParameterData.ownInferences = ownInferences;
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

            $scope.restoreInferencesViewParameters(localParameterData);
            $scope.storeInferencesViewParameters();

            $scope.setInferencesPageURL();

            $scope.checkUserLoginStatus();

            $scope.get_all_inferences();

            if (config_data.isMobile) {
                $ionicModal.fromTemplateUrl('components/partials/all_inferences_filter_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-left',
                    id: 'all_inferences_filter'
                }).then(function (modal) {
                    $scope.modal_all_inferences_filter = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/all_inferences_sort_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-left',
                    id: 'all_inferences_sort'
                }).then(function (modal) {
                    $scope.modal_all_inferences_sort = modal
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

                $ionicModal.fromTemplateUrl('components/partials/add_user_to_all_inferences_search.html', {
                    scope: $scope,
                    //animation: 'slide-in-right',
                    //animation: 'slide-left-right',
                    animation: 'slide-in-up',
                    id: 'addUserToAllInferencesSearch'
                }).then(function (modal) {
                    $scope.modal_addUserToAllInferencesSearch = modal
                });

                $ionicModal.fromTemplateUrl('components/partials/add_tag_to_inference.html', {
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
                    if (id == 'all_inferences_filter') {
                        $scope.modal_all_inferences_filter.show();
                    }else if (id == 'all_inferences_sort') {
                        $scope.modal_all_inferences_sort.show();
                    } else  if (id == 'editor') {
                        $scope.getModalEditor().show();
                    } else  if (id == 'viewusersearch') {
                        $scope.modal_add_canviewuser.show();
                    } else  if (id == 'addUserToAllInferencesSearch') {
                        $scope.modal_addUserToAllInferencesSearch.show();
                    } else  if (id == 'tagsearch') {
                        $scope.modal_tag_search.show();
                    } else  if (id == 'addtagtosearch') {
                        $scope.modal_addtagtosearch.show();
                    }


                };
                $scope.closeModal = function (id) {
                    $timeout(function() {

                        if (id == 'all_inferences_filter') {
                            $scope.modal_all_inferences_filter.hide();
                        } else if (id == 'all_inferences_sort') {
                            $scope.modal_all_inferences_sort.hide();
                        } else if (id == 'editor') {
                            clearTextSelection();
                            $scope.getModalEditor().hide();
                        } else if (id == 'viewusersearch') {
                            $scope.modal_add_canviewuser.hide();
                        } else if (id == 'addUserToAllInferencesSearch') {
                            $scope.modal_addUserToAllInferencesSearch.hide();
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

        $scope.editInference= function (inference){

            $scope.showEditor(inference);
        }



        $scope.scrollDelegateTop = function(id){
            $ionicScrollDelegate.$getByHandle(id).scrollTop();
        };

        $scope.initInferencesParameters();
    });