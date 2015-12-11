angular.module('ionicApp')
    .controller('bookmarkController', function ($scope, Restangular, $sce, $compile) {
    
            $scope.chapterinfo= "";  
            $scope.verseinfo = "";           
            $scope.bookmarkverseid = "";
            $scope.bookchaptername = "";
           
            $scope.bookmarks = [];
            $scope.bookmarksyellowverseID = "";
            $scope.bookmarksyellowchapter = "";
            $scope.bookmarksgreenverseID = "";
            $scope.bookmarksgreenchapter = "";
            $scope.bookmarksorangeverseID = "";
            $scope.bookmarksorangechapter = "";
            
            $scope.$on("openAddBookMarkModal", function(event) {

            $scope.chapterinfo = $scope.bookmarkParameters.chapterinfo;
            $scope.verseinfo = $scope.bookmarkParameters.verseinfo;
            $scope.bookmarkverseid = $scope.bookmarkParameters.bookmarkverseid;
            $scope.bookchaptername = $scope.chapters[$scope.chapterinfo - 1].nameTr;

            bookmark_search();
        });
        
        $scope.navigationPopover=function(){
            bookmark_search();
        }
      
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
        
        $scope.bookmarksave=function(BookMarkcolour,BookMarkverseId)
        {
         var headers = {'Content-Type': 'application/x-www-form-urlencoded', 'access_token': $scope.access_token};
            //var jsonData = annotation;
            var postData = [];
            postData.push(encodeURIComponent("colour") + "=" + encodeURIComponent(BookMarkcolour));
            postData.push(encodeURIComponent("verseId") + "=" + encodeURIComponent(BookMarkverseId));
            
            var data = postData.join("&");

             var bookmarkRestangular = Restangular.one("bookmarks");
                bookmarkRestangular.customPOST(data, '', '', headers).then(function (data) {
                    bookmark_search();
                });
        }
});
