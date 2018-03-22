angular.module('ionicApp')
    .controller('AnnotationDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular, $ionicModal, $timeout, $ionicPopup, $ionicActionSheet, $translate) {

        $scope.annotation = null;

        $scope.new_comment='';

        $scope.deleteCommentFlag = false;
        $scope.commentWillDeleteParent = null;
        $scope.commentWillDeleteId = null;
        $scope.commentWillDeleteIndex = null;

        $scope.updateCommentFlag = false;
        $scope.commentWillUpdateParent = null;
        $scope.commentWillUpdateId = null;
        $scope.commentWillUpdateIndex = null;
        $scope.authorizedAnnotationDisplay = 0;
        $scope.commentContent = {};
        $scope.commentContent.value = "";
        $scope.commentContent.value = "";
        $scope.commentContentUpdate = {};
        $scope.commentContentUpdate.value = "";
        $scope.shareUrl = "";
        $scope.shareTitle = "Ayet Notu Paylaşma";

        $scope.annotation_info = function(annotationId) {
            $scope.shareUrl =  config_data.webAddress + "/__/annotation/display/" + annotationId;
            var annotationRestangular = Restangular.one("annotations", annotationId);
            annotationRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {
                $scope.authorizedAnnotationDisplay = 1;
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
                $scope.annotation = data;
                $scope.focusToCommentArea('comment_textarea_annotation');
            }, function(response) {
                if (response.status == "400"){
                    $scope.authorizedAnnotationDisplay = 2;
                }
            });
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
            $scope.commentContentUpdate.value  = comment.content;
        };

        $scope.openFooterMenu = function (source, comment, comment_index){
            $scope.footerMenuButtons = [];
            $scope.footerMenuButtons.push({text: $translate.instant('Yorumu Güncelle')});
            $scope.footerMenuButtons.push({text: $translate.instant('Yorumu Sil')});
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
                        $scope.resource_type='annotations';
                        $scope.resource_id=$scope.annotation.id;
                        $scope.comment_id=comment.id;
                        $scope.comment_index=comment_index;
                        $scope.isForUpdate=true;
                        $scope.openModal('comment_modal');
                        $scope.commentContentUpdate.value = comment.content;
                    } else if (index == 1) {
                        var confirmPop = $ionicPopup.confirm({
                            title: $translate.instant('Yorum Silme'),
                            template: $translate.instant('Yorumunuzu silmek istiyor musunuz?'),
                            cancelText: $translate.instant('Hayır'),
                            okText: $translate.instant('Sil'),
                            okType : 'button-assertive'
                        });
                        confirmPop.then(function (res) {
                            if (res) {
                                $scope.deleteComment(source, 'annotations', $scope.annotation.id, comment.id, comment_index);
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
                    focusToInput('comment_area_annotation_for_mobile');
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
            $scope.resource = $scope.annotation;
            $scope.resource_type = 'annotations';
            $scope.resource_id = $scope.annotation.id;
            $scope.parent_id = parentId;
            $scope.parent_index = parentIndex;
            $scope.isForUpdate=false;
            $scope.commentContent.value  = "";
            $scope.openModal('comment_modal');
        };

        $scope.initializeAnnotationController = function(){
            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/comment_modal_annotation.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'comment_modal'
                }).then(function (modal) {
                    $scope.comment_modal = modal
                });
            }
            if (!isDefined($routeParams.annotationId))
                return;
            $scope.annotation_info($routeParams.annotationId);
            //$scope.displayTutorial("annotation");
        };

        $scope.showEditor = function(annotation){
            annotation.verseId = annotation.verseId;
            annotation.text = annotation.content;
            annotation.quote = annotation.quote;
            annotation.translationId = annotation.translationId;
            annotation.translationVersion = 1;
            annotation.annotationId = annotation.id;
            $scope.showEditorModal(annotation, -1, $scope.updateAnnotation);
        };

        $scope.deleteAnnotation = function (annotation) {
            if (config_data.isMobile) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('Ayet Notu Sil'),
                    template: $translate.instant('Ayet notu silinecektir, onaylıyor musunuz?'),
                    cancelText: $translate.instant('VAZGEC'),
                    okText: $translate.instant('TAMAM'),
                    okType: 'button-assertive'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $scope.mdeleteAnnotation(annotation);

                        /*var annotationRestangular = Restangular.one("annotations", annotation.id);
                        annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {
                            if (result.code == '200') {
                                var annotationIndex = $scope.getIndexOfArrayByElement($scope.feeds, 'id', annotation.id);
                                if (annotationIndex > -1) {
                                    $scope.feeds.splice(annotationIndex, 1);
                                }
                            }
                        });*/
                    } else {
                    }
                });
            }else{
                $scope.showAnnotationDeleteModal(annotation, $scope.mdeleteAnnotation);
            }
        };

        $scope.mdeleteAnnotation = function (annotation) {
            var annotationRestangular = Restangular.one("annotations", annotation.id);
            annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {
                $scope.annotation = null;
                $scope.annotationRemoved = true;
            });
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
                $scope.commentContent.value  = "";
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
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent($scope.commentContentUpdate.value ));
            var data = postData.join("&");
            commentRestangular.customPUT(data, '', '', headers).then(function (record) {
                source[comment_index].comment.content = record.content;
                $scope.commentContentUpdate.value ="";
            });
        };


        //In case of access token delay. May initialize twice
        if($scope.access_token == null){
            $scope.$on("userInfoReady",$scope.initializeAnnotationController);
        }

        //in case of no access_token
        $scope.initializeAnnotationController();


    });
