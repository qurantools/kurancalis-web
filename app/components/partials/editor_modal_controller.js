angular.module('ionicApp')
    .controller('annotationEditorController', function ($scope, $q, $routeParams, $location, $timeout, Restangular, $ionicModal, $translate) {

        $scope.callback = function (){};
        $scope.cancel = function(){};
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
                    $scope.ViewCircles.push({'id': '-1', 'name': $translate.instant('Herkes')});
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

        //retrives the permissions of an annotation to scope variables
        $scope.restoreScopeAnnotationPermissions = function (annoid) {
            var cevregosterRestangular = Restangular.one("annotations", annoid).all("permissions");
            cevregosterRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (cevreliste) {


                //todo: replace locale "All circles" and "All users" for -2 and -1 circle ids
                var clis = [];

                for (var i = 0; i < cevreliste.canViewCircles.length; i++) {
                    clis.push({'id': cevreliste.canViewCircles[i].id, 'name': cevreliste.canViewCircles[i].name});

                }
                $scope.ViewCircles = clis;
                //do some special for mobile widget
                $scope.setMobileAnnotationEditorCircleListForSelection($scope.ViewCircles);

                var clis1 = [];
                for (var i = 0; i < cevreliste.canViewUsers.length; i++) {
                    clis1.push({'id': cevreliste.canViewUsers[i].id, 'name': cevreliste.canViewUsers[i].name});
                }

                $scope.ViewUsers = clis1;

                var clis2 = [];
                for (var i = 0; i < cevreliste.canCommentCircles.length; i++) {
                    clis2.push({
                        'id': cevreliste.canCommentCircles[i].id,
                        'name': cevreliste.canCommentCircles[i].name
                    });
                }

                $scope.yrmcevres = clis2;

                var clis3 = [];
                for (var i = 0; i < cevreliste.canCommentUsers.length; i++) {
                    clis3.push({'id': cevreliste.canCommentUsers[i].id, 'name': cevreliste.canCommentUsers[i].name});
                }
                $scope.yrmkisis = clis3;
            });
        };

        $scope.setMobileAnnotationEditorCircleListForSelection = function(circles){
            //reset mobileAnnotationEditorCircleListForSelection
            for (var checkboxIndex = 0; checkboxIndex < $scope.mobileAnnotationEditorCircleListForSelection.length; checkboxIndex++) {
                $scope.mobileAnnotationEditorCircleListForSelection[checkboxIndex].selected=false;
            }

            //prepare circle checkbox  list
            for( var circleIndex = 0; circleIndex < circles.length; circleIndex++){
                for (var checkboxIndex = 0; checkboxIndex < $scope.mobileAnnotationEditorCircleListForSelection.length; checkboxIndex++) {
                    if( circles[circleIndex].id == $scope.mobileAnnotationEditorCircleListForSelection[checkboxIndex].id ){
                        $scope.mobileAnnotationEditorCircleListForSelection[checkboxIndex].selected=true;
                    }
                }
            }
        };

        $scope.closeAnnotationModal = function(){
            $("#deleteAnnotationModal").modal("hide");
        };

        $scope.submitEditor = function () {
            $scope.showProgress("submitEditor");
            $timeout(function () {
                if (config_data.isMobile) { //convert mobile selection to viewCircles
                    //prepare canView circle list
                    $scope.ViewCircles = [];
                    for (var index = 0; index < $scope.mobileAnnotationEditorCircleListForSelection.length; ++index) {
                        if ($scope.mobileAnnotationEditorCircleListForSelection[index].selected == true) {
                            $scope.ViewCircles.push($scope.mobileAnnotationEditorCircleListForSelection[index]);
                        }
                    }
                }
                var tagParameters = $scope.getTagParametersForAnnotatorStore($scope.ViewCircles, $scope.yrmcevres, $scope.ViewUsers, $scope.yrmkisis, $scope.annotationModalDataTagsInput);
                $scope.annotationModalData.canViewCircles = tagParameters.canViewCircles;
                $scope.annotationModalData.canCommentCircles = tagParameters.canCommentCircles;
                $scope.annotationModalData.canViewUsers = tagParameters.canViewUsers;
                $scope.annotationModalData.canCommentUsers = tagParameters.canCommentUsers;
                $scope.annotationModalData.tags = tagParameters.tags;

                $scope.hideProgress("submitEditor");
                $scope.callback($scope.annotationModalData);
                if (config_data.isMobile){
                    $scope.closeModal('editor');
                }else{
                    $('#annotationModal').modal('hide');
                }
            },350);
        };

        $scope.mdeleteAnnotation = function(){
            $("#deleteAnnotationModal").modal("hide");
            $scope.callback($scope.index);
        };

        $scope.openModal = function(id){
            if (id == 'editor'){
                $scope.getModalEditor().show();
            } else if (id == 'viewusersearch') {
                $scope.modal_view_user_search.show();
            } else if (id == 'tagsearch') {
                $scope.modal_tag_search.show();
                focusToInput('addtagtoannotation_input');
            }
        };

        $scope.closeModal = function(id){
            if (id == 'editor'){
                $scope.getModalEditor().hide();
            } else if (id == 'tagsearch') {
                $scope.modal_tag_search.hide();
            } else if (id == 'viewusersearch') {
                $scope.modal_view_user_search.hide();
            }
        };

        $scope.cancelNewAnnotationCreation = function(){
            if (config_data.isMobile){
                $scope.closeModal('editor');
            }else{
                $('#annotationModal').modal('hide');
            }
            $scope.cancel();
        };

        $scope.init = function(){
            $scope.$on('show_editor', function(event, args) {
                $scope.callback = args.postCallback;
                if (isDefined(args.cancelPostBack)){
                    $scope.cancel = args.cancelPostBack;
                }
                $scope.showEditor(args.annotation, args.position);
            });

            $scope.$on('show_delete_editor_modal', function(event, args){
                $("#deleteAnnotationModal").modal("show");
                $scope.index = args.index;
                $scope.callback = args.postCallback;
            });

            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/add_tag_to_annotation.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'tagsearch'
                }).then(function (modal) {
                    $scope.modal_tag_search = modal
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
            }
        };

        $scope.init();
    });

