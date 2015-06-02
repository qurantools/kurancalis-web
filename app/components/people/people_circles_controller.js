var mymodal = angular.module('ionicApp')
    .controller('PeopleCirclesCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService, $window) {
        $scope.testData = "circles";
        $scope.ackapakisi=true;
        $scope.ackapa=true;
        $scope.cevreadlar = cevregoster();
        
        var deger=[];
        var csec;
        
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
        
        $scope.kisieskle = false;
        $scope.kisieskleModal = function(){
        $scope.kisieskle = !$scope.kisieskle;
        };
        
        $scope.digercevre = false;
        $scope.digercevremodal = function(){
        $scope.digercevre = !$scope.digercevre;
        };
        
        $scope.kisisil = false;
        $scope.kisisilModal = function(){
        $scope.kisisil = !$scope.kisisil;
        };
        
        function cevregoster() { 
            var cevregosterRestangular = Restangular.all("circles");
            cevregosterRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
            $scope.cevreadlar = cevreliste;
            });            
        };
        
         cevregoster = function() { 
            var cevregosterRestangular = Restangular.all("circles");
            cevregosterRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
            $scope.cevreadlar = cevreliste;
            });            
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
            
            var cevrelerRestangular = Restangular.all("circles");
            cevrelerRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
            $scope.cevreadlar = cevreliste;
            cevreidyaz("", "");
            $scope.cevrekisiler=0;
            $scope.ackapa=true;
            $scope.ackapakisi=true;
            
            });
               
            });
        };
        
    $scope.cevredegistir = function (cvrid, cvrad) {    
    var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
    var jsonData = cvrad;
    var postData = [];
    postData.push(encodeURIComponent("name") + "=" + encodeURIComponent(jsonData));
    var data = postData.join("&");
    var degisRestangular = Restangular.one("circles", cvrid);
    degisRestangular.customPUT(data, '', '', headers).then(function (result) {
            
            cevreidyaz(cvrid, cvrad);
            cevregoster(); 
               
            });
        };
        
        $scope.kisilistele = function (kisiad) {
        var kisilisteRestangular = Restangular.all("users/search");
        $scope.usersParams = [];
        $scope.usersParams.search_query = kisiad;
        kisilisteRestangular.customGET("",  $scope.usersParams, {'access_token': $scope.access_token}).then(function (userliste) {
        $scope.kisiliste = userliste;
            });
            
        };
        
        $scope.kisiekle = function (userid, circleid) {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = userid;
            var postData = [];
            postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
            var data = postData.join("&");
            var kisiekleRestangular = Restangular.one("circles", circleid).all("users");
            
            kisiekleRestangular.customPOST(data, '', '', headers).then(function (circle_user) {
            
            $scope.cevrekisiler = circle_user; 
            cevregoster();     
               });
            
        };
        
        $scope.kisigoruntule = function (circleid, circlead) {
        var kisialRestangular = Restangular.one("circles", circleid).all("users");
        kisialRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (kisiler) {
        $scope.cevrekisiler = kisiler;
                    cevreidyaz(circleid, circlead);
                    deger.length = 0;
                    $scope.ackapakisi=false;
          });
                    
        };
        
        cevreidyaz = function (cevreid, circlead) {
        $scope.cvrid = cevreid;
        $scope.cevretanim = circlead;
        
        if(circlead=="")
        {$scope.circlead = "";}
        else
        { $scope.circlead = circlead + "  çevresindeki kiþiler."; }
        };
         
      $scope.kisiadd = function (kisid, drm) {
      
      $scope.ackapa=true;
      
      var ekle="1";
       
       for(var i=0;i<deger.length;i++)
       {
        if(kisid==deger[i].kisid)
        {
            deger[i].drm=drm;
            ekle="0";
            //break;
        }
        
        if(deger[i].drm==true)
        {$scope.ackapa=false;}
       }
       
       if(ekle=="1")
       { deger.push({kisid, drm}); $scope.ackapa=false;}
         
         };
         
      $scope.cevreadd = function (csecim) {
      
         csec=csecim;
         };
   
    
     $scope.kisisilme = function (circleid) {
        for(var i=0;i<deger.length;i++)
        {
         var drm=deger[i].drm;
         var kisidsi=deger[i].kisid;
        if( drm==true)
        {
            var kisisilmeRestangular = Restangular.one("circles", circleid).one("users", kisidsi);
            kisisilmeRestangular.customDELETE("", "", {'access_token': $scope.access_token}).then(function (kisiler) {
            $scope.cevrekisiler = kisiler; 
            cevregoster();                   
            });
        }
    }
    deger.length = 0;
     };
    
    $scope.kisiekcevre = function () {
    for(var i=0;i<deger.length;i++)
        {
         var drm=deger[i].drm;
         var kisidsi=deger[i].kisid;
            if( drm==true)
            {
            var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            var jsonData = kisidsi;
            var postData = [];
            postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
            var data = postData.join("&");
            var kisiekleRestangular = Restangular.one("circles", csec).all("users");
            
            kisiekleRestangular.customPOST(data, '', '', headers);
            
            cevregoster();
            }
        }
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
  
   mymodal.directive('kisieklemodal', function () {
    return {
      templateUrl: 'app/components/partials/circle_kisiekle.htm',
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
  
   mymodal.directive('kisisilmodal', function () {
    return {
      templateUrl: 'app/components/partials/circle_kisisil.htm',
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
  
  mymodal.directive('digercevremodal', function () {
    return {
      templateUrl: 'app/components/partials/circle_digercevre.htm',
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
   
