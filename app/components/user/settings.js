/**
 * Created by Erata 26/02/18.
 */

var userSettings = angular.module('ionicApp')
    .controller('UserSettingsCtrl', function ($rootScope,$scope,$q, $routeParams, $location, $timeout,$ionicModal, authorization, localStorageService, Restangular, Upload, $sce, $translate, Notification) {

        $scope.message = "";
        $scope.remove_carriage = false;
        $scope.column_name = false;
        $scope.taggedVerseCircles = [];
        $scope.suitToUpload = false;
        $scope.language = $translate.use();

        $scope.init = function () {
            if ( $location.path() == "/user/account/settings/") {
                $scope.pagePurpose = "settings";
            }
        };

        $scope.carriageChanged = function (value) {
            $scope.remove_carriage = value;
        };

        $scope.columnsChanged = function (value) {
            $scope.column_name = value;
            console.log("$scope.column_name",$scope.column_name)
        };

        $scope.showexportmodal = false;
        $scope.exportmodal = function () {
            $scope.showexportmodal = false;

            $timeout(function () {
                $scope.showexportmodal = true;
            },100)
        };

        $scope.showbulkinsertmodal = false;
        $scope.bulkinsertmodal = function () {
            $scope.showbulkinsertmodal = false;

            $timeout(function () {
                $scope.showbulkinsertmodal = true;
            },100)
        };

        $scope.showauthorlistmodal = false;
        $scope.authorlistmodal = function () {
            $scope.showauthorlistmodal = false;

            $timeout(function () {
                $scope.showauthorlistmodal = true;
            },100)
        };

        $scope.showlibreofficemodal = false;
        $scope.libreofficemodal = function () {
            $scope.showlibreofficemodal = false;

            $timeout(function () {
                $scope.showlibreofficemodal = true;
            },100)
        };

        $scope.exportAnnotations = function () {
            console.warn("carriage: " + $scope.remove_carriage, "\ncolumn: "+ $scope.column_name);

            Restangular.one('annotations/export').customGET("", {remove_carriage:$scope.remove_carriage.toString(), column_name:$scope.column_name.toString()}, {'access_token': $scope.access_token}).then(function (data) {
                //console.log("Downloading...\n", data);
                var blob = new Blob([data]);
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'annotations.csv';
                a.target = '_blank';
                a.click();

            }, function(error) {
                console.error("There was an error", error);

                if(error.hasOwnProperty("data")){
                    $scope.showMessage(error.data.description);
                }
            });
        };

        $scope.downloadSampleFile = function() {
            var downloadPath = 'annotations.csv';
            window.open(downloadPath, '_blank', '');
            var blob = new Blob([data]);
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'annotations.csv';
            a.target = '_blank';
            a.click();

        };

        //tags input auto complete
        $scope.cevrelisteleForSearch = function () {
            return $scope.extendedCirclesForSearch;
        };

        $scope.checkFile = function(file, errFiles) {
            $scope.csvFile = file;
            $scope.errFile = errFiles && errFiles[0];
            $scope.errorMsg = "";
            $scope.successMsg = "";

            console.log(file, errFiles);

            if (file && file.size > 10*1024*1024) {
                $scope.errorMsg = $translate.instant("Dosya boyutu en fazla 10MB olabilir.");
            }

            if(file) {
                var match = (/\.(csv)$/i).test(file.name);
                console.log("file type match: " + match);

                if (!match) {
                    if ($scope.errorMsg)
                        $scope.errorMsg = $translate.instant("Dosya boyutu en fazla 10MB ve tipi *.csv olmalıdır.");
                    else
                        $scope.errorMsg = $translate.instant("Dosya tipi *.csv olmalıdır.");
                }
            }

            $scope.scopeApply();
        };

        $scope.uploadFile = function(file) {
            file.upload = Upload.upload({
                headers: {
                    'Content-Type' : file.type,
                    'access_token': $scope.access_token
                },
                method: "POST",
                url: config_data.webServiceUrl + '/annotations/import?headerName=' + $scope.column_name + '&canViewCircles=' + $scope.getTagsWithCommaSeparated($scope.taggedVerseCircles),
                data: {file: file}
            }).progress(function(evt){
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total, 10), $scope.csvFile);
            })
            .success(function(data, status, headers, config){
                $scope.successMsg = $translate.instant("Dosya başarılı bir şekilde yüklendi.");
                console.log('file ' + config.data.file.name + ' is uploaded successfully. Response: ');
            })
            .error(function(err){
                if(err.code == "299" && err.description == "There is an error at line 1")
                {
                    $scope.errorMsg = $scope.getErrorTranslation(err.description) + $translate.instant(": Dosya içeriğini kontrol ediniz. İlk satır kolon başlıklarını içeriyor olabilir.");
                } else if(err.code == "297" || err.code == "298" || err.code == "299") {
                    $scope.errorMsg = $scope.getErrorTranslation(err.description);
                } else {
                    $scope.errorMsg = err.code + $translate.instant(err.description);
                }
                //console.log("ERROR: ",err, $scope.errorMsg);
            });

        };

        $scope.getErrorTranslation = function (str) {

            if($scope.language == "en")
                return str;
            else if($scope.language == "tr")
            {
                var res = str.split("line");
                var text = res[0] + "line";
                var number = res[1];

                if(text == "Author number is not valid at line")
                    return number + ". satırdaki yazar numarası geçersiz";
                else if(text =="Row column number is not suit at line")
                    return number + ". satırındaki kolon sayısı uygun değil";
                else if(text == "There is an error at line")
                    return number + ". satırda hata var";
            }
        };

        $scope.navigateToProfile = function () {
           $location.path("/user/account/settings/");
           $scope.bulkinsertmodal()
        };

        $scope.init();

    });

userSettings.directive('exportmodal', function () {
    return {
        templateUrl: 'app/components/user/export_annotations.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.remove_carriage = false;
            scope.column_name = false;

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

userSettings.directive('bulkinsertmodal', function () {
    return {
        templateUrl: 'app/components/user/bulk_insert_annotations.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.remove_carriage = false;
            scope.column_name = false;

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

userSettings.directive('authorlistmodal', function () {
    return {
        templateUrl: 'app/components/user/author_list.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false,
        link: function postLink(scope, element, attrs) {

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

userSettings.directive('libreofficemodal', function () {
    return {
        templateUrl: 'app/components/user/libre_office_usage.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false,
        link: function postLink(scope, element, attrs) {

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