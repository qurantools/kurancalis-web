angular.module('ionicApp')
    .controller('PeopleHaveYouCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService) {
         var value = [];
       var csec;
       $scope.hidden_visible = true;
        $scope.checkUserLoginStatus();
        
        //View friends
        var peopleRestangular = Restangular.one("circles").all("followers");
            peopleRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (followers) {

                $scope.circle_friends = followers;
            });
            
            //Checkbox click
           $scope.add_people = function (people_id, status) {

            $scope.hidden_visible = true;

            var add = "1";

            for (var i = 0; i < value.length; i++) {
                if (people_id == value[i].people_id) {
                    value[i].status = status;
                    add = "0";
                    //break;
                }

                if (value[i].status == true) {
                    $scope.hidden_visible = false;
                }
            }

            if (add == "1") {
                value.push({'people_id': people_id, 'status': status});
                $scope.hidden_visible = false;
            }

        };
        
         $scope.other_circle = false;
         $scope.digercevremodal = function () {
         $scope.other_circle = !$scope.other_circle;
        };
        
        //View circles
           var view_circleRestangular = Restangular.all("circles");
            view_circleRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (circle_list) {
                $scope.circle_names = circle_list;
           });
           
           //Peoples add    
           $scope.add_circle = function (the_select_circle) 
           { select_circle = the_select_circle; };
        
                $scope.people_add_circle = function () {

            for (var i = 0; i < value.length; i++) {
                var status = value[i].status;
                var the_people_id = value[i].people_id;

                var close = document.getElementById(the_people_id);
                close.checked = false;

                if (status == true) {
                    var headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'access_token': $scope.access_token
                    };
                    var jsonData = the_people_id;
                    var postData = [];
                    postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
                    var data = postData.join("&");
                    var people_addRestangular = Restangular.one("circles", select_circle).all("users");

                    people_addRestangular.customPOST(data, '', '', headers).then(function (people_list) {
                        
                    });

                }
            }

            value.length = 0;
            $scope.hidden_visible = true;

        };
    });