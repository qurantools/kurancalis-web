/**
 * Created by mehmet.gungoren on 29.03.2016.
 */
angular.module('ionicApp').controller('SearchTranslationsController', function ($scope, Restangular, dataProvider) {
    console.log("Search Translations List Controller");

    $scope.searchAuthorMap = [
        {text : "Türkçe", value : "521744"},
        {text : "İngilizce", value : "480"},
        {text : "Arapça", value : "2049"},
        {text : "Transliterasyon", value : "10"}
    ];

    $scope.verseSearchText = "";
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
        $scope.verses = [];
        var translationParams = [];
        translationParams.author = $scope.searchTranslationsAuthor;
        translationParams.verse_keyword = $scope.verseSearchText;

        dataProvider.listTranslations(translationParams, function(data){
            $scope.verses = _.filter(data, function(token) {
                token.translations = _.filter(token.translations, function(innerToken) {
                    return innerToken.content.indexOf($scope.verseSearchText) > -1;
                });
                token.showSingleAuthor = true;
                token.selectedSingleAuthor = token.translations.length > 0 ? token.translations[0].authorId : 0;
                return token.translations.length > 0;
            });
        });
    };

    $scope.initSearchTranslationController = function(){
        $scope.verseSearchText = "";
        $scope.verses = [];
        $scope.searchTranslationsAuthor = $scope.searchAuthorMap[0].value;
    };

    $scope.initSearchTranslationController();
});