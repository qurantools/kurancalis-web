angular.module('directives.showVerse', [])
    .directive('showVerse', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: "app/components/templates/directives/showVerse.html",
            controller: function () {
            }
        };
    });