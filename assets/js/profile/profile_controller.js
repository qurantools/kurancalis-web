var mymodal = angular.module('ionicApp')
    .controller('ProfileController', function ($scope, $routeParams, Restangular, $timeout, $location, $ionicPopup, $ionicModal, $window, navigationManager, $translate) {

        $scope.friendName = "";
        $scope.circleId = -1;
        $scope.feeds = [];
        $scope.kisiliste = [];
        $scope.profiledUser = null;
        $scope.isLoading = false;
        $scope.select_circle = false;
        $scope.hasMoreData = false;
        $scope.selectedCircles = [];
        $scope.selectedUsers = [];
        $scope.recommendations = [];
        $scope.selectedUser;
        $scope.showImageText = false;
        $scope.isClickable=true;
        $scope.currentUser = { username : ""};
         var csec;

        $scope.fetchFriendFeeds = function(friendName, start){
            if ($scope.isLoading)
                return;
            $scope.isLoading = true;
            var feedRestangular = Restangular.one("feed/user/");
            $scope.feedParams = [];
            if (/^\d+$/.test(friendName)){
                $scope.feedParams.user_id = friendName;
            }else{
                $scope.feedParams.user_name = friendName;
            }
            $scope.feedParams.start = start;
            $scope.feedParams.limit = 10;
            $scope.feedParams.orderBy = "updated";
            feedRestangular.customGET("", $scope.feedParams, {'access_token': $scope.access_token}).then(function (data) {
                $scope.hasMoreData = data.length == 0 ? false : true;
                $scope.feeds = $scope.feeds.concat(data);
                console.warn($scope.feeds)
                $scope.isLoading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hideProgress("fetchFriendFeeds");
            }, function (err){
                $scope.isLoading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hideProgress("fetchFriendFeeds");
            });
        };

        $scope.fetchCircleFeeds = function(circleId, start){
            if ($scope.isLoading)
                return;
            $scope.isLoading = true;
            var feedRestangular = Restangular.one("feed/circle/"+ circleId);
            $scope.feedParams = [];
            $scope.feedParams.start = start;
            $scope.feedParams.limit = 10;
            $scope.feedParams.orderBy = "updated";
            feedRestangular.customGET("", $scope.feedParams, {'access_token': $scope.access_token}).then(function (data) {
                $scope.hasMoreData = data.length == 0 ? false : true;
                $scope.feeds = $scope.feeds.concat(data);
                $scope.isLoading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hideProgress("fetchCircleFeeds");
            }, function (err){
                $scope.isLoading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hideProgress("fetchCircleFeeds");
            });
        };

        $scope.fetchUserStatistics = function(friendName){
            var userRestangular = Restangular.one("users/statistics");
            $scope.userParams = [];
            if (/^\d+$/.test(friendName)){
                $scope.userParams.user_id = friendName;
            }else{
                $scope.userParams.user_name = friendName;
            }

            userRestangular.customGET("", $scope.userParams, {'access_token': $scope.access_token}).then(function (data) {
                $scope.profiledUser = data;
                console.log(data)

                if(!config_data.isMobile) {
                    if($scope.access_token==null || $scope.user==null) {
                        $scope.$on('userInfoReady', $scope.initFM);
                    }
                    else{
                        $timeout($scope.initFM,2000);
                    }
                }

                var userInfoDetailsRestangular = Restangular.all("circles");
                userInfoDetailsRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (circles) {
                    $scope.circle_name = circles;
                    $scope.cevreadlar = circles;
                });

            }, function (err){

            });
        };

        $scope.fetchUserRecommendations = function(){
            var limit =  config_data.isMobile ? 3 : 6;

            var userRestangular = Restangular.one("users/recommendations");
            $scope.recommendations = [];
            userRestangular.customGET("", {limit: limit}, {'access_token': $scope.access_token}).then(function (data) {
                $scope.recommendations = data;
            }, function (err){

            });
        };

        $scope.kisilistele = function(search){
            if (search == ""  || search.length < 3){
                $scope.kisiliste = [];
                return;
            }
            var kisilisteRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = search;
            kisilisteRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token}).then(function (userliste) {
                $scope.kisiliste = userliste;
            });
        };

        $scope.navigateToProfile = function (id){
            $location.path("/profile/user/"+id+"/");
        };

        $scope.redirectFacebookProfile = function(){
            $window.open(config_data.webAddress+"/fbredirect.php?id="+$scope.profiledUser.fbId, '_system');
        };

        $scope.showEditor = function(annotation){
            annotation.verseId = annotation.anno_verse_id;
            annotation.text = annotation.content;
            annotation.quote = annotation.anno_quote;
            annotation.translationId = annotation.anno_translation_id;
            annotation.translationVersion = 1;
            annotation.annotationId = annotation.id;
            $scope.showEditorModal(annotation, -1, $scope.updateAnnotation);
        };

        $scope.updateAnnotation = function (annotation) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("start") + "=" + encodeURIComponent(jsonData.ranges[0].start));
            postData.push(encodeURIComponent("end") + "=" + encodeURIComponent(jsonData.ranges[0].end));
            postData.push(encodeURIComponent("startOffset") + "=" + encodeURIComponent(jsonData.ranges[0].startOffset));
            postData.push(encodeURIComponent("endOffset") + "=" + encodeURIComponent(jsonData.ranges[0].endOffset));
            postData.push(encodeURIComponent("quote") + "=" + encodeURIComponent(jsonData.quote));
            // postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData.content));
            postData.push(encodeURIComponent("content") + "=" + encodeURIComponent(jsonData.text));
            postData.push(encodeURIComponent("colour") + "=" + encodeURIComponent(jsonData.colour));
            postData.push(encodeURIComponent("translationVersion") + "=" + encodeURIComponent(jsonData.translationVersion));
            postData.push(encodeURIComponent("translationId") + "=" + encodeURIComponent(jsonData.translationId));
            postData.push(encodeURIComponent("verseId") + "=" + encodeURIComponent(jsonData.verseId));
            var tags = jsonData.tags.join(",");
            postData.push(encodeURIComponent("tags") + "=" + encodeURIComponent(tags));

            var canViewCircles = jsonData.canViewCircles.join(",");
            postData.push(encodeURIComponent("canViewCircles") + "=" + encodeURIComponent(canViewCircles));

            var canViewUsers = jsonData.canViewUsers.join(",");
            postData.push(encodeURIComponent("canViewUsers") + "=" + encodeURIComponent(canViewUsers));

            var canCommentCircles = jsonData.canCommentCircles.join(",");
            postData.push(encodeURIComponent("canCommentCircles") + "=" + encodeURIComponent(canCommentCircles));

            var canCommentUsers = jsonData.canCommentUsers.join(",");
            postData.push(encodeURIComponent("canCommentUsers") + "=" + encodeURIComponent(canCommentUsers));

            var data = postData.join("&");
            var annotationRestangular = Restangular.one("annotations", jsonData.annotationId);
            annotationRestangular.customPUT(data, '', '', headers).then(function(data){
                annotation.content = data.text;
                annotation.colour = data.colour;
            });
        };

        $scope.updateUserPhoto = function (photoPath) {

            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var postData = [];
            var photoName = photoPath.substring(photoPath.lastIndexOf("/") + 1, photoPath.length);
            //console.log("photoName: ", photoName);

            postData.push(encodeURIComponent("photo") + "=" + encodeURIComponent(photoName));
            var data = postData.join("&");
            var userInfoRestangular = Restangular.one("users");
            userInfoRestangular.customPUT(data, '', '', headers).then(function(data){

                //update user profile image and profile image
                $scope.profiledUser.photo = photoPath;
                $scope.user.photo = photoPath;
            });
        };

        $scope.changeUserName = function () {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var postData = [];

            postData.push(encodeURIComponent("name") + "=" + encodeURIComponent($scope.currentUser.username));
            var data = postData.join("&");
            var userInfoRestangular = Restangular.one("users");
            userInfoRestangular.customPUT(data, '', '', headers).then(function(data){
                //update user name
                $scope.profiledUser.username = $scope.currentUser.username;
                $scope.user.name = $scope.currentUser.username;
            });
        }

        $scope.deleteAnnotation = function (annotation) {
            if (config_data.isMobile) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('Ayet Notu Sil'),
                    template: $translate.instant('Ayet notu silinecektir, onaylıyor musunuz?'),
                    cancelText: $translate.instant('VAZGEC'),
                    okText: $translate.instant('TAMAM'),
                    okType: 'button-assertive'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        var annotationRestangular = Restangular.one("annotations", annotation.id);
                        annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {
                            if (result.code == '200') {
                                var annotationIndex = $scope.getIndexOfArrayByElement($scope.feeds, 'id', annotation.id);
                                if (annotationIndex > -1) {
                                    $scope.feeds.splice(annotationIndex, 1);
                                }
                            }
                        });
                    } else {
                    }
                });
            }else{
                $scope.showAnnotationDeleteModal(annotation, $scope.mdeleteAnnotation);
            }
        };

        $scope.mdeleteAnnotation = function(annotation){
            var annotationRestangular = Restangular.one("annotations", annotation.id);
            annotationRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {
                if (result.code == '200') {
                    var annotationIndex = $scope.getIndexOfArrayByElement($scope.feeds, 'id', annotation.id);
                    if (annotationIndex > -1) {
                        $scope.feeds.splice(annotationIndex, 1);
                    }
                }
            });
        };

        $scope.profileCircleChanged = function(circle){
            $scope.selectedCircles = [];
            $scope.selectedCircles.push($scope.extendedCirclesForSearch[$scope.getIndexOfArrayByElement($scope.extendedCirclesForSearch, 'id', $scope.circleId)]);
            $location.path("/profile/circle/"+circle+"/");
        };

        $scope.loadMoreFriendsFeeds = function(){
            if ($scope.friendName == "")
                return;
            var lastItemDate = 0;
            if ($scope.feeds.length > 0){
                lastItemDate = $scope.feeds[$scope.feeds.length -1].updated / 1000;
            }
            $scope.fetchFriendFeeds($scope.friendName, lastItemDate);
        };

        $scope.loadMoreCirclesFeeds = function(){
            var lastItemDate = 0;
            if ($scope.feeds.length > 0){
                lastItemDate = $scope.feeds[$scope.feeds.length -1].updated / 1000;
            }
            $scope.fetchCircleFeeds($scope.circleId, lastItemDate);
        };

        $scope.othercircle = false;
        $scope.othercirclemodal = function (user_id) {
             $scope.othercircle = !$scope.othercircle
             $scope.selectedUser = user_id;
        };

        $scope.change_username = false;
        $scope.changeProfileName = function (user_id) {
            $scope.change_username = !$scope.change_username
        };

        $scope.cevreadd = function (csecim) {
             csec = csecim;
        };

          $scope.kisiekcevre = function () {

               var headers = {
                   'Content-Type': 'application/x-www-form-urlencoded',
                   'access_token': $scope.access_token
               };
               var jsonData = $scope.selectedUser;
               var postData = [];
               postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
               var data = postData.join("&");
               var kisiekleRestangular = Restangular.one("circles", csec).all("users");

               kisiekleRestangular.customPOST(data, '', '', headers).then(function (eklekisi) {
                    $scope.fetchUserRecommendations();
               });

           };

        $scope.showCircleSelectionModal = function(){
            if (config_data.isMobile){
                $scope.openModal("circle_selection");
            }else{
                $scope.select_circle = true;
            }
        };

        $scope.add_to_circle = function (circle) {
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var data = encodeURIComponent("user_id") + "=" + encodeURIComponent($scope.profiledUser.id);
            var kisiekleRestangular = Restangular.one("circles", circle).all("users");
            kisiekleRestangular.customPOST(data, '', '', headers).then(function (eklekisi) {
            }, function(error){
            });
        };

        $scope.openModal = function(id){
            if (id == 'friendsearch'){
                $scope.modal_friend_search.show();
            } else if (id == 'circle_selection'){
                $scope.$broadcast("add_user_to_circle", {callback:function(circle){
                    $scope.closeModal("circle_selection");
                }, users: [{'kisid': $scope.profiledUser.id, 'drm': true}]});
                $scope.modal_circle_selection.show();
            }
        };

        $scope.addRecommendationToCircle = function(user_id){
            $scope.$broadcast("add_user_to_circle", {callback:function(circle){
                $scope.closeModal("circle_selection");
                $scope.fetchUserRecommendations();
            }, users: [{'kisid': user_id, 'drm': true}]});
            $scope.modal_circle_selection.show();
        };

        //hide user from recommendations
        $scope.hideRecommendation = function(user_id){
            var recommendationRejectRestangular = Restangular.all("users/recommendations/hide");
            if (user_id > 0) {
                var headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'access_token': $scope.access_token
                };
                var postData = [];
                postData.push(encodeURIComponent("user_id") + "=" + user_id);
                var data = postData.join("&");
                recommendationRejectRestangular.customPOST(data, '', '', headers).then(function(response) {
                    $scope.fetchUserRecommendations();
                });
            }
        };

        $scope.closeModal = function(id){
            if (id == 'friendsearch'){
                if ($scope.query_users.length > 0){
                    $scope.navigateToProfile($scope.query_users[$scope.query_users.length-1].id);
                }
                $scope.modal_friend_search.hide();
            } else if (id == 'circle_selection'){
                $scope.modal_circle_selection.hide();
            }
        };

        $scope.openVerseDetail = function(verseId, userId, userName){
            $scope.showVerseDetail(verseId, [], $scope.selectedCircles);
        };

        $scope.doVoteInProfile = function (feed, content){
            var resources = "annotations";
            if (feed.study_type != 'annotation'){
                resources = "inferences";
            }
            $scope.doVote(feed, resources, content);
        };

        $scope.initializeProfileController = function () {
            //View circles
            var view_circleRestangular = Restangular.all("circles");
             view_circleRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (circles) {
                 $scope.circle_name = circles;
                 $scope.cevreadlar = circles;
                 $scope.csecim = "";
            });

            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/add_friend_to_search.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'friendsearch'
                }).then(function (modal) {
                    $scope.modal_friend_search = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/add_user_to_circle.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'circle_selection'
                }).then(function (modal) {
                    $scope.modal_circle_selection = modal
                });
            }
            navigationManager.reset();

            if (typeof $routeParams.friendName !== 'undefined') {
                $scope.friendName = $routeParams.friendName;
                $scope.showProgress("fetchFriendFeeds");
                $scope.fetchUserStatistics($scope.friendName);
                $scope.fetchFriendFeeds($scope.friendName, 0);
                return;
            }

            if (typeof $routeParams.circleId !== 'undefined') {
                $scope.circleId = $routeParams.circleId;
                $scope.circleListForTimeline = parseInt($scope.circleId);
                $scope.selectedCircles = [];
                $scope.$on("circleLists ready",function(){
                    $scope.selectedCircles.push($scope.extendedCirclesForSearch[$scope.getIndexOfArrayByElement($scope.extendedCirclesForSearch, 'id', $scope.circleId)]);
                });
                $scope.showProgress("fetchCircleFeeds");
                $scope.fetchUserRecommendations();
                $scope.fetchCircleFeeds($routeParams.circleId, 0);
                return;
            }

        };

        $scope.initFM = function(){

            initFileManager('theView', $scope.profiledUser.id, function () {

                refreshIntervalId = setInterval(function() {

                    if($('#profileImage').val()){
                        $scope.updateUserPhoto($('#profileImage').val());
                        clearInterval(refreshIntervalId);
                    }

                }, 100);
            });

        };

        if($scope.access_token==null){
            $scope.$on("userInfoReady",$scope.initializeProfileController);
        }
        else{
            $scope.initializeProfileController();
        }
    });

mymodal.directive('othercirclemodal', function () {
    return {
        templateUrl: 'app/components/partials/circle_digercevre.htm',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});

mymodal.directive('changeprofilename', function () {
    return {
        templateUrl: 'app/components/partials/update_profile.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});