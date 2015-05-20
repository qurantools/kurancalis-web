angular.module('ionicApp')
    .controller('PeopleHaveYouCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService) {
        $scope.testData = "people have you";
    });