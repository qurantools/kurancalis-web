angular.module('ionicApp')
    .controller('PeopleHaveYouCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService) {
         var deger = [];
       var csec;
       $scope.ackapa = true;
       
        //View friends
        var kisialRestangular = Restangular.one("circles").all("followers");
            kisialRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (kisiler) {

                $scope.cevrekisiler = kisiler;
                $scope.ackapakisi = false;
            });
            
            //Checkbox click
           $scope.kisiadd = function (kisid, drm) {

            $scope.ackapa = true;

            var ekle = "1";

            for (var i = 0; i < deger.length; i++) {
                if (kisid == deger[i].kisid) {
                    deger[i].drm = drm;
                    ekle = "0";
                    //break;
                }

                if (deger[i].drm == true) {
                    $scope.ackapa = false;
                }
            }

            if (ekle == "1") {
                deger.push({'kisid': kisid, 'drm': drm});
                $scope.ackapa = false;
            }

        };
        
         $scope.digercevre = false;
         $scope.digercevremodal = function () {
         $scope.digercevre = !$scope.digercevre;
        };
        
        //View circles
           var cevregosterRestangular = Restangular.all("circles");
            cevregosterRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
                $scope.dcevreadlar = cevreliste;
           });
           
           //Peoples add    
           $scope.cevreadd = function (csecim) 
           { csec = csecim; };
        
                $scope.kisiekcevre = function () {

            for (var i = 0; i < deger.length; i++) {
                var drm = deger[i].drm;
                var kisidsi = deger[i].kisid;

                var kapat = document.getElementById(kisidsi);
                kapat.checked = false;

                if (drm == true) {
                    var headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'access_token': $scope.access_token
                    };
                    var jsonData = kisidsi;
                    var postData = [];
                    postData.push(encodeURIComponent("fb_user_id") + "=" + encodeURIComponent(jsonData));
                    var data = postData.join("&");
                    var kisiekleRestangular = Restangular.one("circles", csec).all("users").all("fbfriend");

                    kisiekleRestangular.customPOST(data, '', '', headers).then(function (eklekisi) {
                        
                    });

                }
            }

            deger.length = 0;
            $scope.ackapa = true;

        };
    });