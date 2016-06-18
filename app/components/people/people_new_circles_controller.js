var mymodal = angular.module('ionicApp')
    .controller('PeopleNewCirclesCtrl', function ($scope, Restangular) {

        $scope.createNewCircleCallBack = $scope.createNewCircleCallBack || function(cevre){};
        $scope.users = [];
        $scope.circle = {};

        $scope.filteredCircles = [];
        $scope.newCircle = {};
        $scope.newCircle.name = "";

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

        $scope.filterCircles = function(circle){
            $scope.filteredCircles = $scope.cevreadlar.filter(function(item){
                return item.name.indexOf(circle) > -1;
            });
        };

        $scope.addCircle = function(newCircleForCreation){
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var data = encodeURIComponent("name") + "=" + encodeURIComponent(newCircleForCreation);

            Restangular.one("circles").customPOST(data, '', '', headers).then(function (circle) {
                $scope.cevreadlar.push({'user_count': '0', 'id': circle.id, 'name': circle.name});
                $scope.newCircle.name = "";
                $scope.filterCircles($scope.newCircle.name);
            });
        };

        $scope.initializePeopleCircles = function () {
            $scope.$on("add_user_to_circle", function(event, args){
                $scope.createNewCircleCallBack = args.callback;
                $scope.users = args.users;
                angular.copy($scope.cevreadlar, $scope.filteredCircles);
            });
        };

        $scope.initializePeopleCircles();

    });