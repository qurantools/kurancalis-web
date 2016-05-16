angular.module('ionicApp')
    .controller('VerseHistoryCtrl', function ($scope, Restangular, $ionicModal) {

        $scope.history = [];
        $scope.selectedAuthor = "8192";
        $scope.isLoading = false;
        $scope.hasMoreData = false;

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
                $scope.hasMoreData = data.length == 0 ? false : true;
                $scope.history = $scope.history.concat(data);
                $scope.isLoading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (err){
                $scope.isLoading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.loadMoreVerseHistory = function(){
            var lastItemDate = 0;
            if ($scope.history.length > 0){
                lastItemDate = $scope.history[$scope.history.length -1].visitDate / 1000;
            }
            $scope.fetchVerseHistory($scope.selectedAuthor, lastItemDate);
        };

        $scope.verseHistoryAuthorUpdate = function(author){
            $scope.history = [];
            $scope.selectedAuthor = author;
            $scope.fetchVerseHistory($scope.selectedAuthor, 0);
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

        $scope.openModal = function(id){
            if (id == 'verse_history'){
                $scope.verse_history_modal.show();
            }
        };

        $scope.closeModal = function(id){
            if (id == 'verse_history'){
                $scope.verse_history_modal.hide();
            }
        };

        $scope.initializeVerseHistoryController = function () {
            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/verse_history.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'verse_history_modal'
                }).then(function (modal) {
                    $scope.verse_history_modal = modal
                });
            }
            $scope.$on('open_verse_history', function(event, args) {
                var author = $scope.selectedAuthor;
                if (isDefined(args.author)){
                    author = args.author;
                }
                $scope.authorOfHistory = author;
                $scope.history = [];
                $scope.fetchVerseHistory(author, 0);

                if (config_data.isMobile){
                    $scope.openModal('verse_history');
                }
            });

            $scope.$on('add_verse_to_history', function(event, args) {
                $scope.addVerseToHistory(args.verseId);
            });
        };

        $scope.initializeVerseHistoryController();
    });