angular.module('ionicApp', ['ngResource', 'ngRoute', 'facebook', 'restangular', 'LocalStorageModule'])
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
    }])
    .config(function ($routeProvider, FacebookProvider, RestangularProvider, localStorageServiceProvider) {
        RestangularProvider.setBaseUrl('https://securewebserver.net/jetty/qt/rest');
        localStorageServiceProvider.setStorageCookie(0, '/');
        //route
        $routeProvider
            .when('/', {
                controller: 'MainCtrl',
                templateUrl: 'app/components/home/homeView.html',
                reloadOnSearch: false
            })
            .when('/sure/:chapterId', {
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

    .controller('MainCtrl', function ($scope, $q, $routeParams, $location, $timeout, ListAuthors, ChapterVerses, User, Footnotes, Facebook, Restangular, localStorageService) {
        var chapterId = 1;
        if (typeof $routeParams.chapterId !== 'undefined') {
            chapterId = $routeParams.chapterId;
        }
        $scope.chapter_id = chapterId;

        //get user info
        $scope.get_user_info = function () {

            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (user) {
                    $scope.user = user;

                    /*
                     $scope.validation_response=user;
                     console.log(user)},function(error){
                     console.log(error);
                     */
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
                annotator.addPlugin( 'Store', {
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
        }

        //list translations
        $scope.list_translations = function () {
            $scope.verses = ChapterVerses.query({
                chapter_id: $scope.chapter_id,
                author_mask: $scope.author_mask
            });

            $timeout(function () {
                $scope.annotate_it()
            }, 2000);

        }
        //list authors
        $scope.list_authors = function () {
            $scope.authorMap = new Object();
            $scope.authors = ListAuthors.query(function (data) {
                var arrayLength = data.length;
                for (var i = 0; i < arrayLength; i++) {
                    $scope.authorMap[data[i].id] = data[i];
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

        /* init */
        //hide list of authors div
        $scope.showAuthorsList = false;

        //list the authors on page load
        $scope.list_authors();

        //get author mask
        $scope.author_mask = 48;

        //selected authors
        $scope.selection = ["16", "32"];


        $scope.list_translations();


        /* end of init */

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
        };

        //go to chapter
        $scope.goToChapter = function () {
            $location.path('/sure/' + $scope.chapter_id, false);
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

        }

        $scope.checkUserLoginStatus = function () {
            var access_token = $scope.get_access_token_cookie();
            if (access_token != null && access_token != "") {
                $scope.access_token = access_token;
                $scope.loggedIn = true;
                $scope.get_user_info();
            }
        }
        $scope.loggedIn = false;
        $scope.checkUserLoginStatus();
        /* end of login - access token */


    });

function list_fn(id) {
    angular.element(document.getElementById('MainCtrl')).scope().list_footnotes(id);
}
