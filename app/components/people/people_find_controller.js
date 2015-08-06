angular.module('ionicApp')
    .controller('PeopleFindCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService) {
       
       var value = [];
       var select_circle;
       $scope.visible_hidden = true;
        $scope.checkUserLoginStatus();
       
       //View friends
        var peopleRestangular = Restangular.one("users").all("friends");
            peopleRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (friends) {

                $scope.fb_friends = friends;
            });

        
        //Checkbox click
           $scope.people_add = function (people_id, status) {

            $scope.visible_hidden = true;

            var ekle = "1";

            for (var i = 0; i < value.length; i++) {
                if (people_id == value[i].people_id) {
                    value[i].status = status;
                    ekle = "0";
                    //break;
                }

                if (value[i].status == true) {
                    $scope.visible_hidden = false;
                }
            }

            if (ekle == "1") {
                value.push({'people_id': people_id, 'status': status});
                $scope.visible_hidden = false;
            }

        };
        
         $scope.other_circle = false;
         $scope.digercevremodal = function () {
         $scope.other_circle = !$scope.other_circle;
        };
        
        //View circles
           var view_circleRestangular = Restangular.all("circles");
            view_circleRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (circles) {
                $scope.circle_name = circles;
           });
       
       //Peoples add    
           $scope.cevreadd = function (the_circle_select) 
           { select_circle = the_circle_select; };
        
                $scope.peoples_add_circle = function () {

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
                    postData.push(encodeURIComponent("fb_user_id") + "=" + encodeURIComponent(jsonData));
                    var data = postData.join("&");
                    var people_addRestangular = Restangular.one("circles", select_circle).all("users").all("fbfriend");

                    people_addRestangular.customPOST(data, '', '', headers).then(function (added) {
                        
                    });

                }
            }

            value.length = 0;
            $scope.visible_hidden = true;

        };

        $scope.inviteFriends= function(){
            Facebook.ui({ method: 'apprequests',
                message: 'Dosdoğru yolu BİRLİKTE bulmak için Kuran Çalışalım: http://kurancalis.com'});

        }
    });
    