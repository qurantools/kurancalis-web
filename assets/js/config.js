var config_module = angular.module('myConfig', []);

var config_data = {
    'webServiceUrl': 'https://securewebserver.net/jetty/qt/rest',
    'isMobile':isMobile()
}

function isMobile() {
    //test for mobile
    //return true;

    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}