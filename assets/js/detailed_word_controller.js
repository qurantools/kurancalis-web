angular.module('ionicApp')
    .controller('DetailedWordCtrl', function ($scope, $timeout, Restangular, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider, $ionicScrollDelegate, $ionicPopup, localStorageService, navigationManager, $translate) {

        $scope.detailedChapters = [];
        $scope.detailedVerseCircles = [];
        $scope.detailedVerseUsers = [];

        $scope.verseId = -1;
        $scope.goToVerseParameters = [];
        $scope.goToVerseParameters.chapter = [];
        $scope.goToVerseParameters.chapter.id = 0;
        $scope.goToVerseParameters.verse = 0;

        $scope.verse = [];

        $scope.allInferencesParams = [];
        $scope.allInferencesParams.own_inferences = true;
        $scope.allInferencesParams.users = "";
        $scope.allInferencesParams.circles = "";
        $scope.allInferencesParams.reference_to_verse = 0;


        $scope.detailed_query_author_mask = 0;
        $scope.localDetailedSearchAuthorSelection = [];

        $scope.detailedVerseTagContentAuthor = MAX_AUTHOR_MASK;
        $scope.detailedVerseTagContentParams = [];


        //show verse words
        $scope.wordsOfVerse = [];
        $scope.wordTranslations = [];
        $scope.rootWords = [];
        $scope.rootTranslations = [];
        $scope.currentAuthor = "";
        $scope.selectedWord = {};

        console.log("WORD_PARAMS",$scope.WORD_PARAMS)
        //----------WORD-----------------

        /* $scope.$watch("showWordsOfRoot", function(newValue, oldValue){
         console.log("showWordsOfRoot-------------",newValue, oldValue)
         if(newValue != oldValue){
         $scope.showWordsOfRoot = newValue;
         $scope.getWordsOfSameRoot($scope.selectedWord.wordId)
         }
         });*/

        $scope.setWordParam = function (param, word) {
            $scope.WORD_PARAMS.type = "";
            $scope.WORD_PARAMS.word = {};
            $timeout(function () {
                $scope.WORD_PARAMS.type = param;
                $scope.WORD_PARAMS.word = word;
                $scope.scopeApply();
            })

        };


        //Get all words of verse
        $scope.getWordsOfVerse = function (verseId) {

            return Restangular.all('words').customGET("", {verse_id: verseId}, {}).then(function(data){
                console.log("data::",data);
                return data;
                //$scope.wordsOfVerse = data;
                //$scope.selectedWord = $scope.wordsOfVerse[0];

            });
        };

        $scope.$on("showWordDetail", function(evt, data){
            console.log("showWordDetail", data)
            $scope.selectedWord = data.word;
            $scope.scopeApply();
        });

        /*//Get all words related wordId
         $scope.getWordsOfSameRoot = function (wordId) {
         $scope.selectedWord = $scope.WORD_PARAMS.word;

         Restangular.all('words').customGET("", {word_id: wordId}, {}).then(function(data){
         $scope.wordsOfSameRoot = data;
         console.log("wordsOfSameRoot::",data)

         /!* $timeout(function() {
         $("#wordDetailModal").show();
         },2000);*!/
         });

         };*/

        $scope.getWordsOfSameRoot = function () {
            console.log("getWordsOfSameRoot::", $scope.WORD_PARAMS);
            var word = "";
            var root = "";
            $scope.selectedWord = $scope.WORD_PARAMS.word;

            if($scope.WORD_PARAMS.type == "word"){
                word = $scope.WORD_PARAMS.word.arabic;
            } else if($scope.WORD_PARAMS.type == "root") {
                root = $scope.WORD_PARAMS.word.rootArabic;
            }

            Restangular.one('words/translation').customGET("", {arabic:word, root_arabic:root}, {}).then(function(data){

                //$scope.rootWords = data.words;
                //$scope.rootTranslations = data.translations;
                console.log("----DATA----::",data)

                $scope.wordTranslations = [];
                var wordItems = [];
                var wordDetails = [];

                if(word != ""){
                    for(var i=0;i<data.words.length; i++) {
                        var style = "";

                        if (word == data.words[i].arabic) {
                            wordDetails[data.words[i].verseId] = data.words[i];
                            style = "color:red";
                        }

                        if(wordItems[data.words[i].verseId] == undefined){
                            wordItems[data.words[i].verseId] = [];
                        }

                        wordItems[data.words[i].verseId].push(data.words[i].arabic); // += "<span><a href ng-click='showWordDetail({{item}})' style='" + style + "'>" + data.words[i].arabic + "</a></span>";
                    }

                } else if (root != ""){
                    for(var i=0;i<data.words.length; i++){
                        var style = "";

                        if(root == data.words[i].rootArabic) {
                            wordDetails[data.words[i].verseId] = data.words[i];
                        }

                        if(wordItems[data.words[i].verseId] == undefined){
                            wordItems[data.words[i].verseId] = [];
                        }
                        wordItems[data.words[i].verseId].push(data.words[i].rootArabic);// += "<span><a href ng-click='showWordDetail({{item}})' style='" + style + "'>" + data.words[i].rootArabic + "</a></span>";
                    }
                }
                console.log("--***wordItems**wordDetails**--",wordItems, wordDetails);

                for(var i=0;i<data.translations.length; i++){
                    $scope.wordTranslations[i] = { wordDetail: wordDetails[data.translations[i].verseId],
                        verseWords: wordItems[data.translations[i].verseId] || "",
                        verseTranslation: data.translations[i].content
                    }
                }

                console.log("----*****wordTranslations********----",$scope.wordTranslations)

                /*if($scope.WORD_PARAMS.type == "word" && $scope.WORD_PARAMS.word.arabic == data.words[i].arabic) {
                 $scope.wordsOfSameRoot.push(data.words[i]);
                 } else if($scope.WORD_PARAMS.type == "root" && $scope.WORD_PARAMS.word.rootArabic == word.words[i].rootArabic){
                 $scope.wordsOfSameRoot.push(data.words[i]);
                 }
                 $scope.wordTranslations[data.words[i].verseId].*/


                //$scope.apply();
                /*  console.log("$scope.getWordsOfSameRoot", $scope.wordsOfSameRoot)
                 var chapter = -1;
                 for(var i=0;i<data.words.length; i++){

                 if(chapter != -1 && chapter != data.words[i].chapter){
                 $scope.rootWords.push(data.words[i])
                 } else {
                 $scope.rootWords.push({wordId:-1, arabic:""}) //will be used in HML
                 //$scope.rootTranslations.splice( $scope.rootWords.length-1, 0, {id: -1} );
                 }

                 chapter = data.words[i].chapter;
                 }*/
                //$scope.wordsTranslationsOfSameRoot = data;
                /* var chapter = -1;
                 var itemGroup = "";
                 for(var i=0;i<data.length; i++){
                 var item = "<span><a href='#' ng-click='getList(data.wordId)'>word.arabic</a></span>";
                 console.log("item----", item)
                 if(chapter == -1 || chapter == data[i].chapter){
                 itemGroup += item;
                 console.log("itemGroup----", itemGroup)
                 } else if(chapter != data[i].chapter) {
                 $scope.wordsTranslationsOfSameRoot.push(itemGroup);
                 itemGroup = "";
                 }

                 chapter = data[i].chapter;
                 }

                 console.log("wordsTranslationsOfSameRoot:::::", $scope.wordsTranslationsOfSameRoot)*/
            });

        };
        //----------WORD-----------------

        $scope.showWordDetail = function(item, index){
            console.log("---------",item,index)
        };


        $scope.setParams = function () {
            var chapterId = $scope.goToVerseParameters.chapter.id;
            var verseId = $scope.goToVerseParameters.verse;
            $scope.verseId = 1000*chapterId + (verseId == "" ? 1 : parseInt(verseId));


            $scope.goToVerseParameters.chapter = $scope.detailedChapters[Math.floor($scope.verseId/1000) -1];
            $scope.goToVerseParameters.verse = $scope.verseId%1000;
        };

        $scope.initializeDetailedWordController = function () {
            console.log("DETAILED WORDS.........")
            $scope.setParams();
        };

        //initialization
        $scope.initializeDetailedWordController();
    });