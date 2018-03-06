

var sureler = require('./sure_ayet');


var uyelik = (function () {


	function uyelik() {

	}

    uyelik.prototype.sil = function () {

        browser.driver.get('https://securewebserver.net/jetty/qttest/rest/users/testdelete');

    };



    uyelik.prototype.cikis = function () {

        browser.get(baseAddress+'/m/www/#!/inference/new/');
        browser.sleep('1000');
        element(by.css('[onclick="toggleLeftPanel()"]')).click();

        browser.sleep('1000');
        var cikis =  element(by.css('[ng-click="logOut()"]'));
        cikis.isPresent().then(function(result) {
            if ( result ) {
                cikis.click();
            } else {
                //Whatever if it is false (not displayed)
            }
        });
        browser.sleep('1000');

    };

    uyelik.prototype.giris = function () {


                var sure = new sureler();
                sure.sayfa();

                element(by.id('login')).click();
                browser.sleep(2000);

                var handlesPromise = browser.getAllWindowHandles();
                var handlesForLaterUse;

                var errorCb = function (err) {
                    console.log(err);
                };


                var clickConfirm = function(err){
                    browser.driver.findElement(by.name('__CONFIRM__')).click();
                    browser.sleep('3000');
                };

                var fillForm = function(err){
                    browser.driver.findElement(by.id('email')).sendKeys('kuran_calis@hotmail.com');
                    browser.driver.findElement(by.id('pass')).sendKeys('kurancalis114');
                    browser.driver.findElement(by.name('login')).click();
                    browser.sleep('3000');
                }

                handlesPromise
                    .then(function(handles) {
                        handlesForLaterUse = handles;
                        return browser.switchTo().window(handles[1]);
                    })
                    .then(function() {

                        browser.driver.findElement(by.name('__CONFIRM__')).then(function() {
                            console.log('First Confirm Element exists');
                            browser.driver.findElement(by.name('__CONFIRM__')).click();
                            return browser.switchTo().window(handlesForLaterUse[0]);
                        }, function(err) {
                            if (err.state && err.state === 'no such element') {
                                console.log('First Confirm Element not found');
                            } else {

                            }
                        });
                        //then in bitmesi icin burasi sart
                        return browser.sleep('1000');
                    }, errorCb)
                    .then(function() {

                        browser.driver.findElement(by.id('email')).then(function(){
                            browser.driver.findElement(by.id('email')).sendKeys('kuran_calis@hotmail.com');
                            browser.driver.findElement(by.id('pass')).sendKeys('kurancalis114');
                            browser.driver.findElement(by.name('login')).click();
                            console.log('Filled the form');
                            return;
                        }, function(err) {
                            if (err.state && err.state === 'no such element') {
                                console.log('Login Element not found');
                            } else {

                            }
                        });
                        //then in bitmesi icin burasi sart
                        return browser.sleep('1000');

                    },errorCb)
                    .then(function(){


                        browser.driver.findElement(by.name('__CONFIRM__')).then(function() {
                            console.log('Second Confirm  Element exists');

                            browser.driver.findElement(by.name('__CONFIRM__')).click();
                            return browser.switchTo().window(handlesForLaterUse[0]);
                        }, function(err) {
                            if (err.state && err.state === 'no such element') {
                                console.log('Second Confirm Element not found');
                                browser.switchTo().window(handlesForLaterUse[0]);
                            } else {
                                console.log('promise rejected');
                                console.log('Switching the window');
                                return browser.switchTo().window(handlesForLaterUse[0]);
                            }
                        });

                        //then in bitmesi icin burasi sart
                        return browser.sleep('1000');
                       /*
                        console.log('Wait after last confirm');
                        console.log('Switching the window');
                        return browser.switchTo().window(handlesForLaterUse[0]);
                        */

                    },errorCb);

    };

    return uyelik;

})();

module.exports = uyelik;
