angular.module('ionicApp')
    .controller('HelpController', function ($scope, $routeParams, $location, $timeout, authorization,
                                            localStorageService, Restangular, $ionicModal, $sce) {
        $scope.title = "Yardım";
        $scope.helpController = this;
        $scope.helpController.API = null;
        $scope.appVersion = config_data.version;
        $scope.generatTurorialID="leftmenu";

        $scope.menuList = [
            {
                id: "leftmenu",
                name: "Genel Yetenekler",
                submenu: [
                    {
                        id: 21,
                        title: "Sol Menü",
                        source: [{
                            src: "../../assets/img/help/mobile/menu_icerigi.mp4",
                            type: "video/mp4"
                        }]
                    },
                    {
                        id: 22,
                        title: "Intro-1",
                        source: [{
                            src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/facebook_arkadaslarim.mp4"),
                            type: "video/mp4"
                        }]
                    },

                ]
            },
            {
                id: "chapter",
                name: "Sure Okuma Tanıtım",
                submenu: [

                    {
                        id: 12,
                        title: "Intro-2",
                        source: [{
                            src: "../../assets/img/help/mobile/sure_alt_menu.mp4",
                            type: "video/mp4"
                        }]
                    },
                    {
                        id: 13,
                        title: "Intro-3",
                        source: [{
                            src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/karalama.mp4"),
                            type: "video/mp4"
                        }]
                    },
                    {
                        id: 14,
                        title: "Intro-4",
                        source: [{
                            src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/suredeki_ayet_notlari.mp4"),
                            type: "video/mp4"
                        }]
                    },
                    {
                        id: 15,
                        title: "Intro-5",
                        source: [{
                            src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/ayet_gecmisi.mp4"),
                            type: "video/mp4"
                        }]
                    },
                    {
                        id: 15,
                        title: "Intro-6",
                        source: [{
                            src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/burada_kaldim.mp4"),
                            type: "video/mp4"
                        }]
                    }
                ]
            }
            /*,
             {   id: "annotation",
             name : "Not Paylaşma",
             submenu : [
             {id:21, title:"Not Paylaşma-1", source:[{src: $sce.trustAsResourceUrl("../../assets/img/help_deneme.mp4"), type: "video/mp4"}]},
             {id:22, title:"Not Paylaşma-2", source:[{src: $sce.trustAsResourceUrl("../../assets/img//VfE_html5.mp4"), type: "video/mp4"}]},
             {id:23, title:"Not Paylaşma-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:24, title:"Not Paylaşma-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:25, title:"Not Paylaşma-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
             ]
             },
             {   id: "bookmarks",
             name : "Ayraç Kullanma",
             submenu : [
             {id:31, title:"Ayraç Kullanma-1", source:[{src: $sce.trustAsResourceUrl("templates/playlist.html"), type: "html"}]},
             {id:32, title:"Ayraç Kullanma-2", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:33, title:"Ayraç Kullanma-3", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]},
             {id:34, title:"Ayraç Kullanma-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:35, title:"Ayraç Kullanma-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
             ]
             },
             {   id: "labels",
             name : "Etiket Kullanımı",
             submenu : [
             {id:41, title:"Etiket Kullanımı-1", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:42, title:"Etiket Kullanımı-2", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:43, title:"Etiket Kullanımı-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:44, title:"Etiket Kullanımı-4", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]},
             {id:45, title:"Etiket Kullanımı-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
             ]
             },
             {   id: "search_annotation",
             name : "Not Arama",
             submenu : [
             {id:51, title:"Not Arama-1", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:52, title:"Not Arama-2", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:53, title:"Not Arama-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:54, title:"Not Arama-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
             {id:55, title:"Not Arama-5", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]}
             ]
             },
             {
             id: "chapter",
             name : "Intro",
             submenu : [
             {id:61, title:"Intro-1", source:[{src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/karalama.mp4"), type: "video/mp4"}]},
             {id:62, title:"Intro-2", source:[{src: $sce.trustAsResourceUrl("https://youtu.be/uqROdKnNfQk"), type: "video/mp4"}]},
             ]
             },
             {
             id: "annotations",
             name : "Ayet Notları",
             submenu : [
             {id:61, title:"Intro-1", source:[{src: $sce.trustAsResourceUrl("../../assets/img/help/mobile/karalama.mp4"), type: "video/mp4"}]},
             {id:62, title:"Intro-2", source:[{src: $sce.trustAsResourceUrl("https://youtu.be/uqROdKnNfQk"), type: "video/mp4"}]},
             ]
             }*/
        ];

        $scope.selectedIndex = -1;
        $scope.selectedMenu = -1;

        $scope.runHelpModal = function (id, isCallFromHelpMenu) {

            //if (!config_data.isNative && !isCallFromHelpMenu) {
            //    return;
            //}

            //do not overlap
            if(this.help_modal.isShown()){
                return;
            }

            if (!isCallFromHelpMenu) {
                if($scope.checkGeneralTutorial()){
                    $scope.runHelpModal($scope.generatTurorialID,true);
                    return;
                }


                var isRunBefore = localStorageService.get('help_modal_tutorial_' + id);
                if (isRunBefore === null) {
                    localStorageService.set('help_modal_tutorial_' + id, "true");
                } else {
                    return;
                }
            }
            $scope.selectedMenu = -1;
            for (var i = 0; i < $scope.menuList.length; i++) {
                if ($scope.menuList[i].id === id) {
                    $scope.selectedMenu = i;
                    break;
                }
            }
            if ($scope.selectedMenu == -1) {
                return;
            }
            $scope.selectedIndex = -1;
            $scope.scopeApply();
            $scope.help_modal.show();
            $timeout(function(){
                $scope.selectedIndex++;
            },900);
        };

        $scope.closeModal = function () {
            $scope.stopPlaying();
            $scope.help_modal.hide();
        };

        $scope.initHelpParameters = function () {
            console.log("help init");
            if (config_data.isMobile) {
                $ionicModal.fromTemplateUrl('components/partials/help_modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    id: 'help_modal'
                }).then(function (modal) {
                    $scope.help_modal = modal
                });

                $scope.$on("displayTutorial", function (event, args) {
                    console.log("on displayTutorial");
                    $scope.runHelpModal(args.id, false);
                });
            }


        };

        $scope.prevTutorial = function () {
            $scope.selectedIndex--;
            if ($scope.selectedIndex < 0) {
                $scope.help_modal.hide();
            }
        };

        $scope.nextTutorial = function () {
            $scope.selectedIndex++;
            if ($scope.selectedIndex >= $scope.menuList[$scope.selectedMenu].submenu.length) {
                $scope.help_modal.hide();
            }
        };

        $scope.config = {
            theme: "../../../assets/lib/videogular/videogular.css",
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };

        $scope.onPlayerReady = function (API) {
            console.log("onPlayerReady");
            $scope.helpController.API = API;
            $scope.vgChangeSource();
        };

        $scope.vgChangeSource = function (source) {
            $scope.helpController.API.stop();
            $timeout($scope.helpController.API.play.bind($scope.helpController.API), 100);
        };

        $scope.stopPlaying = function () {
            if ($scope.helpController.API != null) {
                $scope.helpController.API.stop();
            }
        };

        $scope.initHelpParameters();
    });

