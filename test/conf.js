// conf.js

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

baseAddress='http://test.kurancalis.com';


exports.config = {
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    directConnect: true,
    specs: [
        //'spec1.js',
        //'spec2.js',
        //'spec4.js',
        //'spec5.js',
        //'spec6.js', //Tüm notlarda notu değiştirdiğimiz halde. Sureler bölümü sağ panelde değişmemiş hali geliyor.
        //'spec7.js',
        //'spec8.js',
        //'spec9.js',
        //'spec10.js', //Sağ panelde arama yaptığımızda etiket kelime ile arama başarısız sonuçlanıyor.
        'spec11.js', //GEÇMEDİ
        //'spec12.js',
        //'spec13.js'
    ],
    jasmineNodeOpts: {defaultTimeoutInterval: 360000},
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
        browser.manage().window().setSize(1300, 760);
    }
}