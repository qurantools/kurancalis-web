angular.module('ionicApp')
    .controller('InferenceEditController', function ($scope, $routeParams, $location, authorization, localStorageService, Restangular) {

        $scope.inferenceId=0;
        $scope.circles = []; //id array
        $scope.users = []; //id array
        $scope.pagePurpose = "new";
        
        ///////Volkan
        $scope.extendedCirclesForSearch = []; //show circles
        $scope.initializeCircleLists(); //show circles
        var tags = [];
        var canViewCircles_tags = [];
        var canCommentCircles_tags = [];
        var canViewUsers_tags = [];
        var canCommentUsers_tags = [];
        
        
        //tags input auto complete function
        $scope.loadTags = function (query) {
            var tagsRestangular = Restangular.one('tags', query);
            return tagsRestangular.customGET("", {}, {'access_token': $scope.access_token});
        };
        
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
        
        $scope.do_array=function()
        {
            tags.length=0;
            canViewCircles_tags.length = 0;
            canCommentCircles_tags.length = 0;
            canViewUsers_tags.length = 0;
            canCommentUsers_tags.length = 0;
        
            for(var i=0; i<$scope.tags_entry.length; i++)
            { tags.push($scope.tags_entry[i].id); }
            
            for(var i=0; i<$scope.circlesForSearch.length; i++)
            { canViewCircles_tags.push($scope.circlesForSearch[i].id); }
            
            for(var i=0; i<$scope.usersForSearch.length; i++)
            { canViewUsers_tags.push($scope.usersForSearch[i].id); }
            
            for(var i=0; i<$scope.circlesForSearch1.length; i++)
            { canCommentCircles_tags.push($scope.circlesForSearch1[i].id); }
            
            for(var i=0; i<$scope.usersForSearch1.length; i++)
            { canCommentUsers_tags.push($scope.usersForSearch1[i].id); }
        
        save_inferences();
        }
        
        function save_inferences()
        {
           var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            //var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("title") + "=" + encodeURIComponent($scope.title));
            postData.push(encodeURIComponent("image") + "=" + encodeURIComponent(''));
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent($scope.content));
            var tags_add = tags.join(",");
            postData.push(encodeURIComponent("tags") + "=" + encodeURIComponent(tags_add));

            var canViewCircles = canViewCircles_tags.join(",");
            postData.push(encodeURIComponent("canViewCircles") + "=" + encodeURIComponent(canViewCircles));

            var canViewUsers = canViewUsers_tags.join(",");
            postData.push(encodeURIComponent("canViewUsers") + "=" + encodeURIComponent(canViewUsers));

            var canCommentCircles = canCommentCircles_tags.join(",");
            postData.push(encodeURIComponent("canCommentCircles") + "=" + encodeURIComponent(canCommentCircles));

            var canCommentUsers = canCommentUsers_tags.join(",");
            postData.push(encodeURIComponent("canCommentUsers") + "=" + encodeURIComponent(canCommentUsers));

            //
            var data = postData.join("&");
            var annotationRestangular = Restangular.one("inferences");
            return annotationRestangular.customPOST(data, '', '', headers);
        }
        
        ///////Volkan
        
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

            tinymce.init({
                selector: "#mytextarea",
                language: "tr_TR",
                plugins: "textcolor advlist autolink link image lists preview",
                toolbar: "undo redo | formatselect fontsizeselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | forecolor backcolor | link image preview"
            });



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

