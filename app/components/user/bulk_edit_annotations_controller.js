/**
 * Created by Erata 09/03/18.
 */
var bulkEdit = angular.module('ionicApp')
    .controller('BulkEditCtrl', function ($rootScope,$scope,$q, $routeParams, $location, $timeout,$ionicModal, authorization, localStorageService, Restangular, $translate, Notification) {

        $scope.selectedIDs = [];
        $scope.showdeletebulknotes = [];
        $scope.isSelected = [];
        $scope.isSelectAll = false;

        $scope.init = function () {
            if ( $location.path() == "/user/account/edit_batch_notes/") {
                $scope.pagePurpose = "edit_batch_notes";
                $scope.getAlAnnotations();
            }
        };

        $scope.getAlAnnotations = function () {
            var usersRestangular = Restangular.all("allannotations_with_permissions");
            usersRestangular.customGET("", {}, {'access_token': authorization.getAccessToken()}).then(function (annotations) {
                //console.warn("annotations...", annotations);
                $scope.annotations = annotations;
                $scope.scopeApply();
            });
        };

        $scope.selectAnnotation = function (id, value) {
            if($scope.selectedIDs.includes(id))
            {
                var index = $scope.selectedIDs.indexOf(id);
                $scope.selectedIDs.splice(index, 1);
                $scope.isSelectAll = false;

            } else if(value) {
                $scope.selectedIDs.push(id);

                if($scope.selectedIDs.length == $scope.annotations.length){
                    $scope.isSelectAll = true;
                }
            }
        };

        $scope.selectAlldAnnotation = function (isSelectAll) {
            $scope.selectedIDs = [];

            for (var i = 0; i < $scope.annotations.length; i++){
                if(isSelectAll) {
                    $scope.selectedIDs.push($scope.annotations[i].annotationId);
                }
                $scope.isSelected[i] = isSelectAll;
            }
        };

        $scope.removeSelectedAnnotations = function () {
            Restangular.all("annotations").customDELETE("", {annotations: $scope.selectedIDs.join(",")}, {'access_token': authorization.getAccessToken()}).then(function (result) {
                console.log("Silme Başarılı ",$scope.selectedIDs);

                for(var i=0; i<$scope.selectedIDs.length; i++)
                {
                    var item = $scope.annotations.filter(function(item) {
                        return item.annotationId == $scope.selectedIDs[i];
                    })[0];

                    var index = $scope.annotations.indexOf(item);
                    $scope.annotations.splice(index, 1);
                    $scope.isSelected.splice(index, 1);
                    //console.log("annotations", $scope.annotations.length);
                }

                $timeout(function () {
                    $scope.selectedIDs = [];
                    $scope.isSelectAll = false;
                    $scope.isSelected = [];

                    $scope.scopeApply();
                },100)

            });
        };

        $scope.showdeletebulknotes = false;
        $scope.coklunotsilmodal = function () {
            $scope.showdeletebulknotes = false;

            $timeout(function () {
                $scope.showdeletebulknotes = true;
            },100)
        };

        $scope.init();

    });


bulkEdit.directive('coklunotsilmodal', function () {
    return {
        templateUrl: 'app/components/user/bulk_delete_annotations.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.remove_carriage = false;
            scope.column_name = false;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});