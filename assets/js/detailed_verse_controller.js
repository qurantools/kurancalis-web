angular.module('ionicApp')
    .controller('DetailedVerseCtrl', function ($scope, $timeout, Restangular, $location, authorization) {

        $scope.detailedChapters = [];
        $scope.detailedVerseCircles = [];
        $scope.detailedVerseUsers = [];

        $scope.verseId = -1;
        $scope.goToVerseParameters = [];
        $scope.goToVerseParameters.chapter = [];
        $scope.goToVerseParameters.chapter.id = 0;
        $scope.goToVerseParameters.verse = 0;

        $scope.verse = [];
        $scope.inferences = [];
        $scope.detailedTags = [];
        $scope.detailedAnnotations = [];

        $scope.allInferencesParams = [];
        $scope.allInferencesParams.own_inferences = true;
        $scope.allInferencesParams.users = "";
        $scope.allInferencesParams.circles = "";
        $scope.allInferencesParams.reference_to_verse = 0;

        $scope.translationDivMap = [];

        $scope.detailed_query_author_mask = 0;
        $scope.localDetailedSearchAuthorSelection = [];

        $scope.detailedVerseTagContentAuthor = MAX_AUTHOR_MASK;
        $scope.detailedVerseTagContentParams = [];

        $scope.goToVerse = function(){
            $scope.goToVerseParameters.chapter = $scope.detailedChapters[Math.floor($scope.verseId/1000) -1];
            $scope.goToVerseParameters.verse = $scope.verseId%1000;
            $scope.getVerseTranslations();
            $scope.getVerseDetails();
        };

        $scope.getVerseDetails = function(){
            $scope.getAnnotations();
            $scope.get_inferences();
        };

        $scope.verseNumberValidation = function () {
            var chapters = $scope.detailedChapters;
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
                $scope.verseId = chapter_id * 1000 + verse_number;
                $scope.goToVerse();
            }
        };

        $scope.getSelectedVerseTagContentAuthor = function () {
            return $scope.detailedVerseTagContentAuthor;
        };

        $scope.get_inferences = function () {
            var inferencesRestangular = Restangular.all("inferences");
            $scope.allInferencesParams.reference_to_verse = $scope.verseId;

            var kisiTags = "";
            var cevreTags = "";

            for (var i = 0; isDefined($scope.detailedVerseUsers) && i < $scope.detailedVerseUsers.length; i++) {
                if (i != 0) kisiTags += ",";
                kisiTags += $scope.detailedVerseUsers[i].id;
            }

            for (var i = 0; isDefined($scope.detailedVerseCircles) && i < $scope.detailedVerseCircles.length; i++) {
                if (i != 0) cevreTags += ",";
                cevreTags += $scope.detailedVerseCircles[i].id;
            }

            $scope.allInferencesParams.users = kisiTags;
            $scope.allInferencesParams.circles = cevreTags;

            inferencesRestangular.customGET("", $scope.allInferencesParams, { 'access_token': authorization.getAccessToken() }).then(function (inferences) {
                    $scope.inferences = [];
                    $scope.inferences = $scope.inferences.concat(inferences);
                }
            );
        };

        $scope.getAnnotations = function(){

            var annotationsRestangular = Restangular.all("annotations");
            $scope.allAnnotationsParams = [];

            var kisiTags = "";
            var cevreTags = "";

            for (var i = 0; isDefined($scope.detailedVerseUsers) && i < $scope.detailedVerseUsers.length; i++) {
                if (i != 0)kisiTags += ",";
                kisiTags += $scope.detailedVerseUsers[i].id;
            }

            for (var i = 0; isDefined($scope.detailedVerseCircles) && i < $scope.detailedVerseCircles.length; i++) {
                if (i != 0)cevreTags += ",";
                cevreTags += $scope.detailedVerseCircles[i].id;
            }

            $scope.allAnnotationsParams.users = kisiTags;
            $scope.allAnnotationsParams.circles = cevreTags;
            $scope.allAnnotationsParams.chapters = Math.floor($scope.verseId/1000);
            $scope.allAnnotationsParams.verse = $scope.verseId%1000;

            annotationsRestangular.customGET("", $scope.allAnnotationsParams, {'access_token': authorization.getAccessToken()}).then(function (annotations) {
                $scope.detailedTags = [];
                $scope.detailedAnnotations = annotations;
                for (var i = 0; i < annotations.length; i++){
                    for (var j = 0; j < annotations[i].tags.length; j++){
                        $scope.detailedTags.push(annotations[i].tags[j]);
                    }
                }
            });
        };

        $scope.getVerseTranslations = function () {
            $scope.translationDivMap = [];

            var verseTagContentRestangular = Restangular.all("translations");
            var translationParams = [];

            translationParams.author = $scope.detailed_query_author_mask;
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

        $scope.detailedSearchAuthorToggleSelection = function (author_id) {
            var idx = $scope.localDetailedSearchAuthorSelection.indexOf(author_id);
            if (idx > -1) {
                $scope.localDetailedSearchAuthorSelection.splice(idx, 1);
            }
            else {
                $scope.localDetailedSearchAuthorSelection.push(author_id);
            }
            $scope.detailed_query_author_mask = 0;
            for (var index in $scope.localDetailedSearchAuthorSelection) {
                $scope.detailed_query_author_mask = $scope.detailed_query_author_mask | $scope.localDetailedSearchAuthorSelection[index];
            }
            $scope.getVerseTranslations();
        };

        $scope.setDetailedSearchAuthorSelection = function (authorMask) {
            $scope.localDetailedSearchAuthorSelection = [];
            for (var index in $scope.authorMap) {
                if (authorMask & $scope.authorMap[index].id) {
                    $scope.localDetailedSearchAuthorSelection.push($scope.authorMap[index].id);
                }
            }
            $scope.detailed_query_author_mask = authorMask;
        };

        $scope.gotoNext = function(){
            var lastVerse = $scope.detailedChapters[113].id * 1000 + $scope.detailedChapters[113].verseCount;
            if ($scope.verseId == lastVerse)
                return;
            if ($scope.verseId%1000 == $scope.detailedChapters[Math.floor($scope.verseId/1000)-1].verseCount){
                var nextChapter = $scope.detailedChapters[Math.floor($scope.verseId/1000)];
                $scope.verseId = nextChapter.id * 1000;
            }
            $scope.verseId = $scope.verseId + 1;
            $scope.goToVerse();
        }

        $scope.gotoPrev = function(){
            if ($scope.verseId == 1001)
                return;
            if ($scope.verseId%1000 == 1){
                var previousChapter = $scope.detailedChapters[Math.floor($scope.verseId/1000)-2];
                $scope.verseId = previousChapter.id * 1000 + previousChapter.verseCount + 1;
            }
            $scope.verseId = $scope.verseId - 1;
            $scope.goToVerse();
        };

        $scope.openAddBookMarkModal = function(){
            var bookmarkParameters ={};
            bookmarkParameters.chapterinfo = Math.floor($scope.verseId / 1000);
            bookmarkParameters.verseinfo = $scope.verseId % 1000;
            bookmarkParameters.bookmarkverseid = $scope.verseId;
            bookmarkParameters.bookchaptername = $scope.detailedChapters[$scope.goToVerseParameters.chapter.id - 1].nameTr;
            $scope.$broadcast('openAddBookMarkModal', {bookmarkParameters:bookmarkParameters});
        };

        $scope.initializeTaggedVerseController = function () {
            $scope.$on('open_verse_detail', function(event, args) {
                $scope.verseId = args.chapterVerse;
                $scope.detailedVerseCircles = args.circles;
                $scope.detailedVerseUsers = args.users;
                if ($scope.detailedChapters.length == 0){
                    $scope.detailedChapters = $scope.chapters;
                }
                if (!isDefined($scope.detailedVerseCircles) || $scope.detailedVerseCircles.length == 0)
                    $scope.detailedVerseCircles = $scope.query_circles;
                if (!isDefined($scope.detailedVerseUsers) || $scope.detailedVerseUsers.length == 0)
                    $scope.detailedVerseUsers = $scope.query_users;

                if ($scope.localDetailedSearchAuthorSelection.length == 0){
                    $scope.setDetailedSearchAuthorSelection($scope.authors[5].id);
                }
                if ($scope.detailedVerseTagContentAuthor == MAX_AUTHOR_MASK){
                    if (isDefined(args.author)){
                        $scope.detailedVerseTagContentAuthor = args.author;
                    }else{
                        $scope.detailedVerseTagContentAuthor = $scope.authors[5].id;
                    }
                }
                $scope.goToVerse();
            });
        };

        //initialization
        $scope.initializeTaggedVerseController();
    });