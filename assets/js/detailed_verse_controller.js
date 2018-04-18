mymodal = angular.module('ionicApp')
    .controller('DetailedVerseCtrl', function ($scope, $compile, $timeout, $routeParams, Restangular, $location, authorization, $ionicModal, $ionicActionSheet, dataProvider, $ionicScrollDelegate, $ionicPopup, localStorageService, navigationManager, $cordovaSocialSharing, $translate) {

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

        //show modal title or not
        $scope.isVerseDetail = true;
        $scope.idAttr;
        $scope.shareUrl = "";
        $scope.shareTitle = "Ayet Paylaşma";
        $scope.isNative = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

        // verse words
        $scope.wordsOfVerse = [];

        $scope.footerMenuButtons = [];
        var buttonSelectTranslation = {  text: $translate.instant('Çeviri Seç')  };
        var buttonAddToList = {text: $translate.instant('Listeye Ekle') };
        var buttonGotoVerseInternal = {text: $translate.instant('Ayete Git') };
        var buttonGotoVerse = {text: $translate.instant('Sure İçerisinde Gör') };
        var buttonBookmark = {text: $translate.instant('Burada Kaldım') };
        var buttonVerseHistory = {text: $translate.instant('Ayet Geçmişi') };
        var copyLinkText = $scope.isNative ? $translate.instant('Paylaş') : $translate.instant('Linki Kopyala');
        var copyLink =  {text: copyLinkText };

        $scope.localStorageManager = new LocalStorageManager("detailed_verse",localStorageService,
            [
                {
                    name:"detailed_query_author_mask",
                    getter: null,
                    setter: null,
                    isExistInURL: false,
                    isBase64: false,
                    default: DEFAULT_TURKISH_AUTHOR_MASK

                }
            ]
        );

        $scope.popoveropen=function(){
            $compile($('.popover.in').contents())($scope);
            $('body').on('click', $scope.popoverclose);
        };

        $scope.popoverclose= function(e){
            //clicking on popover toggle button is processed itself. Any other place hides the popover
            if ($(e.target).data('toggle') !== 'popover'
            ){
                $('[data-toggle="popover"]').popover('hide');
                $('body').unbind('click',$scope.popoverclose);
            }
        };

        $scope.setShareUrl = function () {
            $scope.shareUrl =  config_data.webAddress + "/__/verse/display/" + $scope.verseId + "?author=" + $scope.detailed_query_author_mask;
            $scope.scopeApply();
        };

        $scope.shareInference = function(){
            $cordovaSocialSharing.share($scope.title, $scope.shareTitle, null, $scope.shareUrl);
        };

        $scope.callUrlCopied = function(){

            var infoPopup = $ionicPopup.alert({
                title: 'Url Bilgisi Kopyalandı.',
                template: '',
                buttons: []
            });

            $timeout(function() {
                infoPopup.close(); //close the popup after 3 seconds for some reason
            }, 1700);
        };


        $scope.goToVerseDetail = function(){
            $scope.showProgress("showVerseDetails");
            $scope.goToVerseParameters.chapter = $scope.detailedChapters[Math.floor($scope.verseId/1000) -1];
            $scope.goToVerseParameters.verse = $scope.verseId%1000;
            $scope.getVerseTranslations();
            $scope.get_inferences();
            $scope.addVerseToHistory($scope.verseId);
            $scope.getWordsOfVerse();

            $scope.setShareUrl();
        };

        $scope.verseNumberValidation = function () {
            var chapters = $scope.detailedChapters;
            var chapter_id = $scope.goToVerseParameters.chapter.id;
            var verse_number = parseInt($scope.goToVerseParameters.verse);

            //search array with id
            var validationErrorMessage = $translate.instant("Geçerli ayet ve sure numarası giriniz");
            var index = chapters.map(function (el) {
                return el.id;
            }).indexOf(chapter_id);
            if (index == -1 || chapters[index].verseCount < verse_number || isNaN(chapter_id) || isNaN(verse_number)) {
                if (typeof detailedAnnotator != 'undefined') {
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
            $scope.inferences = [];
            inferencesRestangular.customGET("", $scope.allInferencesParams, { 'access_token': authorization.getAccessToken() }).then(function (inferences) {
                    $scope.inferences = $scope.inferences.concat(inferences);
                }
            );
        };

        $scope.getVerseTranslations = function () {
            $scope.translationDivMap = [];

            var translationParams = [];
            translationParams.author = $scope.detailed_query_author_mask;
            translationParams.chapter = Math.floor($scope.verseId/1000);
            translationParams.verse = $scope.verseId%1000;
            $scope.verse = [];
            dataProvider.listTranslations(translationParams, function(data){
                $scope.prepareTranslationDivMap(data);
                if($scope.access_token)
                    $scope.annotate_it();
                $scope.hideProgress("showVerseDetails");
            });
        };

        $scope.prepareTranslationDivMap = function (data) {
            $scope.translationDivMap = [];
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].translations.length; j++) {
                    if (!config_data.isMobile){
                        $scope.translationDivMap[data[i].translations[j].id] = "/div[1]/div[1]/div[" + (j + 1) + "]/div[1]/div[2]/span[1]";
                    }else {
                        $scope.translationDivMap[data[i].translations[j].id] = "/div[1]/div[" + (j + 1) + "]/div[1]/div[2]/span[1]";
                    }
                }
            }
            $scope.verse = data[0];
            if (config_data.isMobile){
                $timeout(function() {
                    var delegate = _.filter($ionicScrollDelegate._instances, function(item){
                         return item.element.innerHTML.indexOf('detailed_verse_content') > -1;
                    })[0];
                    delegate.scrollTop();
                });
            }
        };

        $scope.annotate_it = function(){

            if ($scope.annotatorActivated == 1) {
                detailedAnnotator.unsubscribe();
                detailedAnnotator.destroy();
                delete detailedAnnotator;
            }

            detailedAnnotator = new Annotator($('#' + $scope.idAttr));
            detailedAnnotator.setTranslationDivMap($scope.translationDivMap);
            detailedAnnotator.setAccessToken($scope.access_token);

            var queryParams = {};
            queryParams.chapter = $scope.goToVerseParameters.chapter.id;
            queryParams.author_mask_on_view = $scope.detailedVerseTagContentAuthor;
            queryParams.circles = $scope.getTagsWithCommaSeparated($scope.detailedVerseCircles);
            queryParams.users = $scope.getTagsWithCommaSeparated($scope.detailedVerseUsers);
            queryParams.verses = $scope.verseId%1000;

            detailedAnnotator.setQueryParameters(queryParams);

            detailedAnnotator.addPlugin('Store', {
                prefix: config_data.webServiceUrl,
                urls: {
                    create: '/annotations',
                    update: '/annotations/:id',
                    destroy: '/annotations/:id',
                    search: '/search'
                }
            });

            $scope.annotatorActivated = 1;
            detailedAnnotator.subscribe("annotationCreated", $scope.colorTheAnnotation);
            detailedAnnotator.subscribe("annotationCreated", $scope.addAnnotation);
            detailedAnnotator.subscribe("annotationUpdated", $scope.colorTheAnnotation);
            detailedAnnotator.subscribe("annotationsLoaded", $scope.loadAnnotations);
            detailedAnnotator.subscribe("adderClicked", $scope.showEditor);
            detailedAnnotator.subscribe("editClicked", $scope.showEditor);
            detailedAnnotator.subscribe("annotationDeleted", $scope.deleteAnnotationFromScope);

            //unbind
            if (config_data.isMobile) {
                $(document).unbind('mouseup');
                $(document).unbind('mousedown');
            }
        };

        $scope.showEditor = function (annotation, position) {
            $scope.showEditorModal(annotation, position, $scope.submitEditor, function(){
                $scope.detailed_verse_modal.show();
                detailedAnnotator.publish('annotationEditorCancel');
                detailedAnnotator.onEditorHide();
            });
            $scope.detailed_verse_modal.hide();
        };

        $scope.editAnnotation = function (index){
            detailedAnnotator.onEditAnnotation($scope.detailedAnnotations[index]);
        };

        //delete annotation from annotator library (highlight)
        $scope.deleteAnnotation = function (index) {
            //console.log("$scope.filteredAnnotations: "+JSON.stringify($scope.filteredAnnotations));
            if (config_data.isMobile) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('Ayet Notu Sil'),
                    template: $translate.instant('Ayet notu silinecektir, onaylıyor musunuz?'),
                    cancelText: $translate.instant('VAZGEC'),
                    okText: $translate.instant('TAMAM'),
                    okType: 'button-assertive'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        detailedAnnotator.deleteAnnotation($scope.detailedAnnotations[index]);
                    } else {
                    }
                });
            }else{
                $scope.showAnnotationDeleteModal(index, $scope.mdeleteAnnotation);
            }
        };

        $scope.mdeleteAnnotation = function(index){
            detailedAnnotator.deleteAnnotation($scope.detailedAnnotations[index]);
        };

        //remove annotation from scope
        $scope.deleteAnnotationFromScope = function (annotation) {
            var arrLen = $scope.detailedAnnotations.length;
            var annotationId = annotation.annotationId;
            var annotationIndex = -1;

            for (var i = 0; i < arrLen; i++) {
                if ($scope.detailedAnnotations[i].annotationId == annotationId) {
                    annotationIndex = i;
                }
            }

            if (annotationIndex != -1) {
                $scope.detailedAnnotations[annotationIndex].tags.forEach(function(item) {
                    $scope.detailedTags.splice($scope.detailedTags.indexOf(item), 1);
                });
                $scope.detailedAnnotations.splice(annotationIndex, 1);
                $scope.scopeApply();
            }
        };

        $scope.addAnnotation = function (annotation) {
            $timeout(function(){
                $scope.detailedAnnotations.push(annotation);
                for (var j = 0; j < annotation.tags.length; j++){
                    $scope.detailedTags.push(annotation.tags[j]);
                }
                $scope.scopeApply();
            },250);
        };

        $scope.loadAnnotations = function(annotations){
            $scope.detailedTags = [];
            for (var i = 0; i < annotations.length; i++){
                for (var j = 0; j < annotations[i].tags.length; j++){
                    $scope.detailedTags.push(annotations[i].tags[j]);
                }
            }
            $scope.detailedAnnotations = annotations;
            $scope.scopeApply();
            $scope.colorAnnotations(annotations);
        };

        $scope.detailedSearchAuthorToggleSelection = function (author_id) {
            var idx = $scope.localDetailedSearchAuthorSelection.indexOf(author_id);
            if (idx > -1) {
                $scope.localDetailedSearchAuthorSelection.splice(idx, 1);
            }else {
                $scope.localDetailedSearchAuthorSelection.push(author_id);
            }
            if (!config_data.isMobile) {
                var mask = bigInt(0);
                for (var index in $scope.localDetailedSearchAuthorSelection) {
                    mask = mask.or($scope.localDetailedSearchAuthorSelection[index]);
                }
                $scope.detailed_query_author_mask = mask.value;
                $scope.localStorageManager.storeVariables($scope);
                $scope.getVerseTranslations();
            }

            $scope.setShareUrl();
        };

        $scope.setDetailedSearchAuthorSelection = function (authorMask) {
            var mask = bigInt(authorMask);
            $scope.localDetailedSearchAuthorSelection = [];
            for (var index in $scope.authorMap) {
                if (mask.and($scope.authorMap[index].id).value != 0) {
                    $scope.localDetailedSearchAuthorSelection.push($scope.authorMap[index].id);
                }
            }
            $scope.detailed_query_author_mask = mask.value;
            $scope.localStorageManager.storeVariables($scope);
        };

        $scope.updateAuthors = function () {
            if (config_data.isMobile) {
                var mask = bigInt(0);
                for (var index in $scope.localDetailedSearchAuthorSelection) {
                    mask = mask.or( $scope.localDetailedSearchAuthorSelection[index]);
                }
                $scope.detailed_query_author_mask = mask.value;
                $scope.localStorageManager.storeVariables($scope);
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
        };

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
                navigationManager.reset(); //navigation history should be cleared
                $location.path("/translations").search(
                    {
                        chapter: $scope.goToVerseParameters.chapter.id,
                        verse: $scope.goToVerseParameters.verse
                    }
                );
                $scope.scopeApply();

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
                navigationManager.closeModal($scope.detailed_verse_modal);
            }else if (item == 'tagged_verse_modal'){
                navigationManager.closeModal($scope.tagged_verse_modal);
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
            return tagParameter.join(', ');
        };

        $scope.openFooterMenu = function (){
            $scope.footerMenuButtons = [];
            $scope.footerMenuButtons.push(buttonSelectTranslation);
            $scope.footerMenuButtons.push(buttonGotoVerseInternal);
            $scope.footerMenuButtons.push(buttonGotoVerse);
            if ($scope.user){
                $scope.footerMenuButtons.push(buttonAddToList);
                $scope.footerMenuButtons.push(buttonBookmark);
                $scope.footerMenuButtons.push(buttonVerseHistory);
                $scope.footerMenuButtons.push(copyLink);
            }
            $ionicActionSheet.show({
                buttons: $scope.footerMenuButtons,
                destructiveText: '',
                titleText: '',
                cancelText: $translate.instant('Kapat'),
                cancel: function () {
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.openModal('select_author');
                    } else if (index == 1) {
                        $scope.openModal('chapter_selection_modal');
                    } else if (index == 2) {
                        $scope.openModal('go_to_verse');
                    } else if (index == 3) {
                        $scope.openModal('add_to_list');
                    } else if (index == 4) {
                        $scope.openModal('bookmark');
                    } else if (index == 5){
                        $scope.openVerseHistory();
                    } else if (index == 6) {
                        if($scope.isNative){
                            $scope.shareInference();
                        } else {
                            $scope.kopyala($scope.shareUrl);
                            $scope.callUrlCopied();
                        }
                    }
                    return true;
                }
            });
        };

        $scope.submitEditor = function (annotationModalData) {
            $timeout(function () {
                $scope.detailed_verse_modal.show();
                detailedAnnotator.publish('annotationEditorSubmit', [detailedAnnotator.editor, annotationModalData]);
                $scope.editorSubmitted = 1;
                detailedAnnotator.onEditorHide();
                detailedAnnotator.ignoreMouseup = false;
                $timeout(function(){
                    $scope.scopeApply();
                },50);
            },370);

        };

        $scope.initializeDetailedVerseController = function () {
            if ( $location.path().indexOf("/verse/display/") > -1) {
                if ($routeParams.hasOwnProperty("verseId")) {
                    $scope.idAttr = "verse_display";
                    $scope.isVerseDetail = false;
                } else {
                    console.log("VerseId is missing...")
                }

                if ($routeParams.hasOwnProperty("author")) {
                    $scope.detailed_query_author_mask = $routeParams.author;
                    $scope.setDetailedSearchAuthorSelection($scope.detailed_query_author_mask);
                }
            }

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

                //Get all words of verse
                $scope.getWordsOfVerse = function () {
                    Restangular.all('words').customGET("", {verse_id: $scope.verseId}, {}).then(function(data){
                        //console.log("wordsOfVerse::",data);
                        $scope.wordsOfVerse = data;
                    });
                };

                $scope.openWordModal = function (type, word) {
                    var selectedItem = { type:type, word: word};

                    $scope.showWordDetail(selectedItem);
                };

                if ( $location.path().indexOf("/verse/display/") == -1) {
                     $scope.idAttr =  "detailed_translations";
                    $scope.isVerseDetail = true;
                }

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


                //retrieve author mask from local or default
                $scope.localStorageManager.initializeScopeVariables($scope,{});

                $scope.setDetailedSearchAuthorSelection($scope.detailed_query_author_mask);

                $scope.goToVerseDetail();

                if (config_data.isMobile) {
                    navigationManager.openModal({
                        broadcastFunction : "open_verse_detail",
                        args : args,
                        modal: $scope.detailed_verse_modal
                    });
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
            $scope.goToVerseDetail();
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
                        if (author_id == $scope.author_hakki_yilmaz){
                            if (config_data.isMobile){
                                html += "<div>" +
                                            "<div class='col-xs-1'>&nbsp;</div>" +
                                            "<div class='col-xs-11 footnotebg'>" +
                                                "<a ng-href='#MainCtrl' onclick='javascript: angular.element(document.getElementById(\"MainCtrl\")).scope().openModal(\"hakki_yilmaz_notes\")'>" +
                                                    "<div style='color: #6b006d;margin-bottom: 8px;'>Tüm Notlar</div>" +
                                                "</a>" +
                                            "</div>" +
                                        "</div>";
                            }else{
                                html += "<div>" +
                                            "<div class='col-xs-1'>&nbsp;</div>" +
                                            "<div class='col-xs-11 footnotebg'>" +
                                                "<a style='float: right;'>" +
                                                    "<div style='width:100%; height: 40px; padding-top:8px;' data-target='#hakkiYilmazAllNotesModal' data-toggle='modal'>Tüm Notlar</div>" +
                                                "</a>" +
                                            "</div>" +
                                        "</div>";
                            }
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