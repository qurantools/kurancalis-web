angular.module('ionicApp', ['ngResource', 'ngRoute', 'facebook', 'restangular', 'LocalStorageModule', 'ngTagsInput', 'duScroll'])
    .filter('to_trusted', ['$sce',
        function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])
    .filter('with_footnote_link', [
        function () {
            return function (text, translation_id) {
                return text.replace("*", "<a class='footnote_asterisk' href='javascript:list_fn(" + translation_id + ")'>*</a");
            };
        }])

    .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }]).config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider) {
        RestangularProvider.setBaseUrl('https://securewebserver.net/jetty/qt/rest');
        //RestangularProvider.setBaseUrl('http://localhost:8080/QuranToolsApp/rest');
        localStorageServiceProvider.setStorageCookie(0, '/');
        //route
        $routeProvider
            .when('/', {
                controller: 'MainCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false
            })
            .when('/chapter/:chapterId/author/:authorMask', {
                controller: 'MainCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/'
            });

        //facebook
        FacebookProvider.init('295857580594128');
    })
    .factory('ChapterVerses', function ($resource) {
        return $resource('https://securewebserver.net/jetty/qt/rest/chapters/:chapter_id/authors/:author_mask', {
            chapter_id: '@chapter_id',
            author_mask: '@author_mask'
        }, {
            query: {
                method: 'GET',
                params: {
                    chapter_id: '@chapter_id',
                    author_mask: '@author_mask'
                },
                isArray: true
            }
        });
    }).factory('Footnotes', function ($resource) {
        return $resource('https://securewebserver.net/jetty/qt/rest/translations/:id/footnotes', {
            chapter_id: '@translation_id'
        }, {
            query: {
                method: 'GET',
                params: {
                    id: '@translation_id'
                },
                isArray: true
            }
        });
    }).factory('ListAuthors', function ($resource) {
        return $resource('https://securewebserver.net/jetty/qt/rest/authors', {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }).factory('User', function ($resource) {

        return $resource('https://securewebserver.net/jetty/qt/rest/users',
            {},

            {
                query: {
                    method: 'GET',
                    headers: {
                        "access_token": this.accessToken
                    },
                    isArray: false
                },
                save: {
                    method: 'POST',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    isArray: false
                }
            }
        );
    })

    .controller('MainCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document) {
        var chapterId = 1;
        var authorMask = 48;
        if (typeof $routeParams.chapterId !== 'undefined') {
            chapterId = $routeParams.chapterId;
        }
        if (typeof $routeParams.authorMask !== 'undefined') {
            authorMask = $routeParams.authorMask;
        }
        $scope.chapter_id = chapterId;
        $scope.author_mask = authorMask;


        //get user info
        $scope.get_user_info = function () {

            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;
                }
            );

        }

        $scope.annotate_it = function () {
            if ($scope.annotatorActivated == 1) {
                annotator.destroy();
                //$('#translations').data('annotator').plugins['Store'].destroy();
                delete annotator;
            }

            //annotator = $('#translations').annotator();
            annotator = new Annotator($('#translations'));
            //     if ($scope.annotatorActivated != 1) {
            annotator.addPlugin('Store', {
                prefix: 'https://securewebserver.net/jetty/qt/rest',
                //prefix: 'http://localhost:8080/QuranToolsApp/rest',
                urls: {
                    // These are the default URLs.
                    create: '/annotations',
                    update: '/annotations/:id',
                    destroy: '/annotations/:id',
                    search: '/search'
                }
            });
            annotator.addPlugin('Touch', {
                //force: true
            });
            annotator.addPlugin('Tags');

            $scope.annotatorActivated = 1;

            annotator.subscribe("annotationCreated", $scope.colorTheAnnotation);
            annotator.subscribe("annotationUpdated", $scope.colorTheAnnotation);
            annotator.subscribe("annotationsLoaded", $scope.colorAnnotations);

            //annotator.subscribe("annotationCreated", $scope.loadAnnotations);
            //annotator.subscribe("annotationUpdated", $scope.loadAnnotations);


            annotator.subscribe("annotationsLoaded", $scope.loadAnnotations);


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
                $scope.annotate_it();

            }, 2000);

        }
        //list authors
        $scope.list_authors = function () {
            $scope.authorMap = new Object();
            $scope.authors = ListAuthors.query(function (data) {
                var arrayLength = data.length;
                for (var i = 0; i < arrayLength; i++) {
                    $scope.authorMap[data[i].id] = data[i];
                    $scope.setAuthors();
                }
            });
        }


        //list footnotes
        $scope.list_footnotes = function (translation_id) {
            $scope.footnotes = Footnotes.query({
                id: translation_id
            }, function (data) {
                var footnoteDivElement = document.getElementById('t_' + translation_id);
                //don't list if already listed
                if (!document.getElementById("fn_" + translation_id)) {
                    var html = "<div class='footnote' id='fn_" + translation_id + "'>";
                    var dataLength = data.length;
                    for (index = 0; index < dataLength; ++index) {
                        html += "<div class='row'><div class='col-xs-1 footnote_bullet'>&#149;</div><div class='col-xs-11'>" + data[index] + "</div></div>";
                    }
                    html += '</div>';
                    footnoteDivElement.innerHTML = footnoteDivElement.innerHTML + html;
                } else {
                    var el = document.getElementById('fn_' + translation_id);
                    el.parentNode.removeChild(el);
                }

            });

        }
        //selected authors
        $scope.setAuthors = function () {
            $scope.selection = [];
            for (var index in $scope.authorMap) {
                if ($scope.author_mask & $scope.authorMap[index].id) {
                    $scope.selection.push($scope.authorMap[index].id);
                }
            }
        }

        $scope.getAuthorMask = function () {
            return $scope.author_mask;
        }

        $scope.getChapterId = function () {
            return $scope.chapter_id;
        }

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

        /* init */
        $scope.sidebarActive = 0;
        $scope.tagSearchResult = [];


        //hide list of authors div
        $scope.showAuthorsList = false;

        //list the authors on page load
        $scope.list_authors();

        //get author mask
        //     $scope.author_mask = 48;

        //selected authors


        $scope.selection = ["16", "32"];


        $scope.list_translations();
        // $scope.toggleSidebar();
        sidebarInit();

        /* end of init */

        //toggle selection for an author id
        $scope.toggleSelection = function toggleSelection(author_id) {
            var idx = $scope.selection.indexOf(author_id);
            ;
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(author_id);
            }
            $scope.author_mask = 0;
            for (var index in $scope.selection) {
                $scope.author_mask = $scope.author_mask | $scope.selection[index];
            }
        };

        //go to chapter
        $scope.goToChapter = function () {
            $location.path('/chapter/' + $scope.chapter_id + '/author/' + $scope.author_mask, false);
            $scope.list_translations();
        };


        /* facebook login */
        $scope.fbLoginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        //    $scope.user = null;

        $scope.login = function () {
            Facebook.login(function (response) {
                $scope.fbLoginStatus = response.status;
                $scope.tokenFb = response.authResponse.accessToken;
                if ($scope.tokenFb != "") {
                    $scope.access_token = "";
                    //get token from facebook token
                    //$scope.access_token=
                    var user = new User();
                    user.fb_access_token = $scope.tokenFb;
                    user.$save({fb_access_token: $scope.tokenFb},
                        function (data, headers) {
                            //get token
                            $scope.access_token = data.token;
                            //set cookie
                            localStorageService.set('access_token', $scope.access_token);
                            //get user information
                            $scope.get_user_info();

                            $scope.loggedIn = true;
                            $scope.list_translations();

                        },
                        function (error) {
                            if (error.data.code == '209') {
                                alert("Sisteme giriş yapabilmek için e-posta adresi paylaşımına izin vermeniz gerekmektedir.");
                            }
                            $scope.log_out();
                            $scope.access_token = error;
                        }
                    );
                }
            }, {scope: 'email'});
        };

        $scope.removeAuth = function () {
            Facebook.api({
                method: 'Auth.revokeAuthorization'
            }, function (response) {
                Facebook.getLoginStatus(function (response) {
                    $scope.fbLoginStatus = response.status;
                });
            });
        };

        $scope.api = function () {
            Facebook.api('/me', {fields: 'email'}, function (response) {
                //   $scope.user = response.email;
            });
        };

        $scope.$watch(function () {
                return Facebook.isReady();
            }, function (newVal) {
                if (newVal) {
                    $scope.facebookIsReady = true;
                }
            }
        );
        /* end of facebook login */

        /* login - access token */
        $scope.get_access_token_cookie = function () {
            return localStorageService.get('access_token');
        }
        $scope.log_out = function () {
            $scope.user = null;
            $scope.removeAuth();
            localStorageService.remove('access_token');
            annotator.destroy();
        }

        $scope.checkUserLoginStatus = function () {
            var access_token = $scope.get_access_token_cookie();
            if (access_token != null && access_token != "") {
                $scope.access_token = access_token;
                $scope.loggedIn = true;
                $scope.get_user_info();
            }
        }

        /* Editor operations */
        $scope.hideEditor = function () {
            annotator.onEditorHide();
        }

        $scope.submitEditor = function () {
            var tags = $scope.tags;
            var newTags = [];
            for (var i = 0; i < tags.length; i++) {
                newTags.push(tags[i].name);
            }
            $scope.annotationModalData.tags = newTags;
            annotator.publish('annotationEditorSubmit', [annotator.editor, $scope.annotationModalData]);
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
            angular.element(document.getElementById('theView')).scope().tags = newTags;
            $scope.annotationModalDataVerse = Math.floor(annotation.verseId / 1000) + ":" + annotation.verseId % 1000;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $('#annotationModal').modal('show');
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
            $scope.$apply();
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
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
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

        }
        $scope.deleteAnnotation = function (index) {
            if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
                index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
            }
            annotator.deleteAnnotation($scope.annotations[index]);
        }

        $scope.loggedIn = false;
        $scope.checkUserLoginStatus();
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

        $scope.getAnnotationIndexFromFilteredAnnotationIndex = function (filteredAnnotationIndex) {
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
        }

        $scope.scrollToElement = function (elementId) {
            var destination = angular.element(document.getElementById(elementId));
            $document.scrollToElement(destination, 30, 1000);
        }

    });

function list_fn(id) {
    angular.element(document.getElementById('MainCtrl')).scope().list_footnotes(id);
}

function sidebarInit() {
    $('.cd-btn').on('click', function (event) {
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
    });
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });
}

function openPanel() {
    $('.cd-panel').addClass('is-visible');
}
function closePanel() {
    $('.cd-panel').removeClass('is-visible');
}

