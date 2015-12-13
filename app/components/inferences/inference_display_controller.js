angular.module('ionicApp')
    .controller('InferenceDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular, $timeout) {

        //All scope variables
        $scope.inferenceId=0;
        $scope.circles = []; //id array
        $scope.users = []; //id array

        //All Display Variables
        $scope.edit_user = "";
        $scope.title = "";
        $scope.info_author = "";
        $scope.photo = "";
        $scope.content = "";
        $scope.tags = [];
        $scope.open_edit = true;
        $scope.authorlist = [];

        //Volkan
        $scope.initializeCircleLists(); //show circles
        Circles_tags = [];
        Users_tags = [];

        $scope.digercevre = false;
        $scope.digercevremodal = function () {
            $scope.digercevre = !$scope.digercevre;
        };

        //Delete inference
        $scope.delete_inference = function () {

            var inferenceRestangular = Restangular.one("inferences", $scope.inferenceId);
            inferenceRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (data) {
                $location.path('inferences/');
            });

        }

        //tags input auto complete
        $scope.peoplelist = function (people_name) {
            var peoplesRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = people_name;
            return peoplesRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token});
        };

        //tags input auto complete
        $scope.circleslistForSearch = function () {
            return $scope.extendedCirclesForSearch;
        };

        $scope.initializeCircleLists = function () {

            Restangular.all("circles").customGET("", {}, {'access_token': $scope.access_token}).then(function (circleList) {

                $scope.extendedCircles = [];
                $scope.extendedCircles.push({'id': '-2', 'name': 'Tüm Çevrelerim'});
                $scope.extendedCircles.push({'id': '-1', 'name': 'Herkes'});

                $scope.extendedCirclesForSearch = [];
                $scope.extendedCirclesForSearch.push({'id': '-2', 'name': 'Tüm Çevrelerim'});


                $scope.circleDropdownArray = [];
                $scope.circleDropdownArray.push({'id': '-2', 'name': 'Tüm Çevrelerim'});
                $scope.circleDropdownArray.push({'id': '', 'name': 'Sadece Ben'});

                $scope.query_circle_dropdown = $scope.circleDropdownArray[1];
                Array.prototype.push.apply($scope.circleDropdownArray, circleList);

                //also initialize extended circles
                Array.prototype.push.apply($scope.extendedCircles, circleList);
                Array.prototype.push.apply($scope.extendedCirclesForSearch, circleList);

                $scope.$broadcast("circleLists ready");

            });
        }

        //Authors
        var AuthorsRestangular = Restangular.one("authors");
        AuthorsRestangular.customGET("", {}, {}).then(function (data) {
            $scope.authorlist = data;
            $scope.selectedOption = $scope.authorlist[13].id;
        });

        //Edit inference
        $scope.edit_inference = function () {
            $location.path('inference/edit/'+$scope.inferenceId+"/");
        }
        
        //View inference
        function inference_info(inferenceId) {
            var inferenceRestangular = Restangular.one("inferences", inferenceId);
            inferenceRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {
                $scope.inference_info = data;

                $scope.edit_user = data.userId;
                $scope.title = data.title;
                $scope.info_author = data.userName;
                $scope.photo = data.image;
                $scope.content = data.content;
                $scope.tags = data.tags;

            });
        }

        //On Off Switch
        $scope.status = true;

        $scope.changeStatus = function () {
            $scope.status = !$scope.status;
        }

        $scope.do_array = function () {
            Circles_tags.length = 0;
            Users_tags.length = 0;

            for (var i = 0; i < $scope.circlesForSearch.length; i++) {
                Circles_tags.push($scope.circlesForSearch[i].id);
            }

            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                Users_tags.push($scope.usersForSearch[i].id);
            }

            lists();
        }

        function lists() {

            //var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            //var postData = [];
            //postData.push(encodeURIComponent("author") + "=" + encodeURIComponent($scope.selectedOption.valueOf()));

            //var users = Users_tags.join(",");
            //postData.push(encodeURIComponent("users") + "=" + encodeURIComponent(users));

            //var circles = Circles_tags.join(",");
            //postData.push(encodeURIComponent("circles") + "=" + encodeURIComponent(circles));

            //var data = postData.join("&");
            //var annotationRestangular = Restangular.all("annotations").one("tags");

            //annotationRestangular.customGET(data, '', '', headers).then(function (data) {

            //var a=data;
            //});

            $scope.allAnnotationsParams = [];

            $scope.allAnnotationsParams.author = $scope.selectedOption.valueOf();

            var users = Users_tags.join(",");
            $scope.allAnnotationsParams.users = users;

            var circles = Circles_tags.join(",");
            $scope.allAnnotationsParams.circles = circles;

            var annotationRestangular = Restangular.one("annotations").all("tags");
            annotationRestangular.customGET('', $scope.allAnnotationsParams, {access_token: $scope.access_token}).then(function (data) {

                var a = data;
            });

        }

        //////////////Volkan
        $scope.initializeInferenceDisplayController = function () {
            var inferenceId=0;
            var circles = []; //id array
            var users = []; //id array

            var inferenceIdFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;

            $scope.checkUserLoginStatus();

            if (typeof $routeParams.inferenceId !== 'undefined') {
                inferenceId = $routeParams.inferenceId;
                inferenceIdFromRoute = true;

                //View inference by id
                $scope.inferenceId = inferenceId;
                $timeout( function(){
                    inference_info(inferenceId);
                });
            }
            else {
                alert("iferenceId can not be empty or null!!!!");
            }


            if (typeof $routeParams.circles !== 'undefined') {
                try {
                    circles = JSON.parse(Base64.decode($routeParams.circles));
                    circlesFromRoute = true;
                }
                catch (err) {

                }
            }

            if (typeof $routeParams.users !== 'undefined') {
                try {
                    users = JSON.parse(Base64.decode($routeParams.users));
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
                circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                users: Base64.encode(JSON.stringify($scope.usersForSearch))

            }
            $location.path("/inference/display/"+$scope.inferenceId+"/", false).search(parameters);
        };

        //definitions are finished. Now run initialization
        $scope.initializeInferenceDisplayController();

    });

