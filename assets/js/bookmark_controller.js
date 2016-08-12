angular.module('ionicApp')
    .controller('bookmarkController', function ($scope, Restangular, $sce, $compile) {

        console.log('bookmark ctrl');

        $scope.chapterinfo = "";
        $scope.verseinfo = "";
        $scope.bookmarkverseid = "";
        $scope.bookchaptername = "";

        $scope.bookmarks = [];
        $scope.bookmarksyellowverseID = "";
        $scope.bookmarksyellowchapter = "";
        $scope.bookmarksyellowchapterid = "";

        $scope.bookmarksgreenverseID = "";
        $scope.bookmarksgreenchapter = "";
        $scope.bookmarksgreenchapterid = "";

        $scope.bookmarksorangeverseID = "";
        $scope.bookmarksorangechapter = "";
        $scope.bookmarksorangechapterid = "";

        $scope.$on("openAddBookMarkModal", function (event, args) {

            var verseId = args.verseId;
            $scope.bookmarkParameters = {};
            $scope.bookmarkParameters.chapterinfo = Math.floor(verseId / 1000);
            $scope.bookmarkParameters.verseinfo = verseId % 1000;
            $scope.bookmarkParameters.bookmarkverseid = verseId;
            $scope.bookmarkverseid = verseId;
            $scope.bookmarkParameters.bookchaptername = $scope.chapters[$scope.bookmarkParameters.chapterinfo - 1].nameTr;
        });

        $scope.$on("searchBookMarkModal", function (event) {

            $scope.bookmark_search();
        });

        $scope.bookmark_search = function () {

            $scope.navbookmark = true;

            var bookmarkRestangular = Restangular.all("bookmarks");
            bookmarkRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {

                $scope.bookmarks = data;

                for (var i = 0; i < data.length; i++) {
                    if (data[i].color == "yellow") {
                        $scope.bookmarksyellowverseID = data[i].verseId;
                        $scope.bookmarksyellowchapter = $scope.chapters[(data[i].verseId / 1000 | 0) - 1].nameTr;

                        if ($scope.bookmarksyellowchapter != "") {
                            $scope.bookmarksyellowchapterid = Math.floor(data[i].verseId / 1000);
                            $scope.bookmarksyellowverseID = data[i].verseId % 1000;
                        }
                        else {
                            $scope.bookmarksyellowchapter = "Boş";
                        }
                    }
                    else if (data[i].color == "green") {
                        $scope.bookmarksgreenverseID = data[i].verseId;
                        $scope.bookmarksgreenchapter = $scope.chapters[(data[i].verseId / 1000 | 0) - 1].nameTr;

                        if ($scope.bookmarksgreenchapter != "") {
                            $scope.bookmarksgreenchapterid = Math.floor(data[i].verseId / 1000);
                            $scope.bookmarksgreenverseID = data[i].verseId % 1000;
                        }
                        else {
                            $scope.bookmarksgreenchapter = "Boş";
                        }
                    }
                    else if (data[i].color == "orange") {
                        $scope.bookmarksorangeverseID = data[i].verseId;
                        $scope.bookmarksorangechapter = $scope.chapters[(data[i].verseId / 1000 | 0) - 1].nameTr;

                        if ($scope.bookmarksorangechapter != "") {
                            $scope.bookmarksorangechapterid = Math.floor(data[i].verseId / 1000);
                            $scope.bookmarksorangeverseID = data[i].verseId % 1000;
                        }
                        else {
                            $scope.bookmarksorangechapter = "Boş";
                        }
                    }
                }

            });
        };

        $scope.bookmarksave = function (BookMarkcolour, BookMarkverseId) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            //var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("colour") + "=" + encodeURIComponent(BookMarkcolour));
            postData.push(encodeURIComponent("verseId") + "=" + encodeURIComponent(BookMarkverseId));

            var data = postData.join("&");

            var bookmarkRestangular = Restangular.one("bookmarks");
            bookmarkRestangular.customPOST(data, '', '', headers).then(function (data) {
                $scope.bookmark_search();
            });
        }

        $scope.gotoBookmark = function (chapterid, verseno) {

            $scope.goToVerseParameters.chapter.id = chapterid;
            $scope.goToVerseParameters.verse = verseno;
            $scope.goToVerse();
            //TODO

        };

        $scope.gotoYellowBookmark = function () {

            if ($scope.bookmarksyellowchapter == "") {
                alert("Ayraç kullanılmıyor");
            }
            else {
                $scope.gotoBookmark($scope.bookmarksyellowchapterid, $scope.bookmarksyellowverseID);
                if (config_data.isMobile) {
                    $scope.naviBookmarkModal.hide();
                }
            }
        };

        $scope.gotoGreenBookmark = function () {

            if ($scope.bookmarksgreenchapter == "") {
                alert("Ayraç kullanılmıyor");
            }
            else {
                $scope.gotoBookmark($scope.bookmarksgreenchapterid, $scope.bookmarksgreenverseID);
                if (config_data.isMobile) {
                    $scope.naviBookmarkModal.hide();
                }
            }
        };

        $scope.gotoOrangeBookmark = function () {

            if ($scope.bookmarksorangechapter == "") {
                alert("Ayraç kullanılmıyor");
            }
            else {
                $scope.gotoBookmark($scope.bookmarksorangechapterid, $scope.bookmarksorangeverseID);
                if (config_data.isMobile) {
                    $scope.naviBookmarkModal.hide();
                }
            }
        };

        $scope.$on("userInfoReady", function (event) {
            if($scope.chapters.length==0){
                $scope.prepareChapters($scope.bookmark_search);
            }
            else{
                $scope.bookmark_search();
            }
        });


    });
