angular.module('ionicApp')
    .controller('DetailedVerseCtrl', function ($scope, $timeout, Restangular, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider) {

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

        //mobile parameters
        $scope.taggedVerseCirclesForMobileSearch = [];
        $scope.taggedVerseUsersForMobileSearch = [];

        $scope.footerMenuButtons = [];
        var buttonSelectTranslation = {  text: 'Çeviri Seç'  };
        var buttonAddToList = {text: 'Listeye Ekle' };
        var buttonGotoVerse = {text: 'Sure İçerisinde Gör' };
        var buttonBookmark = {text: 'Burada Kaldım' };
        $scope.footerMenuButtons.push(buttonSelectTranslation);
        $scope.footerMenuButtons.push(buttonAddToList);
        $scope.footerMenuButtons.push(buttonGotoVerse);
        $scope.footerMenuButtons.push(buttonBookmark);

        $scope.goToVerseDetail = function(){
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
            var verse_number = parseInt($scope.goToVerseParameters.verse);

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
                $scope.goToVerseDetail();
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

            var translationParams = [];
            translationParams.author = $scope.detailed_query_author_mask;
            translationParams.chapter = Math.floor($scope.verseId/1000);
            translationParams.verse = $scope.verseId%1000;

            dataProvider.listTranslations(translationParams, function(data){
                $scope.prepareTranslationDivMap(data);
            });
        };

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
            }else {
                $scope.localDetailedSearchAuthorSelection.push(author_id);
            }
            if (!config_data.isMobile) {
                $scope.detailed_query_author_mask = 0;
                for (var index in $scope.localDetailedSearchAuthorSelection) {
                    $scope.detailed_query_author_mask = $scope.detailed_query_author_mask | $scope.localDetailedSearchAuthorSelection[index];
                }
                $scope.getVerseTranslations();
            }
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

        $scope.updateAuthors = function () {
            if (config_data.isMobile) {
                $scope.detailed_query_author_mask = 0;
                for (var index in $scope.localDetailedSearchAuthorSelection) {
                    $scope.detailed_query_author_mask = $scope.detailed_query_author_mask | $scope.localDetailedSearchAuthorSelection[index];
                }
                $scope.getVerseTranslations();
                $scope.closeModal('authors_list');
            }
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
            $scope.goToVerseDetail();
        }

        $scope.gotoPrev = function(){
            if ($scope.verseId == 1001)
                return;
            if ($scope.verseId%1000 == 1){
                var previousChapter = $scope.detailedChapters[Math.floor($scope.verseId/1000)-2];
                $scope.verseId = previousChapter.id * 1000 + previousChapter.verseCount + 1;
            }
            $scope.verseId = $scope.verseId - 1;
            $scope.goToVerseDetail();
        };

        $scope.gotoInference = function (inferenceId){
            $location.path("/inference/display/"+inferenceId+"/");
        };

        $scope.goToVerse = function(){
            var chapterId = $scope.goToVerseParameters.chapter.id;
            var verseId = $scope.goToVerseParameters.verse;
            $scope.verseId = 1000*chapterId + (verseId == "" ? 1 : parseInt(verseId));
            $scope.goToVerseDetail();
        };

        $scope.openModal = function (item){
            if (item == 'detailed_verse_modal'){
                $scope.detailed_verse_modal.show();
            }else if (item == 'tagged_verse_modal'){
                $scope.tagged_verse_modal.show();
            }else if (item == 'tagged_verse_detailed_search'){
                for (var i =0; i< $scope.taggedVerseCirclesForMobileSearch.length; i++){
                    $scope.taggedVerseCirclesForMobileSearch[i].selected = false;
                    for (var j = 0; j < $scope.detailedVerseCircles.length; j++){
                        if ($scope.taggedVerseCirclesForMobileSearch[i].id == $scope.detailedVerseCircles[j].id){
                            $scope.taggedVerseCirclesForMobileSearch[i].selected = true;
                            break;
                        }
                    }
                }
                $scope.taggedVerseUsersForMobileSearch = [];
                for (var i = 0; i < $scope.detailedVerseUsers.length; i++) {
                    $scope.taggedVerseUsersForMobileSearch.push($scope.detailedVerseUsers[i]);
                }
                $scope.tagged_verse_detailed_search.show();
            }else if (item == 'friendsearch'){
                $scope.modal_friend_search.show();
            }else if (item == 'select_author'){
                $scope.detailedSearchAuthorSelection = $scope.localDetailedSearchAuthorSelection;
                $scope.modal_authors_list.show();
            } else if (item == 'add_to_list') {
                $scope.addVerseToVerseList($scope.verseId, $scope.closeModal);
                $scope.modal_verse_selection.show();
            } else if (item == 'go_to_verse') {
                $location.path("/translations").search(
                    {
                        chapter: $scope.goToVerseParameters.chapter.id,
                        verse: $scope.goToVerseParameters.verse
                    }
                );
                $scope.scopeApply();
                $scope.closeModal('detailed_verse_modal');
            } else if (item == 'bookmark') {
                $scope.openAddBookMarkModal($scope.verseId);
                $scope.bookmarkModal.show();
            } else if (item == 'chapter_selection_modal'){
                $scope.chapter_selection_modal.show();
            }
        };

        $scope.closeBookmarkModal = function (){
            $scope.closeModal('bookmark');
        };

        $scope.closeModal = function (item){
            if (item == 'detailed_verse_modal'){
                $scope.detailed_verse_modal.hide();
            }else if (item == 'tagged_verse_modal'){
                $scope.tagged_verse_modal.hide();
            }else if (item == 'tagged_verse_detailed_search'){
                $scope.tagged_verse_detailed_search.hide();
            }else if (item == 'friendsearch'){
                $scope.taggedVerseUsersForMobileSearch = $scope.query_users;
                $scope.modal_friend_search.hide();
            } else if (item == 'bookmark') {
                $scope.bookmarkModal.hide();
            } else if (item == 'authors_list') {
                $scope.modal_authors_list.hide();
            } else if (item == 'chapter_selection'){
                $scope.chapter_selection_modal.hide();
            } else if (item == 'verselist_selection'){
                $scope.modal_verse_selection.hide();
            }
        };

        $scope.taggedValues = function(tagList){
            var tagParameter = [];
            for (var i = 0; tagList && i < tagList.length; i++) {
                tagParameter[i] = tagList[i].name;
            }
            return tagParameter.join(',');
        };

        $scope.openFooterMenu = function (){
            $ionicActionSheet.show({
                buttons: $scope.footerMenuButtons,
                destructiveText: '',
                titleText: '',
                cancelText: 'Kapat',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.openModal('select_author');
                    } else if (index == 1) {
                        $scope.openModal('add_to_list');
                    } else if (index == 2) {
                        $scope.openModal('go_to_verse');
                    } else if (index == 3) {
                        $scope.openModal('bookmark');
                    }
                    return true;
                }
            });
        };

        $scope.initializeDetailedVerseController = function () {
            if (config_data.isMobile) {
                $ionicModal.fromTemplateUrl('components/partials/tagged_verse_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'tagged_verse_modal'
                }).then(function (modal) {
                    $scope.tagged_verse_modal = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/detailed_verse_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'detailed_verse_modal'
                }).then(function (modal) {
                    $scope.detailed_verse_modal = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/tagged_verse_detailed_search.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'tagged_verse_detailed_search'
                }).then(function (modal) {
                    $scope.tagged_verse_detailed_search = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/add_friend_to_search.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'friendsearch'
                }).then(function (modal) {
                    $scope.modal_friend_search = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/bookmark.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'bookmark'
                }).then(function(modal) {
                    $scope.bookmarkModal = modal;
                });
                $ionicModal.fromTemplateUrl('components/partials/authors_list_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'authors_list'
                }).then(function (modal) {
                    $scope.modal_authors_list = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/chapter_selection_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'chapter_selection_modal'
                }).then(function (modal) {
                    $scope.chapter_selection_modal = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/add_verse_to_verselist.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'verse_selection'
                }).then(function (modal) {
                    $scope.modal_verse_selection = modal
                });
            };
            $scope.$on('open_verse_detail', function(event, args) {
                $scope.verseId = parseInt(args.chapterVerse);
                $scope.detailedVerseCircles = args.circles;
                $scope.detailedVerseUsers = args.users;
                if ($scope.detailedChapters.length == 0){
                    $scope.detailedChapters = $scope.chapters;
                }
                if (!isDefined($scope.detailedVerseCircles) || $scope.detailedVerseCircles.length == 0)
                    $scope.detailedVerseCircles = $scope.extendedCirclesForSearch;
                if (!isDefined($scope.detailedVerseUsers) || $scope.detailedVerseUsers.length == 0)
                    $scope.detailedVerseUsers = $scope.query_users;

                $scope.taggedVerseCirclesForMobileSearch = $scope.extendedCirclesForSearch;
                for (var i =0; i< $scope.taggedVerseCirclesForMobileSearch.length; i++){
                    $scope.taggedVerseCirclesForMobileSearch[i].selected = false;
                    for (var j = 0; j < $scope.detailedVerseCircles.length; j++){
                        if ($scope.taggedVerseCirclesForMobileSearch[i].id == $scope.detailedVerseCircles[j].id){
                            $scope.taggedVerseCirclesForMobileSearch[i].selected = true;
                            break;
                        }
                    }
                }
                $scope.taggedVerseUsersForMobileSearch = [];
                for (var i =0; i< $scope.detailedVerseUsers.length; i++){
                    $scope.taggedVerseUsersForMobileSearch.push($scope.detailedVerseUsers[i]);
                }
                $scope.query_users = $scope.taggedVerseUsersForMobileSearch;

                if ($scope.localDetailedSearchAuthorSelection.length == 0){
                    $scope.setDetailedSearchAuthorSelection(MAX_AUTHOR_MASK);
                }
                if ($scope.detailedVerseTagContentAuthor == MAX_AUTHOR_MASK){
                    if (isDefined(args.author)){
                        $scope.detailedVerseTagContentAuthor = args.author;
                    }
                }
                $scope.goToVerseDetail();
                if (config_data.isMobile) {
                    $scope.detailed_verse_modal.show();
                }
            });
        };

        $scope.taggedVerseDetailedSearch = function(){
            $scope.detailedVerseCircles = [];
            $scope.detailedVerseUsers = [];
            for (var i = 0; isDefined($scope.taggedVerseCirclesForMobileSearch) && i < $scope.taggedVerseCirclesForMobileSearch.length; i++) {
                if ($scope.taggedVerseCirclesForMobileSearch[i].selected){
                    $scope.detailedVerseCircles.push($scope.taggedVerseCirclesForMobileSearch[i]);
                }
            }
            for (var i = 0; isDefined($scope.taggedVerseUsersForMobileSearch) && i < $scope.taggedVerseUsersForMobileSearch.length; i++) {
                $scope.detailedVerseUsers.push($scope.taggedVerseUsersForMobileSearch[i]);
            }
            $scope.closeModal('tagged_verse_detailed_search');
            $scope.getVerseDetails();
        };

        //list footnotes
        $scope.list_detailed_footnotes = function (translation_id, author_id) {

            dataProvider.listFootnotes({
                    id: translation_id
                },function (data) {
                    var footnoteDivElement = document.getElementById('detail_t_' + translation_id);
                    //don't list if already listed
                    if (!document.getElementById("detail_fn_" + translation_id)) {
                        var html = "<div id='detail_fn_" + translation_id + "'>";
                        var dataLength = data.length;
                        for (index = 0; index < dataLength; ++index) {
                            //add verse links
                            dataContent = data[index].replace(/(\d{1,3}):(\d{1,3})/g, "<a ng-href='#MainCtrl' onclick='javascript: angular.element(document.getElementById(\"MainCtrl\")).scope().showVerseDetail($1*1000+$2)' data-target='#detailedVerseModal' data-dismiss='modal' data-toggle='modal' style='color: blue'>$1:$2</a>");

                            html += "<div><div class='col-xs-1 footnote_bullet'>&#149;</div><div class='col-xs-11 footnotebg'>" + dataContent + "</div></div>";
                        }
                        html += '</div>';
                        footnoteDivElement.innerHTML = footnoteDivElement.innerHTML + html;
                    } else {
                        var el = document.getElementById('detail_fn_' + translation_id);
                        el.parentNode.removeChild(el);

                        //hide show verse when footnote collapses
                        $(".showVerseData").hide();
                    }
                }
            );
        };

        //initialization
        $scope.initializeDetailedVerseController();
    });