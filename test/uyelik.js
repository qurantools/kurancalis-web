

var sureler = require('./sure_ayet');


var uyelik = (function () {


	function uyelik() {

	}

    uyelik.prototype.sil = function () {

        browser.driver.get('https://securewebserver.net/jetty/qttest/rest/users/testdelete');

    };



    uyelik.prototype.cikis = function () {
        var sure = new sureler();
        sure.sayfa();

        element(by.css('[onclick="toggleLeftPanel()"]')).click();

        browser.sleep('1000');
        var cikis =  element(by.css('[ng-click="log_out()"]'));
        cikis.isPresent().then(function(result) {
            if ( result ) {
                cikis.click();
            } else {
                //Whatever if it is false (not displayed)
            }
        });
        browser.sleep('3000');

    };

    uyelik.prototype.giris = function () {


                var sure = new sureler();
                sure.sayfa();

                element(by.id('login')).click();
                browser.sleep(1000);

                var handlesPromise = browser.getAllWindowHandles();
                var handlesForLaterUse;

                var errorCb = function (err) {
                    console.log(err);
                };

                handlesPromise
                    .then(function(handles) {
                        handlesForLaterUse = handles;
                        return browser.switchTo().window(handles[1]);
                    }).then(function(handle) {
                        browser.driver.findElement(by.id('email')).sendKeys('kuran_calis@hotmail.com');
                        browser.driver.findElement(by.id('pass')).sendKeys('kurancalis114');
                        return browser.driver.findElement(by.name('login')).click();
                    }, errorCb).then(function() {
                        return browser.switchTo().window(handlesForLaterUse[0]);
                    }, errorCb).then(function () {

                        browser.sleep('3000');
                    });

    };

    return uyelik;

})();

module.exports = uyelik;
