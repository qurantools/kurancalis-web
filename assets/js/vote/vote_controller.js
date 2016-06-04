angular.module('ionicApp')
    .controller('VoteCtrl', function ($scope, Restangular, $ionicModal) {

        $scope.results = [];
        $scope.votedObject = null;
        $scope.resource = null;
        $scope.search = {};
        $scope.search.vote = -1;
        $scope.add2Circle = false;
        $scope.voter = null;
        $scope.circle = null;
        $scope.isComment = null;
        $scope.resource_id = null;

        $scope.fetchVoteResults = function() {
            var voteRestangular;
            if (!isDefined($scope.isComment)) {
                voteRestangular = Restangular.one($scope.resource, $scope.votedObject.id).all("votes");
            } else{
                voteRestangular = Restangular.one($scope.resource, $scope.resource_id).one('comments', $scope.votedObject.comment.id).all("votes");
            }
            voteRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data){
                $scope.results = data;
            });
        };

        $scope.voterFilter = function(actual){
            if ($scope.search.vote == -1)
                return true;
            return actual.vote == $scope.search.vote;
        };

        $scope.addUserToCircle = function(user){
            $scope.voter = user;
            if (!config_data.isMobile){
                $("#addUserToCircleModal").modal('show');
            }else{
                $scope.$broadcast("add_user_to_circle", {callback:function(circle){
                    $scope.closeModal("circle_selection");
                }, users: [{'kisid': user.user_id, 'drm': true}]});
                $scope.openModal('circle_selection');
            }
        };

        $scope.toggleCircle = function (item) {
            $scope.circle = item;
        };

        $scope.addUser2Circle = function(){
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'access_token': $scope.access_token
            };
            var jsonData = $scope.voter.user_id;
            var postData = [];
            postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
            var data = postData.join("&");
            var kisiekleRestangular = Restangular.one("circles", $scope.circle.id).all("users");
            kisiekleRestangular.customPOST(data, '', '', headers).then(function (eklekisi) {
            });
        };

        $scope.openModal = function (id) {
            if (id == 'vote_results'){
                $scope.modal_vote_results.show();
            }else if (id == 'circle_selection'){
                $scope.modal_circle_selection.show();
            }
        };

        $scope.closeModal = function (id) {
            if (id == 'vote_results'){
                $scope.modal_vote_results.hide();
            }else if (id == 'circle_selection'){
                $scope.modal_circle_selection.hide();
            }
        };

        $scope.initializeVoteController = function () {
            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/vote_results_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'vote_results'
                }).then(function (modal) {
                    $scope.modal_vote_results = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/add_user_to_circle.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'circle_selection'
                }).then(function (modal) {
                    $scope.modal_circle_selection = modal
                });
            };
            $scope.$on('show_vote_results', function(event, args) {
                $scope.votedObject = args.voted;
                $scope.resource = args.resource;
                $scope.isComment = args.isComment;
                $scope.resource_id = args.resource_id;
                $scope.search.vote = -1;
                $scope.results = [];
                $scope.fetchVoteResults();
                if (!config_data.isMobile){
                    $('#voteResultsModal').modal('show');
                }else{
                    $scope.openModal('vote_results');
                }
            });
        };

        $scope.initializeVoteController();
    });