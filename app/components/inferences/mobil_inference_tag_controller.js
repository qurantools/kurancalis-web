/**
 * Created by omer on 2/18/16.
 */

angular.module('ionicApp')
    .controller('mobileInferenceTagsController', function ($scope, Restangular) {

        console.log('mobileInferenceTagsController');
        $scope.inferenceTagslist = [];
        $scope.mobil_tagsearched_inference = "";

        //TagsQuery
        $scope.inferenceTagsquery = function (query) {

            if ((query != "") && (query.length > 2)) {
                var tagsRestangular = Restangular.one('tags', query);
                tagsRestangular.customGET("", {}, {'access_token': $scope.access_token}).then(function (taglist) {
                    $scope.inferenceTagslist = taglist;
                });
            }
            else {
                $scope.inferenceTagslist = [];
            }
        };

        //Addicionar selected tags
        $scope.mobil_addedInferencetags = function (targetTagList, tag) {

            var control = "0";

            for (var i = 0; i < targetTagList.length; i++) {

                if (targetTagList[i].name == tag) {
                    control = "1";
                }
            }

            if (control == "0") {
                targetTagList.push({name: tag});
                $scope.$emit('addInferenceTags',{name: tag})
            }

            $scope.mobil_tagsearched_inference = "";
            $scope.inferenceTagslist = [];
        }

    });
