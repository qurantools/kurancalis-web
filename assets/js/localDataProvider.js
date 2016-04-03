angular.module('ionicApp').factory("localDataProvider", function (Restangular, $ionicPlatform, $cordovaSQLite) {

    var factory = {};
    factory.db = null;
    factory.callback = function(){};

    factory.initDB = function(rt) {
        var dbName = "kurancalis.db";
        window.plugins.sqlDB.copy(dbName, 0, function () {
            factory.db = $cordovaSQLite.openDB(dbName);
            rt.$broadcast('db.init.finish');
            rt.sqliteDbInit = true;
        }, function (error) {
            factory.db = $cordovaSQLite.openDB(dbName);
            rt.$broadcast('db.init.finish');
            rt.sqliteDbInit = true;
        });
    };

    factory.listAuthors = function (callback) {
        var resultSet = [];
        var query = "SELECT * FROM author a order by a.display_order";
        $cordovaSQLite.execute(factory.db, query).then(function(res) {
            for (var i = 0; i < res.rows.length; i++){
                var item = res.rows.item(i);
                var author = {};
                author.color = item.color;
                author.displayOrder = item.display_order;
                author.id = item.id;
                author.language = item.language;
                author.name = item.name;
                author.title = item.title;
                resultSet.push(author);
            }
            callback(resultSet);
        }, function (err) {
            callback(resultSet);
        });
    };

    factory.listFootnotes = function (args, callback) {
        var resultSet = [];
        var query = "SELECT f.content FROM footnote f WHERE f.translation_id = ?";
        $cordovaSQLite.execute(factory.db, query, [args.id]).then(function(res) {
            for (var i = 0; i < res.rows.length; i++){
                var item = res.rows.item(i);
                resultSet.push(item.content);
            }
            callback(resultSet);
        }, function (err) {
            callback(resultSet);
        });
    };

    factory.listTranslations = function (args, callback) {
        var resultSet = [];
        var query = "SELECT t.* FROM translation t " +
                     "JOIN author a ON t.author_id = a.id ";
        var groupBy = " GROUP BY verse_id, author_id ";
        var orderBy = " ORDER BY verse_id, display_order ASC ";

        var criteria = [];
        if (isDefined(args.chapter)){
            criteria.push("t.chapter = " + args.chapter + " ");
        }
        if (isDefined(args.author)){
            criteria.push("t.author_id & " + args.author + " ");
        }
        if (isDefined(args.verse) && args.verse != ""){
            criteria.push("t.verse = " + args.verse + " ");
        }
        if (isDefined(args.verse_keyword) && args.verse_keyword != ""){
            criteria.push("t.content like '%" + args.verse_keyword + "%'");
        }
        if (criteria.length > 0){
            query += " WHERE " + criteria.join(" AND ") + groupBy +orderBy;
        }else{
            query += groupBy +orderBy;
        }
        $cordovaSQLite.execute(factory.db, query).then(function(res) {
            for (var i = 0; i < res.rows.length; i++){
                var item = res.rows.item(i);
                var translation = {};
                translation.authorId = item.author_id;
                translation.chapter = item.chapter;
                translation.content = item.content;
                translation.id = item.id;
                translation.verse = item.verse;
                translation.verseId = item.verse_id;
                translation.version = item.version;
                resultSet.push(translation);
            }
            var newTranslations = _.chain( resultSet ).reduce(function( memo, translation ) {
                memo[ translation.verseId ] = memo[ translation.verseId ] || [];
                memo[ translation.verseId ].push( translation );
                return memo;
            }, {}).map(function(translations, id) {
                return {
                    id: id,
                    translations: translations
                };
            }).value();
            callback(newTranslations);
        }, function (err) {
            callback(resultSet);
        });
    };

    factory.listChapters = function (callback) {
        var resultSet = [];
        var query = "select * from chapter";
        $cordovaSQLite.execute(factory.db, query).then(function(res) {
            for (var i = 0; i < res.rows.length; i++){
                var item = res.rows.item(i);
                var chapter = {};
                chapter.nameEn = item.name_en;
                chapter.nameTr = item.name_tr;
                chapter.id = item.id;
                chapter.nameTr2 = item.name_tr2;
                chapter.verseCount = item.verse_count;
                resultSet.push(chapter);
            }
            callback(resultSet);
        }, function (err) {
            callback(resultSet);
        });
    };

    factory.fetchTranslationById = function (id, callback) {
        var translation = {};
        var query = "SELECT t.* FROM translation t WHERE t.id = ? ";
        $cordovaSQLite.execute(factory.db, query, [id]).then(function(res) {
            if (res.rows.length == 1){
                var item = res.rows.item(0);
                translation.authorId = item.author_id;
                translation.chapter = item.chapter;
                translation.content = item.content;
                translation.id = item.id;
                translation.verse = item.verse;
                translation.verseId = item.verse_id;
                translation.version = item.version;
            }
            callback(translation);
        }, function (err) {
            callback(translation);
        });
    };

    factory.fetchTranslationByAuthorAndVerseId = function (args, callback) {
        var translation = {};
        var query = "SELECT t.* FROM translation t where t.author_id = ? and t.verse_id = ? ";
        $cordovaSQLite.execute(factory.db, query, [args.authorId, args.verseId]).then(function(res) {
            if (res.rows.length == 1){
                var item = res.rows.item(0);
                translation.authorId = item.author_id;
                translation.chapter = item.chapter;
                translation.content = item.content;
                translation.id = item.id;
                translation.verse = item.verse;
                translation.verseId = item.verse_id;
                translation.version = item.version;
            }
            callback(translation);
        }, function (err) {
            callback(translation);
        });
    };

    factory.fetchTranslationByAuthorAndVerseList = function (args, callback) {
        var resultSet = [];
        var query = "SELECT t.* FROM Translation t WHERE t.verse_id IN ("+ args.verse_list +") AND t.author_id = " + args.author;
        $cordovaSQLite.execute(factory.db, query).then(function(res) {
            for (var i = 0; i < res.rows.length; i++){
                var item = res.rows.item(i);
                var translation = {};
                translation.authorId = item.author_id;
                translation.chapter = item.chapter;
                translation.content = item.content;
                translation.id = item.id;
                translation.verse = item.verse;
                translation.verseId = item.verse_id;
                translation.version = item.version;
                resultSet.push(translation);
            }
            callback(resultSet);
        }, function (err) {
            callback(resultSet);
        });
    };

    factory.searchTranslationByKeyword = function (args, callback) {
        var language=args.language, keyword=args.keyword, authorMask=args.author;

        var resultSet = [];
        if ("" == keyword || keyword.length < 3 || "" == language){
            callback(resultSet);
            return;
        }

        var select = "SELECT t.* FROM translation t ";
        var join = "JOIN author a ON t.author_id = a.id ";
        var where = "WHERE ";
        var groupBy = " ORDER BY t.chapter,t.verse_id ";

        var queryParams = [];
        var whereCriterias = [];

        if ("" != keyword) {
            whereCriterias.push("t.content like ? ");
            queryParams.push("%" +keyword + "%");
        }
        if ("" != language) {
            select += join;
            whereCriterias.push("a.language = ? ");
            queryParams.push(language);
        }
        if(authorMask != null) {
            whereCriterias.push("t.author_id & ? ");
            queryParams.push(authorMask);
        }
        if (queryParams.length > 0){
            where = where + whereCriterias.join(" AND ");
        }
        var query = select + where + groupBy;
        $cordovaSQLite.execute(factory.db, query, queryParams).then(function(res) {
            for (var i = 0; i < res.rows.length; i++){
                var item = res.rows.item(i);
                var translation = {};
                translation.authorId = item.author_id;
                translation.chapter = item.chapter;
                translation.content = item.content;
                translation.id = item.id;
                translation.verse = item.verse;
                translation.verseId = item.verse_id;
                translation.version = item.version;
                resultSet.push(translation);
            }
            var newTranslations = _.chain( resultSet ).reduce(function( memo, translation ) {
                memo[ translation.verseId ] = memo[ translation.verseId ] || [];
                memo[ translation.verseId ].push( translation );
                return memo;
            }, {}).map(function(translations, id) {
                return {
                    id: id,
                    translations: translations
                };
            }).value();
            callback(newTranslations);
        }, function (err) {
            callback(resultSet);
        });
    };

    return factory;
});