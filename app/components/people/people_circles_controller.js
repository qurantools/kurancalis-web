var mymodal = angular.module('ionicApp')
    .controller('PeopleCirclesCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService, $window) {
        $scope.testData = "circles";
        
        $scope.showModal = false;
        $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
        };
        
        $scope.csil = false;
        $scope.csilModal = function(cevreadi, cid){
        $scope.csil = !$scope.csil;
        $scope.cevreadi=cevreadi;
        $scope.cid=cid;
        };
        
        $scope.cdegistir = false;
        $scope.cdegistirModal = function(cevreadi, cvrid){
        $scope.cdegistir = !$scope.cdegistir;
        $scope.cevredgsad=cevreadi;
        $scope.cvrid=cvrid;
        };
        
        $scope.doGreeting = function(cevread) {
        $window.alert(cevread);
        };
        
        
        $scope.cevrekle = function (cevread) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = cevread;
            var postData = [];
            postData.push(encodeURIComponent("name") + "=" + encodeURIComponent(jsonData));
            var data = postData.join("&");
            var cevreRestangular = Restangular.one("circles");
            
            var postDataL = [];
            cevreRestangular.customPOST(data, '', '', headers).then(function (circleUsers) {
                    $scope.cevreadlar = circleUsers;
                }
            );
            
        };
        
      $scope.cevresil = function (cid) {
            var silRestangular = Restangular.one("circles", cid);
            silRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {
            
            if (result.code == '200') {
            var cevrelerRestangular = Restangular.all("circles");
            cevrelerRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
            $scope.cevreadlar = cevreliste;
            });
               }
            });
        };
        
    $scope.cevredegistir = function (cvrid, cvrad) {    
    var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
    var jsonData = cvrad;
    var postData = [];
    postData.push(encodeURIComponent("name") + "=" + encodeURIComponent(jsonData));
    var data = postData.join("&");
    var degisRestangular = Restangular.all("circles", cvrid);
    degisRestangular.customPUT(data, '', '', headers).then(function (result) {
            
            if (result.code == '200') {
            var cevrelerRestangular = Restangular.all("circles");
            cevrelerRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
            $scope.cevreadlar = cevreliste;
            });
               }
            });
        };
        
    });
        
mymodal.directive('modal', function () {
    return {
      templateUrl: 'app/components/partials/circle_add.htm',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
  
  mymodal.directive('silmodal', function () {
    return {
      templateUrl: 'app/components/partials/circle_del.htm',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
  
  mymodal.directive('degistirmodal', function () {
    return {
      templateUrl: 'app/components/partials/circle_dgs.htm',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
   
