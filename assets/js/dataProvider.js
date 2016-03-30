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

        factory.listChapters = function (callback) {
            if (config_data.isNative){
                localDataProvider.listChapters(callback);
            }else{
                Restangular.all('chapters').getList().then(function(data){
                   callback(data);
                });
            }
        };

        factory.listTranslations = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.listTranslations(args, callback);
            }else{
                Restangular.all("translations").customGET("", args, {}).then(function(data){
                    callback(data);
                });
            }
        };

        factory.fetchTranslationById = function (id, callback) {
            if (config_data.isNative){
                localDataProvider.fetchTranslationById(id, callback);
            }else{
                Restangular.one('translations', id).get().then(function(data){
                    callback(data);
                });
            }
        };

        factory.fetchTranslationByAuthorAndVerseId = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.fetchTranslationByAuthorAndVerseId(args, callback);
            }else{
                Restangular.one('authors', args.authorId)
                    .one('verse', args.verseId).get().then(function(data){
                    callback(data);
                });
            }
        };

        factory.fetchTranslationByAuthorAndVerseList = function (args, callback) {
            if (config_data.isNative){
                localDataProvider.fetchTranslationByAuthorAndVerseList(args, callback);
            }else{
                var translationsRestangular = Restangular.one("translations").all("list");
                translationsRestangular.customGET("", {author:args.author, verse_list:args.verse_list}, {'access_token': args.access_token}).then(function(data){
                    callback(data);
                });
            }
        };

        factory.searchTranslationByKeyword = function(args, callback){
            if (config_data.isNative){
                localDataProvider.searchTranslationByKeyword(args, callback);
            }else{
                var translationsRestangular = Restangular.one("translations").all("search_keyword");
                translationsRestangular.customGET("", {language:args.language, keyword:args.keyword}, {}).then(function(data){
                    callback(data);
                });
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