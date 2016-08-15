var requiredModules = ['ionic', 'ngResource', 'ngRoute', 'facebook', 'restangular', 'LocalStorageModule', 'ngTagsInput', 'duScroll', 'directives.showVerse', 'directives.repeatCompleted', 'ui.select', 'myConfig', 'authorizationModule','djds4rce.angular-socialshare', 'ngSanitize', 'com.2fdevs.videogular','com.2fdevs.videogular.plugins.controls','com.2fdevs.videogular.plugins.overlayplay','com.2fdevs.videogular.plugins.poster', 'ngCordova','ui.tinymce', 'ui.bootstrap', 'ion-affix', 'infinite-scroll', 'ngCordova.plugins.appAvailability'];

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
                return text.replace(/\*+/g, "<button style='border:0;' class='label label-dipnot btn  btn-xs' onclick='angular.element(document.getElementById(\"theView\")).scope().list_footnotes(" + translation_id + "," + author_id + ")'>dipnot</button>");
            };
        }])
    .filter('with_detailed_footnote_link', [  //filter for footnotes on detailed verse page
        function () {
            return function (text, translation_id, author_id) {
                return text.replace(/\*+/g, "<button style='border:0;' class='label label-dipnot btn  btn-xs' onclick='angular.element(document.getElementById(\"detailedVerseModal\")).scope().list_detailed_footnotes(" + translation_id + "," + author_id + ")'>dipnot</button>");
            };
        }])
    .filter('with_next_link', [
        function () {
            return function (text, chapter_id, author_id, translation_id) {
                if(author_id!=262144){// if author isn't Hakkı Yılmaz
                    return text;
                }else { // Hakkı Yılmaz
                    var searchText='(Sonraki ';
                    var nextLinkPosition = text.indexOf(searchText);
                    if (nextLinkPosition == -1) {// translation doesn't have next link
                        return text;
                    } else {
                        var chapterVerse=text.substring(nextLinkPosition+searchText.length,text.length-1); //20:83
                        var chapterVerseParse=chapterVerse.split(":");
                        var chapterInLink=parseInt(chapterVerseParse[0]);
                        var verseInLink=parseInt(chapterVerseParse[1]);

                        var linkHref="";
                        if(chapter_id==chapterInLink){// if link will be in same page
                            var elementId='v_'+(chapterInLink*1000+verseInLink);
                            linkHref='javascript: angular.element(document.getElementById(\'theView\')).scope().scrollToElmnt(\''+elementId+'\');';
                        }else{
                            linkHref='javascript: angular.element(document.getElementById(\'theView\')).scope().showVerseFromFootnote(\''+chapterVerse+'\','+author_id+','+translation_id+');';
                        }
                        return text.substring(0,nextLinkPosition)+ ' (Sonraki ' + '<a href="'+linkHref+'">'+chapterVerse+'</a>)';
                    }
                }
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
                        if (typeof props[prop] != 'undefined') {
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        } else {
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
                //TODO: too much cpu consuming
                if (markVerseAnnotations == true && annotation.ranges[0] != undefined) {
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
    .filter('with_search_text', [
        function () {
            return function (text, searched_text) {
                var re = new RegExp('('+searched_text + ')', 'i');
                return text.replace(re, "<div style='color: red;background-color:yellow;display: inline-block;'>$1</div>");
            };
        }])
    .filter('display_comment', [
        function () {
            return function (str) {
                return str.split("\n").join("<br />");
            };
        }])
    .filter('time_in_string',[
        function(){
            return function (milis){
                var difference = new Date().getTime() - milis;
                if(difference < 0) {
                    difference = 0;
                }
                var minutes = Math.floor(difference / (1000 * 60));
                var hours = Math.floor(difference / (1000 * 60 * 60));
                var days = Math.floor(difference / (1000 * 60 * 60 * 24));
                if(days > 364){
                    return Math.floor(days/364 ) + " yıl";
                }else if (days > 30){
                    return Math.floor(days/30) + " ay";
                }else if (days >= 1){
                    return (days) + " gün";
                }else if (hours >= 1){
                    return (hours) + " sa";
                }else {
                    return minutes + " dk";
                }
            }
        }
    ])
    .run(function ($rootScope, $ionicPlatform, dataProvider,$ionicHistory) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                //cordova.plugins.Keyboard.disableScroll(true);

                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
                ionic.keyboard.disable();
            }
            if(config_data.isMobile && config_data.isNative ){

                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                    $rootScope.$broadcast('onlineNetworkConnection');
                });

                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    $rootScope.$broadcast('offlineNetworkConnection', networkState);
                });

                $ionicPlatform.registerBackButtonAction(function (event) {
                    $ionicHistory.goBack();
                }, 100);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            $rootScope.sqliteDbInit = false;
            dataProvider.initDB($rootScope);
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            if( typeof current.$$route !== "undefined"){
                $rootScope.pageTitle = current.$$route.pageTitle;
            }
        });

        /*var original = $location.path;
         $location.path = function (path, reload) {
         if (reload === false) {
         var lastRoute = $route.current;
         var un = $rootScope.$on('$locationChangeSuccess', function () {
         $route.current = lastRoute;
         un();
         });
         }
         return original.apply($location, [path]);
         };*/
    }).directive('ngEnter', function () {
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
    }).directive('imageCheck', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function() {
                    angular.element(this).attr("style", "display:none");
                });
            }
        }
        return fallbackSrc;
    });

