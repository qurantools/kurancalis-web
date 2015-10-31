/**
 * Created by oksuztepe on 30/10/15.
 */
angular.module('ionicApp')
    .controller('friendSearchController', function ($scope, Restangular) {

        $scope.friendSearchResult = [];
        $scope.peoplesearch = "";
        //People Add
        $scope.peopleaddlist = function (index) {

            var control = "0";

            for (var i = 0; i < $scope.query_users.length; i++) {
                if ($scope.query_users[i].id == $scope.friendSearchResult[index].id) {
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.query_users.push($scope.friendSearchResult[index]);
            }

        }

        $scope.addUserToAllAnnotationsSearch = function (index) {

            var control = "0";

            for (var i = 0; i < $scope.usersForSearch.length; i++) {
                if ($scope.usersForSearch[i].id == $scope.friendSearchResult[index].id) {
                    control = "1";
                }
            }

            if (control == "0") {
                $scope.usersForSearch.push($scope.friendSearchResult[index]);
            }

        }


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
        }
    });
