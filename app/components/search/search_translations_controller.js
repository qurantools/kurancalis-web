/**
 * Created by mehmet.gungoren on 29.03.2016.
 */
angular.module('ionicApp').controller('SearchTranslationsController', function ($scope, Restangular, dataProvider) {
    console.log("Search Translations List Controller");

    $scope.searchAuthorMap = [
        {text : "Türkçe", value : "tr"},
        {text : "İngilizce", value : "en"},
        {text : "Arapça", value : "ar"}
    ];

    $scope.verseSearchText = "";
    $scope.verseSearchedText = "";
    $scope.verses = [];
    $scope.searchTranslationsAuthor = {};

    $scope.searchTranslationsAuthorChanged = function (value){
        $scope.searchTranslationsAuthor = value;
    };

    $scope.searchTextChange = function(value){
        $scope.verseSearchText = value;
    };

    $scope.singleAuthorView = function (author, verse) {
        $scope.verses[verse].showSingleAuthor = true;
        $scope.verses[verse].selectedSingleAuthor = author;
        $scope.scopeApply();
    };

    $scope.multipleAuthorsView = function (verse) {
        $scope.verses[verse].showSingleAuthor = false;
        $scope.verses[verse].selectedSingleAuthor = 0;
        $scope.scopeApply();
    };

    $scope.searchTranslations = function(){
        if ($scope.verseSearchText.length < 3){
            return;
        }
        $scope.verses = [];
        var translationParams = [];
        translationParams.language = $scope.searchTranslationsAuthor;
        translationParams.keyword = $scope.verseSearchText;

        dataProvider.searchTranslationByKeyword(translationParams, function(data){
            var d =$scope.verseSearchText;
            $scope.verseSearchedText = d;
            $scope.verses = _.filter(data, function(token) {
                token.showSingleAuthor = true;
                token.selectedSingleAuthor = token.translations.length > 0 ? token.translations[0].authorId : 0;
                return token.translations.length > 0;
            });
        });
    };

    $scope.expandAllTranslations = function(){
        $scope.verses = _.filter($scope.verses, function(token) {
            token.showSingleAuthor = false;
            token.selectedSingleAuthor = 0;
            return token.translations.length > 0;
        });
    };

    $scope.initSearchTranslationController = function(){
        $scope.verseSearchText = "";
        $scope.verses = [];
        $scope.searchTranslationsAuthor = $scope.searchAuthorMap[0].value;
    };

    $scope.initSearchTranslationController();
});