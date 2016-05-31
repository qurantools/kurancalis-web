angular.module('ionicApp')
    .controller('AnnotationDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular) {

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
                        data.comments[parentIndex].comment.childs.unshift(data.comments[i]);
                        childIndexs.push(i);
                    }
                }

                for(var i = childIndexs.length; i > 0; i--){
                    data.comments.splice(childIndexs[i-1], 1);
                }
                $scope.annotation = data;
            });
        };

        $scope.displayCommentDeleteModal = function(source, comment_id, index){
            $scope.deleteCommentFlag=true;
            $scope.commentWillDeleteParent = source;
            $scope.commentWillDeleteId = comment_id;
            $scope.commentWillDeleteIndex = index;
        };

        $scope.displayCommentUpdateModal = function (source, comment, index){
            $scope.updateCommentFlag=true;
            $scope.commentWillUpdateParent = source;
            $scope.commentWillUpdate = comment;
            $scope.commentWillUpdateIndex = index;
            document.getElementById('annotation_comment_update_textarea').value = comment.content;
        };

        $scope.initializeAnnotationController = function(){
            if (!isDefined($routeParams.annotationId))
                return;
            $scope.annotation_info($routeParams.annotationId);
        };

        $scope.initializeAnnotationController();
    });
