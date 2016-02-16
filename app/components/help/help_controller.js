angular.module('ionicApp')
    .controller('HelpController', function ($scope, $routeParams, $location, $timeout, authorization,
                                                     localStorageService, Restangular, $ionicModal) {
        $scope.title = "Yardım";

        $scope.menuList=[
            {id:1, title:"Intro", src:""},
            {id:2, title:"Not Paylaşma", src:""},
            {id:3, title:"Ayraç Kullanma", src:""},
            {id:4, title:"Etiket Kullanımı", src:""},
            {id:5, title:"Not Arama", src:""}];

        $scope.selectedIndex = 0;

        $scope.runHelpModal = function(index){
           $scope.selectedIndex = index;
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
            if ($scope.selectedIndex >= $scope.menuList.length){
                $scope.help_modal.hide();
            }
         }

        /*this.config = {
            sources: [
                /*{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
            ],
            tracks: [
                {
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
            theme: "../../../assets/lib/videogular/videogular.css",
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        }*/

         $scope.initHelpParameters();
    });

