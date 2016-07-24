angular.module('ionicApp')
    .controller('VerseHistoryCtrl', function ($scope, Restangular, $ionicModal,localStorageService,navigationManager) {

        $scope.history = [];
        $scope.authorOfHistory = null;
        $scope.isLoading = false;
        $scope.hasMoreData = false;

        $scope.localStorageManager = new LocalStorageManager("verse_history",localStorageService,
            [
                {
                    name:"authorOfHistory",
                    getter: null,
                    setter: null,
                    isExistInURL: false,
                    isBase64: false,
                    default: DIYANET_AUTHOR_ID

                }
            ]
        );

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
            $scope.fetchVerseHistory($scope.authorOfHistory, lastItemDate);
        };

        $scope.verseHistoryAuthorUpdate = function(author){
            $scope.history = [];
            $scope.fetchVerseHistory($scope.authorOfHistory, 0);
            $scope.localStorageManager.storeVariables($scope);
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


        $scope.closeModal = function(id){
            if (id == 'verse_history'){
                navigationManager.closeModal($scope.verse_history_modal);
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
                $scope.history = [];
                $scope.fetchVerseHistory($scope.authorOfHistory, 0);

                if (config_data.isMobile){
                    navigationManager.openModal({
                        broadcastFunction : "open_verse_history",
                        args : args,
                        modal: $scope.verse_history_modal
                    });
                }
            });

            $scope.$on('add_verse_to_history', function(event, args) {
                $scope.addVerseToHistory(args.verseId);
            });

            $scope.localStorageManager.initializeScopeVariables($scope,{});
        };

        $scope.initializeVerseHistoryController();
    });