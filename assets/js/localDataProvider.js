angular.module('ionicApp').factory("localDataProvider", function (Restangular, $ionicPlatform, $cordovaSQLite, $q) {

    var factory = {};
    factory.db = null;
    factory.callback = function(){};

    factory.initDB = function() {
        if (factory.db == null){
            var deferred = $q.defer();
            console.log("sqllite openDB start");
            var dbName = "kurancalis.db";
            window.plugins.sqlDB.copy(dbName, 0, function () {
                console.log("sqllite db copied");
                factory.db = $cordovaSQLite.openDB(dbName);
                console.log("sqllite openDB end : 1");
                deferred.resolve();
            }, function (error) {
                console.error("There was an error copying the database: " + JSON.stringify(error));
                factory.db = $cordovaSQLite.openDB(dbName);
                console.log("sqllite openDB end : 2");
                deferred.resolve();
            });
            deferred.promise();
        }
    };

    factory.listAuthors = function (callback) {
        $cordovaSQLite.execute(factory.db, "SELECT name FROM sqlite_master WHERE type='table'").then(function(res){
            for (var i= 0; i < res.rows.length; i++ ){
                console.log("table ("+i+"): "+ JSON.stringify(res.rows.item(i)));
            }
        }, function(err){
            console.log("list all tables error !!! "+ JSON.stringify(err));
        });

        console.log("authors list called in localDataProvider. : ");
        var query = "SELECT * FROM author a order by a.display_order";
        $cordovaSQLite.execute(factory.db, query).then(function(res) {
            console.log(JSON.stringify("authors list result : " + res));
            var authors = [];
            if(res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++){
                    var item = res.rows.item(0);

                    authors.push({color : item.color,
                                   displayOrder : item.display_order,
                                   id : item.id,
                                   language : item.language,
                                   name : item.name,
                                   title : item.title});
                }
                callback(authors);
            } else {
                console.log("No results found for authors");
            }
            return authors;
        }, function (err) {
            console.error("list_authors " + JSON.stringify(err));
        });
    };

    factory.listFootnotes = function (args, callback) {
        console.log("list footness called.");
    };
    return factory;
});