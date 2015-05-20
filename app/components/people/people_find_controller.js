angular.module('ionicApp')
    .controller('PeopleFindCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService) {
        $scope.testData = "find people";
    });