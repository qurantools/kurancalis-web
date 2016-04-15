/**
 * Created by oksuztepe on 30/10/15.
 */
angular.module('ionicApp')
    .controller('friendSearchController', function ($scope, Restangular, $location, $ionicModal) {

        $scope.friendSearchResult = [];
        $scope.peoplesearch = "";

        $scope.parentCloseModal = $scope.closeModal || function(item){};
        //People Add
        $scope.peopleaddlist = function (index) {

            var control = "0";
            for (var i = 0;  i < $scope.query_users.length; i++) {
                if ($scope.query_users[i].id == $scope.friendSearchResult[index].id) {
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.query_users.push($scope.friendSearchResult[index]);
            }
        };

        $scope.addUserToAllAnnotationsSearch = function (index) {

            var control = "0";
            console.log("fr");
            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                if ($scope.usersForSearch[i].id == $scope.friendSearchResult[index].id) {
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.usersForSearch.push($scope.friendSearchResult[index]);
            }
        };
        $scope.addUserToAllInferencesSearch = function (index) {

            var control = "0";
            console.log("fr");
            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                if ($scope.usersForSearch[i].id == $scope.friendSearchResult[index].id) {
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.usersForSearch.push($scope.friendSearchResult[index]);
            }
        };
        //People Search
        $scope.peoplelist = function (people) {

            if ((people != "") && (people.length > 2)) {
                var peoplelistRestangular = Restangular.all("users/search");
                $scope.usersParams = [];
                $scope.usersParams.search_query = people;
                peoplelistRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token}).then(function (userliste) {
                    $scope.friendSearchResult = userliste;
                });
            }
            else {
                $scope.friendSearchResult = [];
            }
        };

        $scope.clearfriendsearch = function () {
            $scope.peoplesearch = "";
            $scope.friendSearchResult = [];
        };
        //Add to annotation can view user permission list
        $scope.viewusersearchadd = function (index) {

            var found = false;

            for (var i = 0; i < $scope.ViewUsers.length; i++) {
                if ($scope.ViewUsers[i].id == $scope.friendSearchResult[index].id) {
                    found = true;
                }
            }

            if (found == false) {
                $scope.ViewUsers.push($scope.friendSearchResult[index]);
            }
        };

        $scope.openModal = function (item, userid){
            if (item == "circle_selection"){
                $scope.$broadcast("add_user_to_circle", {callback:function(circle){
                        $scope.closeModal("circle_selection");
                        $location.path("/people/home/");
                    }, users: [{'kisid': userid, 'drm': true}]});
                $scope.modal_circle_selection.show();
            }
        };

        $scope.closeModal = function (item){
            if (item == "circle_selection"){
                $scope.modal_circle_selection.hide();
            }else{
                $scope.parentCloseModal(item);
            }
        };

        $scope.init = function () {
            if (config_data.isMobile){
                    $ionicModal.fromTemplateUrl('components/partials/add_user_to_circle.html', {
                            scope: $scope,
                            animation: 'slide-in-up',
                            id: 'circle_selection'
                    }).then(function (modal) {
                            $scope.modal_circle_selection = modal
                    });
            };
        };

         $scope.init();
    });
