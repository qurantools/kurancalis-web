angular.module('ionicApp')
    .controller('InferenceEditController', function ($scope, $routeParams, $location, authorization, localStorageService, Restangular) {

        $scope.inferenceId=0;
        $scope.circles = []; //id array
        $scope.users = []; //id array
        $scope.pagePurpose = "new";



        $scope.initializeInferenceEditController = function () {
            var inferenceId=0;
            var circles = []; //id array
            var users = []; //id array

            var inferenceIdFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;

            if($location.path()=="/inference/new/"){
                $scope.pagePurpose = "new";
                inferenceId = 0;
            }
            else{
                $scope.pagePurpose = "edit";
            }

            if (typeof $routeParams.inferenceId !== 'undefined') {
                inferenceId = $routeParams.inferenceId;
                inferenceIdFromRoute = true;
            }
            else if( $scope.pagePurpose == "edit" ){
                //edit page should have inferenceID
                alert("Edit page needs inferenceId");
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
            var localParameterData = localStorageService.get('inference_edit_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.circles = [];
                localParameterData.users = [];
                localParameterData.inferenceId = inferenceId;


            }
            else {
                //get defaults or router params for lack of local
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }

                localParameterData.inferenceId = inferenceId;  //0 if new
            }

            $scope.restoreInferenceEditViewParameters(localParameterData);
            $scope.storeInferenceEditViewParameters
            $scope.setInferenceEditPageURL();




        }


        $scope.restoreInferenceEditViewParameters = function (localParameterData) {
            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.inferenceId = localParameterData.inferenceId;

        };

        $scope.storeInferenceEditViewParameters = function () {

            var localParameterData = {};

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            //all pages have its name here
            localStorageService.set('inference_edit_view_parameters', localParameterData);
        };


        //reflects the scope parameters to URL
        $scope.setInferenceEditPageURL = function () {


            if($scope.pagePurpose == "edit"){

                var parameters =
                {
                    inferenceId: $scope.inferenceId,
                    circles: btoa(JSON.stringify($scope.circlesForSearch)),
                    users: btoa(JSON.stringify($scope.usersForSearch))

                }
                $location.path("/inference/edit/", false).search(parameters);
            }
        };




        //definitions are finished. Now run initialization
        $scope.initializeInferenceEditController();

    });

