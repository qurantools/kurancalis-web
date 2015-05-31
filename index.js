var requiredModules = ['ionic', 'ngResource', 'ngRoute', 'facebook', 'restangular', 'LocalStorageModule', 'ngTagsInput', 'duScroll', 'directives.showVerse', 'ui.select', 'myConfig', 'authorizationModule'];

if (config_data.isMobile) {
    var mobileModules = [];//'ionic'
    mobileModules.forEach(function (item) {
        requiredModules.push(item);
    });
}
var app = angular.module('ionicApp', requiredModules)
    .filter('to_trusted', ['$sce',
        function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])
    .filter('newLineAllowed', [
        function () {
            return function (text) {
                if (typeof text != 'undefined') {
                    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
                } else {
                    return '';
                }
            };
        }])
    .filter('with_footnote_link', [
        function () {
            return function (text, translation_id, author_id) {
                return text.replace(/\*+/g, "<a class='footnote_asterisk' href='javascript:angular.element(document.getElementById(\"theView\")).scope().list_footnotes(" + translation_id + "," + author_id + ")'>*</a>");
            };
        }])
    .filter('selectionFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    })
    .filter('mark_verse_annotation', [
        function () {
            return function (translation, annotation, markVerseAnnotations) {
                if (markVerseAnnotations == true) {
                    var startOffset = annotation.ranges[0].startOffset;
                    var endOffset = annotation.ranges[0].endOffset;

                    var newText =
                            translation.substring(0, startOffset) +
                            "<span class='annotator-hl a_hl_" + annotation.colour + "'>" +
                            translation.substring(startOffset, endOffset) +
                            "</span>" +
                            translation.substring(endOffset, translation.length)
                        ;
                    return newText;
                } else {
                    return translation;
                }
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
    }]).directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
if (config_data.isMobile == false) {
    //desktop version
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider) {
        RestangularProvider.setBaseUrl(config_data.webServiceUrl);
        localStorageServiceProvider.setStorageCookie(0, '/');
        //route
        $routeProvider
            .when('/chapter/:chapterId/author/:authorMask/verse/:verseNumber/', {
                controller: 'HomeCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false
            })
            .when('/annotations/', {
                controller: 'AnnotationsCtrl',
                templateUrl: 'app/components/annotations/annotationsView.html',
                reloadOnSearch: false
            })
            .when('/people/find_people/', {
                controller: 'PeopleFindCtrl',
                templateUrl: 'app/components/people/find_people.html',
                reloadOnSearch: false
            })
            .when('/people/people_have_you/', {
                controller: 'PeopleHaveYouCtrl',
                templateUrl: 'app/components/people/people_have_you.html',
                reloadOnSearch: false
            })
            .when('/people/circles/', {
                controller: 'PeopleCirclesCtrl',
                templateUrl: 'app/components/people/circles.html',
                reloadOnSearch: false
            })
            .when('/people/explore/', {
                controller: 'PeopleExploreCtrl',
                templateUrl: 'app/components/people/explore.html',
                reloadOnSearch: false
            })
            .when('/', {
                redirectTo: '/chapter/1/author/1040/verse/1/'
            })
            .when('/chapter/:chapterId/author/:authorMask/', {
                redirectTo: '/chapter/:chapterId/author/:authorMask/verse/1/'
            })
            .otherwise({
                redirectTo: '/'
            });

        //facebook
        FacebookProvider.init('295857580594128');

    });

} else {
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
        RestangularProvider.setBaseUrl(config_data.webServiceUrl);
        localStorageServiceProvider.setStorageCookie(0, '/');

        var locationHref = window.location.href;
        if (locationHref.indexOf('/m/') > -1) {
            //mobile version

            $stateProvider
                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "components/navigation/navigation.html"
                })
                .state('app.home', {
                    url: "/chapter/:chapterId/author/:authorMask/verse/:verseNumber/",
                    views: {
                        'appContent': {
                            templateUrl: "components/home/home.html",
                            controller: "MainCtrl"
                        }
                    }
                })
                .state('app.annotations', {
                    url: "/annotations",
                    views: {
                        'appContent': {
                            templateUrl: "components/annotations/all_annotations.html",
                            controller: "MainCtrl"
                        }
                    }
                })

            $urlRouterProvider.otherwise("/app/chapter/1/author/1040/verse/1/");
        } else {
            //mobile version is not ready
            $routeProvider
                .when('/', {
                    controller: 'MainCtrl',
                    templateUrl: 'app/components/home/mobile_on_development.html',
                    reloadOnSearch: false
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
        FacebookProvider.init('295857580594128');

    });

}

