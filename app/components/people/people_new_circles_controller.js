var mymodal = angular.module('ionicApp')
    .controller('PeopleNewCirclesCtrl', function ($scope, Restangular) {

        $scope.createNewCircleCallBack = $scope.createNewCircleCallBack || function(cevre){};
        $scope.users = [];
        $scope.circle = {};

        $scope.kisiekcevre = function () {
            for (var i = 0; i < $scope.users.length; i++) {
                var drm = $scope.users[i].drm;
                var kisidsi = $scope.users[i].kisid;

                if (drm == true) {
                    var headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'access_token': $scope.access_token
                    };
                    var jsonData = kisidsi;
                    var postData = [];
                    postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
                    var data = postData.join("&");
                    var kisiekleRestangular = Restangular.one("circles", $scope.circle.id).all("users");
                    kisiekleRestangular.customPOST(data, '', '', headers).then(function (eklekisi) {
                    });
                }
            }
            $scope.createNewCircleCallBack($scope.circle);
        };

        $scope.toggleCircle = function (item) {
            $scope.circle = item;
        };

        $scope.initializePeopleCircles = function () {
            $scope.$on("add_user_to_circle", function(event, args){
                $scope.createNewCircleCallBack = args.callback;
                $scope.users = args.users;
            });
        };

        $scope.initializePeopleCircles();

    });