angular.module('ionicApp')
    .controller('HomeCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {


        console.log("HomeCtrl");
        $scope.currentPage = $scope.getCurrentPage();
        $scope.filterSingleAnnotation = false;
        $scope.filterOrderSelect = 'verseId';
        $scope.filteredAnnotations = [];

        //detailed search screen parameters
        $scope.query_chapter_id=$scope.chapter_id;
        $scope.query_author_mask=$scope.author_mask;
        $scope.query_circles=[];
        $scope.query_users=[];
        $scope.query_verses="";
        $scope.query_own_annotations=true;


        $scope.restoreChapterViewParameters = function(localParameterData){
            $scope.query_author_mask = localParameterData.author_mask;
            $scope.query_chapter_id = localParameterData.chapter_id;
            $scope.verse = {};
            $scope.verse.number = localParameterData.verse_number;

        };

        $scope.storeChapterViewParameters = function(){

            var localParameterData = {};
            localParameterData.author_mask=$scope.query_author_mask;
            localParameterData.chapter_id = $scope.query_chapter_id;
            localParameterData.verse_number = $scope.verse.number;

            localStorageService.set('chapter_view_parameters', localParameterData);
        };



        $scope.detailedSearchAuthorToggleSelection = function (author_id) {
            var idx = $scope.detailedSearchAuthorSelection.indexOf(author_id);
            if (idx > -1) {
                $scope.detailedSearchAuthorSelection.splice(idx, 1);
            }
            else {
                $scope.detailedSearchAuthorSelection.push(author_id);
            }
            $scope.query_author_mask = 0;
            for (var index in $scope.detailedSearchAuthorSelection) {
                $scope.query_author_mask = $scope.query_author_mask | $scope.detailedSearchAuthorSelection[index];
            }
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

        $scope.updateTextareaHeight = function(testareaID) {
            var element = document.getElementById(testareaID);
            element.style.height =  element.scrollHeight + "px";
        };


        //TODO: ne is yapiyor?
        $scope.loadVerseTags = function () {
            $scope.verseTags = [];
            var arrLen = $scope.annotations.length;
            for (var i = 0; i < arrLen; i++) {

                var verseId = $scope.annotations[i].verseId;
                var tags = $scope.annotations[i].tags;

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
        };

        $scope.$watch('targetVerseForTagContent',
                function(newValue, oldValue){
                    if(newValue != 0){
                        $timeout(function(){
                            $scope.scrollToElmnt("verseTags_"+$scope.targetVerseForTagContent);
                        });
                    }
                    
        },true);
            


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
                verseTagsJSON.push(thisVerse);
            }
            $scope.verseTagsJSON = verseTagsJSON;
            //TODO: bu kod ne is yapiyor?
            
            if ($scope.editorSubmitted == 0) {
                $scope.scrollToVerse();
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



        $scope.toggleDetailedSearchOwnAnnotations = function(){
            $scope.query_own_annotations=! $scope.query_own_annotations;
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
            console.log("index1: "+filteredAnnotationIndex);
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
                if (found > 0)return true; else return false;
            }
        };


        $scope.editAnnotation = function (index) {
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.onEditAnnotation($scope.annotations[index]);

        };

        $scope.submitEditor = function () {



            //update verse tags
            var oldTags = [];
            if (typeof $scope.annotationModalData.annotationId != 'undefined') {
                //tags with server format
                oldTags = $scope.annotationModalData.tags;
            }

            //get tag Parameters
            var tagParameters = $scope.getTagParametersForAnnotatorStore($scope.cevres,$scope.yrmcevres,$scope.kisis,$scope.yrmkisis,$scope.annotationModalDataTagsInput)
            //now annotationModalData belogs to root scope, may be we can get it later
            $scope.annotationModalData.canViewCircles = tagParameters.canViewCircles;
            $scope.annotationModalData.canCommentCircles = tagParameters.canCommentCircles;
            $scope.annotationModalData.canViewUsers = tagParameters.canViewUsers;
            $scope.annotationModalData.canCommentUsers = tagParameters.canCommentUsers;
            $scope.annotationModalData.tags = tagParameters.tags;

            annotator.publish('annotationEditorSubmit', [annotator.editor, $scope.annotationModalData]);
            $scope.editorSubmitted = 1;

            $scope.updateVerseTags($scope.annotationModalData.verseId, oldTags, $scope.annotationModalData.tags);


            //coming from another page fix
            if ($scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', $scope.annotationModalData.annotationId) == -1) {
                $scope.addAnnotation($scope.annotationModalData);
            }
            if (config_data.isMobile) {
                $scope.closeModal('editor');
            }
            annotator.onEditorHide();
            return annotator.ignoreMouseup = false;

        };




        $scope.authorFilter = function (item) {
            return $scope.selection.indexOf(item.id) > -1;
        };

        $scope.annotationFilterOrder = function (predicate) {
            if(config_data.isMobile){
                $scope.filterOrderSelect = predicate;
            }
            var orderBy = $filter('orderBy');
            $scope.annotations = orderBy($scope.annotations, predicate);
            //filtered annotations index bug fix
            $scope.filteredAnnotations = $scope.annotations;
        };

        $scope.scrollToElmnt = function (elementId) {
            if (!config_data.isMobile) {
                var destination = angular.element(document.getElementById(elementId));
                if (destination.length > 0) {
                    $document.scrollToElement(destination, 70, 0);
                }
            } else {
                var elem = document.getElementById(elementId);
                if(elem != null) {
                    $ionicScrollDelegate.scrollTo(0, elem.offsetTop, false);
                }
            }
        };

        //go to chapter
        $scope.goToChapter = function () {
            $location.path('/chapter/' + $scope.query_chapter_id + '/author/' + $scope.query_author_mask + '/verse/' + $scope.verse.number + '/', false);
            $scope.list_translations();
            $scope.updateVerseTagContent();


        };


        //go to chapter / verse from navigation header
        $scope.goToVerse = function () {
            $scope.query_chapter_id = $scope.goToVerseParameters.chapter.id ;
            $scope.verse.number = $scope.goToVerseParameters.verse;
            $scope.goToChapter();
        };

        //acction for detailed search screen
        $scope.detailedSearch = function(){
            $scope.query_circle_dropdown={'id':'','name':'DETAYLI ARAMA'};
            $scope.goToChapter();
        };


        //customized showEditor for home controller
        $scope.showEditor = function (annotation, position) {
            //call parent show editor
            $scope.$parent.showEditor(annotation,position);
            if (!config_data.isMobile) {
                $('#annotationModal').on('hidden.bs.modal', function () {
                    annotator.onEditorHide();
                 })
            }

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

                var queryParams={};
                queryParams.chapter = $scope.query_chapter_id;
                queryParams.author_mask = $scope.query_author_mask;
                queryParams.circles = $scope.getTagsWithCommaSeparated( $scope.query_circles);
                queryParams.users = $scope.getTagsWithCommaSeparated($scope.query_users);
                queryParams.verses = $scope.query_verses;
                queryParams.own_annotations = $scope.query_own_annotations;

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

                annotator.addPlugin('Tags');
                $scope.annotatorActivated = 1;

                annotator.subscribe("annotationCreated", $scope.colorTheAnnotation);
                annotator.subscribe("annotationCreated", $scope.addAnnotation);
                annotator.subscribe("annotationUpdated", $scope.colorTheAnnotation);
                annotator.subscribe("annotationsLoaded", $scope.loadAnnotations);
                annotator.subscribe("annotationDeleted", $scope.deleteAnnotationFromScope);
                annotator.subscribe("highlightClicked", $scope.onHighlightClicked);
                annotator.subscribe("adderClicked", $scope.showEditor);
                annotator.subscribe("editClicked", $scope.showEditor);

                //unbind
                if (config_data.isMobile) {
                    $(document).unbind('mouseup');
                    $(document).unbind('mousedown');

                }
            }


        };


        $scope.onHighlightClicked = function(clickedAnnotations){

            //mobil theView
            $scope.filteredAnnotations = clickedAnnotations;
            $scope.filterSingleAnnotation = true;
            $scope.scopeApply();

            if(!config_data.isMobile){
                openPanel();
            }else{
                $scope.openModal('annotations_on_page');
            }

        };


//Volkan Ekledi.


//        function cevregoster() {
//            var cevregosterRestangular = Restangular.all("circles");
//            cevregosterRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
//                $scope.cevreadlar = cevreliste;
//            });
//        };

//

        //list translations
        $scope.list_translations = function () {
            $scope.translationDivMap = [];
            $scope.verses = ChapterVerses.query({
                chapter_id: $scope.query_chapter_id,
                author_mask: $scope.query_author_mask
            }, function (data) {
                //prepare translation_id - div block map

                var arrayLength = data.length;
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].translations.length; j++) {
                        var vid = data[i].translations[j].id;
                        var ilkimi;
                        if (j == 0) {
                            ilkimi = 1;
                        }
                        else {
                            ilkimi = 0;
                        }
                        $scope.translationDivMap[vid] = "/div[" + (i + 1) + "]/div[1]/div[" + (j + 1) + "]/div[" + (1 + ilkimi) + "]/div[2]/span[1]";
                    }
                }
            });

            $timeout(function () {

                //mark annotations
                $scope.annotate_it();

                //scroll to verse if user is not logged in.
                //if user is logged in, they will scroll on tag generation.
                if ($scope.user == null) {
                    $scope.scrollToVerse();
                }


            }, 2000);

        };


        $scope.scrollToVerse = function () {
            if (typeof $scope.verse.number != 'undefined') {
                var verseId = parseInt($scope.query_chapter_id * 1000) + parseInt($scope.verse.number);
                var verseElement = 'v_' + verseId;
                
                $timeout(function(){
                            $scope.scrollToElmnt(verseElement);
                        });
                
                
            }
        };

        $scope.colorTheAnnotation = function (annotation) {
            var cat = annotation.colour;
            var highlights = annotation.highlights;
            if (cat) {
                for (var h in highlights) {
                    var classes = highlights[h].className.split(" ");
                    var newClass = "";

                    //remove the class if already coloured
                    for (var theClass in classes) {
                        if (classes[theClass].indexOf("a_hl_") > -1) { //the class is a colour class
                            classes.splice(theClass, 1);
                        }
                    }
                    newClass = classes.join(" ");
                    newClass = newClass + ' a_hl_' + cat;
                    highlights[h].className = newClass;
                }
            }
        };

        $scope.colorAnnotations = function (annotations) {
            for (var annotationIndex in annotations) {
                $scope.colorTheAnnotation(annotations[annotationIndex]);
            }
        };

        $scope.loadAnnotations = function (annotations) {
            $scope.annotations = annotations;
            $scope.loadVerseTags();
            $scope.scopeApply();
            $scope.resetAnnotationFilter();
            $scope.colorAnnotations(annotations);

        };


        //add annotation to scope
        $scope.addAnnotation = function (annotation) {
            $scope.annotations.push(annotation);

            //added because of annotations on page weren't updated when annotation added
            $scope.filteredAnnotations= $scope.annotations;
        };

        //delete annotation from annotator library (highlight)
        $scope.deleteAnnotation = function (index) {
            console.log("deleteAnnotation")
            console.log("$scope.filteredAnnotations: "+JSON.stringify($scope.filteredAnnotations));
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.deleteAnnotation($scope.annotations[index]);

        };


        //remove annotation from scope
        $scope.deleteAnnotationFromScope = function (annotation) {
            var arrLen = $scope.annotations.length;
            var annotationId = annotation.annotationId;
            var annotationIndex = -1;
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

            $scope.footnotes = Footnotes.query({
                id: translation_id
            }, function (data) {
                var footnoteDivElement = document.getElementById('t_' + translation_id);
                //don't list if already listed
                if (!document.getElementById("fn_" + translation_id)) {
                    var html = "<div id='fn_" + translation_id + "'>";
                    var dataLength = data.length;
                    for (index = 0; index < dataLength; ++index) {
                        //add verse links
                        //   dataContent = data[index].replace(/(\d{1,3}:\d{1,3})/g, "<a href='javascript: redirectToVerseByChapterAndVerse(\"$1\");'>$1</a>");
                        dataContent = data[index].replace(/(\d{1,3}:\d{1,3})/g, "<a href='javascript: angular.element(document.getElementById(\"MainCtrl\")).scope().showVerseFromFootnote(\"$1\"," + author_id + "," + translation_id + ");'>$1</a>");

                        html += "<div><div class='col-xs-1 footnote_bullet'>&#149;</div><div class='col-xs-11 footnotebg'>" + dataContent + "</div></div>";
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
        }

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
                //$scope.query_author_mask = localStorageService.get('');
                $scope.goToChapter();

            }
        }

        $scope.verseNumberValidation = function (chapters, chapter_id, verse_number) {
            var chapters = $scope.chapters;
            var chapter_id = $scope.goToVerseParameters.chapter.id;
            var verse_number = $scope.goToVerseParameters.verse;

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
                $scope.goToVerse();
            }
        };

        //Get verses of the tag from server
        $scope.loadVerseTagContent = function (verseTagContentParams, verseId) {
            var verseTagContentRestangular = Restangular.all("translations");
            verseTagContentRestangular.customGET("", verseTagContentParams, {'access_token': $scope.access_token}).then(function (verseTagContent) {
                $scope.targetVerseForTagContent = verseId;
                $scope.verseTagContents = verseTagContent;
                $scope.scopeApply();
            });
        };



        //Retrieve verses with the tag.
        $scope.goToVerseTag = function (verseId, tag) {
            if ($scope.targetVerseForTagContent != -1) {
                $scope.verseTagContentParams = [];
                $scope.verseTagContentParams.author = $scope.getSelectedVerseTagContentAuthor();
                $scope.verseTagContentParams.verse_tags = tag;

                $scope.verseTagContentParams.circles = $scope.getTagsWithCommaSeparated($scope.query_circles);
                $scope.verseTagContentParams.users = $scope.getTagsWithCommaSeparated($scope.query_users);

                $scope.verseTagContentAuthor = $scope.getSelectedVerseTagContentAuthor(); //set combo
                $scope.loadVerseTagContent($scope.verseTagContentParams, verseId);

            } else {
                $scope.targetVerseForTagContent = 0;
            }
        };

        //Redisplay the verses of the tag with current params
        $scope.updateVerseTagContent = function () {
            if ($scope.targetVerseForTagContent != 0 && typeof $scope.verseTagContentParams.verse_tags != 'undefined') {
                $scope.goToVerseTag($scope.targetVerseForTagContent, $scope.verseTagContentParams.verse_tags);
            }
        };

        $scope.getSelectedVerseTagContentAuthor = function () {
            if ($scope.activeVerseTagContentAuthor == "" ) {
                $scope.activeVerseTagContentAuthor = $scope.selection[0];
            }
            else if($scope.selection.indexOf($scope.activeVerseTagContentAuthor)== -1){
                $scope.activeVerseTagContentAuthor = $scope.selection[0];
            }//get the first one if the previous author is not selected now


            return $scope.activeVerseTagContentAuthor;
        };

        $scope.verseTagContentAuthorUpdate = function (item) {
            $scope.activeVerseTagContentAuthor = item;
            $scope.verseTagContentAuthor = $scope.activeVerseTagContentAuthor; //comboda seciliyi degistiriyor
            $scope.updateVerseTagContent();
        };

        if (config_data.isMobile) {
            $ionicModal.fromTemplateUrl('components/partials/annotations_on_page_modal.html', {
                scope: $scope,
                //animation: 'slide-in-right',
                id: 'annotations_on_page'
            }).then(function (modal) {
                $scope.modal_annotations_on_page = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/chapter_selection_modal.html', {
                scope: $scope,
                //animation: 'slide-in-left',
                id: 'chapter_selection'
            }).then(function (modal) {
                $scope.modal_chapter_selection = modal
            });


            $ionicModal.fromTemplateUrl('components/partials/authors_list_modal.html', {
                scope: $scope,
                //animation: 'slide-in-left',
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

            $ionicModal.fromTemplateUrl('components/partials/editor_modal.html', {
                scope: $scope,
                //animation: 'slide-in-left',
                id: 'editor'
            }).then(function (modal) {
                $scope.$parent.modal_editor = modal;
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
                } else  if (id == 'editor') {
                    $scope.$parent.modal_editor.show();
                }
            };

            $scope.closeModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.hide();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.hide();
                } else if (id == 'authors_list') {
                    $scope.modal_authors_list.hide();
                } else if (id == 'annotations_on_page_sort') {
                    $scope.modal_annotations_on_page_sort.hide();
                } else  if (id == 'editor') {
                    clearTextSelection();
                    $scope.$parent.modal_editor.hide();
                }
            }

            $scope.hideAllMobileModals = function(){
                    $scope.modal_annotations_on_page.hide();
                    $scope.modal_chapter_selection.hide();
                    $scope.modal_authors_list.hide();
                    $scope.modal_annotations_on_page_sort.hide();
                    $scope.$parent.modal_editor.hide();
            };

        }


        $scope.initChapterViewParameters = function(){

            var chapterId = 1;
            var authorMask = 1040;
            var verseNumber = 1;
            var chapterFromRoute=false;
            var authorFromRoute=false;
            var verseFromRoute=false;

            if (typeof $routeParams.chapterId !== 'undefined') {
                chapterId = $routeParams.chapterId;
                chapterFromRoute = true;
            }
            if (typeof $routeParams.authorMask !== 'undefined') {
                authorMask = $routeParams.authorMask;
                authorFromRoute = true;
            }
            if (typeof $routeParams.verseNumber !== 'undefined') {
                verseNumber = $routeParams.verseNumber;
                verseFromRoute = true;
            }

            var localParameterData= localStorageService.get('chapter_view_parameters');

            if (localParameterData == null ) {

                //assign  default parameters to scope and store
                $scope.query_author_mask  = authorMask;
                $scope.query_chapter_id   = chapterId;
                $scope.verse = {}
                $scope.verse.number = verseNumber;

                $scope.storeChapterViewParameters();

            }
            else{
                //get from local
                if(chapterFromRoute){
                    localParameterData.chapter_id = chapterId;
                }
                if(authorFromRoute){
                    localParameterData.author_mask = authorMask;
                }
                if(verseFromRoute){
                    localParameterData.verse_number = verseNumber;
                }

                $scope.restoreChapterViewParameters(localParameterData);
                $scope.storeChapterViewParameters();
            }

            //set screen variables for author mask
            $scope.$on("authorMap ready", function handler(){
                $scope.setDetailedSearchAuthorSelection($scope.query_author_mask);
            });

        };


        $scope.initializeHomeController = function(){

            $scope.initChapterViewParameters();
            $scope.list_translations();
            $scope.checkUserLoginStatus();

            $scope.$on('login', function handler() {
                $scope.list_translations();
            });

            $scope.$on('logout', function handler() {
                if (typeof annotator != 'undefined') {
                    annotator.destroy();
                }
                //remove tags on logout
                $scope.verseTagsJSON = [];
            });


            $scope.detailedSearchAuthorSelection = $scope.selection;
        };

        $scope.selectDropdownCircle = function(item){

            $scope.query_own_annotations=true;
            if(item.id==''){
                $scope.query_circles = [];
            }
            else {
                $scope.query_circles = [item];
            }
            $scope.query_circle_dropdown = item;

            $scope.goToChapter();
        };


        //initialization

        $scope.initializeHomeController();

    });