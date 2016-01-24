angular.module('ionicApp')
    .controller('HelpController', function ($scope, $routeParams, $location, $timeout, authorization,
                                                     localStorageService, Restangular) {

        $scope.menuList=["Intro","Not Paylaşma","Ayraç Kullanma","Etiket Kullanımı","Not Arama"];


    });

