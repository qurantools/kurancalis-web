/**
 * Created by mgungoren on 25.6.2016.
 */

/*
 sample variables
 var variables=[{
         broadcastFunction = "detailedVerse"
         data: data
    }
 ]
 */

angular.module('ionicApp').factory("navigationManager", function ($rootScope, $timeout) {
    var factory = {};

    var modalHistory = [];

    factory.storeModal = function (args) {
        modalHistory.push(args);
    };

    factory.closeMe = function () {
        /*if (modalHistory.length == 0)
            return;
        if (modalHistory.length == 1){
            modalHistory.pop();
            return;
        }
        modalHistory.pop(); //remove last item
        var lastItem = modalHistory[modalHistory.length-1];
        $timeout(function(){
            $rootScope.$broadcast(lastItem.broadcastFunction, lastItem.data);
        });*/
    };

    return factory;
});