angular.module('ionicApp')
    .controller('annotationEditorController', function ($scope, $q, $routeParams, $location, $timeout, ChapterVerses, User, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {

        $scope.callback = function (){};
        $scope.index = -1;

        $scope.showEditor = function(annotation, position){
            //prepare canView circles.
            if (typeof annotation.annotationId != 'undefined') {
                $scope.ViewCircles = [];
                $scope.ViewUsers = [];
                $scope.yrmcevres = [];
                $scope.yrmkisis = [];
                $scope.restoreScopeAnnotationPermissions(annotation.annotationId);
            } else {
                if ($scope.ViewCircles.length == 0 && $scope.ViewUsers.length == 0 && $scope.yrmcevres.length == 0 && $scope.yrmkisis.length == 0) {
                    //all empty //share to everyone by default
                    $scope.ViewCircles.push({'id': '-1', 'name': 'Herkes'});
                } else { //use previous values.

                }
                //do some special for mobile widget
                $scope.setMobileAnnotationEditorCircleListForSelection($scope.ViewCircles);
            }
            var newTags = [];
            //Volkan Ekledi.
            var cvrtags = [];
            if (typeof annotation.vcircles != 'undefined') {
                for (var i = 0; i < annotation.vcircles.length; i++) {
                    cvrtags.push({"id": annotation.vcircles[i]});
                }
            }
            if (typeof annotation.tags != 'undefined') {
                for (var i = 0; i < annotation.tags.length; i++) {
                    newTags.push({"name": annotation.tags[i]});
                }
            }

            $scope.annotationModalData = annotation;
            $scope.annotationModalDataTagsInput = newTags;
            if (typeof $scope.annotationModalData.text == 'undefined') {
                $scope.annotationModalData.text = "";
            }
            //set default color
            if (typeof $scope.annotationModalData.colour == 'undefined') {
                $scope.annotationModalData.colour = 'yellow';
            }
            $scope.annotationModalDataVerse = Math.floor(annotation.verseId / 1000) + ":" + annotation.verseId % 1000;

            $scope.scopeApply();
            if (!config_data.isMobile) {
                $('#annotationModal').modal('show');
            } else {
                $scope.openModal('editor');
            }
        };

        $scope.closeAnnotationModal = function(){
            $("#deleteAnnotationModal").modal("hide");
        };

        $scope.submitEditor = function () {
            $scope.showProgress("submitEditor");
            $timeout(function () {
                var tagParameters = $scope.getTagParametersForAnnotatorStore($scope.ViewCircles, $scope.yrmcevres, $scope.ViewUsers, $scope.yrmkisis, $scope.annotationModalDataTagsInput);
                $scope.annotationModalData.canViewCircles = tagParameters.canViewCircles;
                $scope.annotationModalData.canCommentCircles = tagParameters.canCommentCircles;
                $scope.annotationModalData.canViewUsers = tagParameters.canViewUsers;
                $scope.annotationModalData.canCommentUsers = tagParameters.canCommentUsers;
                $scope.annotationModalData.tags = tagParameters.tags;
                $('#annotationModal').modal('hide');
                $scope.hideProgress("submitEditor");
                $scope.callback($scope.annotationModalData);
            },350);
        };

        $scope.mdeleteAnnotation = function(){
            $scope.callback($scope.index);
            $("#deleteAnnotationModal").modal("hide");
        };

        $scope.init = function(){
            $scope.$on('show_editor', function(event, args) {
                $scope.callback = args.postCallback;
                $scope.showEditor(args.annotation, args.position);
            });

            $scope.$on('show_delete_editor_modal', function(event, args){
                $("#deleteAnnotationModal").modal("show");
                $scope.index = args.index;
                $scope.callback = args.postCallback;
            });
        };

        $scope.init();
    });