app.factory('ChapterVerses', function ($resource) {
    return $resource(config_data.webServiceUrl + '/chapters/:chapter_id/authors/:author_mask', {
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
    return $resource(config_data.webServiceUrl + '/translations/:id/footnotes', {
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
    return $resource(config_data.webServiceUrl + '/authors', {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}).factory('User', function ($resource) {

    return $resource(config_data.webServiceUrl + '/users',
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

    .controller('MainCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, authorization) {
        console.log("MainCtrl");

        //currentPage
        $scope.getCurrentPage = function () {
            var retcp = "";
            if ($location.path() == '/annotations/') {
                retcp = 'annotations';
            } else {
                retcp = 'home';
            }
            return retcp;
        }

        /* show verse */
//list of chapters
        $scope.chapters = [];
        var chaptersVersion = 2;
        var localChaptersVersion = localStorageService.get('chaptersVersion');

        if (localChaptersVersion == null || localChaptersVersion < chaptersVersion) {
            Restangular.all('chapters').getList().then(function (data) {
                $scope.chapters = data;
                localStorageService.set('chapters', data);
                localStorageService.set('chaptersVersion', chaptersVersion);
            });
        } else {
            $scope.chapters = localStorageService.get('chapters');
        }

        $scope.setSelectedChapter = function (selectedItem) {
            $scope.chapterSelected = selectedItem;
            $scope.chapter_id = selectedItem.id;
            $scope.setChapterId();
        }

//init chapter select box
        var chaptersLen = $scope.chapters.length;
        for (var chaptersIndex = 0; chaptersIndex < chaptersLen; chaptersIndex++) {
            if ($scope.chapters[chaptersIndex].id == $scope.chapter_id) {
                $scope.chapterSelected = $scope.chapters[chaptersIndex];
                break;
            }
        }

        $scope.showVerse = function (annotation) {
            $scope.showVerseData = {};
            Restangular.one('translations', annotation.translationId).get().then(function (translation) {
                $scope.markVerseAnnotations = true;
                $scope.showVerseData.annotationId = annotation.annotationId;
                $scope.showVerseData.data = translation;

            });
        }


        $scope.showVerseFromFootnote = function (chapterVerse, author, translationId) {

            $scope.showVerseData = {};
            $scope.showVerseData.data = {};
            var chapterAndVerse = seperateChapterAndVerse(chapterVerse);
            $scope.showVerseData.data.chapter = chapterAndVerse.chapter;
            $scope.showVerseData.data.verse = chapterAndVerse.verse;
            $scope.showVerseData.data.authorId = author;
            $scope.showVerseAtTranslation = translationId;
            $scope.showVerseByParameters('go');
            $(".showVerseData").show();

        }

        $scope.showVerseByParameters = function (action) {
            var showVerseRestangular = Restangular.all("translations");
            var showVerseParameters = [];
            if (action == 'next') {
                if ($scope.showVerseData.data.verse != ($scope.chapters[$scope.showVerseData.data.chapter - 1].verseCount)) {
                    $scope.showVerseData.data.verse++;
                } else {
                    $scope.showVerseData.data.chapter++;
                    $scope.showVerseData.data.verse = 0;
                }
            } else if (action == 'previous') {
                if ($scope.showVerseData.data.verse != 0) {
                    $scope.showVerseData.data.verse--;
                } else {
                    $scope.showVerseData.data.chapter--;
                    $scope.showVerseData.data.verse = $scope.chapters[$scope.showVerseData.data.chapter - 1].verseCount;
                }
            } else if (action == 'go') {

            }
            showVerseParameters.chapter = $scope.showVerseData.data.chapter;
            showVerseParameters.verse = $scope.showVerseData.data.verse;
            showVerseParameters = {
                chapter: $scope.showVerseData.data.chapter,
                verse: $scope.showVerseData.data.verse,
                author: $scope.showVerseData.data.authorId
            };
            showVerseRestangular.customGET("", showVerseParameters, {'access_token': authorization.getAccessToken()}).then(function (verse) {
                if (verse != "") {
                    $scope.markVerseAnnotations = false;
                    $scope.showVerseData.data = verse[0].translations[0];
                }
            });
        }
        /* end of show verse */


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

        /* init */
        $scope.sidebarActive = 0;
        $scope.tagSearchResult = [];
        $scope.searchText = "";


        //hide list of authors div
        $scope.showAuthorsList = false;

        //list the authors on page load
        $scope.list_authors();

        //selected authors
        $scope.selection = ["16", "32"];

        $scope.verseTagContentAuthor = $scope.selection[0];

        $scope.annotationSearchAuthorSelection = $scope.selection;


        // $scope.toggleSidebar();
        sidebarInit();
        $scope.editorSubmitted = 0;


        //selected authors
        $scope.setAuthors = function () {
            $scope.selection = [];
            for (var index in $scope.authorMap) {
                if ($scope.author_mask & $scope.authorMap[index].id) {
                    $scope.selection.push($scope.authorMap[index].id);
                }
            }
        }

        //toggle selection for an author id
        $scope.toggleSelection = function toggleSelection(author_id) {
            var idx = $scope.selection.indexOf(author_id);

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
            $scope.setAuthorMask();
            localStorageService.set('author_mask', $scope.author_mask);
        };


    });


function sidebarInit() {
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });
}

function openPanel() {
    $('#cd-panel-right').addClass('is-visible');
}
function closePanel() {
    $('#cd-panel-right').removeClass('is-visible');
}
function openLeftPanel() {
    $('#cd-panel-left').addClass('is-visible');
}
function closeLeftPanel() {
    $('#cd-panel-left').removeClass('is-visible');
}

function toggleLeftPanel() {
    if ($('#cd-panel-left').hasClass('is-visible')) {
        closeLeftPanel();
    } else {
        openLeftPanel();
    }
}

function verseTagClicked(elem) {
    var closeClick = false;
    if ($(elem).hasClass('btn-warning')) {
        angular.element(document.getElementById('theView')).scope().targetVerseForTagContent = -1;
        closeClick = true;
    }

    //disable previous active element
    $('.verse_tag.btn-warning').removeClass('btn-warning').removeClass('btn-sm').addClass("btn-info").addClass("btn-xs");

    //activate element
    if (!closeClick) {
        $(elem).addClass("btn-warning").addClass("btn-sm").removeClass('btn-info').removeClass('btn-xs');
    }
}

function seperateChapterAndVerse(data) {
    var ret = [];
    var seperator = data.indexOf(':');
    ret.chapter = data.substring(0, seperator);
    ret.verse = data.substring(seperator + 1, data.length);
    return ret;
}
