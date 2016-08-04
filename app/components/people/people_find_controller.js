angular.module('ionicApp')
    .controller('PeopleFindCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService, $ionicModal) {
       
        var value = [];
        var select_circle;
        $scope.visible_hidden = true;
        $scope.checkUserLoginStatus();
        $scope.recommendations = [];
        $scope.fb_friends =[];


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
                value.push({'people_id': people_id, 'status': status, 'drm' : status, 'kisid' : people_id});
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
                $scope.cevreadlar = circles;
           });
       
       //Peoples add    
           $scope.cevreadd = function (the_circle_select) 
           { select_circle = the_circle_select; };
        
                $scope.peoples_add_circle = function () {

            for (var i = 0; i < value.length; i++) {
                var status = value[i].status;
                var the_people_id = value[i].people_id;

                if (!config_data.isMobile){
                    var close = document.getElementById(the_people_id);
                    close.checked = false;
                }

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
                        $scope.fetchUserRecommendations();
                    });

                }
            }

            value.length = 0;
            $scope.visible_hidden = true;

        };

        $scope.kisilistele = function (kisiad) {
            var kisilisteRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = kisiad;
            kisilisteRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token}).then(function (userliste) {
                $scope.kisiliste = userliste;
            });

        };

        $scope.inviteFriends= function(){
            var options = {
                method: "apprequests",
                message: "Dosdoğru yolu BİRLİKTE bulmak için Kuran Çalışalım: http://kurancalis.com"
            };
            if (config_data.isNative){
                facebookConnectPlugin.showDialog(options, function(resp){
                    console.log("sucess : " + JSON.stringify(resp));
                });
            }else if (config_data.isMobile){
                FB.ui(options, function(resp){
                    console.log("sucess : " + JSON.stringify(resp));
                });
            }else {
                Facebook.ui(options);
            }
        };

        $scope.openModal = function (item, id){
            if (item == "circle_selection"){
                var values = id === undefined ? value : [{'kisid' : id, 'drm' : true}];
                $scope.$broadcast("add_user_to_circle", {callback:function(circle) {
                    if (id === undefined){
                        $scope.cevreadd(circle.id);
                        $scope.peoples_add_circle();
                        $scope.fb_friends.filter(function (item) {
                            $scope.people_add(item.fbId, false);
                            document.getElementById(item.fbId).children[0].children[0].checked = false;
                        });
                    }
                    $scope.closeModal("circle_selection");
                }, users: values});
                $scope.modal_circle_selection.show();
            };
        };

        $scope.closeModal = function (item){
            if (item == "circle_selection"){
                $scope.modal_circle_selection.hide();
            }
        };

        $scope.fetchUserRecommendations = function(){
            $scope.showProgress("fetchUserRecommendations");
            var userRestangular = Restangular.one("users/recommendations");
            $scope.recommendations = [];
            userRestangular.customGET("", {start:0,limit:10}, {'access_token': $scope.access_token}).then(function (data) {
                $scope.recommendations = data;
                $scope.hideProgress("fetchUserRecommendations");
            }, function (err){

            });
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

            //View friends
            var peopleRestangular = Restangular.one("users").all("friends");
            peopleRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (friends) {

                $scope.fb_friends = friends;
            });

            $scope.fetchUserRecommendations();
        };

        $scope.showProgress("fetchUserRecommendations");
        if($scope.access_token==null){
            $scope.$on("userInfoReady",$scope.init);
        }
        else{
            $scope.init();
        }
    });
    