// conf.js

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec.js'],
    jasmineNodeOpts: {defaultTimeoutInterval: 180000},
    multiCapabilities: [
    /*    {
        browserName: 'firefox'
    }
    */
    /*    ,*/
        {
        browserName: 'chrome'
    }
    ],
    onPrepare: function() {
        browser.manage().window().setSize(1000, 700);
    }
}