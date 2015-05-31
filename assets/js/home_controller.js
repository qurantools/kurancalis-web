angular.module('ionicApp')
    .controller('HomeCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {
        console.log("HomeCtrl");


        /* auth */


        $scope.onFacebookLoginSuccess = function (responseData) {
            if (responseData.loggedIn == false) {
                $scope.loggedIn = false;
                $scope.logOut();
            }
            else {
                $scope.access_token = responseData.token;
                //set cookie
                localStorageService.set('access_token', $scope.access_token);
                //get user information
                $scope.get_user_info();

                $scope.loggedIn = true;
                // $scope.list_translations();
                if ($scope.getCurrentPage() == 'home') {
                    $scope.list_translations();
                }
            }
        }

        $scope.onFacebookLogOutSuccess = function (responseData) {
            if (responseData.loggedOut == true) {
                $scope.user = null;
                if (typeof annotator != 'undefined') {
                    annotator.destroy();
                }

                $scope.verseTagsJSON = {};
                if ($scope.getCurrentPage() != "home") {
                    $scope.chapter_id = 1;
                    $scope.setChapterId();
                    $scope.goToChapter();
                }
            }
        }

        /* facebook login */

        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        //    $scope.user = null;

        $scope.login = function () { //new
            authorization.login($scope.onFacebookLoginSuccess);
        }

        $scope.logOut = function () { //new
            authorization.logOut($scope.onFacebookLogOutSuccess);
        }

        /*
         $scope.api = function () {
         Facebook.api('/me', {fields: 'email'}, function (response) {
         //   $scope.user = response.email;
         });
         };
         */
        $scope.$watch(function () {
                return Facebook.isReady();
            }, function (newVal) {
                if (newVal) {
                    $scope.facebookIsReady = true;
                }
            }
        );
        $scope.checkUserLoginStatus = function () {
            var status = false;
            var access_token = authorization.getAccessToken();
            if (access_token != null && access_token != "") {
                $scope.access_token = access_token;
                $scope.loggedIn = true;
                $scope.get_user_info();
                status = true;
            }
            return status;
        }

        //get user info
        $scope.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;
                }
            );
        }

        $scope.loggedIn = false;
        $scope.checkUserLoginStatus();
        /* end of facebook login */
        /* end of auth */


        $scope.authorization = authorization;

        var chapterId = 1;
        var authorMask = 1040;
        var verseNumber = 1;

        $scope.setChapterId = function () {
            if (typeof annotator != 'undefined') {
                annotator.setChapterId = $scope.chapter_id;
            }
        }
        $scope.setAuthorMask = function () {
            if (typeof annotator != 'undefined') {
                annotator.setAuthorMask = $scope.author_mask;
            }
        }

        if (!config_data.isMobile) {
            if (typeof $routeParams.chapterId !== 'undefined') {
                chapterId = $routeParams.chapterId;
                $scope.initChapterSelect = true;
            }
            if (typeof $routeParams.authorMask !== 'undefined') {
                authorMask = $routeParams.authorMask;
            }
            if (typeof $routeParams.verseNumber !== 'undefined') {
                verseNumber = $routeParams.verseNumber;
            }
        } else {
            //mobile

            //author mask cookie
            var localAuthorMask = localStorageService.get('author_mask');
            if (localAuthorMask != null) {
                authorMask = localAuthorMask;
            }

            if (typeof $stateParams.chapterId !== 'undefined') {
                chapterId = $stateParams.chapterId;
                $scope.initChapterSelect = true;
            }
            if (typeof $stateParams.authorMask !== 'undefined') {
                authorMask = $stateParams.authorMask;
            }
            if (typeof $stateParams.verseNumber !== 'undefined') {
                verseNumber = $stateParams.verseNumber;
            }
        }


        $scope.chapter_id = chapterId;
        $scope.setChapterId();

        $scope.author_mask = authorMask;
        $scope.setAuthorMask();

        localStorageService.set('author_mask', $scope.author_mask);

        $scope.verse = {};
        $scope.verse.number = verseNumber;

        $scope.myRoute = [];
        $scope.myRoute['tag'] = '';
        $scope.myRoute['tagAuthor'] = '';
        $scope.myRoute['targetVerse'] = '';
        $scope.targetVerseForTagContent = 0;

        if (typeof $routeParams.tag !== 'undefined') {
            $scope.myRoute['tag'] = $routeParams.tag;
        }
        if (typeof $routeParams.tagAuthor !== 'undefined') {
            $scope.myRoute['tagAuthor'] = $routeParams.tagAuthor;
        }
        if (typeof $routeParams.targetVerse !== 'undefined') {
            $scope.targetVerseForTagContent = $routeParams.targetVerse;
        }


        $scope.annotate_it = function () {
            if ($scope.annotatorActivated == 1) {
                annotator.destroy();
                delete annotator;
            }
            if ($scope.loggedIn) {  //giris yapilmadiysa yukleme, kavga olmasin.
                annotator = new Annotator($('#translations'));

                //set for annotator usage
                annotator.setAccessToken($scope.access_token);
                annotator.setTranslationDivMap($scope.translationDivMap);
                annotator.setChapterId($scope.chapter_id);
                annotator.setAuthorMask($scope.author_mask);

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
                annotator.subscribe("annotationUpdated", $scope.colorTheAnnotation);
                annotator.subscribe("annotationsLoaded", $scope.loadAnnotations);

                //unbind
                if (config_data.isMobile) {
                    $(document).unbind('mouseup');
                    $(document).unbind('mousedown');
                }
            }


        }

        $scope.loadTags = function (query) {
            var tagsRestangular = Restangular.one('tags', query);
            return tagsRestangular.customGET("", {}, {'access_token': $scope.access_token});
        };


        //list translations
        $scope.list_translations = function () {
            $scope.translationDivMap = [];
            $scope.verses = ChapterVerses.query({
                chapter_id: $scope.chapter_id,
                author_mask: $scope.author_mask
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

                //$state.go($state.current, {}, {reload: true});

                //scroll to verse if user is not logged in.
                //if user is logged in, they will scroll on tag generation.
                if ($scope.user == null) {
                    $scope.scrollToVerse();
                }


            }, 2000);

        }


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
        $scope.list_translations();


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


        /* end of init */


        $scope.annotationSearchAuthorToggleSelection = function annotationSearchAuthorToggleSelection(author_id) {
            var idx = $scope.annotationSearchAuthorSelection.indexOf(author_id);
            if (idx > -1) {
                $scope.annotationSearchAuthorSelection.splice(idx, 1);
            }
            else {
                $scope.annotationSearchAuthorSelection.push(author_id);
            }
            $scope.annotationSearchAuthorMask = 0;
            for (var index in $scope.annotationSearchAuthorSelection) {
                $scope.annotationSearchAuthorMask = $scope.annotationSearchAuthorMask | $scope.annotationSearchAuthorSelection[index];
            }
        };

        //go to chapter
        $scope.goToChapter = function () {
            if (!config_data.isMobile) {
                if ($scope.getCurrentPage() == 'home') {
                    $location.path('/chapter/' + $scope.chapter_id + '/author/' + $scope.author_mask + '/verse/' + $scope.verse.number + '/', false);
                    $scope.list_translations();
                    $scope.updateVerseTagContent();
                } else {
                    window.location.href = '#/chapter/' + $scope.chapter_id + '/author/' + $scope.author_mask + '/';
                }
            } else {
                $state.go("app.home", {
                    "chapterId": $scope.chapter_id,
                    "authorMask": $scope.author_mask,
                    "verseNumber": $scope.verse.number
                }, {reload: true});
            }
        };

        $scope.updateAuthors = function () {
            if (!config_data.isMobile) {
                if ($scope.getCurrentPage() == 'home') {
                    $scope.goToChapter();
                } else if ($scope.getCurrentPage() == 'annotations') {
                    $scope.allAnnotationsOpts.start = 0;
                    $scope.get_all_annotations();
                }
            } else {
                $scope.author_mask = localStorageService.get('author_mask');
                $scope.setAuthorMask();
                $scope.goToChapter();
            }

        }


        /* Editor operations */
        $scope.hideEditor = function () {
            annotator.onEditorHide();
        }

        $scope.submitEditor = function () {
            var jsTags = $scope.theTags;
            var oldTags = [];
            if (typeof $scope.annotationModalData.annotationId != 'undefined') {
                oldTags = $scope.annotationModalData.tags;
            }
            var newTags = [];
            for (var i = 0; i < jsTags.length; i++) {
                newTags.push(jsTags[i].name);
            }
            $scope.annotationModalData.tags = newTags;
            annotator.publish('annotationEditorSubmit', [annotator.editor, $scope.annotationModalData]);
            $scope.editorSubmitted = 1;
            //update verse tags
            $scope.updateVerseTags($scope.annotationModalData.verseId, oldTags, newTags);

            if ($scope.getCurrentPage() == 'annotations') { //annotations page update
                $scope.editAnnotation2($scope.annotationModalData);
            }
            //coming from another page fix
            if ($scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', $scope.annotationModalData.annotationId) == -1) {
                $scope.addAnnotation($scope.annotationModalData);
            }

            return annotator.ignoreMouseup = false;

        }


        $scope.showEditor = function (annotation, position) {
            var newTags = [];
            if (typeof annotation.tags != 'undefined') {
                for (var i = 0; i < annotation.tags.length; i++) {
                    newTags.push({"name": annotation.tags[i]});
                }
            }

            $scope.annotationModalData = annotation;
            if (typeof $scope.annotationModalData.text == 'undefined') {
                $scope.annotationModalData.text = "";
            }
            if (!config_data.isMobile) {
                angular.element(document.getElementById('theView')).scope().theTags = newTags;
            } else {
                angular.element(document.getElementById('MainCtrl')).scope().theTags = newTags;
            }
            $scope.annotationModalDataVerse = Math.floor(annotation.verseId / 1000) + ":" + annotation.verseId % 1000;
            //set default color
            if (typeof $scope.annotationModalData.colour == 'undefined')$scope.annotationModalData.colour = 'yellow';
            $scope.scopeApply();
            if (!config_data.isMobile) {
                $('#annotationModal').modal('show');
                $('#annotationModal').on('hidden.bs.modal', function () {
                    $scope.hideEditor();
                })
            } else {
                $scope.openModal('editor');
            }

        }

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
        }

        $scope.colorAnnotations = function (annotations) {
            for (var annotationIndex in annotations) {
                $scope.colorTheAnnotation(annotations[annotationIndex]);
            }
        }

        $scope.loadAnnotations = function (annotations) {
            $scope.annotations = annotations;
            $scope.loadVerseTags();
            $scope.scopeApply();

            $scope.colorAnnotations(annotations);

        }

        $scope.removeAnnotation = function (annotation) {
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
        }

        $scope.addAnnotation = function (annotation) {
            $scope.annotations.push(annotation);
        }

        $scope.editAnnotation = function (index) {
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.onEditAnnotation($scope.annotations[index]);
            annotator.updateAnnotation($scope.annotations[index]);


        }
        $scope.deleteAnnotation = function (index) {
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.deleteAnnotation($scope.annotations[index]);
            annotator.plugins['Store'].annotationDeleted($scope.annotations[index])

        }


        $scope.deleteAnnotation2 = function (annotation) {
            var annotationRestangular = Restangular.one("annotations", annotation.annotationId);
            annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {

                if (result.code == '200') {
                    var annotationIndex = $scope.getIndexOfArrayByElement($scope.annotations, 'annotationId', annotation.annotationId);
                    if (annotationIndex > -1) {
                        $scope.annotations.splice(annotationIndex, 1);
                    }
                }
            });
        }

        $scope.editAnnotation2 = function (annotation) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("start") + "=" + encodeURIComponent(jsonData.ranges[0].start));
            postData.push(encodeURIComponent("end") + "=" + encodeURIComponent(jsonData.ranges[0].end));
            postData.push(encodeURIComponent("startOffset") + "=" + encodeURIComponent(jsonData.ranges[0].startOffset));
            postData.push(encodeURIComponent("endOffset") + "=" + encodeURIComponent(jsonData.ranges[0].endOffset));
            postData.push(encodeURIComponent("quote") + "=" + encodeURIComponent(jsonData.quote));
            // postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData.content));
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData.text));
            postData.push(encodeURIComponent("colour") + "=" + encodeURIComponent(jsonData.colour));
            postData.push(encodeURIComponent("translationVersion") + "=" + encodeURIComponent(jsonData.translationVersion));
            postData.push(encodeURIComponent("translationId") + "=" + encodeURIComponent(jsonData.translationId));
            postData.push(encodeURIComponent("verseId") + "=" + encodeURIComponent(jsonData.verseId));
            var tags = jsonData.tags.join(",");
            postData.push(encodeURIComponent("tags") + "=" + encodeURIComponent(tags));
            var data = postData.join("&");
            var annotationRestangular = Restangular.one("annotations", jsonData.annotationId);
            return annotationRestangular.customPUT(data, '', '', headers);
        }


        $scope.tagSearchResult = [];
        /* end of login - access token */

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
        }

        $scope.authorFilter = function (item) {
            return $scope.selection.indexOf(item.id) > -1;
        }

        $scope.annotationFilterOrder = function (predicate) {
            var orderBy = $filter('orderBy');
            $scope.annotations = orderBy($scope.annotations, predicate);
        }

        $scope.annotationTextSearch = function (item) {

            var searchText = $scope.searchText.toLowerCase();
            if (item.quote.toLowerCase().indexOf(searchText) > -1 || item.text.toLowerCase().indexOf(searchText) > -1) {
                return true;
            } else {
                return false;
            }
        }

        $scope.getAnnotationIndexFromFilteredAnnotationIndex = function (filteredAnnotationIndex) {
            //TODO use getIndexOfArrayByElement
            var arrLen = $scope.annotations.length;
            var filteredAnnotationId = $scope.filteredAnnotations[filteredAnnotationIndex].annotationId;
            var annotationIndex = -1;
            for (var i = 0; i < arrLen; i++) {
                if ($scope.annotations[i].annotationId == filteredAnnotationId) {
                    annotationIndex = i;
                }
            }
            return annotationIndex;
        }

        $scope.resetAnnotationFilter = function () {
            $scope.filteredAnnotations = [];
            $scope.searchText = '';
        }

        $scope.scrollToElement = function (elementId) {
            var destination = angular.element(document.getElementById(elementId));

            if (destination.length > 0) {
                $document.scrollToElement(destination, 70, 1000);
            }
            /*
             $location.hash(elementId);
             var delegate = $ionicScrollDelegate.$getByHandle('content');
             delegate.anchorScroll();
             */
        }


        $scope.getIndexOfArrayByElement = function (arr, k, v) {
            var arrLen = arr.length;
            var foundOnIndex = -1;
            for (var i = 0; i < arrLen; i++) {
                if (arr[i][k] == v) {
                    foundOnIndex = i;
                }
            }
            return foundOnIndex;
        }


        if ($scope.getCurrentPage() == 'annotations') {
            $scope.filterTags = [];
            //   $scope.get_all_annotations();
        }

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
        }

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
            if ($scope.editorSubmitted == 0) {
                $scope.scrollToVerse();
            } else {
                $scope.editorSubmitted = 0;
            }
        }


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
        }

        $scope.loadVerseTagContent = function (verseTagContentParams, verseId) {
            var verseTagContentRestangular = Restangular.all("translations");
            $scope.verseTagContent = [];
            verseTagContentRestangular.customGET("", verseTagContentParams, {'access_token': $scope.access_token}).then(function (verseTagContent) {
                $scope.targetVerseForTagContent = verseId;
                $scope.verseTagContents = verseTagContent;
            });
        }
        if ($scope.myRoute['tag'] != "") {
            $scope.goToVerseTag($scope.targetVerseForTagContent, $scope.myRoute['tag']);
        }

        $scope.goToVerseTag = function (verseId, tag) {
            if ($scope.targetVerseForTagContent != -1) {
                $scope.verseTagContentParams = [];
                $scope.verseTagContentParams.author = $scope.getSelectedVerseTagContentAuthor();
                $scope.verseTagContentParams.verse_tags = tag;
                $scope.loadVerseTagContent($scope.verseTagContentParams, verseId);
                $scope.verseTagContentAuthor = $scope.getSelectedVerseTagContentAuthor(); //set combo
                $scope.scopeApply();
            } else {
                $scope.targetVerseForTagContent = 0;
            }

        }

        $scope.updateVerseTagContent = function () {
            if ($scope.targetVerseForTagContent != 0 && typeof $scope.verseTagContentParams.verse_tags != 'undefined') {
                $scope.goToVerseTag($scope.targetVerseForTagContent, $scope.verseTagContentParams.verse_tags);
            }
        }

        $scope.getSelectedVerseTagContentAuthor = function () {
            if (typeof $scope.activeVerseTagContentAuthor == 'undefined') {
                $scope.activeVerseTagContentAuthor = $scope.selection[0];
            }
            return $scope.activeVerseTagContentAuthor;
        }

        $scope.verseTagContentAuthorUpdate = function (item) {
            $scope.activeVerseTagContentAuthor = item;
            $scope.verseTagContentAuthor = $scope.activeVerseTagContentAuthor; //comboda seciliyi degistiriyor
            $scope.updateVerseTagContent();
        }


        $scope.scrollToVerse = function () {
            if (typeof $scope.verse.number != 'undefined') {
                var verseId = parseInt($scope.chapter_id * 1000) + parseInt($scope.verse.number);
                $scope.scrollToElement('v_' + verseId);
            }
        }

