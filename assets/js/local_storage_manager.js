/**
 * Created by oksuztepe on 18/06/16.
 */

/*
sample variables
var variables=[{
    name:"usersForSearch",
    getter: function(){ return $scope.getAnnotationSearchAuthorMask(); },
    setter: function(data){ return $scope.setAnnotationSearchAuthorMask(data); },
    isExistInURL: true,
    isBase64: false
    default: 250
    },
    {
     name:"allAnnotationsOrderBy",
     getter: null,
     setter: null,
     isExistInURL: true,
     isBase64: true,
     default: []
    }
   ]
*/
function LocalStorageManager(name, localStorageService,variables ){
    this.name=name;
    this.variables=variables;
    this.localStorageService = localStorageService;
}

//initializes scope variables from local storage and route params or default values otherwise.
LocalStorageManager.prototype.initializeScopeVariables = function(scope,routeParams){


    var index;
    //get data from local storage
    var localParameterData = this.localStorageService.get(this.name+"_parameters");
    var isEmptyLocalData=false;

    if (localParameterData == null) {
        localParameterData = {};
    }

    for (index = 0; index < this.variables.length; ++index) {

        var name = this.variables[index].name;
        var value = this.variables[index].default; // assign default value
        var valueFromRoute = false;



        if (this.variables[index].isExistInURL && typeof routeParams[name] !== 'undefined') { //if exists on route params force its value
            if( this.variables[index].isBase64 == true){ //if it is object array
                try {
                    value = JSON.parse(Base64.decode(routeParams[name]));
                    valueFromRoute = true;
                }
                catch (err) {
                    console.log(err);
                    value=[];
                    valueFromRoute = true;
                }
            }
            else{
                value = routeParams[name];
                valueFromRoute = true;
            }



        }

        //assign the default value if no local
        //assign route param although local param exist
        //let local data used if no route param.

        if(valueFromRoute  || !isDefined(localParameterData[name])) {
            localParameterData[name] = value;
        }


    }

    this.restoreVariables(scope,localParameterData);
    this.storeVariables(scope);

};


LocalStorageManager.prototype.getPageParameters = function(scope){
    var parameters = {};
    var index;

    for (index = 0; index < this.variables.length; ++index) {

        var name = this.variables[index].name;
        if (this.variables[index].getter != null) { //use getter function if exist
            parameters[name] = this.variables[index].getter();
        }
        else {
            if (this.variables[index].isBase64 == true) { //if it is object array
                try {
                    parameters[name] = Base64.encode(JSON.stringify(scope[name]));
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                parameters[name] = scope[name];
            }
        }


    }

    return parameters;

};

LocalStorageManager.prototype.storeVariables = function(scope){

    var localParameterData = {};

    var index;

    for (index = 0; index < this.variables.length; ++index) {

        var name = this.variables[index].name;
        if(this.variables[index].getter != null){
            localParameterData[name] = this.variables[index].getter();
        }
        else{
            localParameterData[name] = scope[name];
        }

    }

    this.localStorageService.set(this.name+'_parameters', localParameterData);

};


LocalStorageManager.prototype.restoreVariables = function(scope, localParameterData){

    var index;

    for (index = 0; index < this.variables.length; ++index) {

        var name = this.variables[index].name;
        if(this.variables[index].getter != null){
            this.variables[index].setter(localParameterData[name]);
        }
        else{
            scope[name]=localParameterData[name];
        }

    }

};

