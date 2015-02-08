//var ann = Annotator(document.body);
//ann.setupPlugins()

jQuery(function ($) {
    var rest_url='https://securewebserver.net/jetty/qt/rest/';
    $('#translations').annotator('addPlugin', 'Store', {
        prefix: 'https://securewebserver.net/jetty/qt/rest',
        urls: {
            // These are the default URLs.
            create:  '/annotations',
            update:  '/anotations/:id',
            destroy: '/annotations/:id',
            search:  '/search'
        }
    });
});