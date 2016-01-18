var config_module = angular.module('myConfig', []);

//var domain = "http://kurancalis.com";
//var domain = "http://test.kurancalis.com";
var domain = "http://localhost:63342/kurancalis-web";

var config_data = {
    'webServiceUrl': 'https://securewebserver.net/jetty/qttest/rest',
    //'webServiceUrl': 'http://localhost:8080/QuranToolsApp/rest',
    'webAddress': domain,
    'mobileAddress': domain+'/m/www',
    'mobileLoginCallbackAddress': domain +'/m/www/components/mobile_auth/login_callback.html',
    'FBAppID': '400142910165594',
    //'FBAppID': '506964319483452',
    'clientSecret':'e1c0f664bd3e803fce38a8d6399dba2d',
    'version':"1.4",
    'isMobile':isMobile()
}

var MAX_AUTHOR_MASK = "2147483647"; //32 authors

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