angular.module('ionicApp')
    .controller('InferenceDisplayController', function ($scope, $routeParams, $location, authorization, localStorageService,  Restangular, $timeout,$sce,$ionicModal,$ionicPopup) {

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
        $scope.contentOriginal = "";
        $scope.tags = [];
        $scope.open_edit = true;
        $scope.authorizedInferenceDisplay = 0;

        //On Off Switch
        $scope.inlineReferenceDisplay = false;

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
            $location.path('inference/edit/' + $scope.inferenceId + "/");
            

        }
        
        $scope.compileContent = function(original,verseList, verseIdList, inline){
            var outContent=original;
            for (var i = 0; i < verseIdList.length; i++) {
                var verseId = verseIdList[i];
                if(inline) {
                    outContent = outContent.replace(verseId, Math.floor(verseId / 1000) + ":" + verseId % 1000 + " - " + $scope.referenced.verses[verseId].translation);
                }
                else{
                    outContent = outContent.replace(verseId, Math.floor(verseId / 1000) + ":" + verseId % 1000);
                }
            }

            return $sce.trustAsHtml(outContent);
        };

        //View inference
        $scope.inference_info = function(inferenceId) {
            var inferenceRestangular = Restangular.one("inferences", inferenceId);
            inferenceRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {
                $scope.inference_info = data;
                $scope.authorizedInferenceDisplay = 1;

                $scope.edit_user = data.userId;
                $scope.title = data.title;
                //set page title as inference title
                $scope.setPageTitle(data.title);
                //$rootScope.pageTitle=data.title;

                $scope.info_author = data.userName;
                $scope.photo = data.image;
                $scope.contentOriginal = data.content;

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
            }, function(response) {
                if (response.status == "400"){
                    $scope.authorizedInferenceDisplay = 2;
                }
            });
        };


        $scope.changeInlineReferenceDisplay = function () {
            $scope.inlineReferenceDisplay = !$scope.inlineReferenceDisplay;
            $scope.updateReferencedTranslations();
        }



        //////////////Volkan
        $scope.initializeInferenceDisplayController = function () {
            var inferenceId=0;
            var circles = []; //id array
            var users = []; //id array
            var author = 1024; //default: yasar nuri

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
                localParameterData.circles = circles;
                localParameterData.users = users;
                localParameterData.author = author;

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
            $scope.shareUrl =  $location.absUrl().split('#')[0] + "__/inference/display/" + $scope.inferenceId;
            $scope.shareTitle = "Çıkarım Paylaşma";
        };




        $scope.restoreInferenceDisplayViewParameters = function (localParameterData) {
            $scope.circlesForSearch = localParameterData.circles;
            $scope.usersForSearch = localParameterData.users;
            $scope.inferenceId = localParameterData.inferenceId;
            $scope.referenced.selectedAuthor = localParameterData.author;

            //add Diyanet Fihristi if not exist
            var found=false;
            for(var i=0; i< $scope.usersForSearch.length; i++){
                if($scope.usersForSearch[i].id==2413){
                    found=true;
                }
            }
            if(!found){
                $scope.usersForSearch.push(
                    {
                        fbId: 100,
                        id: 2413,
                        name: "Diyanet Fihristi",
                        photo: "https://upload.wikimedia.org/wikipedia/tr/f/f4/Diyanet_logo.jpg",
                        username: "diyanetfihristi"
                    }
                );
            }
        };

        $scope.storeInferenceDisplayViewParameters = function () {

            var localParameterData = {};

            localParameterData.circles = $scope.circlesForSearch;
            localParameterData.users = $scope.usersForSearch;
            localParameterData.author = $scope.referenced.selectedAuthor;
            //all pages have its name here
            localStorageService.set('inference_display_view_parameters', localParameterData);
        };


        //use selected author and update referenced translation list
        $scope.updateReferencedTranslations = function(){


            if($scope.referenced.verses.length == 0){
                $scope.content = $scope.compileContent($scope.contentOriginal,$scope.referenced.verses, $scope.referenced.verseIds, $scope.inlineReferenceDisplay);
                return;
            }
            //get referenced verse id list
            var verseIds = Object.keys($scope.referenced.verses).join(",");
            var translationsRestangular = Restangular.one("translations").all("list");
            translationsRestangular.customGET("", {author:$scope.referenced.selectedAuthor, verse_list:verseIds}, {'access_token': $scope.access_token}).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var verseId = data[i].verseId;
                    $scope.referenced.verses[verseId].translation = data[i].content;
                }
                $scope.content = $scope.compileContent($scope.contentOriginal,$scope.referenced.verses, $scope.referenced.verseIds,$scope.inlineReferenceDisplay);

            });
            $scope.storeInferenceDisplayViewParameters();
            $scope.setInferenceDisplayPageURL();
        }

        $scope.updateTags = function() {

            if($scope.referenced.verses.length == 0){
                return;
            }
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

            $scope.storeInferenceDisplayViewParameters();
            $scope.setInferenceDisplayPageURL();

        }

        //reflects the scope parameters to URL
        $scope.setInferenceDisplayPageURL = function () {
            var parameters =
            {
                circles: Base64.encode(JSON.stringify($scope.circlesForSearch)),
                users: Base64.encode(JSON.stringify($scope.usersForSearch)),
                author: $scope.referenced.selectedAuthor

            }
            $location.path("/inference/display/" + $scope.inferenceId + "/", false).search(parameters);
                     

        };

        if(config_data.isMobile){

            $scope.deleted = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Notu Silme',
                    template: 'Çıkarım notu silinecek Onaylıyor musunuz?',
                    buttons: [{
                        text : 'Vazgeç',
                        type: 'button-balanced',
                    },
                    {
                        text : 'Sil',
                        type: 'button-assertive',
                        onTap: function (e) {
                            $scope.delete_inference();
                        }
                    }]
                });                              
            };
        }
        $scope.getChapterVerseNotation = function(verseId){
            return Math.floor(verseId/1000)+":"+ verseId%1000;
        };

        //definitions are finished. Now run initialization
        $scope.initializeInferenceDisplayController();

    });

