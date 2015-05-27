var authorizationModule = angular.module('authorizationModule', [])
    .factory("authorization", function () {
        return {
            login: function () {
                console.log("login");
            },
            logout: function () {
                console.log("logout");
            },
            test: "testtt"
        }
    }
);