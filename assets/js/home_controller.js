angular.module('ionicApp')
    .controller('HomeCtrl', function ($scope, $compile, $q, $routeParams, $location, $timeout, ChapterVerses, User, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization,$ionicActionSheet,$ionicPopup, $sce, dataProvider, $ionicPlatform, navigationManager, $translate) {


        $scope.linkno="";


        $scope.switchAuthorViewVerseId = 0;
        $scope.switchScrollWatch=false;


        ///////////////////////

        $scope.DETAILED_SEARCH_ITEM = {'id': '', 'name': 'DETAYLI ARAMA'};
        $scope.ONLY_MINE_ITEM = {'id': '', 'name': 'Sadece Ben'};
        console.log("HomeCtrl");

        $scope.filterSingleAnnotation = false;
        $scope.filterOrderSelect = 'verseId';
        $scope.filteredAnnotations = [];

        $scope.actionSheetButtons = [];

        //detailed search screen parameters
        $scope.query_chapter_id = $scope.chapter_id;
        $scope.query_author_mask = $scope.author_mask;
        $scope.query_circles = [];
        $scope.query_users = [];
        $scope.query_verses = "";

        $scope.query_own_annotations = { value: true };
        $scope.queryVerse={};//trick for scope - detailed search compatibiliry. object needed
        $scope.queryVerse.keyword="";
        $scope.detailedSearchAuthorSelection = [];
        $scope.circlesname = [];

        //multiple > single author view
        $scope.showSingleAuthor=false;
        $scope.selectedSingleAuthor=0;

        //mobile modals
        $scope.modal_annotations_on_page = null;
        $scope.modal_chapter_selection = null;
        $scope.modal_authors_list = null;
        $scope.modal_annotations_on_page_sort = null;
        $scope.modal_editor = null;
        $scope.modal_home_search = null;
        $scope.modal_friend_search = null;


        //tags parameters
        $scope.mobil_tagsearched = "";

        $scope.verseAnnotationData = [];

        $scope.restoreChapterViewParameters = function (localParameterData) {
            $scope.query_author_mask = localParameterData.author_mask;
            $scope.query_chapter_id = localParameterData.chapter_id;
            if($scope.query_chapter_id ==""){
                $scope.query_chapter_id = 1;
            }
            $scope.queryVerse.keyword = localParameterData.verseKeyword;
            $scope.verse = {};
            $scope.verse.number = localParameterData.verse_number;
            $scope.query_circles = localParameterData.circles;
            $scope.query_users = localParameterData.users;
            $scope.query_own_annotations.value = localParameterData.ownAnnotations;

        };

        $scope.storeChapterViewParameters = function () {

            var localParameterData = {};
            localParameterData.author_mask = $scope.query_author_mask;
            localParameterData.chapter_id = $scope.query_chapter_id;
            localParameterData.verseKeyword = $scope.queryVerse.keyword;
            localParameterData.verse_number = $scope.verse.number;
            localParameterData.ownAnnotations = $scope.query_own_annotations.value;
            localParameterData.circles = $scope.query_circles;
            localParameterData.users = $scope.query_users;

            localStorageService.set('chapter_view_parameters', localParameterData);
        };

        $scope.searchBookMarkModal = function(){

            $scope.$broadcast('searchBookMarkModal');
        };

        $scope.popoveropen=function(){
            $compile($('.popover.in').contents())($scope);
            $('body').on('click', $scope.popoverclose);
        }

        $scope.popoverclose= function(e){
            //clicking on popover toggle button is processed itself. Any other place hides the popver
            if ($(e.target).data('toggle') !== 'popover'
            //&& $(e.target).parents('[data-toggle="popover"]').length === 0    //for not hiding after clicking inside popover
            //&& $(e.target).parents('.popover.in').length === 0                //for not hiding after clicking inside popover
            ){
                $('[data-toggle="popover"]').popover('hide');
                $('body').unbind('click',$scope.popoverclose);
            }
        }



        $scope.linkcreate=function(chapterno,verseno){
            if(verseno=="0")
            {verseno="1"; chapterno="1";  }

            $scope.linkno="http://kuranharitasi.com/kuran.aspx?sureno=" + chapterno + "&ayetno=" + verseno + "#ContentPlaceHolder1_ayettekikoklergrid";
            $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.linkno);

        };

        //reflects the scope parameters to URL
        $scope.setTranslationsPageURL = function () {
            var parameters =
            {
                author: $scope.query_author_mask,
                chapter: $scope.query_chapter_id,
                verse: $scope.verse.number,
                verseKeyword: $scope.queryVerse.keyword,
                ownAnnotations: $scope.query_own_annotations.value,
                circles: Base64.encode(JSON.stringify($scope.query_circles)),
                users: Base64.encode(JSON.stringify($scope.query_users))
            }
            $location.path("/translations/", false).search(parameters);
        };

        $scope.detailedSearchAuthorToggleSelection = function (author_id) {
            var idx = $scope.detailedSearchAuthorSelection.indexOf(author_id);
            if (idx > -1) {
                $scope.detailedSearchAuthorSelection.splice(idx, 1);
            }
            else {
                $scope.detailedSearchAuthorSelection.push(author_id);
            }
            $scope.query_author_mask = bigInt(0);
            for (var index in $scope.detailedSearchAuthorSelection) {
                $scope.query_author_mask = $scope.query_author_mask.or( $scope.detailedSearchAuthorSelection[index]);
            }
            $scope.query_author_mask = $scope.query_author_mask.value;
        };


        //selected authors
        $scope.setDetailedSearchAuthorSelection = function (authorMask) {
            $scope.detailedSearchAuthorSelection = [];
            for (var index in $scope.authorMap) {
                if (authorMask & $scope.authorMap[index].id) {
                    $scope.detailedSearchAuthorSelection.push($scope.authorMap[index].id);
                }
            }
        };

        $scope.updateTextareaHeight = function (testareaID) {
            var element = document.getElementById(testareaID);
            element.style.height = element.scrollHeight + "px";
        };


        $scope.verseHasAnnotation = function(verseId){
            return verseId in $scope.verseAnnotationData;
        };

        //load the data that contains verse centric annotation and tag data map
        $scope.loadVerseAnnotationData = function(){
            $scope.verseAnnotationData = [];
            $scope.verseTags = [];
            var arrLen = $scope.annotations.length;
            for (var i = 0; i < arrLen; i++) {

                var verseId = $scope.annotations[i].verseId;
                var tags = $scope.annotations[i].tags;

                if (typeof $scope.verseAnnotationData[verseId] == 'undefined') {
                    $scope.verseAnnotationData[verseId] = {};
                    $scope.verseAnnotationData[verseId].annotations=[];
                }

                $scope.verseAnnotationData[verseId].annotations.push ($scope.annotations[i]);

                if (tags != null && tags != "") {
                    if (typeof $scope.verseTags[verseId] == 'undefined') {
                        $scope.verseTags[verseId] = [];

                    }

                    for (var tag in tags) {
                        var theTag = String(tags[tag]);
                        if ($scope.verseTags[verseId].indexOf(theTag) == -1) {
                            $scope.verseTags[verseId][theTag] = 0;
                        }

                        $scope.verseTags[verseId][theTag]++;// = $scope.verseTags[verseId][theTag] + 1;
                    }
                }
            }
            $scope.generateVerseTags();
        }

        $scope.$watch('targetVerseForTagContent',
            function (newValue, oldValue) {
                if (newValue != 0) {
                    $timeout(function () {
                        $scope.scrollToElmnt("verseTags_" + $scope.targetVerseForTagContent);
                    });
                }

            }, true);

        $scope.$watch('switchScrollWatch',
            function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var verseElement = 'v_' + $scope.switchAuthorViewVerseId;
                    $timeout(function () {
                        $scope.scrollToElmnt(verseElement);
                    });

                }

            }, true);


        //TODO:ne is yapiyor?
        $scope.generateVerseTags = function () {
            var verseTagsJSON = [];
            for (var verseId in $scope.verseTags) {
                var thisVerse = {verseId: verseId, tags: []};
                for (var tag in $scope.verseTags[verseId]) {
                    thisVerse['tags'].push({
                        tag: tag,
                        count: $scope.verseTags[verseId][tag]
                    });
                }
                verseTagsJSON[verseId]=thisVerse;
            }
            $scope.verseTagsJSON = verseTagsJSON;
            //TODO: bu kod ne is yapiyor?

            if ($scope.editorSubmitted == 0) {
                if (typeof $scope.verse.number != 'undefined') {
                    var verseId = parseInt($scope.query_chapter_id * 1000) + parseInt($scope.verse.number);
                    $scope.scrollToVerse(verseId);
                }
            } else {
                $scope.editorSubmitted = 0;
            }

        };

        $scope.updateVerseTags = function (verseId, oldTags, newTags) {
            var arrLen = oldTags.length;
            for (var i = 0; i < arrLen; i++) {
                if (typeof $scope.verseTags[verseId][oldTags[i]] != 'undefined') { //zaten olması lazım
                    $scope.verseTags[verseId][oldTags[i]]--;
                }
                if ($scope.verseTags[verseId][oldTags[i]] == 0) {
                    delete $scope.verseTags[verseId][oldTags[i]];
                }
            }
            arrLen = newTags.length;
            for (var i = 0; i < arrLen; i++) {
                if (typeof $scope.verseTags[verseId] == 'undefined') {
                    $scope.verseTags[verseId] = [];
                }
                if (typeof $scope.verseTags[verseId][newTags[i]] == 'undefined') { //henuz yok
                    //yoksa count=0 olustur
                    $scope.verseTags[verseId][newTags[i]] = 0;
                }

                $scope.verseTags[verseId][newTags[i]]++;
            }
            $scope.generateVerseTags();
        };


        $scope.toggleDetailedSearchOwnAnnotations = function () {
            $scope.query_own_annotations.value = !$scope.query_own_annotations.value;
        }



        $scope.resetAnnotationFilter = function () {
            $scope.resetFilteredAnnotations();
            $scope.searchText = '';
        };

        $scope.resetFilteredAnnotations = function () {
            $scope.filteredAnnotations = [];
            //  $scope.scopeApply();
            $scope.filterSingleAnnotation = false;
        };

        $scope.annotationTextSearch = function (item) {
            if (config_data.isMobile) {
                if (document.getElementById("searchText") && document.getElementById("searchText").value) {
                    var searchText = document.getElementById("searchText").value;
                    $scope.searchText = searchText;
                }
            }
            var searchText = $scope.searchText.toLowerCase();

            var tags = '';
            if (typeof item.tags != 'undefined' && typeof item.tags[0] != 'undefined') {
                tags = item.tags[0].toLowerCase();
            }
            if (item.quote.toLowerCase().indexOf(searchText) > -1 || item.text.toLowerCase().indexOf(searchText) > -1 || tags.indexOf(searchText) > -1) {
                if ($scope.filterSingleAnnotation == false) {
                    if ($scope.filteredAnnotations.indexOf(item) == -1) {
                        $scope.filteredAnnotations.push(item);
                    }
                }
                return true;
            } else {
                return false;
            }
        };

        $scope.getAnnotationIndexFromFilteredAnnotationIndex = function (filteredAnnotationIndex) {
            //TODO use getIndexOfArrayByElement
            //console.log("index1: " + filteredAnnotationIndex);
            var arrLen = $scope.annotations.length;

            var filteredAnnotationId = $scope.filteredAnnotations[filteredAnnotationIndex].annotationId;
            var annotationIndex = -1;
            for (var i = 0; i < arrLen; i++) {
                if ($scope.annotations[i].annotationId == filteredAnnotationId) {
                    annotationIndex = i;
                }
            }
            return annotationIndex;
        };

        //method for checking if the item passes the filter.
        $scope.annotationFilter = function (item) {
            if (typeof $scope.filteredAnnotations == 'undefined' || $scope.filteredAnnotations.length == 0) {
                return true;
            } else {
                var found = 0;
                for (i = 0; i < $scope.filteredAnnotations.length; i++) {
                    if (item.annotationId == $scope.filteredAnnotations[i].annotationId) {
                        found++;
                    }
                }
                if (found > 0){
                    return true;
                } else {
                    return false;
                }
            }
        };

        $scope.editAnnotation = function (index) {
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.onEditAnnotation($scope.annotations[index]);
        };

        $scope.submitEditor = function (annotationModalData) {
            $timeout(function () {
                if (config_data.isMobile) {
                    //prepare canView circle list
                    $scope.ViewCircles = [];
                    for (var index = 0; index < $scope.mobileAnnotationEditorCircleListForSelection.length; ++index) {
                        if ($scope.mobileAnnotationEditorCircleListForSelection[index].selected == true) {
                            $scope.ViewCircles.push($scope.mobileAnnotationEditorCircleListForSelection[index]);
                        }
                    }
                }

                //update verse tags
                var oldTags = [];
                if (typeof $scope.annotationModalData.annotationId != 'undefined') {
                    //tags with server format
                    oldTags = $scope.annotationModalData.tags;
                }

                annotator.publish('annotationEditorSubmit', [annotator.editor, annotationModalData]);
                $scope.editorSubmitted = 1;

                $scope.updateVerseTags(annotationModalData.verseId, oldTags, annotationModalData.tags);

                //coming from another page fix
                if ($scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', annotationModalData.annotationId) == -1) {
                    $scope.addAnnotation(annotationModalData);
                }

                annotator.onEditorHide();
                annotator.ignoreMouseup = false;

                if (config_data.isMobile) {
                    $scope.closeModal('editor');
                }
            },350);
        };


        $scope.authorFilter = function (item) {
            return $scope.detailedSearchAuthorSelection.indexOf(item.id) > -1;
        };

        $scope.annotationFilterOrder = function (predicate) {
            if (config_data.isMobile) {
                $scope.filterOrderSelect = predicate;
            }
            var orderBy = $filter('orderBy');
            $scope.annotations = orderBy($scope.annotations, predicate);
            //filtered annotations index bug fix
            //$scope.filteredAnnotations = $scope.annotations;
        };

        $scope.scrollToElmnt = function (elementId) {
            if (!config_data.isMobile) {
                var destination = angular.element(document.getElementById(elementId));
                if (destination.length > 0) {
                    $document.scrollToElement(destination, 70, 0);
                }
            } else {
                var elem = document.getElementById(elementId);
                if (elem != null) {
                    $ionicScrollDelegate.scrollTo(0, elem.offsetTop, true);
                }
            }
        };

        //go to chapter
        $scope.goToChapter = function () {
            $scope.showProgress("goToChapter");
            $scope.list_translations();
            //$scope.updateVerseTagContent();
            $scope.storeChapterViewParameters();
            $scope.setTranslationsPageURL();

        };

        //go to chapter / verse from navigation header
        $scope.goToVerse = function () {

            $scope.query_chapter_id = $scope.goToVerseParameters.chapter.id;
            $scope.verse.number = $scope.goToVerseParameters.verse;
            $scope.queryVerse.keyword = ""; //reset keyword because we need the chapter.
            $scope.goToChapter();
            var verseId = parseInt($scope.query_chapter_id * 1000);
            if (typeof $scope.verse.number != 'undefined') {
                verseId += parseInt($scope.verse.number);
            }
            $scope.addVerseToHistory(verseId);
        };


        //action for detailed search screen
        $scope.detailedSearch = function () {

            $timeout(function(){

                if(isMobile()){ //set query_circles from mobile selection
                    $scope.query_circles=[];
                    for (var index = 0; index < $scope.mobileDetailedSearchCircleListForSelection.length; ++index) {
                        if($scope.mobileDetailedSearchCircleListForSelection[index].selected==true){
                            $scope.query_circles.push($scope.mobileDetailedSearchCircleListForSelection[index]);
                        }
                    }
                }
                $scope.query_circle_dropdown = $scope.DETAILED_SEARCH_ITEM;
                $scope.goToChapter();

                if (config_data.isMobile) {
                    $scope.closeModal('homesearch');
                }
            },350);

        };

        $scope.showEditor = function (annotation, position) {
            $scope.showEditorModal(annotation, position, $scope.submitEditor, function(){
                annotator.publish('annotationEditorCancel');
                annotator.onEditorHide();
            });
        };

        $scope.annotate_it = function () {
            if ($scope.annotatorActivated == 1) {
                annotator.unsubscribe();
                annotator.destroy();
                delete annotator;
            }
            if ($scope.loggedIn) {  //giris yapilmadiysa yukleme, kavga olmasin.
                annotator = new Annotator($('#translations'));

                annotator.setAccessToken($scope.access_token);
                annotator.setTranslationDivMap($scope.translationDivMap);

                var queryParams = {};
                queryParams.chapter = $scope.query_chapter_id;
                queryParams.author_mask_on_view = $scope.query_author_mask;
                queryParams.author_mask = MAX_AUTHOR_MASK;
                queryParams.circles = $scope.getTagsWithCommaSeparated($scope.query_circles) || $scope.CIRCLE_PUBLIC.id;
                queryParams.users = $scope.getTagsWithCommaSeparated($scope.query_users);
                queryParams.verses = $scope.query_verses;
                queryParams.own_annotations = $scope.query_own_annotations.value;

                //-----------------------------------//
                console.warn("queryParams::", queryParams);
                //-----------------------------------//

                annotator.setQueryParameters(queryParams);

                annotator.addPlugin('Store', {
                    prefix: config_data.webServiceUrl,
                    //prefix: 'http://localhost:8080/QuranToolsApp/rest',
                    urls: {
                        create: '/annotations',
                        update: '/annotations/:id',
                        destroy: '/annotations/:id',
                        search: '/search'
                    }
                });

                $scope.annotatorActivated = 1;

                annotator.subscribe("annotationCreated", $scope.colorTheAnnotation);
                annotator.subscribe("annotationCreated", $scope.addAnnotation);
                annotator.subscribe("annotationUpdated", $scope.colorTheAnnotation);
                annotator.subscribe("annotationsLoaded", $scope.loadAnnotations);
                annotator.subscribe("annotationDeleted", $scope.deleteAnnotationFromScope);
                annotator.subscribe("highlightClicked", $scope.onHighlightClicked);
                annotator.subscribe("adderClicked", $scope.showEditor);
                annotator.subscribe("editClicked", $scope.showEditor);
                annotator.subscribe("rangeNormalizeFail",function(anno){
                    console.log("verseId:"+anno.verseId+" start:"+anno.ranges[0].start);
                });

                //unbind
                if (config_data.isMobile) {
                    $(document).unbind('mouseup');
                    $(document).unbind('mousedown');
                }
            }
        };

        $scope.onCustomAdderClick = function (verseId, translationId) {

            var annotation, cancel, cleanup, position, save;

            console.log($scope, $scope.translations);
            for(var i=0; i<$scope.translations;i++){
                console.log($scope.translations[i]);
            }
            position = -1;
            annotator.adder.hide();

            var annotation = {};
            annotation.translationId = translationId;
            annotation.verseId = verseId;
            annotation.authorId = 1;
            annotation.text = "";
            annotation.quote = "";
            var ranges = [{}];
            ranges[0].start = "";
            ranges[0].end = "";
            ranges[0].endOffset = 0;
            ranges[0].startOffset = 0;
            annotation.ranges = ranges;
            annotation.translationVersion = 1;
            annotation.canViewCircles = -1;
            annotation.highlights = [];
            annotation.tags = [];
            annotation.userId = $scope.user.id;
            annotation.userName = $scope.user.username;
            annotation.created = new Date();
            annotation.authorId = 1;

            save = (function (annotator) {
                return function () {
                    return annotator.publish('annotationCreated', [annotation]);
                };

            })(annotator);
            cancel = (function (annotator) {
                return function () {
                    return annotator.deleteAnnotation(annotation);
                };
            })(annotator);
            cleanup = (function (annotator) {
                return function () {
                    annotator.unsubscribe('annotationEditorHidden', cleanup);
                    return annotator.unsubscribe('annotationEditorSubmit', save);
                };
            })(annotator);

            annotator.unsubscribe('annotationEditorHidden');
            annotator.unsubscribe('annotationEditorSubmit');
            annotator.subscribe('annotationEditorCancel', cancel);
            annotator.subscribe('annotationEditorHidden', cleanup);
            annotator.subscribe('annotationEditorSubmit', save);

            annotator.publish("adderClicked",[annotation, position]);
        };

        $scope.showVerseAnnotations = function (verseId){

            var arrayLength = $scope.annotations.length;
            var verseAnnotations = [];
            for (var i = 0; i < arrayLength; i++) {

                if( $scope.annotations[i].verseId == verseId ){
                    verseAnnotations.push($scope.annotations[i]);
                }
            }

            //it is just like clicked on annotations
            $scope.onHighlightClicked(verseAnnotations);

        };

        $scope.onHighlightClicked = function (clickedAnnotations) {

            //mobil theView
            $scope.filteredAnnotations = clickedAnnotations;
            $scope.filterSingleAnnotation = true;
            $scope.scopeApply();

            if (!config_data.isMobile) {
                openPanel();
            } else {
                $scope.openModal('annotations_on_page');
            }

        };

        $scope.setAuthorViewAccordingToDetailedSearchAuthorSelection = function(){
            //switch to singleAuthor View in case of single author
            if($scope.detailedSearchAuthorSelection.length == 1){
                $scope.showSingleAuthor = true;
                $scope.selectedSingleAuthor=$scope.detailedSearchAuthorSelection[0];
            }
            else{
                $scope.showSingleAuthor = false;
                $scope.selectedSingleAuthor = 0;
            }
        };


        //prepare translation_id - div block map
        $scope.prepareTranslationDivMap = function (data) {

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].translations.length; j++) {
                    var vid = data[i].translations[j].id;
                    var ilkimi;


                    if(config_data.isMobile){
                        if (j == 0) {
                            ilkimi = 2;
                        }
                        else {
                            ilkimi = 1;
                        }
                        $scope.translationDivMap[vid] =
                            "/div[" + (i + 1) + "]/div[1]/div[" + (j + 1) + "]/div[" + ilkimi + "]/div[2]/span[1]";

                    }
                    else {
                        if (j == 0) {
                            ilkimi = 3;
                        }
                        else {
                            ilkimi = 1;
                        }
                        if (data.length == 1) { //there is only one author selected
                            $scope.translationDivMap[vid] = "/div[" + (i + 1) + "]/div[1]/div[1]/div[1]/div[3]";
                        }
                        else {

                            $scope.translationDivMap[vid] =
                                /*
                                 4:0:1 /div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/span[1]
                                 4:0:2 /div[1]/div[1]/div[1]/div[2]/div[1]/div[3]/span[1]
                                 4:1:1 /div[2]/div[1]/div[1]/div[1]/div[2]/div[3]/span[1]
                                 4:1:2 /div[2]/div[1]/div[1]/div[2]/div[1]/div[3]/span[1]
                                 4:1:3 /div[2]/div[1]/div[1]/div[3]/div[1]/div[3]/span[1]
                                 /div[1]/div[1]/div[1]/div[4]/div[1]/div[3]/span[1]
                                 /div[2]/div[1]/div[1]/div[2]/div[1]/div[3]/span[1]
                                 "/div[2]/div[1]/div[1]/div[1]/div[2]/div[3]/span[1]"
                                 /div[2]/div[1]/div[1]/div[1]/div[2]/div[3]/span[1]
                                 */
                                "/div[" + (i + 1) + "]/div[1]/div[1]/div[" + (j + 1) + "]/div[" + ilkimi + "]/div[3]/span[1]";
                        }
                    }

                }
            }
            $scope.verses = data;
        };

        //list translations
        $scope.list_translations = function () {

            $scope.showProgress("homeInitialize");
            $scope.setAuthorViewAccordingToDetailedSearchAuthorSelection();

            $scope.translationDivMap = [];

            var translationParams = [];
            translationParams.author = $scope.query_author_mask;
            translationParams.chapter = $scope.query_chapter_id;
            translationParams.verse_keyword = $scope.queryVerse.keyword;

            if(translationParams.verse_keyword !=""){
                translationParams.chapter="";
                $scope.chapter_title = "";
            }else{
                 $scope.setTitle();
            }

            dataProvider.listTranslations(translationParams, function(data){
                $scope.prepareTranslationDivMap(data);
                //mark annotations

                if($scope.access_token == null){
                    $scope.$on("userInfoReady",$scope.annotate_it);
                }
                else{
                    $scope.annotate_it();
                }
                //scroll to verse if user is not logged in.
                //if user is logged in, they will scroll on tag generation.
                if ($scope.user == null && authorization.getAccessToken() == null) {
                    if (typeof $scope.verse.number != 'undefined') {
                        var verseId = parseInt($scope.query_chapter_id * 1000) + parseInt($scope.verse.number);
                        $timeout(function () {
                            $scope.scrollToVerse(verseId);

                        },400);
                    }
                }
            });
        };

        $rootScope.$on('languageChanged', function(){
            $scope.setTitle();
        });

        $scope.setTitle = function () {
            var chapter = $scope.query_chapter_id;

            $timeout(function(){

                try{
                    if (typeof chapter != 'undefined' && typeof $scope.chapters[chapter - 1] !== 'undefined') {
                        var verseName = $translate.instant('VERSE_NAME.' + $scope.chapters[chapter - 1].nameTr);
                        var verseDescription = $translate.instant('VERSE_DESCRIPTION.' + $scope.chapters[chapter - 1].nameTr2);

                        var suffix = "";
                        if($translate.use() == "tr"){
                            suffix = "Sûresi";
                        }

                        $scope.chapter_title = verseName + ' - ' + verseDescription + ' ' + suffix;
                    }
                }
                catch (err){

                }

            },200);
        };


        $scope.scrollToVerse = function (verseId) {

            $scope.verse.number = verseId%1000;
            var verseElement = 'v_' + verseId;
            $scope.setTranslationsPageURL();

            $timeout(function () {
                $scope.scrollToElmnt(verseElement);
                $scope.hideProgress("goToChapter");
                $scope.hideProgress("homeInitialize");
            });
        };

        $scope.loadAnnotations = function (annotations) {
            console.warn("LOAD ANNOTATIONS... ", annotations)
            $scope.annotations = annotations;
            $scope.loadVerseAnnotationData();
            $scope.scopeApply();
            $scope.resetAnnotationFilter();
            $scope.colorAnnotations(annotations);
        };

        //add annotation to scope
        $scope.addAnnotation = function (annotation) {
            $scope.annotations.push(annotation);

            //added because of annotations on page weren't updated when annotation added
            $scope.filteredAnnotations = $scope.annotations;
        };

        //delete annotation from annotator library (highlight)
        $scope.deleteAnnotation = function (index) {
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
                        if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                            index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
                        }
                        annotator.deleteAnnotation($scope.annotations[index]);
                    } else {
                    }
                });
            }else{
                $scope.showAnnotationDeleteModal(index, $scope.mdeleteAnnotation);
            }
        };

        $scope.mdeleteAnnotation = function(index){
            console.log('anno');
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.deleteAnnotation($scope.annotations[index]);
        };

        //remove annotation from scope
        $scope.deleteAnnotationFromScope = function (annotation) {

            var verseId = annotation.verseId;
            var arrLen = $scope.annotations.length;
            var annotationId = annotation.annotationId;
            var annotationIndex = -1;

            //delete from verseTags

            //delete from verseAnnotations
            if( typeof $scope.verseAnnotationData[verseId] != 'undefined' && $scope.verseAnnotationData.hasOwnProperty("annotations")){

                for (var i = 0; i < $scope.verseAnnotationData[verseId].annotations.length; i++) {
                    if ($scope.verseAnnotationData[verseId].annotations[i].annotationId == annotationId) {
                        $scope.verseAnnotationData[verseId].annotations.splice(i, 1);
                        break;
                    }
                }

                if($scope.verseAnnotationData[verseId].annotations.length == 0){
                    delete verseAnnotationData[verseId];
                }
            }

            for (var i = 0; i < arrLen; i++) {
                if ($scope.annotations[i].annotationId == annotationId) {
                    annotationIndex = i;
                }
            }

            if (annotationIndex != -1) {
                $scope.annotations.splice(annotationIndex, 1);
                $scope.scopeApply();
            }
        };

        //list footnotes
        $scope.list_footnotes = function (translation_id, author_id) {
            dataProvider.listFootnotes({
                id: translation_id
            }, function (data) {
                $scope.footnotes = data;
                var footnoteDivElement = document.getElementById('t_' + translation_id);
                //don't list if already listed
                if (!document.getElementById("fn_" + translation_id)) {
                    var html = "<div id='fn_" + translation_id + "'>";
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
                                            "<a style='float: right;' ng-href='#MainCtrl' onclick='javascript: angular.element(document.getElementById(\"MainCtrl\")).scope().openModal(\"hakki_yilmaz_notes\")'>" +
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
                    var el = document.getElementById('fn_' + translation_id);
                    el.parentNode.removeChild(el);

                    //hide show verse when footnote collapses
                    $(".showVerseData").hide();
                }
            });
        };

        //degisti $scope.list_translations();


        $scope.toggleSidebar = function () {
            var translationsDiv = angular.element(document.querySelector('#translations'));
            var sidebarDiv = angular.element(document.querySelector('#sidebar'));
            if ($scope.sidebarActive == 0) {
                sidebarDiv.removeClass('col-xs-0');
                sidebarDiv.removeClass('hide');
                translationsDiv.removeClass('col-xs-12');
                sidebarDiv.addClass('col-xs-3');
                translationsDiv.addClass('col-xs-9');
                $scope.sidebarActive = 1;
            } else {
                sidebarDiv.removeClass('col-xs-3');
                sidebarDiv.addClass('hide');
                translationsDiv.removeClass('col-xs-9');
                translationsDiv.addClass('col-xs-12');

                $scope.sidebarActive = 0;
            }
        }

        $scope.updateAuthors = function () {
            if (!config_data.isMobile) {
                $scope.goToChapter();
            } else {
                $timeout(function(){
                    //$scope.query_author_mask = localStorageService.get('');
                    $scope.goToChapter();

                    if (config_data.isMobile) {
                        $scope.closeModal('authors_list');
                    }

                },300);

            }
        }

        $scope.verseNumberValidation = function (chapters, chapter_id, verse_number) {
            var chapters = $scope.chapters;
            var chapter_id = $scope.goToVerseParameters.chapter.id;
            var verse_number = $scope.goToVerseParameters.verse;

            //search array with id
            var validationErrorMessage = $translate.instant("Geçerli ayet ve sure numarası giriniz");
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
                $scope.goToVerse();
            }
        };

        $scope.singleAuthorView = function (author, verse) {
            $scope.showSingleAuthor=true;
            $scope.switchAuthorViewVerseId = verse;
            $scope.selectedSingleAuthor=author;
            $scope.scopeApply();
            $scope.switchScrollWatch=!$scope.switchScrollWatch;
        };

        $scope.multipleAuthorsView = function (verse) {
            if($scope.detailedSearchAuthorSelection.length != 1){
                $scope.showSingleAuthor=false;
                $scope.switchAuthorViewVerseId = verse;
                $scope.selectedSingleAuthor=0;
                $scope.scopeApply();
                $scope.switchScrollWatch=!$scope.switchScrollWatch;
            }

        };

        if (config_data.isMobile) {
            $ionicModal.fromTemplateUrl('components/partials/annotations_on_page_modal.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'annotations_on_page'

            }).then(function (modal) {
                $scope.modal_annotations_on_page = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/chapter_selection_modal.html', {
                scope: $scope,
                //animation: 'slide-in-left',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'chapter_selection'
            }).then(function (modal) {
                $scope.modal_chapter_selection = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/authors_list_modal.html', {
                scope: $scope,
                //animation: 'slide-in-left',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'authors_list'
            }).then(function (modal) {
                $scope.modal_authors_list = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/annotations_on_page_sort_modal.html', {
                scope: $scope,
                //animation: 'slide-in-left',
                id: 'annotations_on_page_sort'
            }).then(function (modal) {
                $scope.modal_annotations_on_page_sort = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/detailed_search.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'homesearch'
            }).then(function (modal) {
                $scope.modal_home_search = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/add_friend_to_search.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'friendsearch'
            }).then(function (modal) {
                $scope.modal_friend_search = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/add_tag_to_annotation.html', {
                scope: $scope,
                animation: 'slide-in-up',
                id: 'tagsearch'
            }).then(function (modal) {
                $scope.modal_tag_search = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/bookmark.html', {
                id:'1001',
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.bookmarkModal = modal;
            });

            $ionicModal.fromTemplateUrl('components/partials/add_verse_to_verselist.html', {
                scope: $scope,
                animation: 'slide-in-up',
                id: 'verse_selection'
            }).then(function (modal) {
                $scope.modal_verse_selection = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/nav_bookmark.htm', {
                id:'1002',
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.naviBookmarkModal = modal;
            });

            $ionicModal.fromTemplateUrl('components/partials/add_canviewuser.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                //animation: 'slide-left-right',
                animation: 'slide-in-up',
                id: 'viewusersearch'
            }).then(function (modal) {
                $scope.modal_view_user_search = modal
            });

            $scope.openModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.show();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.show();
                } else if (id == 'authors_list') {
                    $scope.modal_authors_list.show();
                } else if (id == 'annotations_on_page_sort') {
                    $scope.modal_annotations_on_page_sort.show();
                } else if (id == 'editor') {
                    $scope.getModalEditor().show();
                } else if (id == 'homesearch') {
                    $scope.restoreMobileDetailedSearchCircleSelections();
                    $scope.modal_home_search.show();
                } else if (id == 'friendsearch') {
                    $scope.modal_friend_search.show();
                } else if (id == 'viewusersearch') {
                    $scope.modal_view_user_search.show();
                } else if (id == 'tagsearch') {
                    $scope.modal_tag_search.show();
                    focusToInput('addtagtoannotation_input');
                }
            };

            $scope.closeModal = function (id) {
                $timeout(function(){

                    if (id == 'annotations_on_page') {
                        $scope.modal_annotations_on_page.hide();
                    } else if (id == 'chapter_selection') {
                        $scope.modal_chapter_selection.hide();
                    } else if (id == 'authors_list') {
                        $scope.modal_authors_list.hide();
                    } else if (id == 'annotations_on_page_sort') {
                        $scope.modal_annotations_on_page_sort.hide();
                    } else if (id == 'homesearch') {
                        $scope.modal_home_search.hide();
                    } else if (id == 'friendsearch') {
                        $scope.modal_friend_search.hide();
                    } else if (id == 'tagsearch') {
                        $scope.modal_tag_search.hide();
                    } else if (id == 'viewusersearch') {
                        $scope.modal_view_user_search.hide();
                    } else if (id == 'editor') {
                        clearTextSelection();
                        $scope.getModalEditor().hide();
                    } else if (id == 'verselist_selection'){
                        $scope.modal_verse_selection.hide();
                    }
                },300);
            };

            $scope.hideAllMobileModals = function () {
                $scope.modal_annotations_on_page.hide();
                $scope.modal_chapter_selection.hide();
                $scope.modal_authors_list.hide();
                $scope.modal_annotations_on_page_sort.hide();
                $scope.modal_editor.hide();
            };
        }

        //On Off Switch
        $scope.status = true;

        $scope.changeStatus = function () {
            $scope.status = !$scope.status;
        }

        $scope.restoreMobileDetailedSearchCircleSelections = function(){
            //restore mobile circle selections
            for (var index = 0; index < $scope.mobileDetailedSearchCircleListForSelection.length; ++index) {
                for(var qindex = 0; qindex < $scope.query_circles.length; ++qindex){
                    if($scope.query_circles[qindex].id == $scope.mobileDetailedSearchCircleListForSelection[index].id){

                        $scope.mobileDetailedSearchCircleListForSelection[index].selected=true;
                        break;
                    }
                    else{
                        $scope.mobileDetailedSearchCircleListForSelection[index].selected=false;
                    }
                }
            }
        }

        //Select circles addicional for detailed search parameter
        $scope.mobil_addCircles = function (index) {

            var control = "0";
            var circle_id = $scope.circlesname[index].id;

            for (var i = 0; i < $scope.query_circles.length; i++) {
                if ($scope.query_circles[i].id == circle_id) {
                    $scope.query_circles.splice(i, 1);
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.query_circles.push($scope.circlesname[index]);
            }
        };

        //Select circles addicionar for parameter
        $scope.mobil_addViewCircles = function (index) {

            var control = "0";
            var circle_id = $scope.circlesname[index].id;

            for (var i = 0; i < $scope.ViewCircles.length; i++) {
                if ($scope.ViewCircles[i].id == circle_id) {
                    $scope.ViewCircles.splice(i, 1);
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.ViewCircles.push($scope.circlesname[index]);
            }

        }

        $scope.checked = function (durum) {

            $scope.query_own_annotations.value = durum;
        };

        $scope.initChapterViewParameters = function () {

            var chapterId = 1;
            var verseKeyword = "";
            var authorMask = 8208;
            var verseNumber = 1;
            var ownAnnotations = true;
            var circles = []; //id array
            //circles.push($scope.CIRCLE_ALL_CIRCLES);// All Circles by default
            circles.push($scope.CIRCLE_PUBLIC);// Public Circles by default
            var users = []; //id array
            var chapterFromRoute = false;
            var authorFromRoute = false;
            var verseFromRoute = false;
            var ownAnnotationsFromRoute = false;
            var circlesFromRoute = false;
            var usersFromRoute = false;
            var verseKeywordFromRoute = false;

            if (typeof $routeParams.chapter !== 'undefined') {
                chapterId = $routeParams.chapter;
                chapterFromRoute = true;
            }

            if (typeof $routeParams.verseKeyword !== 'undefined') {
                verseKeyword = $routeParams.verseKeyword;
                verseKeywordFromRoute = true;
            }

            if (typeof $routeParams.author !== 'undefined') {
                authorMask = $routeParams.author;
                authorFromRoute = true;
            }
            if (typeof $routeParams.verse !== 'undefined') {
                verseNumber = $routeParams.verse;
                verseFromRoute = true;
            }
            if (typeof $routeParams.ownAnnotations !== 'undefined') {
                ownAnnotations = $routeParams.ownAnnotations == true;
                ownAnnotationsFromRoute = true;
            }
            if (typeof $routeParams.circles !== 'undefined') {
                try {
                    circles = JSON.parse(Base64.decode($routeParams.circles));
                    circlesFromRoute = true;
                }
                catch (err) {

                }
            }
            if (typeof $routeParams.users !== 'undefined') {
                try {
                    users = JSON.parse(Base64.decode($routeParams.users));
                    usersFromRoute = true;
                }
                catch (err) {

                }
            }

            var localParameterData = localStorageService.get('chapter_view_parameters');

            if (localParameterData == null) {

                localParameterData = {};
                localParameterData.chapter_id = chapterId;
                localParameterData.verseKeyword = verseKeyword;
                localParameterData.author_mask = authorMask;
                localParameterData.verse_number = verseNumber;
                localParameterData.ownAnnotations = ownAnnotations;
                localParameterData.circles = circles; //process later
                localParameterData.users = []; //process later

            }
            else {
                //get from local
                if (chapterFromRoute || !isDefined(localParameterData.chapter_id)) {
                    localParameterData.chapter_id = chapterId;
                }
                if (verseKeywordFromRoute || !isDefined(localParameterData.verseKeyword)) {
                    localParameterData.verseKeyword = verseKeyword;
                }
                if (authorFromRoute || !isDefined(localParameterData.author_mask)) {
                    localParameterData.author_mask = authorMask;
                }
                if (verseFromRoute || !isDefined(localParameterData.verse_number)) {
                    localParameterData.verse_number = verseNumber;
                }
                if (ownAnnotationsFromRoute || !isDefined(localParameterData.ownAnnotations)) {
                    localParameterData.ownAnnotations = ownAnnotations;
                }

                if (usersFromRoute || !isDefined(localParameterData.users)) {
                    localParameterData.users = users;
                }
                if (circlesFromRoute || !isDefined(localParameterData.circles)) {
                    localParameterData.circles = circles;
                }
            }

            $scope.restoreChapterViewParameters(localParameterData);
            $scope.storeChapterViewParameters();

            //set detailed search author selection
            $scope.setDetailedSearchAuthorSelection($scope.query_author_mask);
            $scope.setAuthorViewAccordingToDetailedSearchAuthorSelection();


            if (localParameterData.users.length != 0 || localParameterData.circles.length > 1 || localParameterData.ownAnnotations == false) {
                $scope.query_circle_dropdown = $scope.DETAILED_SEARCH_ITEM;
            }
            else if (localParameterData.circles.length == 1 && localParameterData.ownAnnotations) {
                $scope.query_circle_dropdown = localParameterData.circles[0];
            }
            else {
                $scope.query_circle_dropdown = $scope.ONLY_MINE_ITEM;
            }

            //set screen variables for author mask
            $scope.$on("authorMap ready", function handler() {
                $scope.setDetailedSearchAuthorSelection($scope.query_author_mask);
                $scope.setAuthorViewAccordingToDetailedSearchAuthorSelection();
            });

            $scope.setTranslationsPageURL();
        };


        //circlelists should be ready for this operation
        $scope.resolveCircleIdListToCircles = function (circleIdList) {

            var circleList = [];
            for (var circleIndex in $scope.circleDropdownArray) {
                for (var idIndex in circleIdList) {
                    if ($scope.circleDropdownArray[circleIndex].id == circleIdList[idIndex]) {
                        circleList.push($scope.circleDropdownArray[circleIndex]);
                    }
                }
            }

            return circleList;
        };

        $scope.initializeHomeController = function () {

            $scope.checkUserLoginStatus();
            $scope.initChapterViewParameters();
            $scope.list_translations();

            $scope.$on('login', function handler() {
                $scope.list_translations();
            });

            $scope.$on('userInfoReady', function handler() {
                $scope.initializeActionSheetButtons();

            });

            $scope.$on('logout', function handler() {
                if (typeof annotator != 'undefined') {
                    annotator.destroy();
                }

                //remove tags on logout
                $scope.verseTagsJSON = [];
            });

            $scope.$on('modal.shown', function(event, modal) {
                if(config_data.isMobile) {
                    $timeout(function () {
                        $scope.scrollDelegateTop(modal.id);
                    });
                }
            });

            navigationManager.reset();
            $scope.initializeActionSheetButtons();
            $scope.displayTutorial("chapter");

        };

        $scope.initializeActionSheetButtons = function(){
            //initialize action sheets
            $scope.actionSheetButtons = [];
            var butonCeviri = {  text: '<i class="icon ion-person"></i> ' + $translate.instant('Çeviri Seç')  };
            var butonSureAyet = {text: '<i class="icon ion-arrow-right-b"></i> ' + $translate.instant('Sure/Ayete Git') };
            var butonFiltre = {text: '<i class="icon fa fa-search"></i> ' + $translate.instant('Notları Filtrele') };
            var butonAyraclar = {text: '<i class="icon ion-android-bookmark"></i> ' + $translate.instant('Ayraçlar') };
            var buttonVerseHistory = {text: '<i class="icon fa fa-history"></i> ' + $translate.instant('Ayet Geçmişi') };

            $scope.actionSheetButtons.push(butonCeviri);
            $scope.actionSheetButtons.push(butonSureAyet);
            if($scope.loggedIn) {
                if($scope.user){
                    $scope.actionSheetButtons.push(butonFiltre);
                    $scope.actionSheetButtons.push(butonAyraclar);
                    $scope.actionSheetButtons.push(buttonVerseHistory);
                }
            }
        };

        $scope.selectDropdownCircle = function (item) {

            $scope.query_own_annotations.value = true;
            if (item.id == '') {
                $scope.query_circles = [];
            }
            else {
                $scope.query_circles = [item];
            }
            $scope.query_circle_dropdown = item;

            $scope.goToChapter();
        };

        $scope.scrollDelegateTop = function(id){
            $ionicScrollDelegate.$getByHandle(id).scrollTop();
        };

        $scope.verseActionSheet = function (translationId,chapter,verse,verseId) {
            if ($scope.user == null)
                return;
            $timeout(function() {
                //TODO: initialize action sheet according to login status
                //var buttonDetailedVerse = {text: '<i class="icon fa fa-history"></i> Ayet İnceleme' };
                //var buttonVerseAnnotations = {text: '<i class="icon fa fa-history"></i> Ayete Ait Notlar' };
                $ionicActionSheet.show({
                    buttons: [
                        {text: $translate.instant('Not Ekle')},
                        {text: $translate.instant('Burada Kaldım')},
                        {text: $translate.instant('Ayeti Listeye Ekle')}
                    ],
                    destructiveText: '',
                    titleText: '',
                    cancelText: $translate.instant('Kapat'),
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        if (index == 0){
                            $("#annotationModal").show();
                            $scope.onCustomAdderClick(verseId, translationId)
                        } else if (index == 1){
                            $scope.openAddBookMarkModal(verseId);
                            $scope.bookmarkModal.show();
                        }else if (index == 2){
                            $scope.modal_verse_selection.show();
                            $scope.addVerseToVerseList(verseId, $scope.closeModal);
                        }
                        return true;
                    }
                });
            },350);
        };

        $scope.closeBookmarkModal =function () {
            $scope.bookmarkModal.hide();
            $scope.naviBookmarkModal.hide();
        };

        $scope.openMenuModal = function () {
            $scope.initializeActionSheetButtons();
            $timeout(function() {
                $ionicActionSheet.show({
                    buttons: $scope.actionSheetButtons,
                    destructiveText: '',
                    titleText: '',
                    cancelText: $translate.instant('Kapat'),
                    cancel: function () {
                        // add cancel code..home_controller
                    },
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $scope.openModal('authors_list');
                        } else if (index == 1) {
                            $scope.openModal('chapter_selection');
                        }else if (index == 2) {
                            $scope.openModal('homesearch');
                        } else if (index == 3) {
                            $scope.searchBookMarkModal();
                            $scope.naviBookmarkModal.show();
                        } else if (index == 4){
                            $scope.openVerseHistory();
                        }
                        return true;
                    }
                });
            },350);
        };
        //initialization
        if(config_data.isNative && !$scope.sqliteDbInit) {
            $scope.$on('db.init.finish', function() {
                $scope.initializeHomeController();
            });
        }else{
            $scope.initializeHomeController();
        }
    })

    .directive('toggle', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                if (attrs.toggle=="tooltip"){
                    $(element).tooltip();
                }
                if (attrs.toggle=="popover"){
                    $(element).popover();

                }
            }
        };
    })
;