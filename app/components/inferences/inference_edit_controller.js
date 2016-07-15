angular.module('ionicApp')
    .controller('InferenceEditController', function ($rootScope,$scope,$q, $routeParams, $location, $timeout,$ionicModal, authorization, localStorageService, Restangular) {

        $scope.inferenceId = 0;
        $scope.circles = []; //id array
        $scope.users = []; //id array
        $scope.pagePurpose = "new";


        $scope.inferenceData={};
        ///////Volkan
        //$scope.extendedCirclesForSearch = []; //show circles
        //$scope.initializeCircleLists(); //show circles


        $scope.tags_entry = [];
        $scope.circlesForSearch = [];
        $scope.usersForSearch = [];
        $scope.circlesForSearch1  = [];
        $scope.usersForSearch1 = [];
        $scope.tagListInference =[]; // mobil icin

        var tags = [];
        var canViewCircles_tags = [];
        var canCommentCircles_tags = [];
        var canViewUsers_tags = [];
        var canCommentUsers_tags = [];
        var record_nm = "";
        $scope.show_entry = false;

        $scope.loadTags = function (query) {
            var tagsRestangular = Restangular.one('tags', query);
            return tagsRestangular.customGET("", {}, {'access_token': $scope.access_token});
        };
        $scope.loadTags2 = function (query) {
            var tagsRestangular = Restangular.one('tags', query);
             tagsRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (resp) {
                 $scope.tagListInference =resp;
             });
        };
        //tags input auto complete function
        var tagArray = [];
        if(config_data.isMobile){

            $scope.inferenceData.title = "";
            $scope.inferenceData.content = "";
            $scope.imageDefined = false;

            setTimeout(function () {
                if (typeof $scope.inferenceData.image === "undefined" || $scope.inferenceData.image == "undefined") {
                    $scope.imageDefined = false;                   
                } else {
                    $scope.imageDefined = true;
                }
            },1000);

            $scope.pagePrevious = function () {
                window.history.go(-2);
            }

            $ionicModal.fromTemplateUrl('components/partials/add_tag_to_inferences.html', {
                scope: $scope,              
                animation: 'slide-in-up',
                id: 'inferenceTagsearch'
            }).then(function (modal) {
                $scope.modal_inference_tag_search = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/add_canviewuser.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'viewusersearch'
            }).then(function (modal) {
                $scope.modal_view_user_search = modal
            });

            $ionicModal.fromTemplateUrl('components/inferences/inferenceEditTinyMobileView.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'inference_mobile_tiny_edit'
            }).then(function (modal) {
                $scope.modal_edit_inference_tiny = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/add_verse_to_inference_from_verselist.html', {
                scope: $scope,
                animation: 'slide-in-up',
                id: 'add_reference_from_list'
            }).then(function (modal) {
                $scope.modal_add_reference_from_verse_list = modal
            });

            $scope.tagsquery= function (query) {
                $scope.loadTags2(query)
            };

            $scope.openModal = function(id){
                if (id == 'viewusersearch') {
                    $scope.modal_view_user_search.show();
                    focusToInput('mobil_peoples');
                }else if(id == "inferenceTagsearch"){
                    $scope.modal_inference_tag_search.show();
                    focusToInput('inference_tag_input');
                }else if(id == "inference_mobile_tiny_edit"){
                    $scope.modal_edit_inference_tiny.show();
                }else if (id == "add_verse_to_inference_from_verselist"){
                    $scope.openVerseListForVerseSelection($scope.copyValueFromSelectedList, $scope.closeModal);
                    $scope.modal_add_reference_from_verse_list.show();
                };
            };

            $scope.closeModal = function (id) {
                $timeout(function(){

                    if (id == 'viewusersearch') {
                        $scope.modal_view_user_search.hide();
                    }else if(id == "inferenceTagsearch"){
                        $scope.modal_inference_tag_search.hide();
                    }else if(id == "inference_mobile_tiny_edit"){
                        $scope.modal_edit_inference_tiny.hide();
                    }else if (id == "add_verse_to_inference_from_verselist"){
                        $scope.modal_add_reference_from_verse_list.hide();
                    }
                },300);
            };
        }
        //tags input auto complete
        $scope.peoplelist = function (people_name) {
            var peoplesRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = people_name;
            return peoplesRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token});
        };
        
        //tags input auto complete
        $scope.circleslistExtended = function () {
            return $scope.extendedCircles;
        };

        $scope.do_array = function () {

            if(config_data.isMobile){

                $scope.usersForSearch = $scope.ViewUsers;
                $scope.circlesForSearch.length=0;

                for (var index = 0; index < $scope.mobileInferencesEditorCircleListForSelection.length; ++index) {
                    if ($scope.mobileInferencesEditorCircleListForSelection[index].selected == true) {
                        $scope.circlesForSearch.push($scope.mobileInferencesEditorCircleListForSelection[index]);
                    }
                }
            }

            tags.length = 0;
            canViewCircles_tags.length = 0;
            canCommentCircles_tags.length = 0;
            canViewUsers_tags.length = 0;
            canCommentUsers_tags.length = 0;

            for (var i = 0; i < $scope.tagListInference.length; i++) {
                tags.push($scope.tagListInference[i].name);
            }

            for (var i = 0; i < $scope.circlesForSearch.length; i++) {
                canViewCircles_tags.push($scope.circlesForSearch[i].id);
            }

            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                canViewUsers_tags.push($scope.usersForSearch[i].id);
            }

            if ($scope.show_entry == false) {
                for (var i = 0; i < $scope.circlesForSearch1.length; i++) {
                    canCommentCircles_tags.push($scope.circlesForSearch1[i].id);
                }

                for (var i = 0; i < $scope.usersForSearch1.length; i++) {
                    canCommentUsers_tags.push($scope.usersForSearch1[i].id);
                }
            }
            else {
                for (var i = 0; i < $scope.circlesForSearch.length; i++) {
                    canCommentCircles_tags.push($scope.circlesForSearch[i].id);
                }

                for (var i = 0; i < $scope.usersForSearch.length; i++) {
                    canCommentUsers_tags.push($scope.usersForSearch[i].id);
                }
            }

            save_inferences();
        }

        function save_inferences() {

            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            //var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("title") + "=" + encodeURIComponent($scope.inferenceData.title));
            postData.push(encodeURIComponent("image") + "=" + encodeURIComponent($scope.inferenceData.image));
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent($scope.inferenceData.content));
            var tags_add = tags.join(",");
            postData.push(encodeURIComponent("tags") + "=" + encodeURIComponent(tags_add));

            var canViewCircles = canViewCircles_tags.join(",");
            postData.push(encodeURIComponent("canViewCircles") + "=" + encodeURIComponent(canViewCircles));

            var canViewUsers = canViewUsers_tags.join(",");
            postData.push(encodeURIComponent("canViewUsers") + "=" + encodeURIComponent(canViewUsers));

            var canCommentCircles = canCommentCircles_tags.join(",");
            postData.push(encodeURIComponent("canCommentCircles") + "=" + encodeURIComponent(canCommentCircles));

            var canCommentUsers = canCommentUsers_tags.join(",");
            postData.push(encodeURIComponent("canCommentUsers") + "=" + encodeURIComponent(canCommentUsers));

            //
            var data = postData.join("&");

            //if inference id 0 new record else update.
            if ($scope.inferenceId == 0) {
                var annotationRestangular = Restangular.one("inferences");
                annotationRestangular.customPOST(data, '', '', headers).then(function (record) {

                    $scope.inferenceId = record.id;
                    $location.path('inference/display/' + $scope.inferenceId);
                });
            }
            else {
                var annotationRestangular = Restangular.one("inferences", $scope.inferenceId);
                annotationRestangular.customPUT(data, '', '', headers).then(function (record) {

                    $scope.inferenceId = record.id;
                    $location.path('inference/display/' + $scope.inferenceId);
                    

                });
            }
        }

        //View inference
        function inference_info(inferenceId) {
            var inferenceRestangular = Restangular.one("inferences", inferenceId);
            inferenceRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {

                $scope.inferenceData.title = data.title;
                $scope.inferenceData.image = data.image;
                $scope.inferenceData.content = $scope.prepareContentForEdit(data.content,data.references);
                $scope.tags_entry = data.tags;

                for (var i = 0; i < data.tags.length; i++) {
                    $scope.tagListInference.push({ name: data.tags[i] });
                }
                
                var inference_PermRestangular = Restangular.one("inferences", inferenceId).all("permissions");
                inference_PermRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {

                    $scope.circlesForSearch = data.canViewCircles;
                    $scope.usersForSearch = data.canViewUsers;
                    $scope.circlesForSearch1 = data.canCommentCircles;
                    $scope.usersForSearch1 = data.canCommentUsers;
                    $scope.ViewUsers = data.canViewUsers;
                    console.log("1 :", $scope.mobileInferencesEditorCircleListForSelection);
                    console.log("2 :", $scope.circlesForSearch);

                    for (var i = 0; i < $scope.mobileInferencesEditorCircleListForSelection.length; i++) {
                        for (var x = 0; x < $scope.circlesForSearch.length; x++) {
                            if ($scope.mobileInferencesEditorCircleListForSelection[i].name == $scope.circlesForSearch[x].name) {
                                $scope.mobileInferencesEditorCircleListForSelection[i].selected = true;
                                break;
                            }
                        }
                    }
                    
                });

            });
        }

        $scope.prepareContentForEdit = function(contentOnSystem,references){
            var content = contentOnSystem;
            for(var i=0; i< references.length;i++){
                content = content.replace(new RegExp("\\["+references[i]+"\\]", 'g'),Math.floor(references[i]/1000)+":"+references[i]%1000);
            }
            return content;
        };

        ///////Volkan

        $scope.initializeInferenceEditController = function () {
            var inferenceId = 0;
            var circles = []; //id array
            circles.push($scope.CIRCLE_PUBLIC);
            var users = []; //id array

            var inferenceIdFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;

            $scope.checkUserLoginStatus();

            if ($location.path() == "/inference/new/") {
                $scope.pagePurpose = "new";
                inferenceId = 0;
             }else {
                $scope.pagePurpose = "edit";
            }

            if (typeof $routeParams.inferenceId !== 'undefined') {
                inferenceId = $routeParams.inferenceId;
                inferenceIdFromRoute = true;

                $timeout(function () {
                    inference_info(inferenceId);
                });
            }
            else if ($scope.pagePurpose == "edit") {
                //edit page should have inferenceID
                alert("Edit page needs inferenceId");
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

            //all pages should have its name
            var localParameterData = localStorageService.get('inference_edit_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.circles = circles;
                localParameterData.users = [];
                localParameterData.inferenceId = inferenceId;


            }
            else {
                //get defaults or router params for lack of local
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }

                localParameterData.inferenceId = inferenceId;  //0 if new
            }

            $scope.restoreInferenceEditViewParameters(localParameterData);
            $scope.storeInferenceEditViewParameters
            $scope.setInferenceEditPageURL();

            /*
             $scope.content = 'World';
             var _scope = $scope;

             tinymce.init({
             selector: "#mytextarea",
             language: "tr_TR",
             plugins: [
             "textcolor advlist autolink link image lists preview"
             ],
             setup: function (ed) {
             ed.on('Change', function (e) {
             _scope.content = ed.getContent();
             $scope.$apply();
             }),
             ed.on('keyup', function (e) {
             _scope.content = ed.getContent();
             $scope.$apply();
             })
             },
             toolbar: "undo redo | formatselect fontsizeselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | forecolor backcolor | link image preview"
             });
             */

            if(!config_data.isMobile){
            $scope.tinymceOptions = {
                language: "tr_TR",
                plugins: [
                    "textcolor advlist autolink link image lists preview"
                ],
                setup: function (editor) {
                    editor.on('Change', function (e) {
                        $scope.inferenceData.content = editor.getContent();
                    }),
                        editor.on('keyup', function (e) {
                            $scope.inferenceData.content = editor.getContent();
                        })
                },
                toolbar: "undo redo | formatselect fontsizeselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | forecolor | link image preview"

            };
            }else{
                $scope.tinymceOptions = {
                    language: "tr_TR",
                    plugins: [
                        ""
                    ],
                    setup: function (editor) {
                        editor.on('Change', function (e) {
                            $scope.inferenceData.content = editor.getContent();
                        }),
                            editor.on('keyup', function (e) {
                                $scope.inferenceData.content = editor.getContent();
                            })
                    },
                    height: 210,
                    max_height: 210,
                    selector: "textarea#editable",
                    toolbar: " bold italic underline | alignleft aligncenter  |  bullist ",
                    inline: false,
                    theme : 'modern',
                    menu: {}

                };

                $scope.froalaOptions = {
                    charCounterCount: false,
                    toolbarInline: true
                };

            }

            if(!config_data.isMobile) {
                $scope.$on('userInfoReady', function handler() {
                    initFileManager('theView', $scope.user.id, function () {
                        //$('inferenceImage').onchange=
                        $timeout(function () {
                            angular.element($('#inferenceImage')).triggerHandler('input');

                        });
                    });
                    console.log("Image manager initialized for: " + $scope.user.id);
                });
            }

        }

        $scope.restoreInferenceEditViewParameters = function (localParameterData) {
            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.inferenceId = localParameterData.inferenceId;

            if(config_data.isMobile){
                $scope.ViewUsers = localParameterData.users;
                $scope.$on("circleLists ready",function(){
                for (var i = 0; i < $scope.mobileInferencesEditorCircleListForSelection.length; i++) {
                    for (var x = 0; x < $scope.circlesForSearch.length; x++) {
                        if ($scope.mobileInferencesEditorCircleListForSelection[i].name == $scope.circlesForSearch[x].name) {
                            $scope.mobileInferencesEditorCircleListForSelection[i].selected = true;
                            break;
                        }
                    }
                }
                });
            }

        };

        $scope.storeInferenceEditViewParameters = function () {

            var localParameterData = {};

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            //all pages have its name here
            localStorageService.set('inference_edit_view_parameters', localParameterData);
        };


        //reflects the scope parameters to URL
        $scope.setInferenceEditPageURL = function () {


            if ($scope.pagePurpose == "edit") {

                var parameters =
                {
                    circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                    users: Base64.encode(JSON.stringify($scope.usersForSearch))

                }
                $location.path("/inference/edit/" + $scope.inferenceId + "/", false).search(parameters);
                
            }
        };

        $scope.copyValueFromSelectedList = function (selected) {
            $scope.inferenceData.content = $scope.inferenceData.content.concat("<p>" + selected + "</p>");
            $scope.kopyala(selected);

            if (config_data.isMobile){
                $scope.closeModal('add_verse_to_inference_from_verselist');
            }
        };

        //definitions are finished. Now run initialization
        $scope.initializeInferenceEditController();

    });

