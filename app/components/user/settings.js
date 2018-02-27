/**
 * Created by Erata 26/02/18.
 */
var userSettings = angular.module('ionicApp')
    .controller('UserSettingsCtrl', function ($rootScope,$scope,$q, $routeParams, $location, $timeout,$ionicModal, authorization, localStorageService, Restangular, $translate, Notification) {

        $scope.message = "";
        $scope.remove_carriage = false;
        $scope.column_name = false;

        $scope.init = function () {
            if ( $location.path() == "/user/account/settings/") {
                $scope.pagePurpose = "settings";
            }
        };

        $scope.carriageChanged = function (value) {
            $scope.remove_carriage = value;
        };

        $scope.columnsChanged = function (value) {
            $scope.column_name = value;
        };

        $scope.showexportmodal = false;
        $scope.exportmodal = function () {
            $scope.showexportmodal = !$scope.showexportmodal;
        };

        $scope.exportAnnotations = function () {
            console.warn("carriage: " + $scope.remove_carriage, "\ncolumn: "+ $scope.column_name);

            Restangular.one('annotations/export').customGET("", {remove_carriage:$scope.remove_carriage.toString(), column_name:$scope.column_name.toString()}, {'access_token': $scope.access_token}).then(function (data) {
                console.log("Downloading...\n", data);
                var blob = new Blob([data]);
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'annotations.csv';
                a.target = '_blank';
                a.click();

            }, function(error) {
                console.error("There was an error", error);

                if(error.hasOwnProperty("data")){
                    $scope.showMessage(error.data.description);
                }
            });
        };

        $scope.init();

    });

userSettings.directive('exportmodal', function () {
    return {
        templateUrl: 'app/components/partials/export_annotations.html',
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