//tutorial
        $scope.showTutorial = 0;
        if ($location.path() == "/") {
            $scope.showTutorial = 1;
        }
        $scope.tutorialCarouselActive = 0;
        $scope.tutorial = function (parameter) {
            if (parameter == 'init') {
                if ($scope.loggedIn == false) {
                    $('#tutorialModal').modal('show');
                }
            } else if (parameter == 'next') {
                $('#tutorialCarousel').carousel('next');
                $scope.tutorialCarouselActive++;
            } else if (parameter == 'previous') {
                $('#tutorialCarousel').carousel('prev');
                $scope.tutorialCarouselActive--;
            }

        }
//end of tutorial

        $scope.scopeApply = function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        if (config_data.isMobile) {
            $scope.currentState = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.currentState = toState.name;
                    $scope.scopeApply();
                })


            $ionicModal.fromTemplateUrl('components/partials/annotations_on_page_modal.html', {
                scope: $scope,
                animation: 'slide-in-right',
                id: 'annotations_on_page'
            }).then(function (modal) {
                $scope.modal_annotations_on_page = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/editor_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'editor'
            }).then(function (modal) {
                $scope.modal_editor = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/chapter_selection_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'chapter_selection'
            }).then(function (modal) {
                $scope.modal_chapter_selection = modal
            });

            $ionicModal.fromTemplateUrl('components/partials/authors_list_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'authors_list'
            }).then(function (modal) {
                $scope.modal_authors_list = modal
            });

            $scope.openModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.show();
                } else if (id == 'editor') {
                    $scope.modal_editor.show();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.show();
                } else if (id == 'authors_list') {
                    $scope.modal_authors_list.show();
                }
            };

            $scope.closeModal = function (id) {
                if (id == 'annotations_on_page') {
                    $scope.modal_annotations_on_page.hide();
                } else if (id == 'editor') {
                    $scope.modal_editor.hide();
                } else if (id == 'chapter_selection') {
                    $scope.modal_chapter_selection.hide();
                } else if (id == 'authors_list') {
                    $scope.modal_authors_list.hide();
                }
            }


            $scope.annotationAddable = false;
            $scope.selectionEnded = function () {
                $scope.annotationAddable = true;
                $scope.scopeApply();
            }

            $scope.selectionCancel = function () {
                $scope.annotationAddable = false;
                $scope.scopeApply();
            }
        }

    });