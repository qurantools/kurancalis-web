angular.module('ionicApp')
    .controller('DetailedVerseCtrl', function ($scope, $timeout, Restangular, $location, authorization) {

        $scope.detailedChapters = null;
        $scope.detailedVerseCircles = null;
        $scope.detailedVerseUsers = null;

        $scope.verseId = -1;
        $scope.goToVerseParameters = [];
        $scope.goToVerseParameters.chapter = 1;
        $scope.goToVerseParameters.verse = 0;

        $scope.verse = [];
        $scope.inferences = [];

        $scope.allInferencesParams = [];
        $scope.allInferencesParams.own_inferences = true;
        $scope.allInferencesParams.users = "";
        $scope.allInferencesParams.circles = "";
        $scope.allInferencesParams.reference_to_verse = 0;

        $scope.translationDivMap = [];

        $scope.goToVerse = function(verseId){
            $scope.getVerseTranslations();
            $scope.get_inferences();
        }

        $scope.verseNumberValidation = function () {
            var chapters = $scope.chapters;
            var chapter_id = $scope.goToVerseParameters.chapter.id;
            var verse_number = $scope.goToVerseParameters.verse;

            //search array with id
            var validationErrorMessage = "Geçerli ayet ve sure numarası giriniz";
            var index = chapters.map(function (el) {
                return el.id;
            }).indexOf(chapter_id);
            if (index == -1 || chapters[index].verseCount < verse_number || isNaN(chapter_id) || isNaN(verse_number)) {
                if (typeof annotator != 'undefined') {
                    Annotator.showNotification(validationErrorMessage);
                } else {
                    alert(validationErrorMessage);
                }
            } else {
                $scope.goToVerse();
            }
        };

        $scope.get_inferences = function () {
            var usersRestangular = Restangular.all("inferences");
            $scope.allInferencesParams.reference_to_verse = $scope.verseId;

            var kisiTags = "";
            var cevreTags = "";

            for (var i = 0; i < $scope.detailedVerseUsers.length; i++) {
                if (i != 0) kisiTags += ",";
                kisiTags += $scope.detailedVerseUsers[i].id;
            }


            for (var i = 0; i < $scope.detailedVerseCircles.length; i++) {
                if (i != 0) cevreTags += ",";
                cevreTags += $scope.detailedVerseCircles[i].id;
            }

            $scope.allInferencesParams.users = kisiTags;
            $scope.allInferencesParams.circles = cevreTags;

            usersRestangular.customGET("", $scope.allInferencesParams, { 'access_token': authorization.getAccessToken() }).then(function (inferences) {
                    $scope.inferences = [];
                    $scope.inferences = $scope.inferences.concat(inferences);
                }
            );
        }

        $scope.getVerseTranslations = function () {
            $scope.translationDivMap = [];

            var verseTagContentRestangular = Restangular.all("translations");
            var translationParams = [];

            translationParams.author = $scope.query_author_mask;
            translationParams.chapter = Math.floor($scope.verseId/1000);
            translationParams.verse = $scope.verseId%1000;

            verseTagContentRestangular.customGET("", translationParams, {}).then( function(data){
                $scope.prepareTranslationDivMap(data);
            });
        }

        $scope.prepareTranslationDivMap = function (data) {

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].translations.length; j++) {
                    var vid = data[i].translations[j].id;
                    var ilkimi;
                    if (j == 0) {
                        ilkimi = 3;
                    }else {
                        ilkimi = 1;
                    }
                    if (data[i].translations.length == 1) { //there is only one author selected
                        $scope.translationDivMap[vid] = "/div[" + (i + 1) + "]/div[1]/div[1]/div[1]/div[3]";
                    }else {
                        $scope.translationDivMap[vid] = "/div[" + (i + 1) + "]/div[1]/div[1]/div[" + (j + 1) + "]/div[" + ilkimi + "]/div[3]/span[1]";
                    }
                }
            }
            $scope.verse = data[0];
        };

        $scope.initializeTaggedVerseController = function () {
            $scope.$on('open_verse_detail', function(event, args) {
                $scope.verseId = args.chapterVerse;
                if (!isDefined($scope.detailedChapters)){
                    $scope.detailedChapters = $scope.chapters;
                }
                if (!isDefined($scope.detailedAuthors)){
                    $scope.detailedAuthors = $scope.authorMap;
                }
                if ($scope.detailedVerseCircles == null)
                    $scope.detailedVerseCircles = $scope.circlesForSearch;
                if ($scope.detailedVerseUsers == null)
                    $scope.detailedVerseUsers = $scope.usersForSearch;

                $scope.goToVerseParameters.chapter = Math.floor($scope.verseId/1000);
                $scope.goToVerseParameters.verse = $scope.verseId%1000;
                $scope.goToVerse();
            });
        };

        //initialization
        $scope.initializeTaggedVerseController();
    });