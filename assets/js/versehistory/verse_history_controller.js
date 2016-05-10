angular.module('ionicApp')
    .controller('VerseHistoryCtrl', function ($scope, Restangular) {

        $scope.history = [];
        $scope.selectedAuthor = "8192";
        $scope.isLoading = false;

        $scope.fetchVerseHistory = function(author, start){
            if ($scope.isLoading)
                return;
            $scope.isLoading = true;
            var verseHistoryRestangular = Restangular.one("verse_visit");
            $scope.historyParams = [];
            $scope.historyParams.author = author;
            $scope.historyParams.start = start;
            $scope.historyParams.limit = 10;
            verseHistoryRestangular.customGET("", $scope.historyParams, {'access_token': $scope.access_token}).then(function (data) {
                $scope.history = $scope.history.concat(data);
                $scope.isLoading = false;
            }, function (err){
                $scope.isLoading = false;
            });
        };

        $scope.loadMoreVerseHistory = function(){
            var lastItemDate = Math.floor(Date.now() / 1000);
            if ($scope.history.length > 0){
                lastItemDate = $scope.history[$scope.history.length -1].visitDate / 1000;
            }
            $scope.fetchVerseHistory($scope.selectedAuthor, lastItemDate);
        };

        $scope.verseHistoryAuthorUpdate = function(author){
            $scope.history = [];
            $scope.selectedAuthor = author;
            $scope.fetchVerseHistory($scope.selectedAuthor, Math.floor(Date.now() / 1000));
        };

        $scope.addVerseToHistory = function(verseId){
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var verseHistoryRestangular = Restangular.one("verse_visit");
            verseHistoryRestangular.customPOST(encodeURIComponent("verse_id") + "=" + encodeURIComponent(verseId), '', '', headers).then(function (added) {

            });
        };

        $scope.initializeVerseHistoryController = function () {
            $scope.$on('open_verse_history', function(event, args) {
                var author = $scope.selectedAuthor;
                if (isDefined(args.author)){
                    author = args.author;
                }
                $scope.authorOfHistory = author;
                $scope.history = [];
                $scope.fetchVerseHistory(author, Math.floor(Date.now() / 1000));
            });

            $scope.$on('add_verse_to_history', function(event, args) {
                $scope.addVerseToHistory(args.verseId);
            });
        };

        $scope.initializeVerseHistoryController();
    });