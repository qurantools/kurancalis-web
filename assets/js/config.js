var config_module = angular.module('myConfig', []);



var config_data = {
    'webServiceUrl': 'https://securewebserver.net/jetty/qt/rest'
}
angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
});