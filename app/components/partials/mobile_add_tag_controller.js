/**
 * Created by oksuztepe on 30/10/15.
 */
angular.module('ionicApp')
    .controller('mobileAddTagController', function ($scope, Restangular) {

        $scope.tagslist = [];
        $scope.mobil_tagsearched = "";
        //People Add

        //TagsQuery
        $scope.tagsquery = function (query) {

            if ((query != "") && (query.length > 2)) {
                var tagsRestangular = Restangular.one('tags', query);
                tagsRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (taglist) {
                    $scope.tagslist = taglist;
                });
            }
            else {
                $scope.tagslist = [];
            }
        };

        //Addicionar selected tags
        $scope.mobil_addedtags = function (targetTagList, tag) {

            var control = "0";

            for (var i = 0; i < targetTagList.length; i++) {

                if (targetTagList[i].name == tag) {
                    control = "1";
                }
            }

            if (control == "0") {
                targetTagList.push({name: tag});
            }

            $scope.mobil_tagsearched = "";
            $scope.tagslist = [];
        }


    });
