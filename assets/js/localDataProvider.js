angular.module('ionicApp').factory("localDataProvider", function (Restangular, $ionicPlatform, $cordovaSQLite) {

    var factory = {};
    factory.db = null;
    factory.callback = function(){};

    factory.initDB = function(rt) {
        console.log("sqllite openDB start");
        var dbName = "kurancalis.db";
        window.plugins.sqlDB.copy(dbName, 0, function () {
            console.log("sqllite db copied");
            factory.db = $cordovaSQLite.openDB(dbName);
            rt.$broadcast('db.init.finish');
            console.log("sqllite openDB end : 1");
        }, function (error) {
            console.error("There was an error copying the database: " + JSON.stringify(error));
            factory.db = $cordovaSQLite.openDB(dbName);
            rt.$broadcast('db.init.finish');
            console.log("sqllite openDB end : 2");
        });
    };

    factory.listAuthors = function (callback) {
        var authors = [];
        console.log("authors list called in localDataProvider. : ");
        var query = "SELECT * FROM author a order by a.display_order";
        $cordovaSQLite.execute(factory.db, query).then(function(res) {
            console.log("authors list result : " + JSON.stringify(res));
            if(res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++){
                    var item = res.rows.item(i);
                    console.log("item ("+ i + ") : " + JSON.stringify(item));
                    var author = {};
                    author.color = item.color;
                    author.displayOrder = item.display_order;
                    author.id = item.id;
                    author.language = item.language;
                    author.name = item.name;
                    author.title = item.title;
                    authors.push(author);
                }
            } else {
                console.log("No results found for authors");
            }
            callback(authors);
        }, function (err) {
            console.error("list_authors " + JSON.stringify(err));
            callback(authors);
        });
    };

    factory.listFootnotes = function (args, callback) {
        console.log("list footness called.");
    };
    return factory;
});