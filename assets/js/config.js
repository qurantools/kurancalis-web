var config_module = angular.module('myConfig', []);

var config_data = {
    'webServiceUrl': 'https://securewebserver.net/jetty/qttest/rest',
    'webAddress': 'http://test.kurancalis.com',
    'mobileAddress': 'http://test.kurancalis.com/m/www',
   //  'mobileAddress': 'http://localhost:63342/kurancalis-web/m/www',
'isMobile':isMobile()
}

function isMobile() {
    //test for mobile
    var mobileTest = false;
    if (mobileTest == true) {
        return true;
    } else {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        }
        else {
            return false;
        }
    }

}