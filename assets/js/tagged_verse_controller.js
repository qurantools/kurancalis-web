angular.module('ionicApp')
    .controller('TaggedVerseCtrl', function ($scope, $timeout, Restangular, $location, $ionicModal, $ionicScrollDelegate,localStorageService, navigationManager) {

        $scope.taggedVerseCircles = [];
        $scope.taggedVerseUsers = [];
        $scope.verseTagContentAuthor = MAX_AUTHOR_MASK;
        $scope.targetVerseForTagContent = 0;
        $scope.verseTagContents = [];
        $scope.verseTagContentParams = [];
        $scope.verseId = 0;

        //mobile parameters
        $scope.taggedVerseCirclesForMobileSearch = [];
        $scope.taggedVerseUsersForMobileSearch = [];

        $scope.localStorageManager = new LocalStorageManager("tagged_verses",localStorageService,
            [
                {
                    name:"verseTagContentAuthor",
                    getter: null,
                    setter: null,
                    isExistInURL: false,
                    isBase64: false,
                    default: DIYANET_AUTHOR_ID

                }
            ]
        );

        console.log("TaggedVerseCtrl init");
        //Get verses of the tag from server
        $scope.loadVerseTagContent = function (verseTagContentParams, verseId) {
            $scope.showProgress("loadVerseTagContent");
            var verseTagContentRestangular = Restangular.all("translations");
            verseTagContentRestangular.customGET("", verseTagContentParams, {'access_token': $scope.access_token}).then(function (verseTagContent) {
                $scope.targetVerseForTagContent = verseId;
                $scope.verseTagContents = verseTagContent;
                $scope.scopeApply();

                if (config_data.isMobile){
                    $timeout(function() {
                        var delegate = _.filter($ionicScrollDelegate._instances, function(item){
                            return item.element.innerHTML.indexOf('tagged_verse_content') > -1;
                        })[0];
                        delegate.scrollTop();
                        $scope.hideProgress("loadVerseTagContent");
                    });
                }
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
            $scope.verseTagContentAuthor = item;
            $scope.updateVerseTagContent();
            $scope.localStorageManager.storeVariables($scope);
        };

        //reflects the scope parameters to URL
        $scope.displayAnnotationsWithTag = function () {
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
            };
            $location.path("/annotations/", false).search(parameters);
        };

        $scope.openModal = function (item){
            if (item == 'tagged_verse'){
                $scope.tagged_verse_modal.show();
            }else if (item == 'tagged_verse_detailed_search'){
                for (var i =0; i< $scope.taggedVerseCirclesForMobileSearch.length; i++){
                    $scope.taggedVerseCirclesForMobileSearch[i].selected = false;
                    for (var j = 0; j < $scope.taggedVerseCircles.length; j++){
                        if ($scope.taggedVerseCirclesForMobileSearch[i].id == $scope.taggedVerseCircles[j].id){
                            $scope.taggedVerseCirclesForMobileSearch[i].selected = true;
                            break;
                        }
                    }
                }
                $scope.taggedVerseUsersForMobileSearch = [];
                for (var i = 0; i < $scope.taggedVerseUsers.length; i++) {
                    $scope.taggedVerseUsersForMobileSearch.push($scope.taggedVerseUsers[i]);
                }
                $scope.tagged_verse_detailed_search.show();
            }else if (item == 'friendsearch'){
                $scope.modal_friend_search.show();
            }
        };

        $scope.closeModal = function (item){
            if (item == 'tagged_verse'){
                navigationManager.closeModal($scope.tagged_verse_modal);
            }else if (item == 'tagged_verse_detailed_search'){
                $scope.tagged_verse_detailed_search.hide();
            }else if (item == 'friendsearch'){
                $scope.taggedVerseUsersForMobileSearch = $scope.query_users;
                $scope.modal_friend_search.hide();
            }
        };

        $scope.taggedValues = function(tagList){
            var tagParameter = [];
            for (var i = 0; tagList && i < tagList.length; i++) {
                tagParameter[i] = tagList[i].name;
            }
            return tagParameter.join(',');
        };

        $scope.taggedVerseDetailedSearch = function(){
            $scope.taggedVerseCircles = [];
            for (var i = 0; i < $scope.taggedVerseCirclesForMobileSearch.length; i++) {
                if ($scope.taggedVerseCirclesForMobileSearch[i].selected){
                    $scope.taggedVerseCircles.push($scope.taggedVerseCirclesForMobileSearch[i]);
                }
            }
            $scope.taggedVerseUsers = [];
            for (var i = 0; i < $scope.taggedVerseUsersForMobileSearch.length; i++) {
                $scope.taggedVerseUsers.push($scope.taggedVerseUsersForMobileSearch[i]);
            }
            $scope.closeModal('tagged_verse_detailed_search');
            $scope.updateVerseTagContent();
        };

        $scope.initializeTaggedVerseController = function () {
            if (config_data.isMobile) {
                $ionicModal.fromTemplateUrl('components/partials/tagged_verse_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'tagged_verse_modal'
                }).then(function (modal) {
                    $scope.tagged_verse_modal = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/tagged_verse_detailed_search.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'tagged_verse_detailed_search'
                }).then(function (modal) {
                    $scope.tagged_verse_detailed_search = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/add_friend_to_search.html', {
                    scope: $scope,
                    //animation: 'slide-in-right',
                    //animation: 'slide-left-right',
                    animation: 'slide-in-up',
                    id: 'friendsearch'
                }).then(function (modal) {
                    $scope.modal_friend_search = modal
                });
            }


            $scope.localStorageManager.initializeScopeVariables($scope,{});

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
                $scope.taggedVerseCirclesForMobileSearch = $scope.extendedCirclesForSearch;
                for (var i =0; i< $scope.taggedVerseCirclesForMobileSearch.length; i++){
                    $scope.taggedVerseCirclesForMobileSearch[i].selected = false;
                    for (var j = 0; $scope.taggedVerseCircles != null && j < $scope.taggedVerseCircles.length; j++){
                        if ($scope.taggedVerseCirclesForMobileSearch[i].id == $scope.taggedVerseCircles[j].id){
                            $scope.taggedVerseCirclesForMobileSearch[i].selected = true;
                            break;
                        }
                    }
                }
                $scope.taggedVerseUsersForMobileSearch = [];
                for (var i =0; i< $scope.taggedVerseUsers.length; i++){
                    $scope.taggedVerseUsersForMobileSearch.push($scope.taggedVerseUsers[i]);
                }
                $scope.query_users = $scope.taggedVerseUsersForMobileSearch;

                if (isDefined(args.author)){
                    $scope.verseTagContentAuthor = args.author;
                    $scope.localStorageManager.storeVariables($scope);

                }

                $scope.goToVerseTag(args.verseId, args.tag);
                if (config_data.isMobile){
                    if (config_data.isMobile) {
                        navigationManager.openModal({
                            broadcastFunction : "tagged_verse_modal",
                            args : args,
                            modal: $scope.tagged_verse_modal
                        });
                    }
                }
            });
        };

        //initialization
        $scope.initializeTaggedVerseController();
    });