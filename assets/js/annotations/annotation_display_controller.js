angular.module('ionicApp')
    .controller('AnnotationDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular, $ionicModal, $timeout, $ionicPopup, $ionicActionSheet) {

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

        $scope.annotation_info = function(annotationId) {
            var annotationRestangular = Restangular.one("annotations", annotationId);
            annotationRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {
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
            document.getElementById('annotation_comment_update_textarea').value = comment.content;
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
                        $scope.resource_type='annotations';
                        $scope.resource_id=$scope.annotation.id;
                        $scope.comment_id=comment.id;
                        $scope.comment_index=comment_index;
                        $scope.isForUpdate=true;
                        $scope.openModal('comment_modal');
                        document.getElementById('comment_area_for_mobile').value = comment.content;
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
                $scope.focusToCommentArea("comment_area_for_mobile");
            }
        };

        $scope.closeModal = function (id) {
            if (id == 'comment_modal'){
                $scope.comment_modal.hide();
            }
        };

        $scope.displayCommentModal = function (parentId, parentIndex) {
            $scope.resource = $scope.annotation;
            $scope.resource_type = 'annotations';
            $scope.resource_id = $scope.annotation.id;
            $scope.parent_id = parentId;
            $scope.parent_index = parentIndex;
            $scope.isForUpdate=false;
            document.getElementById('comment_area_for_mobile') != null ? document.getElementById('comment_area_for_mobile').value = '' : console.log('');
            $scope.openModal('comment_modal');
        };

        $scope.initializeAnnotationController = function(){
            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/comment_modal.html', {
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
            $scope.displayTutorial("annotation");
        };

        $scope.initializeAnnotationController();
    });
