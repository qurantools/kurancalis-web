angular.module('ionicApp')
    .controller('InferenceDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular, $timeout) {

        //All scope variables
        $scope.inferenceId=0;
        $scope.circles = []; //id array
        $scope.users = []; //id array
        $scope.circlesForSearch =[];
        $scope.usersForSearch = [];
        $scope.referenced = {};
        $scope.referenced.verses = [];
        $scope.referenced.selectedAuthor="";

        //All Display Variables
        $scope.edit_user = "";
        $scope.title = "";
        $scope.info_author = "";
        $scope.photo = "";
        $scope.content = "";
        $scope.tags = [];
        $scope.open_edit = true;


        //Volkan
        $scope.initializeCircleLists(); //show circles

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


        //Edit inference
        $scope.edit_inference = function () {
            $location.path('inference/edit/'+$scope.inferenceId+"/");
        }
        
        //View inference
        $scope.inference_info = function(inferenceId) {
            var inferenceRestangular = Restangular.one("inferences", inferenceId);
            inferenceRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {
                $scope.inference_info = data;

                $scope.edit_user = data.userId;
                $scope.title = data.title;
                $scope.info_author = data.userName;
                $scope.photo = data.image;
                $scope.content = data.content;
                $scope.tags = data.tags;

                for (var i = 0; i < data.references.length; i++) {
                    var verseId = data.references[i];
                    $scope.referenced.verses[verseId] = { translation:"", tags:[], verseId:verseId};
                }

                //array of referenced verse IDs
                $scope.referenced.verseIds = Object.keys($scope.referenced.verses);

                if($scope.authorMap.length == 0){
                    $scope.$on("authorMap ready",function(){
                        //$scope.referenced.selectedAuthor = authorMap[$scope.referenced.selectedAuthor];
                        $scope.updateReferencedTranslations();
                        $scope.updateTags();
                    });
                }
                else{
                    $scope.updateReferencedTranslations();
                    $scope.updateTags();
                }

            });
        };

        //On Off Switch
        $scope.status = true;

        $scope.changeStatus = function () {
            $scope.status = !$scope.status;
        }

        $scope.updateTags = function() {

            var allAnnotationsParams = [];

            var circleIDList = [];
            var userIDList = [];

            for (var i = 0; i < $scope.circlesForSearch.length; i++) {
                circleIDList.push($scope.circlesForSearch[i].id);
            }

            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                userIDList.push($scope.usersForSearch[i].id);
            }

            allAnnotationsParams.circles = circleIDList.join(",");
            allAnnotationsParams.users = userIDList.join(",");
            allAnnotationsParams.verses = Object.keys($scope.referenced.verses).join(",");

            var annotationRestangular = Restangular.one("annotations").all("tags");
            annotationRestangular.customGET('', allAnnotationsParams, {access_token: $scope.access_token}).then(function (data) {


                //clear tag map
                for (var i = 0; i < $scope.referenced.verseIds.length; i++) {
                    $scope.referenced.verses[$scope.referenced.verseIds[i]].tags = [];
                }
                //update tag map
                for (var i = 0; i < data.length; i++) {
                    var verseId = data[i].verse_id;
                    $scope.referenced.verses[verseId].tags = data[i].tags;
                }

            });

        }

        //////////////Volkan
        $scope.initializeInferenceDisplayController = function () {
            var inferenceId=0;
            var circles = []; //id array
            var users = []; //id array
            var author = "";

            var inferenceIdFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;
            var authorFromRoute = false;

            $scope.checkUserLoginStatus();

            if (typeof $routeParams.inferenceId !== 'undefined') {
                inferenceId = $routeParams.inferenceId;

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

            if (typeof $routeParams.author !== 'undefined') {
                try {
                    author = $routeParams.author;
                    authorFromRoute = true;
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
                localParameterData.author = 1024;

            }
            else {
                //get defaults or router params for lack of local
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }
                if (authorFromRoute || !isDefined(localParameterData.author)) {
                    localParameterData.author = author;
                }
            }

            localParameterData.inferenceId = inferenceId;

            $scope.restoreInferenceDisplayViewParameters(localParameterData);
            $scope.storeInferenceDisplayViewParameters
            $scope.setInferenceDisplayPageURL();


            //View inference by id
            $scope.inferenceId = inferenceId;
            $timeout( function(){
                $scope.inference_info(inferenceId);
            });

            //Authors
            /*
            var AuthorsRestangular = Restangular.one("authors");
            AuthorsRestangular.customGET("", {}, {}).then(function (data) {
                $scope.authorlist = data;
                $scope.referenced.selectedAuthor = $scope.authorlist[13].id;
            });
            */



        };




        $scope.restoreInferenceDisplayViewParameters = function (localParameterData) {
            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.inferenceId = localParameterData.inferenceId;
            $scope.referenced.selectedAuthor = localParameterData.author;

        };

        $scope.storeInferenceDisplayViewParameters = function () {

            var localParameterData = {};

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            localParameterData.selectedAuthor = $scope.referenced.selectedAuthor;
            //all pages have its name here
            localStorageService.set('inference_display_view_parameters', localParameterData);
        };


        //use selected author and update referenced translation list
        $scope.updateReferencedTranslations = function(){
            //get referenced verse id list
            var verseIds = Object.keys($scope.referenced.verses).join(",");
            var translationsRestangular = Restangular.one("translations").all("list");
            translationsRestangular.customGET("", {author:$scope.referenced.selectedAuthor, verse_list:verseIds}, {'access_token': $scope.access_token}).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var verseId = data[i].verseId;
                    $scope.referenced.verses[verseId].translation = data[i].content;
                }

            });
        }

        //reflects the scope parameters to URL
        $scope.setInferenceDisplayPageURL = function () {
            var parameters =
            {
                circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                users: Base64.encode(JSON.stringify($scope.usersForSearch)),
                author: $scope.referenced.selectedAuthor

            }
            $location.path("/inference/display/"+$scope.inferenceId+"/", false).search(parameters);
        };

        $scope.getChapterVerseNotation = function(verseId){
            return Math.floor(verseId/1000)+":"+ verseId%1000;
        };

        //definitions are finished. Now run initialization
        $scope.initializeInferenceDisplayController();

    });

