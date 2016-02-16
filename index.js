var requiredModules = ['ionic', 'ngResource', 'ngRoute', 'facebook', 'restangular', 'LocalStorageModule', 'ngTagsInput', 'duScroll', 'directives.showVerse', 'directives.repeatCompleted', 'ui.select', 'myConfig', 'authorizationModule','ui.tinymce','djds4rce.angular-socialshare', 'ngSanitize', 'com.2fdevs.videogular','com.2fdevs.videogular.plugins.controls','com.2fdevs.videogular.plugins.overlayplay','com.2fdevs.videogular.plugins.poster'];

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

    .run(['$route', '$rootScope', '$location', '$ionicPlatform', function ($route, $rootScope, $location, $ionicPlatform) {

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
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.pageTitle = current.$$route.pageTitle;
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


if (config_data.isMobile == false) { //false
    //desktop version
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider) {
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
                reloadOnSearch: false
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
    app.config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
            console.log("mobile version")


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

            }
            else {
                RestangularProvider.setBaseUrl(config_data.webServiceUrl);
                localStorageServiceProvider.setStorageCookie(0, '/');
                //route

                //route
                $routeProvider
                    .when('/translations/', {
                        controller: 'HomeCtrl',
                        templateUrl: 'components/home/home.html',
                        reloadOnSearch: false
                    })
                    .when('/annotations/', {
                        controller: 'AnnotationsCtrl',
                        templateUrl: 'components/annotations/all_annotations.html',
                        reloadOnSearch: false
                    })
                    .when('/', {
                        redirectTo: '/translations/'
                    })
                    .when('/chapter/:chapter/author/:author/', {
                        redirectTo: '/translations/?chapter=:chapter&verse=1&author=:author'
                    })
                    .when('/m_inference/', {
                        controller: 'InferenceListController',
                        templateUrl: 'components/inferences/inferenceListMobileView.html',
                        reloadOnSearch: false
                    })
                    .when('/m_inference/display/:inferenceId/', {
                        controller: 'InferenceDisplayController',
                        templateUrl: 'components/inferences/inferenceDisplayMobileView.html',
                        reloadOnSearch: false
                    })
                    .when('/m_inference/new/', {
                        controller: 'InferenceEditController',
                        templateUrl: 'components/inferences/inferenceEditMobileView.html',
                        reloadOnSearch: false
                    })
                    .when('/m_inference/edit/:inferenceId/', {
                        controller: 'InferenceEditController',
                        templateUrl: 'components/inferences/inferenceEditMobileView.html',
                        reloadOnSearch: false
					})
					.when('/help/',{
                        controller:'HelpController',
                        templateUrl:'components/help/index.html'
                    })
                    .otherwise({
                        redirectTo: '/translations/'
                    });


                openFB.init({appId: config_data.FBAppID});
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

    .controller('MainCtrl', function ($scope, $q, $routeParams, $ionicSideMenuDelegate, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService, $document, $filter, $rootScope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $ionicPosition, $ionicLoading, authorization,$rootScope) {
        console.log("MainCtrl");

        //all root scope parameters should be defined and documented here
        $scope.access_token = "";
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
        $scope.authorMap = new Object();

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

        //    $scope.user = null;

        $scope.modal_editor = null;
        $scope.author_mask = 1040;
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

        $scope.helpModalCarouselActive = 0;

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


        }

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

        $scope.help = function (parameter) {
            if (parameter == 'init') {
                $('#helpModal').modal('show');
            } else if (parameter == 'next') {
                $('#helpModalCarousel').carousel('next');
                $scope.helpModalCarouselActive++;
            } else if (parameter == 'previous') {
                $('#helpModalCarousel').carousel('prev');
                $scope.helpModalCarouselActive--;
            }
        }

        $scope.setPageTitle= function(title){
            $rootScope.pageTitle = title;
        }

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
            }
            else {
                retcp = 'home';
            }
            
            return retcp;
        }


        /* auth */
        //general login.
        $scope.onFacebookLoginSuccess = function (responseData) {
            if (responseData.loggedIn == false) {
                $scope.loggedIn = false;
                $scope.logOut();
            }
            else {
                $scope.access_token = responseData.token;
                $scope.user = responseData.user;
                $scope.loggedIn = true;

                $scope.initializeCircleLists();

                $scope.$broadcast('login', responseData);
                $scope.$broadcast('userInfoReady');
            }
        }


        //general logout.
        $scope.onFacebookLogOutSuccess = function (responseData) {
            if (responseData.loggedOut == true) {

                $scope.verseTagsJSON = {};
                $scope.access_token = "";
                $scope.loggedIn = false;
                $scope.user = null;

                localStorageService.remove('chapter_view_parameters');
                localStorageService.remove('annotations_view_parameters');
                $scope.$broadcast('logout', responseData);

                window.location.href = '#/';
            }
        }


        //sub page should write the its function if it needs custom login.
        $scope.login = function () { //new
            authorization.login($scope.onFacebookLoginSuccess);
        }

        $scope.logOut = function () { //new
            if($ionicSideMenuDelegate.isOpenLeft()){
                $ionicSideMenuDelegate.toggleLeft();
            }
            authorization.logOut($scope.onFacebookLogOutSuccess);

        }

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
                $scope.get_user_info();
                $scope.loggedIn = true;

                status = true;

                //Show Circles - Kullanıcı login olduğunda çevre listesi çekilir.
                $scope.initializeCircleLists();

            }
            else {
                $scope.loggedIn = false;
                //do some cleaning
            }

            return status;
        };

        $scope.goToVerseParameters.setSelectedChapter = function (chapter) {
            $scope.goToVerseParameters.chapter = chapter;
        };


        //get user info

        $scope.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;
                    $scope.$broadcast('userInfoReady');
                },
                function(response) {
                    console.log("Error occured while validating user login with status code", response.status);
                    $scope.logOut();
                }
            );
        }


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
            }
            else{
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

        //retrives the permissions of an annotation to scope variables
        $scope.restoreScopeAnnotationPermissions = function (annoid) {
            var cevregosterRestangular = Restangular.one("annotations", annoid).all("permissions");
            cevregosterRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (cevreliste) {


                //todo: replace locale "All circles" and "All users" for -2 and -1 circle ids
                var clis = [];

                for (var i = 0; i < cevreliste.canViewCircles.length; i++) {
                    clis.push({'id': cevreliste.canViewCircles[i].id, 'name': cevreliste.canViewCircles[i].name});

                }
                $scope.ViewCircles = clis;
                //do some special for mobile widget
                $scope.setMobileAnnotationEditorCircleListForSelection($scope.ViewCircles);

                var clis1 = [];
                for (var i = 0; i < cevreliste.canViewUsers.length; i++) {
                    clis1.push({'id': cevreliste.canViewUsers[i].id, 'name': cevreliste.canViewUsers[i].name});
                }

                $scope.ViewUsers = clis1;

                var clis2 = [];
                for (var i = 0; i < cevreliste.canCommentCircles.length; i++) {
                    clis2.push({
                        'id': cevreliste.canCommentCircles[i].id,
                        'name': cevreliste.canCommentCircles[i].name
                    });
                }

                $scope.yrmcevres = clis2;

                var clis3 = [];
                for (var i = 0; i < cevreliste.canCommentUsers.length; i++) {
                    clis3.push({'id': cevreliste.canCommentUsers[i].id, 'name': cevreliste.canCommentUsers[i].name});
                }

                $scope.yrmkisis = clis3;

            });
        };



        $scope.setMobileAnnotationEditorCircleListForSelection = function(circles){
            //reset mobileAnnotationEditorCircleListForSelection
            for (var checkboxIndex = 0; checkboxIndex < $scope.mobileAnnotationEditorCircleListForSelection.length; checkboxIndex++) {
                $scope.mobileAnnotationEditorCircleListForSelection[checkboxIndex].selected=false;
            }

            //prepare circle checkbox  list
            for( var circleIndex = 0; circleIndex < circles.length; circleIndex++){
                for (var checkboxIndex = 0; checkboxIndex < $scope.mobileAnnotationEditorCircleListForSelection.length; checkboxIndex++) {
                    if( circles[circleIndex].id == $scope.mobileAnnotationEditorCircleListForSelection[checkboxIndex].id ){
                        $scope.mobileAnnotationEditorCircleListForSelection[checkboxIndex].selected=true;
                    }
                }

            }
        };



        $scope.showEditor = function (annotation, position) {

            //debug for annotation start - end
            //this will be used after html structure change
            console.log(annotation.ranges[0].start);



            //prepare canView circles.
            if (typeof annotation.annotationId != 'undefined') {
                $scope.ViewCircles = [];
                $scope.ViewUsers = [];
                $scope.yrmcevres = [];
                $scope.yrmkisis = [];
                $scope.restoreScopeAnnotationPermissions(annotation.annotationId);
            }
            else {
                if ($scope.ViewCircles.length == 0 && $scope.ViewUsers.length == 0 && $scope.yrmcevres.length == 0 && $scope.yrmkisis.length == 0) {
                    //all empty //share to everyone by default

                    $scope.ViewCircles.push({'id': '-1', 'name': 'Herkes'});
                }
                else { //use previous values.

                }
                //do some special for mobile widget
                $scope.setMobileAnnotationEditorCircleListForSelection($scope.ViewCircles);
            }


            var newTags = [];

            //Volkan Ekledi.
            var cvrtags = [];
            if (typeof annotation.vcircles != 'undefined') {
                for (var i = 0; i < annotation.vcircles.length; i++) {
                    cvrtags.push({"id": annotation.vcircles[i]});

                }
            }
            //

            if (typeof annotation.tags != 'undefined') {
                for (var i = 0; i < annotation.tags.length; i++) {
                    newTags.push({"name": annotation.tags[i]});
                }
            }

            $scope.annotationModalData = annotation;
            $scope.annotationModalDataTagsInput = newTags;
            if (typeof $scope.annotationModalData.text == 'undefined') {
                $scope.annotationModalData.text = "";
            }
            //set default color
            if (typeof $scope.annotationModalData.colour == 'undefined') {
                $scope.annotationModalData.colour = 'yellow';
            }
            $scope.annotationModalDataVerse = Math.floor(annotation.verseId / 1000) + ":" + annotation.verseId % 1000;

            $scope.scopeApply();
            if (!config_data.isMobile) {
                $('#annotationModal').modal('show');

            } else {

                $scope.openModal('editor');
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
            Restangular.one('translations', annotation.translationId).get().then(function (translation) {
                $scope.markVerseAnnotations = true;
                $scope.showVerseData.annotationId = annotation.annotationId;
                $scope.showVerseData.data = translation;

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
            var showVerseRestangular = Restangular.one('authors', $scope.showVerseData.data.authorId)
                                                .one('verse', verseId);
            showVerseRestangular.get().then(function (translation) {
                if (translation != "") {
                    $scope.markVerseAnnotations = false;
                    $scope.showVerseData.data = translation;
                }
            });
        };
        /* end of show verse */


        //list authors
        $scope.list_authors = function () {
            $scope.authorMap = new Object();
            $scope.authors = ListAuthors.query(function (data) {
                var arrayLength = data.length;
                for (var i = 0; i < arrayLength; i++) {
                    $scope.authorMap[data[i].id] = data[i];
                    $scope.setAuthors($scope.author_mask);
                }
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

                $scope.extendedCircles = [];
                $scope.extendedCircles.push({'id': '-2', 'name': 'Tüm Çevrelerim'});
                $scope.extendedCircles.push({'id': '-1', 'name': 'Herkes'});

                $scope.extendedCirclesForSearch = [];
                $scope.extendedCirclesForSearch.push({'id': '-2', 'name': 'Tüm Çevrelerim'});


                $scope.circleDropdownArray = [];
                $scope.circleDropdownArray.push({'id': '-2', 'name': 'Tüm Çevrelerim'});
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

                $scope.$broadcast("circleLists ready");

            });

        }


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
        }


        $scope.initializeController = function () {

            $scope.checkAPIVersion();

            $scope.$on('$routeChangeStart', function(next, current) {
                $scope.currentPage = $scope.getCurrentPage();
            });

            if (config_data.isMobile) {

                $scope.setModalEditor= function(modal){
                    $scope.modal_editor = modal;
                };

                $scope.getModalEditor= function(){
                    return $scope.modal_editor;
                };

                $scope.openModal = function (id) {
                    if (id == 'editor') {
                        $scope.modal_editor.show();
                    }
                };

                $scope.closeModal = function (id) {
                    $timeout(function() {

                        if (id == 'editor') {
                            clearTextSelection();
                            $scope.modal_editor.hide();
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


            //list of chapters
            $scope.chapters = [];

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
            
        };//end of init controller


        $scope.showProgress = function(operationName) {


            $scope.progressOperation=operationName;
            if(config_data.isMobile){
                $scope.clickBlocking = true;
            /*    if (window.cordova && window.cordova.plugins){

                    SpinnerDialog.show("","",$scope.hideProgress);
                }
                else{*/
                    $ionicLoading.show({
                        template: 'Yükleniyor...',
                        delay:100,
                        duration:1000
                    });
                //}
            }
        };
        $scope.hideProgress = function(operationName){
            //hide only for started operation
            if(operationName == $scope.progressOperation) {
                if (config_data.isMobile) {
                    $scope.clickBlocking = false;
                    /*    if (window.cordova && window.cordova.plugins){

                     SpinnerDialog.hide();
                     }
                     else{*/
                    $ionicLoading.hide();
                    //}
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
        }

        //initialization

        //initialization
        $scope.initRoute();

        $scope.initializeController();


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