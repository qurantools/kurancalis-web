
var angularModule=angular.module('ionicApp');

    angularModule.controller('InferenceDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular, $timeout,$sce,$ionicModal,$ionicPopup, $cordovaSocialSharing, dataProvider, $ionicActionSheet ) {

        //All scope variables
        $scope.inferenceId=0;
        $scope.circles = []; //id array
        $scope.users = []; //id array
        $scope.circlesForSearch =[];
        $scope.usersForSearch = [];
        $scope.referenced = {};
        $scope.referenced.verses = [];
        $scope.referenced.selectedAuthor=-1;

        //All Display Variables
        $scope.edit_user = "";
        $scope.title = "";
        $scope.author_info = {};
        $scope.photo = "";
        $scope.content = "";
        $scope.contentOriginal = "";
        $scope.tags = [];
        $scope.open_edit = true;
        $scope.authorizedInferenceDisplay = 0;
        $scope.isNative = false;

        //On Off Switch
        $scope.inlineReferenceDisplay = false;
        $scope.new_comment='';

        $scope.deleteCommentFlag = false;
        $scope.commentWillDeleteParent = null;
        $scope.commentWillDeleteId = null;
        $scope.commentWillDeleteIndex = null;

        $scope.updateCommentFlag = false;
        $scope.commentWillUpdateParent = null;
        $scope.commentWillUpdateId = null;
        $scope.commentWillUpdateIndex = null;
        $scope.commentContent = {};
        $scope.commentContent.value = "";
        $scope.commentContentUpdate = {};
        $scope.commentContentUpdate.value = "";

        //Volkan
        $scope.initializeCircleLists(); //show circles

        $scope.digercevre = false;
        $scope.digercevremodal = function () {
            $scope.digercevre = !$scope.digercevre;
        };

        //Delete inference
        $scope.delete_inference = function () {

            var inferenceRestangular = Restangular.one("inferences", $scope.inferenceId);
            inferenceRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (data) {
                $location.path('inferences/');
               
            });
        };

        //tags input auto complete
        $scope.peoplelist = function (people_name) {
            var peoplesRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = people_name;
            return peoplesRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token});
        };

        //tags input auto complete
        $scope.circleslistForSearch = function () {
            return $scope.extendedCirclesForSearch;
        };


        //Edit inference
        $scope.edit_inference = function () {
            $location.path('inference/edit/' + $scope.inferenceId + "/");           
        }
        $scope.goToInferenceList = function () {
            $location.path('inferences');
        }

        $scope.compileContent = function(original,verseList, verseIdList, inline){
            var outContent=original;
            for (var i = 0; i < verseIdList.length; i++) {
                var verseId = verseIdList[i];
                if(inline) {
                    outContent = outContent.replace(new RegExp("\\["+verseId+"\\]", 'g'), "["+Math.floor(verseId / 1000) + ":" + verseId % 1000 + " - " + $scope.referenced.verses[verseId].translation+"]");
                }
                else{
                    outContent = outContent.replace(new RegExp("\\["+verseId+"\\]", 'g'), "["+Math.floor(verseId / 1000) + ":" + verseId % 1000+"]");
                }
            }

            return $sce.trustAsHtml(outContent);
        };

        //View inference
        $scope.inference_info = function(inferenceId) {
            var inferenceRestangular = Restangular.one("inferences", inferenceId);
            inferenceRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {

                $scope.authorizedInferenceDisplay = 1;

                $scope.edit_user = data.userId;
                $scope.title = data.title;
                //set page title as inference title
                $scope.setPageTitle(data.title);
                //$rootScope.pageTitle=data.title;

                $scope.author_info.name= data.userName;
                $scope.author_info.id = data.userId;
                $scope.author_info.photo = data.user_photo;
                $scope.photo = data.image;
                $scope.contentOriginal = data.content;

                $scope.tags = data.tags;

                var childIndexs = [];
                for (var i = 0; i< data.comments.length; i++){
                    data.comments[i].comment.edit=false;
                    if (data.comments[i].comment.parentCommentId != null){
                        var parentIndex = -1;
                        for (var j = 0; j < data.comments.length; j++){
                            if (data.comments[j].comment.id == data.comments[i].comment.parentCommentId){
                                parentIndex = j;
                                break;
                            }
                        }
                        if (!isDefined(data.comments[parentIndex].comment.childs)){
                            data.comments[parentIndex].comment.childs = [];
                        }
                        data.comments[parentIndex].comment.childs.push(data.comments[i]);
                        data.comments[parentIndex].showChilds = data.comments[parentIndex].comment.childs.length > 2 ? false : true;
                        childIndexs.push(i);
                    }
                }

                for(var i = childIndexs.length; i > 0; i--){
                    data.comments.splice(childIndexs[i-1], 1);
                }

                for (var i = 0; i < data.references.length; i++) {
                    var verseId = data.references[i];
                    $scope.referenced.verses[verseId] = { translation:"", tags:[], verseId:verseId};
                }

                $scope.focusToCommentArea('comment_textarea_inference');
                //array of referenced verse IDs
                $scope.referenced.verseIds = Object.keys($scope.referenced.verses);
                $scope.inference_info = data;
                if($scope.authorMap.length == 0){
                    $scope.$on("authorMap ready",function(){
                        //$scope.referenced.selectedAuthor = authorMap[$scope.referenced.selectedAuthor];
                        $scope.updateReferencedTranslations();
                        $scope.updateTags();
                    });
                }
                else{
                    $scope.updateReferencedTranslations();
                    $scope.updateTags();
                }
            }, function(response) {
                if (response.status == "400"){
                    /*if (config_data.isMobile && $scope.access_token != ""){
                        $location.path('/');
                        return;
                    }*/
                    $scope.authorizedInferenceDisplay = 2;
                }
            });
        };

        $scope.changeInlineReferenceDisplay = function () {
            $scope.inlineReferenceDisplay = !$scope.inlineReferenceDisplay;
            $scope.updateReferencedTranslations();
        };

        //////////////Volkan
        $scope.initializeInferenceDisplayController = function () {
            var inferenceId=0;
            var circles = []; //id array
            var users = []; //id array
            var author = "1024"; //default: yasar nuri

            var inferenceIdFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;
            var authorFromRoute = false;

            $scope.checkUserLoginStatus();

            if (typeof $routeParams.inferenceId !== 'undefined') {
                inferenceId = $routeParams.inferenceId;

            }
            else {
                alert("iferenceId can not be empty or null!!!!");
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

            if (typeof $routeParams.author !== 'undefined') {
                try {
                    author = $routeParams.author;
                    authorFromRoute = true;
                }
                catch (err) {

                }
            }

            //all pages should have its name
            var localParameterData = localStorageService.get('inference_display_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.circles = circles;
                localParameterData.users = users;
                localParameterData.author = author;

            }
            else {
                //get defaults or router params for lack of local
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }
                if (authorFromRoute || !isDefined(localParameterData.author)) {
                    localParameterData.author = author;
                }
            }

            localParameterData.inferenceId = inferenceId;

            $scope.restoreInferenceDisplayViewParameters(localParameterData);
            $scope.storeInferenceDisplayViewParameters
            $scope.setInferenceDisplayPageURL();


            //View inference by id
            $scope.inferenceId = inferenceId;
            $timeout( function(){
                $scope.inference_info(inferenceId);
            });

            $scope.shareUrl =  config_data.webAddress + "/__/inference/display/" + $scope.inferenceId;
            $scope.new_comment = '';
            $scope.isNative = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            $scope.shareTitle = "Çıkarım Paylaşma";
        };

        $scope.restoreInferenceDisplayViewParameters = function (localParameterData) {
            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.inferenceId = localParameterData.inferenceId;
            $scope.referenced.selectedAuthor = localParameterData.author;

            //add Diyanet Fihristi if not exist
            var found=false;
            for(var i=0; i< $scope.usersForSearch.length; i++){
                if($scope.usersForSearch[i].id==2413){
                    found=true;
                }
            }
            if(!found){
                $scope.usersForSearch.push(
                    {
                        fbId: 100,
                        id: 2413,
                        name: "Diyanet Fihristi",
                        photo: "https://upload.wikimedia.org/wikipedia/tr/f/f4/Diyanet_logo.jpg",
                        username: "diyanetfihristi"
                    }
                );
            }
        };

        $scope.storeInferenceDisplayViewParameters = function () {

            var localParameterData = {};

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            localParameterData.author = $scope.referenced.selectedAuthor;
            //all pages have its name here
            localStorageService.set('inference_display_view_parameters', localParameterData);
        };


        //use selected author and update referenced translation list
        $scope.updateReferencedTranslations = function(){


            if($scope.referenced.verses.length == 0){
                $scope.content = $scope.compileContent($scope.contentOriginal,$scope.referenced.verses, $scope.referenced.verseIds, $scope.inlineReferenceDisplay);
                return;
            }
            //get referenced verse id list
            var verseIds = Object.keys($scope.referenced.verses).join(",");
            dataProvider.fetchTranslationByAuthorAndVerseList({author:$scope.referenced.selectedAuthor, verse_list:verseIds, access_token:$scope.access_token}, function (data) {
                for (var i = 0; i < data.length; i++) {
                    var verseId = data[i].verseId;
                    $scope.referenced.verses[verseId].translation = data[i].content;
                }
                $scope.content = $scope.compileContent($scope.contentOriginal,$scope.referenced.verses, $scope.referenced.verseIds,$scope.inlineReferenceDisplay);

            });
            $scope.storeInferenceDisplayViewParameters();
            $scope.setInferenceDisplayPageURL();
        }

        $scope.updateTags = function() {

            if($scope.referenced.verses.length == 0){
                return;
            }
            var allAnnotationsParams = [];

            var circleIDList = [];
            var userIDList = [];


            for (var i = 0; i < $scope.circlesForSearch.length; i++) {
                circleIDList.push($scope.circlesForSearch[i].id);
            }

            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                userIDList.push($scope.usersForSearch[i].id);
            }

            allAnnotationsParams.circles = circleIDList.join(",");
            allAnnotationsParams.users = userIDList.join(",");
            allAnnotationsParams.verses = Object.keys($scope.referenced.verses).join(",");


            var annotationRestangular = Restangular.one("annotations").all("tags");
            annotationRestangular.customGET('', allAnnotationsParams, {access_token: $scope.access_token}).then(function (data) {


                //clear tag map
                for (var i = 0; i < $scope.referenced.verseIds.length; i++) {
                    $scope.referenced.verses[$scope.referenced.verseIds[i]].tags = [];
                }
                //update tag map
                for (var i = 0; i < data.length; i++) {
                    var verseId = data[i].verse_id;
                    $scope.referenced.verses[verseId].tags = data[i].tags;
                }

            });

            $scope.storeInferenceDisplayViewParameters();
            $scope.setInferenceDisplayPageURL();

        }

        //reflects the scope parameters to URL
        $scope.setInferenceDisplayPageURL = function () {
            var parameters =
            {
                circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                users: Base64.encode(JSON.stringify($scope.usersForSearch)),
                author: $scope.referenced.selectedAuthor

            }
            $location.path("/inference/display/" + $scope.inferenceId + "/", false).search(parameters);
                     

        };

        if(config_data.isMobile){
            $scope.deleted = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Notu Silme',
                    template: 'Çıkarım notu silinecek Onaylıyor musunuz?',
                    buttons: [{
                        text : 'Vazgeç',
                        type: 'button-balanced',
                    },
                    {
                        text : 'Sil',
                        type: 'button-assertive',
                        onTap: function (e) {
                            $scope.delete_inference();
                        }
                    }]
                });
            };

            $ionicModal.fromTemplateUrl('components/partials/comment_modal_inference.html', {
                scope: $scope,
                animation: 'slide-in-up',
                id: 'comment_modal'
            }).then(function (modal) {
                $scope.comment_modal = modal
            });
        }
        $scope.getChapterVerseNotation = function(verseId){
            return Math.floor(verseId/1000)+":"+ verseId%1000;
        };

        $scope.shareInference = function(){
            $cordovaSocialSharing.share($scope.title, $scope.shareTitle, null, $scope.shareUrl);
        };

        $scope.callUrlCopied = function(){

            var infoPopup = $ionicPopup.alert({
                title: 'Url Bilgisi Kopyalandı.',
                template: '',
                buttons: []
            });

            $timeout(function() {
                infoPopup.close(); //close the popup after 3 seconds for some reason
            }, 1700);
        };

        $scope.displayCommentDeleteModal = function(source, comment_id, index){
            $scope.deleteCommentFlag=true;
            $scope.commentWillDeleteParent = source;
            $scope.commentWillDeleteId = comment_id;
            $scope.commentWillDeleteIndex = index;
        };

        $scope.displayCommentUpdateModal = function (source, comment, index){
            $scope.updateCommentFlag = true;
            $scope.commentWillUpdateParent = source;
            $scope.commentWillUpdate = comment;
            $scope.commentWillUpdateIndex = index;
            $scope.commentContentUpdate.value = comment.content;
        };

        $scope.openFooterMenu = function (source, comment, comment_index){
            $scope.footerMenuButtons = [];
            $scope.footerMenuButtons.push({text: 'Yorumu Güncelle'});
            $scope.footerMenuButtons.push({text: 'Yorumu Sil'});
            if ($scope.user.id != comment.userId){
                return;
            }
            $ionicActionSheet.show({
                buttons: $scope.footerMenuButtons,
                destructiveText: '',
                titleText: '',
                cancelText: 'Kapat',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.source = source;
                        $scope.resource_type='inferences';
                        $scope.resource_id=$scope.inference_info.id;
                        $scope.comment_id=comment.id;
                        $scope.comment_index=comment_index;
                        $scope.isForUpdate=true;
                        $scope.openModal('comment_modal');
                        $scope.commentContentUpdate.value = comment.content;
                    } else if (index == 1) {
                        var confirmPop = $ionicPopup.confirm({
                            title: 'Yorum Silme',
                            template: 'Yorumunuzu silmek istiyor musunuz?',
                            cancelText: 'Hayır',
                            okText: 'Sil',
                            okType : 'button-assertive'
                        });

                        confirmPop.then(function (res) {
                            if (res) {
                                $scope.deleteComment(source, 'inferences', $scope.inference_info.id, comment.id, comment_index);
                            }
                        });
                    }
                    return true;
                }
            });
        };

        $scope.openModal = function (id) {
            if (id == 'comment_modal'){
                $scope.comment_modal.show();
                $timeout(function(){
                    $scope.focusToCommentArea("comment_area_inference_for_mobile");
                },600);
            }
        };

        $scope.closeModal = function (id) {
            if (id == 'comment_modal'){
                $scope.comment_modal.hide();
            }
        };

        $scope.displayCommentModal = function (parentId, parentIndex) {
            if ($scope.user == null)
                return;
            $scope.resource = $scope.inference_info;
            $scope.resource_type = 'inferences';
            $scope.resource_id = $scope.inference_info.id;
            $scope.parent_id = parentId;
            $scope.parent_index = parentIndex;
            $scope.isForUpdate=false;
            $scope.commentContent.value = "";
            //document.getElementById('comment_area_for_mobile') != null ? document.getElementById('comment_area_for_mobile').value = '' : console.log('');
            $scope.openModal('comment_modal');
        };


        $scope.createComment = function(resource, resource_type, resource_id, content, parent_id, parent_index){
            var commentRestangular = Restangular.one(resource_type, resource_id).one("comments");
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var postData = [];
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent($scope.commentContent.value));
            if (parent_id != null)
                postData.push(encodeURIComponent("parent_id") + "=" + encodeURIComponent(parent_id));
            var data = postData.join("&");
            commentRestangular.customPOST(data, '', '', headers).then(function (comment) {
                var temp = {};
                temp.vote = null;
                temp.voteRates = {'like':0, 'dislike':0};
                temp.comment = comment;
                temp.owner = $scope.user;
                temp.owner.user_id = $scope.user.id;
                if (parent_id != null){
                    if (!isDefined(resource.comments[parent_index].comment.childs)){
                        resource.comments[parent_index].comment.childs = [];
                        resource.comments[parent_index].showChilds = true;
                    }
                    resource.comments[parent_index].comment.childs.push(temp);
                }else{
                    resource.comments.push(temp);
                }
                $scope.commentContent.value = "";
            });
        };

        $scope.deleteComment = function(source, resource_type, resource_id, comment_id, comment_index){
            var commentRestangular = Restangular.one(resource_type, resource_id).one("comments", comment_id);
            commentRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (comment) {
                source.splice(comment_index,1);
            });
        };

        $scope.updateComment = function (source, resource_type, resource_id, comment_id, content, comment_index){
            var commentRestangular = Restangular.one(resource_type, resource_id).one("comments", comment_id);
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var postData = [];
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent($scope.commentContentUpdate.value));
            var data = postData.join("&");
            commentRestangular.customPUT(data, '', '', headers).then(function (record) {
                source[comment_index].comment.content = record.content;
                $scope.commentContentUpdate.value="";
            });
        };


        //definitions are finished. Now run initialization
        //authorMap should be initialized before start
        if($scope.authorMap.length==0){
            $scope.$on("authorMap ready",function(){
                $scope.initializeInferenceDisplayController();
            });
        }
        else{
            $scope.initializeInferenceDisplayController();
        }

    });

