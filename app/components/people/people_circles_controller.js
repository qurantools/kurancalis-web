var mymodal = angular.module('ionicApp')
    .controller('PeopleCirclesCtrl', function ($scope, $routeParams, Facebook, Restangular, localStorageService, $window, $timeout, $ionicModal, $ionicPopup, navigationManager, $translate) {

        $scope.testData = "circles";
        $scope.ackapakisi = true;
        $scope.ackapa = true;
        $scope.showAddButton = false;

        $scope.createNewCircleCallBack = $scope.createNewCircleCallBack || function(cevre){};

        var deger = [];
        var csec;
        var tbls;

        $scope.renksec = function (yeni) {

            if (yeni != tbls) {
                var property = document.getElementById(yeni);
                property.style.backgroundColor = "orange";

                var property1 = document.getElementById("bt1" + yeni);
                property1.style.backgroundColor = "orange";

                var property2 = document.getElementById("bt2" + yeni);
                property2.style.backgroundColor = "orange";


                var eski = document.getElementById(tbls);
                var eski1 = document.getElementById("bt1" + tbls);
                var eski2 = document.getElementById("bt2" + tbls);
                if (eski != null) {
                    eski.style.backgroundColor = "#1abc9c";
                    eski1.style.backgroundColor = "#1abc9c";
                    eski2.style.backgroundColor = "#1abc9c";
                }

                tbls = yeni;
            }
        };

        $scope.showModal = false;
        $scope.toggleModal = function (cevread) {
            $scope.showModal = !$scope.showModal;
            $scope.cevread = {
                text: ''
            };
        };

        $scope.csil = false;
        $scope.csilModal = function (cevreadi, cid) {
            var lblad = document.getElementById('ad' + cid);
            cevreadi = lblad.textContent;

            $scope.csil = !$scope.csil;
            $scope.cevreadi = cevreadi;
            $scope.cid = cid;
        };

        $scope.cdegistir = false;
        $scope.cdegistirModal = function (cevreadi, cvrid) {
            var lblad = document.getElementById('ad' + cvrid);
            cevreadi = lblad.textContent;

            $scope.cdegistir = !$scope.cdegistir;
            $scope.cevredgsad = {
                text: cevreadi
            };
            $scope.cvrid = cvrid;
        };

        $scope.kisieskle = false;
        $scope.kisieskleModal = function () {
            $scope.kisieskle = !$scope.kisieskle;
            $scope.kisieklead = {
                text: ''
            };
            $scope.kisiliste = [];
        };

        $scope.digercevre = false;
        $scope.digercevremodal = function () {
            $scope.digercevre = !$scope.digercevre;
        };

        $scope.kisisil = false;
        $scope.kisisilModal = function () {
            $scope.kisisil = !$scope.kisisil;
        };

        function cevrelisteac() {
            var cevregosterRestangular = Restangular.all("circles");
            cevregosterRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
                $scope.cevreadlar = cevreliste;
                $scope.dcevreadlar = cevreliste;

                if (config_data.isMobile){
                    if (typeof $routeParams.circleid !== 'undefined') {
                        var selectedCircle = $scope.cevreadlar.filter(function(item){
                            return item.id+"" == $routeParams.circleid;
                        })[0];
                        $scope.kisigoruntule(selectedCircle.id, selectedCircle.name);
                    }
                }
            });
        };

        cevregoster = function (circleid, cvrad) {
            var cevregosterRestangular = Restangular.all("circles");
            cevregosterRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {
                if (config_data.isMobile){
                    $scope.cevreadlar = cevreliste;
                }
                $scope.dcevreadlar = cevreliste;
                for (var i = 0; i < cevreliste.length; i++) {
                    var ls = cevreliste[i].id;
                    if (ls == circleid && !config_data.isMobile) {
                        var lbl = document.getElementById('lb' + circleid);
                        lbl.textContent = cevreliste[i].user_count;

                        var lblad = document.getElementById('ad' + circleid);
                        lblad.textContent = cevreliste[i].name;
                    }
                }
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

                var cirlist = [];
                cirlist.push({'user_count': '0', 'id': circleUsers.id, 'name': circleUsers.name});

                $scope.cevreadlar.push(cirlist[0]);
            });
        };

        $scope.cevresil = function (cid) {
            var silRestangular = Restangular.one("circles", cid);
            silRestangular.customDELETE("", {}, {'access_token': $scope.access_token}).then(function (result) {

                var cevrelerRestangular = Restangular.all("circles");
                cevrelerRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (cevreliste) {

                    for (var i = 0; i < $scope.cevreadlar.length; i++) {
                        var cad = $scope.cevreadlar[i].id;
                        if (cad == cid)
                            $scope.cevreadlar.splice(i, 1);
                    }

                    cevreidyaz("", "");
                    $scope.cevrekisiler = 0;
                    $scope.ackapa = true;
                    $scope.ackapakisi = true;

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
                cevregoster(cvrid, cvrad);

//            var x=0;
//            
//            for(var i=0;i<$scope.cevreadlar.length;i++)
//            {
//            var dg=$scope.cevreadlar[i].id;
//            
//            if(dg==cvrid)
//              { 
//              x=i;
//              //$scope.cevreadlar.splice(i,1); 
//              }
//            }
//            
//            var cvrlist=[];
//            cvrlist.push({'user_count':result.user_count,'id':result.id,'name':result.name});
//            $scope.cevreadlar[x]=cvrlist[0];
//            
//            //$scope.cevreadlar.splice(x,1);
//            //$scope.cevreadlar.push(cvrlist[0]); 
//            
            });
        };

        $scope.kisilistele = function (kisiad) {
            var kisilisteRestangular = Restangular.all("users/search");
            $scope.usersParams = [];
            $scope.usersParams.search_query = kisiad;
            kisilisteRestangular.customGET("", $scope.usersParams, {'access_token': $scope.access_token}).then(function (userliste) {
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

                var userlist = [];
                userlist.push({'user_id': circle_user.user_id, 'name': circle_user.name, 'photo': circle_user.photo});

                $scope.cevrekisiler.push(userlist[0]);

                cevregoster(circleid);
            });

        };

        $scope.kisigoruntule = function (circleid, circlead) {
            var kisialRestangular = Restangular.one("circles", circleid).all("users");
            kisialRestangular.customGET("", "", {'access_token': $scope.access_token}).then(function (kisiler) {
                if (!config_data.isMobile) {
                    var lblad = document.getElementById('ad' + circleid);
                    circlead = lblad.textContent;
                }

                if ($scope.cevretanim != circlead) {
                    $scope.cevrekisiler = _.filter(kisiler, function(token) {
                        token.selected = false;
                        return true;
                    });
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
                cevreidyaz(circleid, circlead);
                deger.length = 0;
                $scope.ackapakisi = false;
            });
        };

        cevreidyaz = function (cevreid, circlead) {
            $scope.cvrid = cevreid;
            $scope.cevretanim = circlead;

            if (circlead == "") {
                $scope.circlead = "";
            }
            else {
                $scope.circlead = circlead + "  " + $translate.instant("çevresindeki kişiler.");
            }
        };

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

        $scope.cevreadd = function (csecim) {
            csec = csecim;
        };

        $scope.kisisilme = function (circleid) {
            for (var i = 0; i < deger.length; i++) {
                var drm = deger[i].drm;
                var kisidsi = deger[i].kisid;

                if (drm == true) {
                    for (var y = 0; y < $scope.cevrekisiler.length; y++) {
                        var uad = $scope.cevrekisiler[y].user_id;
                        if (uad == kisidsi) {
                            $scope.cevrekisiler.splice(y, 1);
                            y = y - 1;
                        }
                    }

                    var kisisilmeRestangular = Restangular.one("circles", circleid).one("users", kisidsi);
                    kisisilmeRestangular.customDELETE("", "", {'access_token': $scope.access_token}).then(function (kisiler) {

                        $scope.ackapa = true;

                        cevregoster(circleid);
                    });
                }
            }
            deger.length = 0;
        };

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
                    postData.push(encodeURIComponent("user_id") + "=" + encodeURIComponent(jsonData));
                    var data = postData.join("&");
                    var kisiekleRestangular = Restangular.one("circles", csec).all("users");

                    kisiekleRestangular.customPOST(data, '', '', headers).then(function (eklekisi) {
                        cevregoster(csec);
                    });

                }
            }

            deger.length = 0;
            $scope.ackapa = true;
        };

        $scope.toggleButton = function(){
            $scope.showAddButton = !$scope.showAddButton;
        };

        $scope.openModal = function (item){
            if (item == 'add_people'){
                $scope.query_users = [];
                $scope.query_users = _.filter($scope.cevrekisiler, function(item){
                    $scope.query_users.push(item);
                    return true;
                });
                $scope.modal_friend_search.show();
            } else if (item == "circle_selection"){
                $scope.$broadcast("add_user_to_circle", {callback:function(new_circle){
                    $scope.closeModal("circle_selection");
                }, users: deger});
                $scope.modal_circle_selection.show();
            };
        };

        $scope.closeModal = function (item){
            if (item == 'friendsearch'){
                if ($scope.query_users.length > $scope.cevrekisiler.length){
                    var user = $scope.query_users[$scope.query_users.length-1];
                    $scope.kisiekle(user.id,$scope.cvrid);
                }
                $scope.modal_friend_search.hide();
            } else if (item == "circle_selection"){
                $scope.modal_circle_selection.hide();
            }
        };

        $scope.createNewCircle = function(){
            $scope.item = {};
            $scope.item.name = "";
            var promptPopup = $ionicPopup.prompt({
                template: '<input type="text" ng-model="item.name">',
                title: $translate.instant('Yeni Çevre Oluştur'),
                scope : $scope,
                inputType: 'text',
                inputPlaceholder: $translate.instant('Çevre Tanımı')
            });

            promptPopup.then(function(res) {
                if (isDefined(res) && $scope.item.name != ""){
                    $scope.cevrekle($scope.item.name);
                }
            });
        };

        $scope.deleteCircle = function(item){
            var confirmPop = $ionicPopup.confirm({
                title: $translate.instant('Çevre Silme'),
                template: '<b>'+ item.name + '</b>' +  $translate.instant("çevresini silmek istiyor musunuz?"),
                cancelText: $translate.instant('Hayır'),
                okText: $translate.instant('Sil'),
                okType : 'button-assertive'
            });

            confirmPop.then(function (res) {
                if (res) {
                    $scope.cevresil(item.id);
                }
            });
        };

        $scope.updateCircle = function (item) {
            $scope.item = $.extend( true, {}, item );
            var promptPopup = $ionicPopup.prompt({
                template: '<input type="text" ng-model="item.name">',
                title: $translate.instant('İsim Değiştirme'),
                scope : $scope,
                inputType: 'text',
                inputPlaceholder: $translate.instant('Çevre Tanımı')
            });

            promptPopup.then(function(res) {
                if (isDefined(res) && $scope.item.name != item.name){
                    $scope.cevredegistir(item.id, $scope.item.name);
                }
            });
        };

        $scope.initializePeopleCircles = function () {
            $scope.checkUserLoginStatus();
            if ($scope.loggedIn == false) {
                //redirect to home page
                window.location.href = '#!/';
            }
            $scope.cevreadlar = cevrelisteac();
            if (config_data.isMobile){
                $ionicModal.fromTemplateUrl('components/partials/add_friend_to_search.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'friendsearch'
                }).then(function (modal) {
                    $scope.modal_friend_search = modal
                });
                $ionicModal.fromTemplateUrl('components/partials/add_user_to_circle.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'circle_selection'
                }).then(function (modal) {
                    $scope.modal_circle_selection = modal
                });
            };
        };

        //definitions are finished. Now run initialization
        $scope.initializePeopleCircles();
        navigationManager.reset();

    });


mymodal.directive('modal', function () {
    return {
        templateUrl: 'app/components/partials/circle_add.htm',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        backdrop: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
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
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
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
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
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
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
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
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
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
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});