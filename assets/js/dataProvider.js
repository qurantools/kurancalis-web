angular.module('ionicApp').factory("dataProvider", function (Restangular, localDataProvider, ListAuthors, Footnotes) {
        var factory = {};
        factory.callback = function(){};

        factory.initDB = function(rt) {
            if (config_data.isNative){
                localDataProvider.initDB(rt);
            }else{
                //nothing
            }
        };

        factory.listAuthors = function (callback) {
            console.log("authors list called in dataProvider. config_data.isNative : " + config_data.isNative);
            if (config_data.isNative){
                localDataProvider.listAuthors(callback);
            }else{
                ListAuthors.query(function(data){
                    callback(data);
                });
            }
        };

        factory.listFootnotes = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.listFootnotes(args, callback);
            }else{
                Footnotes.query({
                    id: args.id
                }, function (data) {
                    callback(data);
                });
            }
        };

        factory.listVerses = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.listVerses(args, callback);
            }else{

            }
        };

        factory.listChapters = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.listChapters(args, callback);
            }else{

            }
        };

        factory.listTranslations = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.listTranslations(args, callback);
            }else{

            }
        };
        return factory;
}).factory('ListAuthors', function ($resource) {
    return $resource(config_data.webServiceUrl + '/authors', {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}).factory('Footnotes', function ($resource) {
    return $resource(config_data.webServiceUrl + '/translations/:id/footnotes', {
        chapter_id: '@translation_id'
    }, {
        query: {
            method: 'GET',
            params: {
                id: '@translation_id'
            },
            isArray: true
        }
    });
});