angular.module('ionicApp')
    .controller('DetailedWordCtrl', function ($scope, $timeout, Restangular, $window, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider, $ionicScrollDelegate, $ionicPopup, localStorageService, navigationManager, $translate) {

        $scope.wordTranslations = [];
        $scope.currentAuthor = "";
        $scope.selectedWord = {};
        $scope.selectedItem = { arabic: "", rootArabic: "" };
        $scope.selectedType = "";
        $scope.isLoading = false;
        $scope.hasMoreData = false;
        $scope.start = 0;
        $scope.limit = 50; // max verse
        $scope.selectedLanguage = $translate.use();

        $scope.$on("showWord", function(evt, data){
            //{ type: type, word: word, wordId:.., arabic:..., rootArabic...}
            $scope.start = 0;
            $scope.wordTranslations = [];
            $scope.selectedType = data.type;

            if(data.hasOwnProperty("word")) {
                $scope.selectedWord = data.word;
                $scope.selectedItem.arabic = data.word.arabic;
                $scope.selectedItem.rootArabic = data.word.rootArabic;

                $scope.scopeApply();
                $scope.getWordsAndTranslations();

            } else if(data.hasOwnProperty("wordId")) {
                $scope.getWord(data.wordId)
            }

        });

        $scope.getWord = function(wordId) {
            console.warn(wordId)
            Restangular.one('words/' + wordId).customGET("", "", {}).then(function (data) {
                $scope.selectedWord = data;
                $scope.selectedItem.arabic = data.arabic;
                $scope.selectedItem.rootArabic = data.rootArabic;

                $scope.scopeApply();
                $scope.getWordsAndTranslations();

                }, function (err){
                console.err(err)
            });

        };

        $scope.getWordsAndTranslations = function () {

            if ($scope.isLoading)
                return;
            $scope.isLoading = true;
            $scope.hasMoreData = true;

            var word = "";
            var root = "";

            if($scope.selectedType == "word"){
                word = $scope.selectedItem.arabic;
            } else {
                root = $scope.selectedItem.rootArabic;
            }

            Restangular.all('words/translation').customGET("", {arabic:word, root_arabic:root, author_id: $scope.currentAuthor, start: $scope.start, limit: $scope.limit}, {}).then(function(data){
                //console.log("translations length:  ", data.translations.length, "root" + root, "author" + $scope.currentAuthor, "DATA :: " + data);

                $scope.hasMoreData = data.translations.length > 0 && data.translations.length == $scope.limit ;
                $scope.isLoading = false;
                //$scope.$broadcast('scroll.infiniteWordScrollComplete');
                //$scope.hideProgress("fetchWordsFeeds");

                var wordItems = [];
                var wordDetails = [];

                for(var i=0;i<data.words.length; i++) {

                    var item = {};

                    if ($scope.selectedType == "word" && word == data.words[i].arabic) {
                        wordDetails[data.words[i].verseId] = data.words[i];
                        item = { wordId:data.words[i].wordId, arabic: data.words[i].arabic, highlight: true };

                    } else if ($scope.selectedType == "root" && root == data.words[i].rootArabic) {
                        wordDetails[data.words[i].verseId] = data.words[i];
                        item = { wordId:data.words[i].wordId, arabic: data.words[i].arabic, highlight: true };
                    }

                    if(wordItems[data.words[i].verseId] == undefined){
                        wordItems[data.words[i].verseId] = [];
                    }

                    if(angular.equals(item, {})) { // if empty
                        item = { wordId:data.words[i].wordId, arabic: data.words[i].arabic, highlight: false };
                    }

                    wordItems[data.words[i].verseId].push(item);
                }

                for(var i=0;i<data.translations.length; i++){
                    $scope.wordTranslations[$scope.wordTranslations.length] = {
                                                                                word: wordDetails[data.translations[i].verseId],
                                                                                verseWords: wordItems[data.translations[i].verseId] || "",
                                                                                verseTranslation: data.translations[i].content
                                                                             }
                }

                $scope.scopeApply();

                //console.log("***wordTranslations***", $scope.wordTranslations)

            }, function (err){
                $scope.isLoading = false;
                //$scope.$broadcast('scroll.infiniteWordScrollComplete');
                //$scope.hideProgress("fetchWordsFeeds");
            });

        };

        $scope.showWordDetail = function(item, index){
             //console.log("item, index", item, index);

             Restangular.one('words/' + item.wordId).customGET("", "", {}).then(function(data){
                 //console.log("data::",data);

                 $scope.wordTranslations[index].word.wordId = data.wordId;
                 $scope.wordTranslations[index].word.chapter = data.chapter;
                 $scope.wordTranslations[index].word.verseId = data.verseId;
                 $scope.wordTranslations[index].word.arabic = data.arabic;
                 $scope.wordTranslations[index].word.rootArabic = data.rootArabic;
                 $scope.wordTranslations[index].word.turkish = data.turkish;
                 $scope.wordTranslations[index].word.transcriptTurkish = data.transcriptTurkish;
                 $scope.wordTranslations[index].word.rootTranscript = data.rootTranscript;
                 $scope.wordTranslations[index].word.english = data.english;

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


        $scope.getWords = function (type, word) {
            $scope.selectedWord = word;
            $scope.selectedItem.arabic = word.arabic;
            $scope.selectedItem.rootArabic = word.rootArabic;
            $scope.selectedType = type;
            $scope.start = 0;
            $scope.wordTranslations = [];
            $scope.scopeApply();

            $scope.getWordsAndTranslations();
        };

        $scope.linkcreate = function(letters){
            var link = "http://m.kuranmeali.eu/Mufredat/index.php?t=" + letters.toUpperCase();
            $window.open(link, '_blank');
        };


        $scope.getItemColor = function (wordItem, leftItem) {

            if(wordItem.highlight) {
                return 'red';
            }
            else if($scope.selectedType =='root' && wordItem.arabic == leftItem.arabic) {
                return "#800000";
            }
            else if($scope.selectedType =='word' && wordItem.arabic == leftItem.arabic){
                return  "#800000";
            }
        };

    }).filter('removeQuotes', function() {

        // remove multiple quute chars
        return function(string) {

            return string.replace(/(""|"""|""""|"""""|"""""")/g, '');

        }

    });