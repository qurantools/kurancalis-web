var showVerseTemplateUrl="app/components/templates/directives/showVerse.html";
if (config_data.isMobile) {
    showVerseTemplateUrl="components/templates/directives/showVerse.html";
}
angular.module('directives.showVerse', [])
    .directive('showVerse', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: showVerseTemplateUrl,
            controller: function () {
            }
        };
    });