if (config_data.isMobile == false) { //false
    //desktop version
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider, $httpProvider) {
        RestangularProvider.setBaseUrl(config_data.webServiceUrl);
        localStorageServiceProvider.setStorageCookie(0, '/');

        //route
        $routeProvider
            .when('/translations/', {
                controller: 'HomeCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Sureler'
            })
            .when('/annotations/', {
                controller: 'AnnotationsCtrl',
                templateUrl: 'app/components/annotations/annotationsView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Ayet Notları'
            })
            .when('/annotation/display/:annotationId/', {
                controller: 'AnnotationDisplayController',
                templateUrl: 'app/components/annotations/annotationDisplayView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Ayet Notu'
            })
            .when('/people/find_people/', {
                controller: 'PeopleFindCtrl',
                templateUrl: 'app/components/people/find_people.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Arkadaş Bul'
            })
            .when('/people/people_have_you/', {
                controller: 'PeopleHaveYouCtrl',
                templateUrl: 'app/components/people/people_have_you.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Seni Takip Eden Kişiler'
            })
            .when('/people/circles/', {
                controller: 'PeopleCirclesCtrl',
                templateUrl: 'app/components/people/circles.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Çevreler'
            })
            .when('/people/explore/', {
                controller: 'PeopleExploreCtrl',
                templateUrl: 'app/components/people/explore.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Arkadaş Bul'
            })
            .when('/inferences/', {
                controller: 'InferenceListController',
                templateUrl: 'app/components/inferences/inferencesListView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Çıkarım Notları'
            })
            .when('/inference/new/', {
                controller: 'InferenceEditController',
                templateUrl: 'app/components/inferences/inferenceEditView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Yeni Çıkarım Notu'
            })
            .when('/inference/edit/:inferenceId/', {
                controller: 'InferenceEditController',
                templateUrl: 'app/components/inferences/inferenceEditView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Çıkarım Notu Düzenle'
            })
            .when('/inference/display/:inferenceId/', {
                controller: 'InferenceDisplayController',
                templateUrl: 'app/components/inferences/inferenceDisplayView.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Çıkarım Notu'
            })
            .when('/search_translations/', {
                controller: 'SearchTranslationsController',
                templateUrl: 'app/components/search/translations.html',
                reloadOnSearch: false,
                pageTitle: 'Ayet Arama'
            })
            .when('/lists/verse', {
                controller: 'VerseListController',
                templateUrl: 'app/components/lists/verse_list.html',
                reloadOnSearch: false,
                pageTitle: 'Ayet Listelerim'
            })
            .when('/profile/user/', {
                controller: 'ProfileController',
                templateUrl: 'app/components/profile/friend.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Kullanıcı Profili'
            })
            .when('/profile/user/:friendName/', {
                controller: 'ProfileController',
                templateUrl: 'app/components/profile/friend.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Kullanıcı Profili'
            })
            .when('/profile/circle/', {
                controller: 'ProfileController',
                templateUrl: 'app/components/profile/circle.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Çevre Zaman Tüneli'
            })
            .when('/profile/circle/:circleId/', {
                controller: 'ProfileController',
                templateUrl: 'app/components/profile/circle.html',
                reloadOnSearch: false,
                pageTitle: 'Kuran Çalış - Çevre Zaman Tüneli'
            })
            .when('/', {
                redirectTo: '/translations/'
            })
            .when('/chapter/:chapter/author/:author/', {
                redirectTo: '/translations/?chapter=:chapter&verse=1&author=:author'
            })
            .when('/help/',{
                controller:'HelpController',
                templateUrl:'app/components/help/index.html',
                pageTitle: 'Kuran Çalış - Yardım'

            })
            .when('/help/about/',{
                controller:'HelpController',
                templateUrl:'app/components/help/about.html',
                pageTitle: 'Kuran Çalış - Hakkında'

            })
            //.when('/:chapter/:verse', {
            //    redirectTo: '/translations?chapter=:chapter&verse=:verse&author=1040'
            //})
            .otherwise({
                redirectTo: '/translations/'
            });

//        var $route = $routeProvider.$get[$routeProvider.$get.length-1]({$on:function(){}});
//        $route.routes['/:chapter/:verse'].regexp = /^\/(?:artist\/(\d+))$/

        //facebook
        FacebookProvider.init(config_data.FBAppID);
    });
} else {
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider, $httpProvider, $compileProvider) {
            console.log("mobile version");
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|qurantools):/);
            //redirect / to /m/www/
            var currentPath = window.location.pathname;
            if (currentPath == '/kurancalis-web/' || currentPath == '/') {
                var diyezIndex =  window.location.href.indexOf("#");
                var locationURL = "";
                if(diyezIndex!= -1){
                    locationURL = window.location.href.substring(diyezIndex);
                }
                var mobileURL = currentPath + 'm/www/'+ locationURL;
                console.log("Redirectiong to mobile version:" + mobileURL);
                window.location.href = mobileURL;
                $timeout(function(){},5000);
                return;
            }else {
                RestangularProvider.setBaseUrl(config_data.webServiceUrl);
                localStorageServiceProvider.setStorageCookie(0, '/');

                //route
                $routeProvider
                    .when('/translations/', {
                        controller: 'HomeCtrl',
                        templateUrl: 'components/home/home.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Sure'
                    })
                    .when('/annotations/', {
                        controller: 'AnnotationsCtrl',
                        templateUrl: 'components/annotations/all_annotations.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Ayet Notları'
                    })
                    .when('/annotation/display/:annotationId/', {
                        controller: 'AnnotationDisplayController',
                        templateUrl: 'components/annotations/annotationDisplayView.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Ayet Notu'
                    })
                    .when('/chapter/:chapter/author/:author/', {
                        redirectTo: '/translations/?chapter=:chapter&verse=1&author=:author',
                        pageTitle: 'Kuran Çalış'
                    })
                    .when('/inferences/', {
                        controller: 'InferenceListController',
                        templateUrl: 'components/inferences/inferenceListMobileView.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Çıkarım Notları'
                    })
                    .when('/inference/display/:inferenceId/', {
                        controller: 'InferenceDisplayController',
                        templateUrl: 'components/inferences/inferenceDisplayMobileView.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış'
                    })
                    .when('/inference/new/', {
                        controller: 'InferenceEditController',
                        templateUrl: 'components/inferences/inferenceEditMobileView.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Yeni Çıkarım Notu'
                    })
                    .when('/inference/edit/:inferenceId/', {
                        controller: 'InferenceEditController',
                        templateUrl: 'components/inferences/inferenceEditMobileView.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış'
                    })
                    .when('/help/',{
                        controller:'HelpController',
                        templateUrl:'components/help/index.html',
                        pageTitle: 'Kuran Çalış - Yardım'
                    })
                    .when('/help/about/',{
                        controller:'HelpController',
                        templateUrl:'components/help/about.html',
                        pageTitle: 'Kuran Çalış - Hakkında'

                    })
                    .when('/login/',{
                        controller:'LoginController',
                        templateUrl:'components/login/login.html',
                        pageTitle: 'Kuran Çalış - Giriş'
                    })
                    .when('/search_translations/', {
                        controller: 'SearchTranslationsController',
                        templateUrl: 'components/search/translations.html',
                        pageTitle: 'Ayet Arama'
                    })
                    .when('/people/home/', {
                        controller: 'PeopleFindCtrl',
                        templateUrl: 'components/people/index.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Kişiler'
                    })
                    .when('/people/find_people/', {
                        controller: 'PeopleFindCtrl',
                        templateUrl: 'components/people/find_people.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Facebook Arkadaşlarımı Bul'
                    })
                    .when('/people/search_people/', {
                        controller: 'friendSearchController',
                        templateUrl: 'components/people/search_people.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Arkadaş Bul'
                    })
                    .when('/people/people_have_you/', {
                        controller: 'PeopleHaveYouCtrl',
                        templateUrl: 'components/people/people_have_you.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Seni Takip Eden Kişiler'
                    })
                    .when('/people/circles/', {
                        controller: 'PeopleCirclesCtrl',
                        templateUrl: 'components/people/circles.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Çevreler'
                    })
                    .when('/people/peoples/:circleid/', {
                        controller: 'PeopleCirclesCtrl',
                        templateUrl: 'components/people/peoples.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Arkadaş Bul'
                    })
                    .when('/lists/verse/', {
                        controller: 'VerseListController',
                        templateUrl: 'components/lists/verse_lists.html',
                        reloadOnSearch: false,
                        pageTitle: 'Ayet Listelerim'
                    })
                    .when('/lists/verse/:listid/', {
                        controller: 'VerseListController',
                        templateUrl: 'components/lists/verses.html',
                        reloadOnSearch: false,
                        pageTitle: 'Ayet Listelerim'
                    })
                    .when('/profile/user/', {
                        controller: 'ProfileController',
                        templateUrl: 'components/profile/friend.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Kullanıcı Profili'
                    })
                    .when('/profile/user/:friendName/', {
                        controller: 'ProfileController',
                        templateUrl: 'components/profile/friend.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Kullanıcı Profili'
                    })
                    .when('/profile/circle/', {
                        controller: 'ProfileController',
                        templateUrl: 'components/profile/circle.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Çevre Zaman Tüneli'
                    })
                    .when('/profile/circle/:circleId/', {
                        controller: 'ProfileController',
                        templateUrl: 'components/profile/circle.html',
                        reloadOnSearch: false,
                        pageTitle: 'Kuran Çalış - Çevre Zaman Tüneli'
                    })
                    .when('/', {
                        redirectTo: '/translations/',
                        pageTitle: 'Kuran Çalış'
                    })
                    .otherwise({
                        redirectTo: '/translations/',
                        pageTitle: 'Kuran Çalış'
                    });
            }
            /*
             $ionicAppProvider.identify({
             // The App ID (from apps.ionic.io) for the server
             app_id: '30f3e1ed',
             // The public API key all services will use for this app
             api_key: 'fc14493a35cb42bd3f7dab2b09071ea96a03ad62b5d55770',
             // The GCM project ID (project number) from your Google Developer Console (un-comment if used)
             // gcm_id: 'YOUR_GCM_ID'
             });
             */
            FacebookProvider.init(config_data.FBAppID);
        }
    );
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
}).controller('MainCtrl', function ($scope, $q, $routeParams, $ionicSideMenuDelegate, $location, $timeout, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, $ionicLoading, authorization,$rootScope, $ionicPopup, dataProvider, $cordovaAppAvailability) {
    console.log("MainCtrl");

    //all root scope parameters should be defined and documented here
    $scope.access_token = null;
    $scope.loggedIn = false;
    $scope.verseTagsJSON = {};
    $scope.chapter_id = 1;
    $scope.chapters = [];
    $scope.chapterSelected = 1;
    $scope.currentPage = "";
    var chaptersVersion = 4;
    $scope.modal_editor = null;

    $scope.circleDropdownArray = [];

    //selected authors
    $scope.selection = ["16", "32"];
    $scope.verseTagContentAuthor = $scope.selection[0];
    $scope.activeVerseTagContentAuthor = "";
    //$scope.authorMap = new Object();
    $scope.authorMap = [];
    $scope.authors= [];

    /* facebook login */

    $scope.fbLoginStatus = 'disconnected';
    $scope.facebookIsReady = false;

    //editor model
    $scope.annotationModalData = {};
    $scope.annotationModalDataTagsInput = [];
    $scope.annotationModalDataVerse = "0:0";
    $scope.ViewCircles = [];
    $scope.ViewUsers = [];
    $scope.yrmcevres = [];
    $scope.yrmkisis = [];

    //share modal
    $scope.shareText = "";
    $scope.shareUrl = "";
    $scope.shareTitle = "";

    $scope.user = null;
    $scope.isConnected= true;
    $scope.modal_editor = null;
    $scope.author_mask = 8208;
    $scope.author_hakki_yilmaz = 262144;
    $scope.authorMaskCheckPoint = $scope.author_mask;

    $scope.verse = {};
    $scope.annotations = [];

    $scope.tagSearchResult = [];

    $scope.filterTags = [];

    $scope.verseTags = [];

    $scope.verseTagsJSON = [];
    $scope.editorSubmitted = 0;
    $scope.verseTagContents = [];


    //go to chapter / verse parameters for header display
    $scope.goToVerseParameters = {};
    $scope.goToVerseParameters.chapter = 1;
    $scope.goToVerseParameters.verse = 0;

    //route variables
    $scope.myRoute = [];
    $scope.myRoute['tag'] = '';
    $scope.myRoute['tagAuthor'] = '';
    $scope.myRoute['targetVerse'] = '';
    $scope.targetVerseForTagContent = 0;

    //verse tags
    $scope.verseTagContentParams = [];
    $scope.targetVerseForTagContent = 0;


    $scope.selection = [];

    //hizli meal gosterimi - show verse
    $scope.showVerseData = {};
    $scope.markVerseAnnotations = true;
    $scope.showVerseAtTranslation = 0;

    //tutorial
    $scope.showTutorial = 0;
    $scope.tutorialCarouselActive = 0;


    /* side panel */
    $scope.sidebarActive = 0;
    $scope.tagSearchResult = [];
    $scope.searchText = "";

    //mobile
    $scope.annotationAddable = false;

    //hide list of authors div
    $scope.showAuthorsList = false;

    //Çevreleri listeleme - show circles
    $scope.extendedCircles = [];
    $scope.extendedCirclesForSearch = [];
    $scope.circleListsPromise=null;

    $scope.clickBlocking = false;

    //mobile: can View circle list for editor
    $scope.mobileAnnotationEditorCircleListForSelection = [];
    //mobile: circle list for detailed search
    $scope.mobileDetailedSearchCircleListForSelection = [];
    //mobile: circle list for all annotations search
    $scope.mobileAllAnnotationsSearchCircleListForSelection = [];
    $scope.query_users = [];

    $scope.internet_display_message = "";
    $scope.internet_display_show = false;
    $scope.internet_display_style = {"background-color": "orange"};

    $scope.verselists = [];

    $scope.cevreadlar = [];

    $scope.currentPageUrl = "";

    //Some Constants:
    $scope.CIRCLE_ALL_CIRCLES = {'id': '-2', 'name': 'Tüm Çevrelerim'};
    $scope.CIRCLE_PUBLIC={'id': '-1', 'name': 'Herkes'};


    $scope.checkAPIVersion = function(){
        var versionRestangular = Restangular.all("apiversioncompatibility");
        $scope.versionParams = [];
        $scope.versionParams.version = config_data.version;
        $scope.versionParams.platform = ionic.Platform.platform();
        versionRestangular.customGET("", $scope.versionParams, {}).then(function(data){
            if(data.message != "OK"){
                alert(data.message);
            }
        });
    };

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
    };

    $scope.setPageTitle= function(title){
        $rootScope.pageTitle = title;
    };

    //currentPage
    $scope.getCurrentPage = function () {
        var retcp = "";

        url = $location.path();
        if ( url == '/annotations/') {
            retcp = 'annotations';
        } else if ( url == "/people/circles/"){
            retcp = "people_circle";
        } else if ( url == "/people/people_have_you/"){
            retcp = "people_have_you";
        } else if ( url == "/people/find_people/"){
            retcp = "people_find";
        } else if ( url == "/people/explore/"){
            retcp = "people_explore";
        } else if ( url == "/search_translations/"){
            retcp = "search_translations";
        } else if ( url == "/lists/verse"){
            retcp = "verse_lists";
        } else if ( url.indexOf("/profile/user/") > -1){
            retcp = "profile_user";
        } else if ( url.indexOf("/profile/circle/") > -1){
            retcp = "profile_circle";
        } else {
            retcp = 'home';
        }

        return retcp;
    };


    /* auth */
    //general login.
    $scope.onFacebookLoginSuccess = function (responseData) {
        if (responseData.loggedIn == false) {
            $scope.loggedIn = false;
            $scope.logOut();
        } else {
            $scope.access_token = responseData.token;
            $scope.user = responseData.user;
            $scope.loggedIn = true;

            $scope.$broadcast('login', responseData);
            $scope.$broadcast('userInfoReady');
            console.log("location:"+$location.path() );
            if($location.path() == "/login/"){
                $location.path('/');
            }
        }
    };

    //general logout.
    $scope.onFacebookLogOutSuccess = function (responseData) {
        if (responseData.loggedOut == true) {

            $scope.verseTagsJSON = {};
            $scope.access_token = null;
            $scope.loggedIn = false;
            $scope.user = null;

            localStorageService.remove('chapter_view_parameters');
            localStorageService.remove('annotations_view_parameters');
            localStorageService.remove('annotations_parameters');
            localStorageService.remove('chapters');
            localStorageService.remove('chaptersVersion');
            localStorageService.remove('detailed_verse_parameters');
            localStorageService.remove('help_modal_tutorial_annotation');
            localStorageService.remove('help_modal_tutorial_chapter');
            localStorageService.remove('inference_display_view_parameters');
            localStorageService.remove('inferences_view_parameters');
            localStorageService.remove('tagged_verses_parameters');
            localStorageService.remove('verse_history_parameters');
            localStorageService.remove('verse_lists_parameters');


            $scope.$broadcast('logout', responseData);
            $location.path('/login');
        }
    };


    //sub page should write the its function if it needs custom login.
    $scope.login = function () { //new
        authorization.login($scope.onFacebookLoginSuccess);
    }

    $scope.logOut = function () { //new
        if($ionicSideMenuDelegate.isOpenLeft()){
            $ionicSideMenuDelegate.toggleLeft();
        }
        authorization.logOut($scope.onFacebookLogOutSuccess);
    };

    $scope.$watch(function () {
            return Facebook.isReady();
        }, function (newVal) {
            if (newVal) {
                $scope.facebookIsReady = true;
            }
        }
    );
    $scope.checkUserLoginStatus = function () {
        var access_token = authorization.getAccessToken(); //check from local storage
        if (access_token != null && access_token != "") {
            if($scope.access_token  == null){ //this means already logged in but just initializing or
                                                //mobile web facebook login with redirection.

            }
            $scope.get_user_info(access_token);


        }
        else {
            $scope.loggedIn = false;
            //do some cleaning
        }

        console.log("checkUserLoginStatus(may be pending verification):"+$scope.loggedIn);
        return $scope.loggedIn;
    };

    $scope.goToVerseParameters.setSelectedChapter = function (chapter) {
        $scope.goToVerseParameters.chapter = chapter;
    };


    //get user info

    $scope.get_user_info = function (system_access_token) {

        if($scope.user != null && $scope.loggedIn == true){
            return;
        }
        var usersRestangular = Restangular.all("users");
        //TODO: document knowhow: custom get with custom header
        usersRestangular.customGET("", {}, {'access_token': system_access_token}).then(function (user) {
                console.log("User info retrieved");
                if($scope.access_token == null){
                    $scope.access_token = system_access_token;
                    console.log("scope acces_token set");
                }
                if($scope.user == null){
                    $scope.user = user;
                    $scope.loggedIn = true;
                    $scope.$broadcast('userInfoReady');

                }
            },
            function(response) {
                console.error("Could not get user info");
                //var message =JSON.stringify(response, null, 4);
                //console.error(message);
                if( config_data.isNative){
                    if(navigator.network.connection.type == Connection.NONE) {
                        $ionicPopup.confirm({
                            title: "Internet Bağlantısı Yok",
                            content: "Internet baglantısı olmadığı için kullanıcı işlemleri yapılamayacaktır"
                        });

                    }
                    else{
                        console.error("There is connection but could not get user info");

                        if(response.status != 0 && response.data != null && response.data.code == "201"){
                            var infoPopup = $ionicPopup.alert({
                                title: 'Var olan oturumuzun süresi dolmuştur. Çıkış yapılıyor.',
                                template: '',
                                buttons: []
                            });
                            $timeout(function () {
                                infoPopup.close();
                                $scope.logOut();
                            }, 1700);
                        }
                        else{ //there is connection, it is logged in, retry every 2 secs.
                            $timeout(function () {
                                $scope.get_user_info(system_access_token);
                            }, 2000);

                        }
                    }
                }
                else {
                    console.log("Error occured while validating user login with status code", response.status);
                    var infoPopup = $ionicPopup.alert({
                        title: 'Var olan oturumuzun süresi dolmuştur. Çıkış yapılıyor.',
                        template: '',
                        buttons: []
                    });

                    $timeout(function () {
                        infoPopup.close();
                        $scope.logOut();
                    }, 1700);
                }
            }
        );
    };


    //     $scope.checkUserLoginStatus();
    /* end of facebook login */
    /* end of auth */


    $scope.initRoute = function () {

        if (typeof $routeParams.tag !== 'undefined') {
            $scope.myRoute['tag'] = $routeParams.tag;
        }
        if (typeof $routeParams.tagAuthor !== 'undefined') {
            $scope.myRoute['tagAuthor'] = $routeParams.tagAuthor;
        }
        if (typeof $routeParams.targetVerse !== 'undefined') {
            $scope.targetVerseForTagContent = $routeParams.targetVerse;
        }

    };


    $scope.getTagsWithCommaSeparated = function (tagList) {
        //prepare tags
        var tagParameter = [];

        for (var i = 0; i < tagList.length; i++) {
            tagParameter[i] = tagList[i].id;
        }
        return tagParameter.join(',');
    };

    $scope.getIdArrayFromCommaSeparated = function (tagList) {
        if(tagList.length==0){
            return [];
        } else{
            return tagList.split(',');
        }
    };

    $scope.getTagParametersForAnnotatorStore = function (canViewCircles, canCommentCircles, canViewUsers, canCommentUsers, tags) {
        //prepare tags
        var tagParameters = {};
        tagParameters.canViewCircles = [];
        tagParameters.canViewUsers = [];
        tagParameters.canCommentCircles = [];
        tagParameters.canCommentUsers = [];

        for (var i = 0; i < canViewCircles.length; i++) {
            tagParameters.canViewCircles[i] = canViewCircles[i].id;
        }

        for (var i = 0; i < canViewUsers.length; i++) {
            tagParameters.canViewUsers[i] = canViewUsers[i].id;
        }

        for (var i = 0; i < canCommentUsers.length; i++) {
            tagParameters.canCommentUsers[i] = canCommentUsers[i].id;
        }

        for (var i = 0; i < canCommentCircles.length; i++) {
            tagParameters.canCommentCircles[i] = canCommentCircles[i].id;
        }

        //the tags data should be in annotationModalDataTagInputs
        var jsTags = tags;

        if (typeof jsTags == 'undefined') {
            jsTags = [];
        }

        var newTags = [];
        for (var i = 0; i < jsTags.length; i++) {
            newTags.push(jsTags[i].name);
        }

        tagParameters.tags = newTags;

        return tagParameters;
    };

    $scope.showEditorModal = function (annotation, position, postCallback, cancelPostBack) {
        $timeout(function(){
            $scope.$broadcast("show_editor",{annotation: annotation, position:position, postCallback: postCallback, cancelPostBack : cancelPostBack});
        });
    };

    $scope.showAnnotationDeleteModal = function (index, postCallback) {
        $timeout(function(){
            $scope.$broadcast("show_delete_editor_modal",{index:index, postCallback: postCallback});
        });
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

    //go to chapter for general purpuse.
    $scope.goToChapter = function () {
        window.location.href = '#/chapter/' + $scope.chapter_id + '/author/' + $scope.author_mask + '/verse/' + $scope.verse.number;
    };

    $scope.goToChapterWithParameters = function (chapter_id, author_mask, verse_number) {
        $scope.chapter_id = chapter_id;
        $scope.author_mask = author_mask;
        $scope.verse.number = verse_number;
        $scope.goToChapter();

    };

    /*
     moved to homectrl
     $scope.editAnnotation = function (index) {
     console.log("$scope.filteredAnnotations:"+$scope.filteredAnnotations);
     if (typeof $scope.filteredAnnotations != 'undefined' && $scope.filteredAnnotations.length > 0) {
     index = $scope.getAnnotationIndexFromFilteredAnnotationIndex(index);
     }
     annotator.onEditAnnotation($scope.annotations[index]);
     annotator.updateAnnotation($scope.annotations[index]);
     }
     */


    $scope.getIndexOfArrayByElement = function (arr, k, v) {
        var arrLen = arr.length;
        var foundOnIndex = -1;
        for (var i = 0; i < arrLen; i++) {
            if (arr[i][k] == v) {
                foundOnIndex = i;
            }
        }
        return foundOnIndex;
    };


    $scope.scopeApply = function () {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    //Hizli Meal Gosterimi / Fast Translation Display
    $scope.showVerse = function (annotation) {
        $scope.showVerseData = {};
        dataProvider.fetchTranslationById(annotation.translationId, function (translation) {
            $scope.markVerseAnnotations = true;
            $scope.showVerseData.annotationId = annotation.annotationId;
            $scope.showVerseData.data = translation;

        });
    };

    $scope.showVerseDetail = function (chapterVerse, users, circles){
        $timeout(function(){
            $scope.$broadcast("open_verse_detail",{chapterVerse: chapterVerse, circles:circles, users:users});
        });
    };

    $scope.addVerseToVerseList = function (verse, closeModal){
        $timeout(function(){
            $scope.$broadcast("add_verse_to_verse_lists", {verse:verse, closeModal:closeModal});
        });
    };

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

    };

    $scope.showVerseByParameters = function (action) {

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

        var verseId = $scope.showVerseData.data.chapter * 1000 + parseInt($scope.showVerseData.data.verse);
        dataProvider.fetchTranslationByAuthorAndVerseId({authorId : $scope.showVerseData.data.authorId, verseId: verseId},function (translation) {
            if (translation != "") {
                $scope.markVerseAnnotations = false;
                $scope.showVerseData.data = translation;
            }
        });
    };
    /* end of show verse */

    //list authors
    $scope.list_authors = function () {
        $scope.authorMap = [];
        $scope.authors = [];
        dataProvider.listAuthors(function(data){
            $scope.authors = data;
            var arrayLength = data.length;
            for (var i = 0; i < arrayLength; i++) {
                $scope.authorMap[data[i].id] = data[i];
            }
            $scope.setAuthors($scope.author_mask);
            $scope.$broadcast("authorMap ready");
        });
    };

    //tags input auto complete function
    $scope.loadTags = function (query) {
        var tagsRestangular = Restangular.one('tags', query);
        return tagsRestangular.customGET("", {}, {'access_token': $scope.access_token});
    };

    //tags input auto complete
    $scope.cevrelistele = function () {
        return $scope.extendedCircles;
    };

    //tags input auto complete
    $scope.cevrelisteleForSearch = function () {

        return $scope.extendedCirclesForSearch;
    };

    $scope.initializeCircleLists = function () {

        Restangular.all("circles").customGET("", {}, {'access_token': $scope.access_token}).then(function (circleList) {

            $scope.cevreadlar = circleList;
            $scope.extendedCircles = [];
            $scope.extendedCircles.push($scope.CIRCLE_ALL_CIRCLES);
            $scope.extendedCircles.push($scope.CIRCLE_PUBLIC);

            $scope.extendedCirclesForSearch = [];
            $scope.extendedCirclesForSearch.push($scope.CIRCLE_ALL_CIRCLES);


            $scope.circleDropdownArray = [];
            $scope.circleDropdownArray.push($scope.CIRCLE_ALL_CIRCLES);
            $scope.circleDropdownArray.push({'id': '', 'name': 'Sadece Ben'});

            $scope.query_circle_dropdown = $scope.circleDropdownArray[1];
            Array.prototype.push.apply($scope.circleDropdownArray, circleList);

            //also initialize extended circles
            Array.prototype.push.apply($scope.extendedCircles, circleList);
            Array.prototype.push.apply($scope.extendedCirclesForSearch, circleList);

            // initialize mobileAnnotationEditorCircleListForSelection
            $scope.mobileAnnotationEditorCircleListForSelection=[];
            Array.prototype.push.apply($scope.mobileAnnotationEditorCircleListForSelection, $scope.extendedCircles);
            //add isSelected property for mobile.
            for (var index = 0; index < $scope.mobileAnnotationEditorCircleListForSelection.length; ++index) {
                $scope.mobileAnnotationEditorCircleListForSelection[index].selected=false;
            }

            // initialize mobileDetailedSearchCircleListForSelection
            $scope.mobileDetailedSearchCircleListForSelection=[];
            Array.prototype.push.apply($scope.mobileDetailedSearchCircleListForSelection, $scope.extendedCirclesForSearch);
            //add isSelected property for mobile.
            for (var index = 0; index < $scope.mobileDetailedSearchCircleListForSelection.length; ++index) {
                $scope.mobileDetailedSearchCircleListForSelection[index].selected=false;
            }

            // initialize mobileAllAnnotationsSearchCircleListForSelection
            $scope.mobileAllAnnotationsSearchCircleListForSelection=[];
            Array.prototype.push.apply($scope.mobileAllAnnotationsSearchCircleListForSelection, $scope.extendedCirclesForSearch);
            //add isSelected property for mobile.
            for (var index = 0; index < $scope.mobileAllAnnotationsSearchCircleListForSelection.length; ++index) {
                $scope.mobileAllAnnotationsSearchCircleListForSelection[index].selected=false;
            }

            $scope.mobileInferencesEditorCircleListForSelection = [];
            Array.prototype.push.apply($scope.mobileInferencesEditorCircleListForSelection, $scope.extendedCircles);
            //add isSelected property for mobile.
            for (var index = 0; index < $scope.mobileInferencesEditorCircleListForSelection.length; ++index) {
                $scope.mobileInferencesEditorCircleListForSelection[index].selected = false;
            }

            // initialize mobileAllInferencessSearchCircleListForSelection
            $scope.mobileAllInferencesSearchCircleListForSelection = [];
            Array.prototype.push.apply($scope.mobileAllInferencesSearchCircleListForSelection, $scope.extendedCirclesForSearch);
            //add isSelected property for mobile.
            for (var index = 0; index < $scope.mobileAllInferencesSearchCircleListForSelection.length; ++index) {
                $scope.mobileAllInferencesSearchCircleListForSelection[index].selected = false;
            }
            $scope.$broadcast("circleLists ready");

        },function(response){
            if(response.data==null) {
                $timeout(function () {
                    $scope.initializeCircleLists();
                }, 2000);
            }
        });
    };

    $scope.initializeVerseLists = function(){
        Restangular.all("verselists").customGET("", {}, {'access_token': $scope.access_token}).then(function (verselists) {
            $scope.verselists = verselists;
        });
    };

    //tags input auto complete
    $scope.kisilistele = function (kisiad) {
        var kisilisteRestangular = Restangular.all("users/search");
        $scope.usersParams = [];
        $scope.usersParams.search_query = kisiad;
        return kisilisteRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token});

    };

    //selected authors
    $scope.setAuthors = function (authorMask) {
        $scope.selection = [];
        for (var index in $scope.authorMap) {
            if (authorMask & $scope.authorMap[index].id) {
                $scope.selection.push($scope.authorMap[index].id);
            }
        }
    };

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
        //$scope.setAuthorMask();
        //localStorageService.set('author_mask', $scope.author_mask);
    };

    //go to chapter / verse from navigation header
    $scope.goToVerse = function () {
        $scope.query_chapter_id = $scope.goToVerseParameters.chapter.id ;
        $scope.verse.number = $scope.goToVerseParameters.verse;
        $scope.goToChapter();
    };

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

    $scope.goToURL = function(url){
        $location.path(url).search({});
        $scope.scopeApply();
        //$route.reload();
    };

    $scope.openAddBookMarkModal = function(verseId){
        $scope.$broadcast('openAddBookMarkModal', {verseId:verseId});
    };

    $scope.goToVerseTag = function (authorId, verseId, tag, users, circles) {
        var args= {verseId:verseId, tag:tag, circles:circles, users:users};
        if (authorId != 0){
            args.author = authorId+"";
        }
        $scope.$broadcast("tagged_verse_modal",args);
    };

    $scope.openVerseListForVerseSelection = function (callback, closeModal) {
        $scope.$broadcast("open_verse_for_verse_selection",{callback:callback, closeModal:closeModal});
    };

    $scope.openVerseHistory = function(author){
        $scope.$broadcast("open_verse_history",{author:author});
    };

    $scope.addVerseToHistory = function(verseId){
        $scope.$broadcast("add_verse_to_history",{verseId:verseId});
    };

    $scope.launchFromURL = function(url){
        //$scope.navigateTo(url);
        if (url.indexOf("?") > -1){
            var pureParam = url.substr(url.indexOf("?") + 1).split("&");
            var query_string = {};
            for (var i = 0; i < pureParam.length; i++){
                var pair = pureParam[i].split("=");
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
            $location.path(url.substr(0,url.indexOf("?"))).search(query_string);
        }else{
            $scope.navigateTo(url);
        }
        $scope.scopeApply();
    };

    $scope.prepareChapters= function (callbackFunction){
        //list of chapters
        $scope.chapters = [];

        var localChaptersVersion = localStorageService.get('chaptersVersion');
        var localChapters = localStorageService.get('chapters');

        if (localChaptersVersion == null || localChaptersVersion < chaptersVersion || localChapters == null) {
            dataProvider.listChapters(function (data) {
                $scope.chapters = data;
                localStorageService.set('chapters', data);
                localStorageService.set('chaptersVersion', chaptersVersion);
                if(callbackFunction != null){
                    callbackFunction();
                }
            });
        } else {
            $scope.chapters = localChapters;
            if(callbackFunction != null){
                callbackFunction();
            }
        }
    };

    $scope.initializeController = function () {
        $scope.checkAPIVersion();

        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.currentPage = $scope.getCurrentPage();
        });

        $scope.$on('onlineNetworkConnection', function() {
            $scope.internet_display_show = true;
            $scope.internet_display_style = {"background-color": "green"};
            $scope.internet_display_message = "Internet bağlantınız sağlandı.";
            $scope.isConnected= true;
            $timeout(function(){
                $scope.checkUserLoginStatus();
                $scope.internet_display_show = false;
            },2000);
        });

        $scope.$on('offlineNetworkConnection', function(message) {
            $scope.user = null;
            $scope.internet_display_show = true;
            $scope.internet_display_style = {"background-color": "orange"};
            $scope.internet_display_message = "Bağlantınız yok. Yapabileceğiniz işlemler kısıtlıdır.";
            $scope.isConnected= false;

        });

        if (config_data.isMobile) {
            $ionicModal.fromTemplateUrl('components/partials/editor_modal.html', {
                scope: $scope,
                animation: 'slide-in-left',
                id: 'editor'
            }).then(function (modal) {
                $scope.modal_editor = modal;
            });

            $scope.getModalEditor = function(){
                return $scope.modal_editor;
            };

            $ionicModal.fromTemplateUrl('components/partials/hakki_yilmaz_all_notes_modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
            }).then(function (modal) {
                $scope.hakki_yilmaz_modal = modal
            });

            $scope.openModal = function (id) {
                if (id == 'editor') {
                    $scope.modal_editor.show();
                } else if (id === 'hakki_yilmaz_notes'){
                    $scope.hakki_yilmaz_modal.show();
                }
            };

            $scope.closeModal = function (id) {
                $timeout(function() {

                    if (id == 'editor') {
                        clearTextSelection();
                        $scope.modal_editor.hide();
                    } else if (id === 'hakki_yilmaz_notes'){
                        $scope.hakki_yilmaz_modal.hide();
                    }
                },300);
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
        if ($location.path() == "/") {
            $scope.showTutorial = 1;
        }

        //list the authors on page load
        $scope.list_authors(); //prepare map


        // $scope.toggleSidebar();
        sidebarInit();

        $scope.prepareChapters();

        if ($scope.myRoute['tag'] != "") {
            $scope.goToVerseTag($scope.targetVerseForTagContent, $scope.myRoute['tag']);
        }

        //init chapter select box
        var chaptersLen = $scope.chapters.length;
        for (var chaptersIndex = 0; chaptersIndex < chaptersLen; chaptersIndex++) {
            if ($scope.chapters[chaptersIndex].id == $scope.chapter_id) {
                $scope.goToVerseParameters.chapter = $scope.chapters[chaptersIndex];
                break;
            }
        }

        $scope.$on('modal.shown', function(event, modal) {
            if(config_data.isMobile) {
                $timeout(function () {
                    $ionicScrollDelegate.$getByHandle(modal.id).scrollTop();
                });
            }
        });

        $scope.$on("userInfoReady",function(){
            //Show Circles - Kullanıcı login olduğunda çevre listesi çekilir.
            $scope.initializeCircleLists();
            $scope.initializeVerseLists();
        });


        $scope.checkUserLoginStatus();

    };//end of init controller


    $scope.checkGeneralTutorial = function () {
        var oldVersion=localStorageService.get("appVersion");
        var currentVersion = config_data.version;
        if(oldVersion!=currentVersion){
            localStorageService.set("appVersion",currentVersion);
            return true;
        }
        else{
            return false;
        }
    };


    $scope.isAllowUrlWithoutLogin = function(){
        var url = $location.path();
        if (url.indexOf('/inference/display/')>-1){
            return true;
        }
        return false;
    };

    $scope.navigateTo = function (target) {
        $location.path(target);
    };

    $scope.showProgress = function(operationName) {


        $scope.progressOperation=operationName;
        if(config_data.isMobile){
            $scope.clickBlocking = true;
            $ionicLoading.show({
                template: 'Yükleniyor...',
                delay:100,
                duration:1000
            });
        }
    };

    $scope.hideProgress = function(operationName){
        //hide only for started operation
        if(operationName == $scope.progressOperation) {
            if (config_data.isMobile) {
                $scope.clickBlocking = false;
                $ionicLoading.hide();
            }
        }
    };

    $scope.kopyala = function(url){
        var copyFrom = document.createElement("textarea");
        copyFrom.textContent = url;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        body.removeChild(copyFrom);
    };

    $scope.doVote = function(votable, resource, voteType) {
        if ($scope.user == null)
            return;
        var voteRestangular = Restangular.one(resource, votable.id).all("votes");
        //new vote or vote changed
        if (votable.vote == null || votable.vote.content != voteType) {
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var jsonData = voteType;
            var postData = [];
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData));
            var data = postData.join("&");
            voteRestangular.customPOST(data, '', '', headers).then(function (rates) {
                votable.vote = {'content' : voteType};
                votable.voteRates = rates;
            });
        }else {
            voteRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (rates) {
                votable.vote = null;
                votable.voteRates = rates;
            });
        }
    };

    $scope.doVoteForComment = function(votable, typeId, resource, voteType) {
        if ($scope.user == null)
            return;
        var voteRestangular = Restangular.one(resource, typeId).one("comments", votable.comment.id).all("votes");
        //new vote or vote changed
        if (votable.vote == null || votable.vote.content != voteType) {
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var jsonData = voteType;
            var postData = [];
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData));
            var data = postData.join("&");
            voteRestangular.customPOST(data, '', '', headers).then(function (rates) {
                votable.vote = {'content' : voteType};
                votable.voteRates = rates;
            });
        }else {
            voteRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (rates) {
                votable.vote = null;
                votable.voteRates = rates;
            });
        }
    };

    $scope.showVoteResults = function(votableObject, resource, isComment, resource_id){
        $timeout(function(){
            if ((votableObject.voteRates.like + votableObject.voteRates.dislike) < 1)
                return;
            $scope.$broadcast("show_vote_results", {voted:votableObject, resource:resource, isComment:isComment, resource_id:resource_id});
        });
    };



    $scope.addToStorageForFocus2Comment = function () {
        localStorageService.set('focus2comment', true);
    };

    $scope.focusToCommentArea = function(textarea){
        var param = localStorageService.get("focus2comment");
        if (param == null) {
            return;
        }
        $timeout(function () {
            var element = $("#"+textarea);
            element.focus();
            element.val(element.val()+'');
            localStorageService.remove('focus2comment');
        },600);
    };
    
    $scope.displayTutorial = function (id){
        console.log("Display tutorial called");
        $timeout(function(){
            console.log("Display tutorial broadcaast");
            $scope.$broadcast("displayTutorial",{id:id})
        },4000);
    };

    $scope.initRoute();

    //initialization
    if(config_data.isNative && !$scope.sqliteDbInit) {
        $scope.$on('db.init.finish', function() {
            $scope.initializeController();
        });
    }else{
        $scope.initializeController();
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
    document.getElementById("openbtn").style.border = "1px solid blue";
}
function closePanel() {
    $('#cd-panel-right').removeClass('is-visible');
    document.getElementById("openbtn").style.border = "none";
}
function togglePanel() {
    if ($('#cd-panel-right').hasClass('is-visible')) {
        closePanel();
    } else {
        openPanel();

    }
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
        //   angular.element(document.getElementById('MainCtrl')).scope().targetVerseForTagContent = -1;
        closeClick = true;
    }

    //disable previous active element
    $('.verse_tag.btn-warning').removeClass('btn-warning').removeClass('btn-sm').addClass("btn-info").addClass("btn-xs").removeClass('activeTag');


    //activate element
    if (!closeClick) {
        $(elem).addClass("btn-warning").addClass("activeTag").addClass("btn-sm").removeClass('btn-info').removeClass('btn-xs');
    }
}
function seperateChapterAndVerse(data) {
    var ret = [];
    var seperator = data.indexOf(':');
    ret.chapter = data.substring(0, seperator);
    ret.verse = data.substring(seperator + 1, data.length);
    return ret;
}
function clearTextSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}
function focusToVerseInput() {
    setTimeout(function () {
        document.getElementById('chapterSelection_verse').focus();
        document.getElementById('chapterSelection_verse').select();
    }, 600);
}
function focusToChapterInput() {
    setTimeout(function () {
        document.getElementById('chapterSelection_chapter').focus();
        document.getElementById('chapterSelection_chapter').select();
    }, 600);
}
function focusToInput(elementID) {
    setTimeout(function () {
        document.getElementById(elementID).focus();
        document.getElementById(elementID).select();
    }, 600);
}
