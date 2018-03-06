// spec.js
//
var uyelik = require('./uyelik');

describe('ceviri gosterimi', function() {
	
  beforeEach(function() {
	        browser.get('http://kurancalis.com/#!/chapter/1/author/1040/verse/1');
	        
	       //browser.sleep(50000); // if your test is outrunning the browser
	       // browser.waitForAngular(); 
	       // pageLoadedStatus = true; 
    });
  
    function karala(elm, korx, kory) {
    	
    	browser.actions().doubleClick(elm).perform();
    	
    	 //browser.actions().
    	 //   mouseDown(elm).
    	 //   mouseMove({x: korx, y: kory}).
    	 //   mouseMove({x: korx, y: kory}).
    	 //   mouseMove({x: korx, y: kory}).
    	 //   mouseMove({x: korx, y: kory}).
    	 //   mouseUp().
    	 //   perform();	
    }
  
       it('Silinen not doğrulanması', function() {
       	
       	var uye = new uyelik();
       	
       	 uye.cikis();
         //uye.sil();
         uye.giris();
       	
    	    browser.sleep(10000);
    	    element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
    	   	
    	    browser.sleep(2000);
    	    element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
    	    browser.sleep(2000);
    	    
    	   	browser.refresh();
    	   	browser.sleep(10000);
    	   	
    	   	var elm = element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
    	
    	   	karala(elm,0,0);
    	   	
       	  	expect(element(by.id('cd-panel-right')).isDisplayed()).toBe(false);
       });
      
});