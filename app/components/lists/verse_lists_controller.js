/**
 * Created by mehmet.gungoren on 04.04.2016.
 */
angular.module('ionicApp').controller('VerseListController', function ($scope, $timeout, Restangular, dataProvider, $routeParams, $ionicModal, $ionicPopup) {

    console.log("verse list ctrl");
    $scope.selectedVerseList = {};
    $scope.verseListAuthor = "8192"; //Diyanet
    $scope.newVerseListModal = false;
    $scope.newVerseList = "";
    $scope.localVerseListSelection = [];
    $scope.selectedVerseListsForVerseToAdd = [];
    $scope.verseForAddToLists = {};
    $scope.verses = [];

    $scope.filteredVerselists = [];

    $scope.callBackFunctionOfVerseSelectionFromVerseList;
    $scope.callBackCloseModal;

    $scope.showLeftButton = false;

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
                    $scope.verses = _.filter(data, function(token) {
                        token.selected = false;
                        return true;
                    });
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
            $scope.filteredVerselists.push({'verseCount': '0', 'id': verseList.id, 'name': verseList.name});
            $scope.newVerseListModal = false;
            $scope.newVerseList = "";
            $scope.filterVerseLists($scope.newVerseList);
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
            var idx = $scope.verselists.map(function(e) { return e.id; }).indexOf(verselist.id);
            $scope.verselists[idx] = verselist;
        });
    };

    $scope.deleteVerseList = function(verselist){
        $scope.editVerseListModal = false;
        Restangular.one("verselists", verselist.id).customDELETE("" , {}, {'access_token': $scope.access_token}).then(function (data) {
            var idx = $scope.verselists.map(function(e) { return e.id; }).indexOf(verselist.id);
            $scope.verselists.splice(idx, 1);
        });
    };

    $scope.addVerseToVerseLists = function(list){
        for (var i = 0; i < list.length; i++){
            Restangular.one("verselists", list[i]).one("verses", $scope.verseForAddToLists).customPOST("", "", "", {'access_token': $scope.access_token}).then(function (data) {
            });
        }
        $scope.closeModal('verselist_selection');
    };

    $scope.filterVerseListsToggleSelection = function(verselist_id){
        var idx = $scope.localVerseListSelection.indexOf(verselist_id);
        if (idx > -1) {
            $scope.localVerseListSelection.splice(idx, 1);
        }else {
            $scope.localVerseListSelection.push(verselist_id);
        }
    };

    $scope.filterVerseLists = function(newVerseList){
        $scope.filteredVerselists = $scope.verselists.filter(function(item){
            return item.name.indexOf(newVerseList) > -1;
        });
    };

    $scope.selectVerse = function(index){
        $scope.verses[index].selected = !$scope.verses[index].selected;
    };

    $scope.selectSelectedVerses = function(){
        var selected = $scope.verses.filter(function(item){
            return item.selected;
        }).map(function (elem) {
            return elem.chapter + ":" + elem.verse;
        }).join(" ");
        $scope.callBackFunctionOfVerseSelectionFromVerseList(selected);
    };

    $scope.toggleButton = function(){
      $scope.showLeftButton = !$scope.showLeftButton;
    };

    $scope.deleteVerseListWithConfirm = function(verselist){
        var confirmPop = $ionicPopup.confirm({
            title: 'Liste Silme',
            template: '<b>'+ verselist.name + "</b> listesini silmek istiyor musunuz?",
            cancelText: 'Hayır',
            okText: 'Sil',
            okType : 'button-assertive'
        });

        confirmPop.then(function (res) {
            if (res) {
                $scope.deleteVerseList(verselist);
            }
        });
    };

    $scope.updateVerseListWithConfirm = function(verselist){
        $scope.item = $.extend( true, {}, verselist );
        var promptPopup = $ionicPopup.prompt({
            template: '<input type="text" ng-model="item.name">',
            title: 'İsim Değiştirme',
            scope : $scope,
            inputType: 'text',
            inputPlaceholder: 'Liste Tanımı',
        });

        promptPopup.then(function(res) {
            if (isDefined(res) && $scope.item.name != verselist.name){
                $scope.updateVerseList($scope.item);
            }
        });
    };

    $scope.createNewVerseList = function(){
        $scope.item = {};
        $scope.item.name = "";
        var promptPopup = $ionicPopup.prompt({
            template: '<input type="text" ng-model="item.name">',
            title: 'Yeni Liste Oluştur',
            scope : $scope,
            inputType: 'text',
            inputPlaceholder: 'Liste Tanımı',
        });

        promptPopup.then(function(res) {
            if (isDefined(res) && $scope.item.name != ""){
                $scope.addVerseList($scope.item.name);
            }
        });
    };

    $scope.closeModal = function (item){
        if (item == "verselist_selection" && config_data.isMobile && isDefined($scope.callBackCloseModal)){
            $scope.callBackCloseModal(item);
        } else if (item == 'add_verse_to_inference_from_verselist' && config_data.isMobile && isDefined($scope.callBackCloseModal)){
            $scope.callBackCloseModal(item);
        }
    };

    $scope.initVerseListController = function(){
        $scope.$on('add_verse_to_verse_lists', function(event, args) {
            $scope.verseForAddToLists = args.verse;
            $scope.callBackCloseModal = args.closeModal;
            $scope.selectedVerseListsForVerseToAdd = [];
            $scope.localVerseListSelection = [];
        });

        $scope.$on('open_verse_for_verse_selection', function(event, args) {
            $scope.callBackFunctionOfVerseSelectionFromVerseList = args.callback;
            $scope.callBackCloseModal = args.closeModal;
        });

        $timeout(function(){
            var selectedVerseId = $scope.verselists.length > 0 ?  $scope.verselists[0].id : undefined;
            if (config_data.isMobile){
                if (typeof $routeParams.listid !== 'undefined') {
                    selectedVerseId = $routeParams.listid;
                }
            }
            if ($scope.verselists.length > 0){
                $scope.localVerseListSelection.push(selectedVerseId);
                var idx = $scope.verselists.map(function(e) { return e.id + ""; }).indexOf(selectedVerseId);
                $scope.selectedVerseList = $scope.verselists[idx];
                $scope.getVerseListsVerse();
            }

            angular.copy($scope.verselists, $scope.filteredVerselists);
        },200);
        $scope.localVerseListSelection = [];
    };

    $scope.initVerseListController();
});