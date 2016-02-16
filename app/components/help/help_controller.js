angular.module('ionicApp')
    .controller('HelpController', function ($scope, $routeParams, $location, $timeout, authorization,
                                                     localStorageService, Restangular, $ionicModal, $sce) {
        $scope.title = "Yardım";

        $scope.menuList=[
            {   name : "Intro",
                submenu : [
                    {id:11, title:"Intro-1", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]},
                    {id:12, title:"Intro-2", source:[{src: $sce.trustAsResourceUrl("https://youtu.be/uqROdKnNfQk"), type: "video/mp4"}]},
                    {id:13, title:"Intro-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:14, title:"Intro-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:15, title:"Intro-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
                ]
            },
            {   name : "Not Paylaşma",
                submenu : [
                    {id:21, title:"Not Paylaşma-1", source:[{src: $sce.trustAsResourceUrl("http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4"), type: "video/mp4"}]},
                    {id:22, title:"Not Paylaşma-2", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]},
                    {id:23, title:"Not Paylaşma-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:24, title:"Not Paylaşma-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:25, title:"Not Paylaşma-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
                ]
            },
            {   name : "Ayraç Kullanma",
                submenu : [
                    {id:31, title:"Ayraç Kullanma-1", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:32, title:"Ayraç Kullanma-2", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:33, title:"Ayraç Kullanma-3", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]},
                    {id:34, title:"Ayraç Kullanma-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:35, title:"Ayraç Kullanma-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
                ]
            },
            {   name : "Etiket Kullanımı",
                submenu : [
                    {id:41, title:"Etiket Kullanımı-1", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:42, title:"Etiket Kullanımı-2", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:43, title:"Etiket Kullanımı-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:44, title:"Etiket Kullanımı-4", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]},
                    {id:45, title:"Etiket Kullanımı-5", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]}
                ]
            },
            {   name : "Not Arama",
                submenu : [
                    {id:51, title:"Not Arama-1", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:52, title:"Not Arama-2", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:53, title:"Not Arama-3", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:54, title:"Not Arama-4", source:[{src: $sce.trustAsResourceUrl(""), type: "video/mp4"}]},
                    {id:55, title:"Not Arama-5", source:[{src: $sce.trustAsResourceUrl("http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"), type: "video/mp4"}]}
                ]
            }];

        $scope.selectedIndex = 0;
        $scope.selectedMenu = 0;

        $scope.runHelpModal = function(index){
           $scope.selectedMenu = index;
           $scope.selectedIndex = 0;
           $scope.help_modal.show();
        }

        $scope.closeModal = function(){
           $scope.help_modal.hide();
        }

        $scope.initHelpParameters = function(){
                if (config_data.isMobile) {
                    $ionicModal.fromTemplateUrl('components/partials/help_modal.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        id: 'help_modal'
                    }).then(function (modal) {
                        $scope.help_modal = modal
                    });
                }
         }

         $scope.prevTutorial = function(){
            $scope.selectedIndex--;
            if ($scope.selectedIndex < 0){
                $scope.help_modal.hide();
            }
         }

        $scope.nextTutorial = function(){
            $scope.selectedIndex++;
            if ($scope.selectedIndex >= $scope.menuList[$scope.selectedMenu].submenu.length){
                $scope.help_modal.hide();
            }
        }

        $scope.onError = function(event){
            alert(event);
        }

        this.config = {
            theme: "../../../assets/lib/videogular/videogular.css",
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        }

         $scope.initHelpParameters();
    });

