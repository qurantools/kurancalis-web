angular.module('ionicApp')
    .controller('TaggedVerseCtrl', function ($scope, $timeout, Restangular, $location) {

        //Get verses of the tag from server
        $scope.loadVerseTagContent = function (verseTagContentParams, verseId) {
            $scope.showProgress("loadVerseTagContent");
            var verseTagContentRestangular = Restangular.all("translations");
            verseTagContentRestangular.customGET("", verseTagContentParams, {'access_token': $scope.access_token}).then(function (verseTagContent) {
                $scope.targetVerseForTagContent = verseId;
                $scope.verseTagContents = verseTagContent;
                $scope.scopeApply();
                $scope.hideProgress("loadVerseTagContent")
            });
        };


        //Retrieve verses with the tag.
        $scope.goToVerseTag = function (verseId, tag) {
            if ($scope.targetVerseForTagContent != -1) {
                $scope.verseTagContentParams = [];
                $scope.verseTagContentParams.author = $scope.getSelectedVerseTagContentAuthor();
                //display all verse tags on all authors
                //$scope.verseTagContentParams.author = MAX_AUTHOR_MASK;
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
            if ($scope.activeVerseTagContentAuthor == "") {
                $scope.activeVerseTagContentAuthor = $scope.selection[0];
            }
            else if ($scope.detailedSearchAuthorSelection.indexOf($scope.activeVerseTagContentAuthor) == -1) {
                $scope.activeVerseTagContentAuthor = $scope.selection[0];
            }//get the first one if the previous author is not selected now


            return $scope.activeVerseTagContentAuthor;
        };

        $scope.verseTagContentAuthorUpdate = function (item) {
            $scope.activeVerseTagContentAuthor = item;
            $scope.verseTagContentAuthor = $scope.activeVerseTagContentAuthor; //comboda seciliyi degistiriyor
            $scope.updateVerseTagContent();
        };

        //reflects the scope parameters to URL
        $scope.displayAnnotationsWithTag = function (tag) {
            var parameters =
            {
                authorMask: MAX_AUTHOR_MASK,
                verseTags: $scope.verseTagContentParams.verse_tags,
                verseKeyword: "",
                ownAnnotations: true,
                orderby: "time",
                chapters: "",
                verses: "",
                circles: Base64.encode(JSON.stringify($scope.query_circles)),
                users: Base64.encode(JSON.stringify($scope.query_users))

            }
            $location.path("/annotations/", false).search(parameters);
        };

        $scope.initializeTaggedVerseController = function () {
            $scope.$on('tagged_verse_modal', function(event, args) {
                $scope.verseTagContents = {};
                $scope.goToVerseTag(args.verseId, args.tag);
            });
        };

        //initialization
        $scope.initializeTaggedVerseController();
    });