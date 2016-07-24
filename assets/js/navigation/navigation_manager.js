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

    factory.openModal = function (data) {
        var length = modalHistory.length;
        if (length>0){
            var currentModalData = modalHistory[length-1];
            currentModalData.modal.hide();
        }
        modalHistory.push(data);
        data.modal.show();
    };

    factory.closeModal = function () {

        var currentModalData = modalHistory.pop(); //remove current modal
        var currentModal = currentModalData.modal;
        if (modalHistory.length != 0){
            var previousModalData = modalHistory.pop(); //remove previous modal

            $timeout(function(){
                $rootScope.$broadcast(previousModalData.broadcastFunction, previousModalData.args);
            });
        }
        currentModal.hide();
    };

    factory.reset = function (){
        for (var i in modalHistory){
            modalHistory[i].modal.hide();
        }
        modalHistory = [];
    }

    return factory;
});