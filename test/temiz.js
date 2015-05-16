var sureler = require('./sure_ayet');

describe('ceviri gosterimi', function() {
	 
	  it('Not ekleme', function() {
	
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
		    	  
		  browser.ignoreSynchronization = true;
		  browser.get('https://securewebserver.net/jetty/qttest/rest/users/testdelete');
	      
		      });	
	  });
	  	  
});