angular.module('ionicApp')
    .controller('InferenceDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular) {

        //All scope variables
        $scope.inferenceId=0;
        $scope.circles = []; //id array
        $scope.users = []; //id array


        $scope.initializeInferenceDisplayController = function () {
            var inferenceId=0;
            var circles = []; //id array
            var users = []; //id array

            var inferenceIdFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;

            if (typeof $routeParams.inferenceId !== 'undefined') {
                inferenceId = $routeParams.inferenceId;
                inferenceIdFromRoute = true;
            }
            else {
                alert("iferenceId can not be empty or null!!!!");
            }


            if (typeof $routeParams.circles !== 'undefined') {
                try {
                    circles = JSON.parse(atob($routeParams.circles));
                    circlesFromRoute = true;
                }
                catch (err) {

                }
            }

            if (typeof $routeParams.users !== 'undefined') {
                try {
                    users = JSON.parse(atob($routeParams.users));
                    usersFromRoute = true;
                }
                catch (err) {

                }
            }

            //all pages should have its name
            var localParameterData = localStorageService.get('inference_display_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.circles = [];
                localParameterData.users = [];

            }
            else {
                //get defaults or router params for lack of local
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }
            }

            localParameterData.inferenceId = inferenceId;

            $scope.restoreInferenceDisplayViewParameters(localParameterData);
            $scope.storeInferenceDisplayViewParameters
            $scope.setInferenceDisplayPageURL();

            $scope.checkUserLoginStatus();
        }


        $scope.restoreInferenceDisplayViewParameters = function (localParameterData) {
            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.inferenceId = localParameterData.inferenceId;

        };

        $scope.storeInferenceDisplayViewParameters = function () {

            var localParameterData = {};

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            //all pages have its name here
            localStorageService.set('inference_display_view_parameters', localParameterData);
        };


        //reflects the scope parameters to URL
        $scope.setInferenceDisplayPageURL = function () {
            var parameters =
            {
                inferenceId: $scope.inferenceId,
                circles: btoa(JSON.stringify($scope.circlesForSearch)),
                users: btoa(JSON.stringify($scope.usersForSearch))

            }
            $location.path("/inference/display/"+$scope.inferenceId+"/", false).search(parameters);
        };

        //definitions are finished. Now run initialization
        $scope.initializeInferenceDisplayController();

    });

