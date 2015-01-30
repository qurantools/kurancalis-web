
angular.module('ionicApp', ['ngResource','ngRoute']).filter('to_trusted', ['$sce',
    function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]).filter('with_footnote_link', [
    function() {
        return function(text, translation_id) {
            return text.replace("*", "<a class='footnote_asterisk' href='javascript:list_fn(" + translation_id + ")'>*</a");
        };
    }])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'MainCtrl',
                templateUrl:'app/components/home/homeView.html'
            })
            .when('/edit/:projectId', {
                controller:'EditCtrl',
                templateUrl:'detail.html'
            })
            .when('/new', {
                controller:'CreateCtrl',
                templateUrl:'detail.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    })
    .factory('ChapterVerses', function($resource) {
        return $resource('https://securewebserver.net/jetty/qt/rest/chapters/:chapter_id/authors/:author_mask', {
            chapter_id : '@chapter_id',
            author_mask : '@author_mask'
        }, {
            query : {
                method : 'GET',
                params : {
                    chapter_id : '@chapter_id',
                    author_mask : '@author_mask'
                },
                isArray : true
            },
            post : {
                method : 'POST'
            },
            update : {
                method : 'PUT'
            },
            remove : {
                method : 'DELETE'
            }
        });
    }).factory('Footnotes', function($resource) {
        return $resource('https://securewebserver.net/jetty/qt/rest/translations/:id/footnotes', {
            chapter_id : '@translation_id'
        }, {
            query : {
                method : 'GET',
                params : {
                    id : '@translation_id'
                },
                isArray : true
            },
            post : {
                method : 'POST'
            },
            update : {
                method : 'PUT'
            },
            remove : {
                method : 'DELETE'
            }
        });
    }).factory('ListAuthors', function($resource) {
        return $resource('https://securewebserver.net/jetty/qt/rest/authors', {
            query : {
                method : 'GET',
                isArray : true
            },
            post : {
                method : 'POST'
            },
            update : {
                method : 'PUT'
            },
            remove : {
                method : 'DELETE'
            }
        });
    }).controller('MainCtrl', function($scope, $q, ListAuthors, ChapterVerses, Footnotes) {

        //list translations
        $scope.list_translations = function() {
            $scope.verses = ChapterVerses.query({
                chapter_id : $scope.chapter_id,
                author_mask : $scope.author_mask
            });
        }
        //list authors
        $scope.list_authors = function() {
            $scope.authorMap = new Object();
            $scope.authors = ListAuthors.query(function(data) {
                var arrayLength = data.length;
                for (var i = 0; i < arrayLength; i++) {
                    $scope.authorMap[data[i].id] = data[i];
                }
            });
        }
        //list footnotes
        $scope.list_footnotes = function(translation_id) {

            $scope.footnotes = Footnotes.query({
                id : translation_id
            }, function(data) {
                var footnoteDivElement=document.getElementById('t_' + translation_id);
                //don't list if already listed
                if (!document.getElementById("fn_" + translation_id)) {
                    var html = "<div class='footnote' id='fn_" + translation_id+"'>";
                    var dataLength = data.length;
                    for ( index = 0; index < dataLength; ++index) {
                        html += "<div class='row'><div class='col-xs-1'>" + (index + 1) + "</div><div class='col-xs-11'>" + data[index] + "</div></div>";
                    }
                    html += '</div>';
                    footnoteDivElement.innerHTML = footnoteDivElement.innerHTML + html;
                }

            });

        }
        //selected authors
        $scope.setAuthors = function() {
            for (var index in $scope.authorMap) {
                if ($scope.author_mask & $scope.authorMap[index].id) {
                    $scope.selection.push($scope.authorMap[index].id);
                }
            }
        }
        /* init */
        //hide list of authors div
        $scope.showAuthorsList = false

        //list the authors on page load
        $scope.list_authors();

        //get author mask
        $scope.author_mask = 48;

        //selected authors
        $scope.selection = ["16", "32"];

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

    });

function list_fn(id) {
    angular.element(document.getElementById('MainCtrl')).scope().list_footnotes(id);
}