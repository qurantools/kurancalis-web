angular.module('ionicApp')
    .controller('DetailedWordCtrl', function ($scope, $timeout, Restangular, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider, $ionicScrollDelegate, $ionicPopup, localStorageService, navigationManager, $translate) {

        $scope.wordTranslations = [];
        $scope.currentAuthor = "";
        $scope.selectedWord = {};
        $scope.selectedType = "";
        $scope.isLoading = false;
        $scope.hasMoreData = false;
        $scope.start = 0;
        $scope.limit = 20; // max verse
        $scope.titleType = "";

        $scope.$on("showWord", function(evt, data){
            //{ type: type, word: word, wordId:.., arabic:..., rootArabic...}
            $scope.start = 0;
            $scope.wordTranslations = [];
            $scope.selectedType = data.type;

            if(data.hasOwnProperty("word")) {
                $scope.selectedWord = data.word;
                $scope.setTitleType();
            } else if(data.hasOwnProperty("wordId")) {
                $scope.getWord(data.wordId)
            }

            $scope.scopeApply();
            $scope.getWordsAndTranslations();
        });

        $scope.setTitleType = function () {
            if($scope.selectedType == "word"){
                $scope.titleType = "Kelime";
            } else {
                $scope.titleType = "Kök";
            }
        };

        $scope.getWord = function(wordId) {
            Restangular.one('words/' + wordId).customGET("", "", {}).then(function (data) {
                $scope.selectedWord = data;
                $scope.setTitleType();

                $scope.scopeApply();
                $scope.getWordsAndTranslations();
            })
        };

        $scope.getWordsAndTranslations = function () {

            if ($scope.isLoading)
                return;
            $scope.isLoading = true;

            var word = "";
            var root = "";

            if($scope.selectedType == "word"){
                word = $scope.selectedWord.arabic;
            } else {
                root = $scope.selectedWord.rootArabic;
            }

            Restangular.all('words/translation').customGET("", {arabic:word, root_arabic:root, author_id: $scope.currentAuthor, start: $scope.start, limit: $scope.limit}, {}).then(function(data){
                console.log("word" + word, "root" + root, "author" + $scope.currentAuthor, "DATA :: " + data);

                $scope.hasMoreData = data.translations.length > 0 ;
                $scope.isLoading = false;
                //$scope.$broadcast('scroll.infiniteWordScrollComplete');
                //$scope.hideProgress("fetchWordsFeeds");

                var wordItems = [];
                var wordDetails = [];

                for(var i=0;i<data.words.length; i++) {

                    if ($scope.selectedType == "word" && word == data.words[i].arabic) {
                        wordDetails[data.words[i].verseId] = data.words[i];
                    } else if ($scope.selectedType == "root" && root == data.words[i].rootArabic) {
                        wordDetails[data.words[i].verseId] = data.words[i];
                    }

                    if(wordItems[data.words[i].verseId] == undefined){
                        wordItems[data.words[i].verseId] = [];
                    }

                    wordItems[data.words[i].verseId].push({ wordId:data.words[i].wordId, arabic: data.words[i].arabic });
                }

                for(var i=0;i<data.translations.length; i++){
                    $scope.wordTranslations[$scope.wordTranslations.length] = {
                                                                                word: wordDetails[data.translations[i].verseId],
                                                                                verseWords: wordItems[data.translations[i].verseId] || "",
                                                                                verseTranslation: data.translations[i].content
                                                                             }
                }

                $scope.scopeApply();

                console.log("***wordTranslations***", $scope.wordTranslations)

            }, function (err){
                $scope.isLoading = false;
                //$scope.$broadcast('scroll.infiniteWordScrollComplete');
                //$scope.hideProgress("fetchWordsFeeds");
            });

        };

        $scope.showWordDetail = function(item, index){
             console.log("item, index", item, index);

             Restangular.one('words/' + item.wordId).customGET("", "", {}).then(function(data){
                 console.log("data::",data);

                 $scope.wordTranslations[index].word.wordId = data.wordId;
                 $scope.wordTranslations[index].word.chapter = data.chapter;
                 $scope.wordTranslations[index].word.verseId = data.verseId;
                 $scope.wordTranslations[index].word.arabic = data.arabic;
                 $scope.wordTranslations[index].word.rootArabic = data.rootArabic;
                 $scope.wordTranslations[index].word.turkish = data.turkish;
                 $scope.wordTranslations[index].word.transcriptTurkish = data.transcriptTurkish;
                 $scope.wordTranslations[index].word.rootTranscript = data.rootTranscript;

                 $scope.scopeApply();
             })
        };

        $scope.changeTranslation = function () {
            $scope.wordTranslations = [];

            $scope.scopeApply();
            $scope.getWordsAndTranslations();
        };

        $scope.loadMoreWordTranslations = function(){
            console.warn("loadMoreWordTranslations...")

            $scope.start += $scope.limit; //increase start every api call
            $scope.getWordsAndTranslations();
        };


        $scope.getWordswithRoot = function (type) {
            $scope.selectedType = type;
            $scope.start = 0;
            $scope.wordTranslations = [];
            $scope.setTitleType();

            $scope.scopeApply();
            $scope.getWordsAndTranslations();
        }

    });