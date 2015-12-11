angular.module('ionicApp')
    .controller('bookmarkController', function ($scope, Restangular, $sce, $compile) {
    
    
 $('[data-toggle="popover"]').popover({ html : true })
    .click(function(ev) {
     //this is workaround needed in order to make ng-click work inside of popover
     $compile($('.popover.in').contents())($scope);
});
    
    $scope.linkno="";
    
      $scope.linkcreate=function(chapterno,verseno){
            if(verseno=="0")
            {verseno="1"; chapterno="1";  }

            $scope.linkno="http://kuranharitasi.com/kuran.aspx?sureno=" + chapterno + "&ayetno=" + verseno + "#ContentPlaceHolder1_ayettekikoklergrid";
            $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.linkno);
        
        };
        
       $scope.showModal = false;
            $scope.modal = function (chapterinfo, verseinfo, bookmarkverseid) {
            $scope.showModal = !$scope.showModal
            $scope.chapterinfo=chapterinfo;  
            $scope.verseinfo=verseinfo;           
            $scope.bookmarkverseid=bookmarkverseid;
            $scope.bookchaptername = $scope.chapters[chapterinfo - 1].nameTr;
            
            bookmark_search();
        };
      
       function bookmark_search()
        {
         var bookmarkRestangular = Restangular.all("bookmarks");
            bookmarkRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (data) {
               
               $scope.bookmarks = data;
               
               for(var i=0;i<3;i++)
                {
                  if(data[i].color=="yellow")
                    {
                        $scope.bookmarksyellowverseID = data[i].verseId;
                        $scope.bookmarksyellowchapter = $scope.chapters[(data[i].verseId / 1000 | 0)-1].nameTr;                    
                    }
                    else if(data[i].color=="green")
                    {
                        $scope.bookmarksgreenverseID = data[i].verseId;
                        $scope.bookmarksgreenchapter = $scope.chapters[(data[i].verseId / 1000 | 0)-1].nameTr;                    
                    }    
                     else if(data[i].color=="orange")
                    {
                        $scope.bookmarksorangeverseID = data[i].verseId;
                        $scope.bookmarksorangechapter = $scope.chapters[(data[i].verseId / 1000 | 0)-1].nameTr;                    
                    }            
                }
               
            });
        }
});
