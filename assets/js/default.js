//var ann = Annotator(document.body);
//ann.setupPlugins()

jQuery(function ($) {
    var rest_url='https://securewebserver.net/jetty/qt/rest/';
    $('#mealler').annotator('addPlugin', 'Store', {
        urls: {
            // These are the default URLs.
            create:  rest_url+'annotations',
            update:  rest_url+'annotations/:id',
            destroy: rest_url+'annotations/:id',
            search:  '/search'
        }
    });
});