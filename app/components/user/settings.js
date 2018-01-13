angular.module('ionicApp')
    .controller('UserSettingsController', function ($rootScope,$scope,$q, $routeParams, $location, $timeout,$ionicModal, authorization, localStorageService, Restangular) {

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };

    });

