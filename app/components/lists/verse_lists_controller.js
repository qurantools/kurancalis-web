/**
 * Created by mehmet.gungoren on 04.04.2016.
 */
angular.module('ionicApp').controller('VerseListController', function ($scope, Restangular, dataProvider) {

    $scope.selectedVerseList = {};
    $scope.verseListAuthor = "8192"; //Diyanet
    $scope.newVerseListModal = false;
    $scope.newVerseList = "";
    $scope.localVerseListSelection = [];
    $scope.verseForAddToLists = {};
    $scope.selectedVerseListsForVerseToAdd = [];
    $scope.verses = [];

    $scope.openNewVerseListModal = function(){
        $scope.newVerseListModal = true;
        $scope.newVerseList = "";
    };

    $scope.verseListsToggleSelection = function(verselist_id){
        var idx = $scope.localVerseListSelection.indexOf(verselist_id);
        if (idx > -1) {
            $scope.localVerseListSelection.splice(idx, 1);
            $scope.verses = [];
            $scope.selectedVerseList = {};
        }else {
            $scope.localVerseListSelection = [];
            $scope.localVerseListSelection.push(verselist_id);
            $scope.getVerseListsVerse();
            $scope.selectedVerseList = $scope.verselists.filter(function(item){
                return item.id == verselist_id
            })[0];
        }
    };

    $scope.getVerseListsVerse = function(){
        if ($scope.localVerseListSelection.length > 0 ) {
            var verselist_id = $scope.localVerseListSelection[0];
            Restangular.one("verselists", verselist_id).all("verses").customGET("", {}, {'access_token': $scope.access_token}).then(function (verses) {
                var verselist = verses.map(function (elem) {
                    return elem.verseId;
                }).join(",");
                dataProvider.fetchTranslationByAuthorAndVerseList({
                    author: $scope.verseListAuthor,
                    verse_list: verselist
                }, function (data) {
                    $scope.verses = data;
                })
            });
        }
    };

    $scope.listVerseLists = function(){
        Restangular.all("verselists").customGET("", {}, {'access_token': $scope.access_token}).then(function (verselists) {
            $scope.verselists = verselists;
        });
    };

    $scope.addVerseList = function(newList){
        var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
        var jsonData = newList;
        var postData = [];
        postData.push(encodeURIComponent("name") + "=" + encodeURIComponent(jsonData));
        var data = postData.join("&");

        Restangular.one("verselists").customPOST(data, '', '', headers).then(function (verseList) {
            $scope.verselists.push({'verseCount': '0', 'id': verseList.id, 'name': verseList.name});
            $scope.newVerseListModal = false;
            $scope.newVerseList = "";
        });
    };

    $scope.deleteVerseFromVerseList = function (listId, verseId){
        Restangular.one("verselists", listId).one("verses", verseId).customDELETE("", {}, {'access_token': $scope.access_token}).then(function (data) {
            $scope.verses = $scope.verses.filter(function (item) {
                return item.verseId != verseId;
            });
        });
    };

    $scope.verseListsAuthorChanged = function (value){
        $scope.verseListAuthor = value;
        $scope.getVerseListsVerse();
    };

    $scope.editVerseList = function(verselist){
        $scope.editVerseListModal = true;
        $scope.editedVerseList = verselist;
    };

    $scope.updateVerseList = function(verselist){
        $scope.editVerseListModal = false;
        var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
        var jsonData = verselist.name;
        var postData = [];
        postData.push(encodeURIComponent("name") + "=" + encodeURIComponent(jsonData));
        var data = postData.join("&");

        Restangular.one("verselists", verselist.id).customPUT(data, '', '', headers).then(function (data) {
            var idx = $scope.verselists.indexOf(verselist);
            $scope.verselists[idx] = verselist;
        });
    };

    $scope.deleteVerseList = function(verselist){
        $scope.editVerseListModal = false;
        Restangular.one("verselists", verselist.id).customDELETE("" , {}, {'access_token': $scope.access_token}).then(function (data) {
            var idx = $scope.verselists.indexOf(verselist);
            $scope.verselists.splice(idx, 1);
        });
    };

    $scope.addVerseToVerseLists = function(){
        for (var i = 0; i < $scope.selectedVerseListsForVerseToAdd.length; i++){
            Restangular.one("verselists", $scope.selectedVerseListsForVerseToAdd[i].id).one("verses", $scope.verseForAddToLists).customPOST("", "", "", {'access_token': $scope.access_token}).then(function (data) {
            });
        }
    };

    $scope.initVerseListController = function(){
        $scope.$on('add_verse_to_verse_lists', function(event, args) {
            $scope.verseForAddToLists = args.verse;
            $scope.selectedVerseListsForVerseToAdd = [];
        });
    };

    $scope.initVerseListController();
});