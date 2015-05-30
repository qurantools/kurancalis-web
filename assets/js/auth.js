var authorizationModule = angular.module('authorizationModule', ['facebook', 'LocalStorageModule','restangular']);

authorizationModule.factory('User', function ($resource) {

    return $resource(config_data.webServiceUrl + '/users',
        {},

        {
            query: {
                method: 'GET',
                headers: {
                    "access_token": this.accessToken
                },
                isArray: false
            },
            save: {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                isArray: false
            }
        }
    );
}).


    factory("authorization", function (Facebook, User, localStorageService,Restangular) {
        fbLoginStatus = 'disconnected';
        facebookIsReady = false;
        var factory = {};

        factory.login = function () {


            Facebook.login(function (response) {
                fbLoginStatus = response.status;
                tokenFb = response.authResponse.accessToken;
                if (tokenFb != "") {
                    access_token = "";
                    var user = new User();

                    user.fb_access_token = tokenFb;
                    user.$save({fb_access_token: tokenFb},
                        function (data, headers) {
                            //get token
                            access_token = data.token;
                            //set cookie
                            localStorageService.set('access_token', access_token);
                            //get user information
                            factory.get_user_info();

                                loggedIn = true;
//                                $scope.list_translations();

                        },
                        function (error) {
                            if (error.data.code == '209') {
                                alert("Sisteme giriş yapabilmek için e-posta adresi paylaşımına izin vermeniz gerekmektedir.");
                            }
                                factory.log_out();
//                                $scope.access_token = error;
                        }
                    );

                }

            }, {scope: 'email'});
        };


        factory.get_user_info = function () {
            var usersRestangular = Restangular.all("users");
            //TODO: document knowhow: custom get with custom header
            usersRestangular.customGET("", {}, {'access_token': access_token}).then(function (theUser) {
                    user = theUser;
                }
            );
        };

        factory.logout = function () {
            console.log("logout");
        };

        return factory;
    });