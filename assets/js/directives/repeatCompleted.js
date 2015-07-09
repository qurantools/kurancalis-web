// -------------------------------------------------- //
// -------------------------------------------------- //


// I invoke the given expression when associated ngRepeat loop
// has finished its first round of rendering.
angular.module('directives.repeatCompleted', []).directive(
    "repeatCompleted",
    function   () {
        return function(scope, element, attrs) {
            if (scope.$last) { // all are rendered
                scope.$eval(attrs.repeatCompleted);
            }
        }
      
    });
        
