angular.module('ionicApp')
    .controller('AnnotationDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular) {

        $scope.annotationId=0;
        $scope.annotation = null;
        $scope.new_comment='';
        $scope.deleteCommentFlag = false;
        $scope.commentWillDeleteParent = null;
        $scope.commentWillDeleteId = null;
        $scope.commentWillDeleteIndex = null;

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
            }, function(response) {
                if (response.status == "400"){
                    if (config_data.isMobile && $scope.access_token != ""){
                        $location.path('/');
                        return;
                    }
                }
            });
        };

        $scope.displayCommentDeleteModal = function(source, comment_id, index){
            $scope.deleteCommentFlag=true;
            $scope.commentWillDeleteParent = source;
            $scope.commentWillDeleteId = comment_id;
            $scope.commentWillDeleteIndex = index;
        };

        $scope.initializeAnnotationController = function(){
            if (!isDefined($routeParams.annotationId))
                return;
            $scope.annotation_info($routeParams.annotationId);
        };

        $scope.initializeAnnotationController();
    });
