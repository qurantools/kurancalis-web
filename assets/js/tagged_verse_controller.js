angular.module('ionicApp')
    .controller('TaggedVerseCtrl', function ($scope, $timeout, Restangular, $location) {

        $scope.taggedVerseCircles = null;
        $scope.taggedVerseUsers = null;
        $scope.verseTagContentAuthor = MAX_AUTHOR_MASK;
        $scope.targetVerseForTagContent = 0;
        $scope.verseTagContents = [];
        $scope.verseTagContentParams = [];
        $scope.verseId = 0;

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
                $scope.verseId = verseId;
                $scope.verseTagContentParams.author = $scope.getSelectedVerseTagContentAuthor();
                //display all verse tags on all authors
                //$scope.verseTagContentParams.author = MAX_AUTHOR_MASK;
                $scope.verseTagContentParams.verse_tags = tag;

                $scope.verseTagContentParams.circles = $scope.getTagsWithCommaSeparated($scope.taggedVerseCircles);
                $scope.verseTagContentParams.users = $scope.getTagsWithCommaSeparated($scope.taggedVerseUsers);

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
            return $scope.verseTagContentAuthor;
        };

        $scope.verseTagContentAuthorUpdate = function (item) {
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
                circles: Base64.encode(JSON.stringify($scope.taggedVerseCircles)),
                users: Base64.encode(JSON.stringify($scope.taggedVerseUsers))

            }
            $location.path("/annotations/", false).search(parameters);
        };

        $scope.initializeTaggedVerseController = function () {
            $scope.$on('tagged_verse_modal', function(event, args) {
                if (isDefined(args.users) && args.users.length >= 0){
                    $scope.taggedVerseUsers = args.users;
                }else{
                    $scope.taggedVerseUsers = $scope.usersForSearch;
                }
                if (isDefined(args.circles) && args.circles.length >= 0){
                    $scope.taggedVerseCircles = args.circles;
                }else{
                    $scope.taggedVerseCircles = $scope.circlesForSearch;
                }
                if ($scope.verseTagContentAuthor == MAX_AUTHOR_MASK){
                    if (isDefined(args.author)){
                        $scope.verseTagContentAuthor = args.author;
                    }else{
                        $scope.verseTagContentAuthor = $scope.authors[0].id;
                    }
                }
                $scope.goToVerseTag(args.verseId, args.tag);
            });
        };

        //initialization
        $scope.initializeTaggedVerseController();
    });