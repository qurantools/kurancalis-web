// spec.js
//

describe('ceviri gosterimi', function() {
	
	  beforeEach(function() {
	        browser.get('http://kurancalis.com/#/chapter/1/author/1040/verse/1');
	        
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
 
       it('Etiket işlemleri', function() {
    	   
	    	 var not_deger='ASlqwertyuıopğü,işlkjhgfdsazxcvbnmöç.:;<>1234567890';
	  	    	
	   	   	 elm = element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
	   	   	   	
	   	   	 //karalama yapıyor not ve etiket ekliyor
	   	   	 
	   	   	 karala(elm, -12, 0);
	   	   	 element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	   	   	 element(by.model('annotationModalData.text')).sendKeys(not_deger);
	   	   	 element(by.model('newTag.text')).sendKeys('Test1');
	   	   	 element(by.css('[value="red"]')).click();
	   	   	 element(by.css('[ng-click="submitEditor()"]')).click();
	   	   	 
	   	   	  element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
	   	   	 
	   	   	 //eklenen etiketi sağ paneli açıp kontrol ediyor.
	   	   	 
	   	   	 var lcnt = element.all(by.repeater('annotationTag in annotation.tags'));
	   	   	 
	   	   	 expect(lcnt.count()).toEqual(1);   	   	
	   	  
	   	    element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(0)).getText().then(function(text) {
	    		  expect(text).toBe('Test1');	
	         });
	   	   	 
	   	   	browser.sleep(2000);
	   	   	
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
	   	   	 
	   	     //Nota iki adet daha etiket ekliyor
	   	   	 
	   	   	 element(by.model('newTag.text')).sendKeys('Test2');
	   	   	 element(by.model('annotationModalData.text')).click();
	   	   	 element(by.model('newTag.text')).sendKeys('Test3');
	   	   	 element(by.model('annotationModalData.text')).click();
	   	   	 element(by.css('[ng-click="submitEditor()"]')).click();
	   	   	 
	   	    //eklenen etiketleri sağ paneli açıp kontrol ediyor.
	   	   	 
	   	   	 expect(lcnt.count()).toEqual(3);
	   	   	
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(0)).getText().then(function(text) {
    		  expect(text).toBe('Test1');	
	   	   	 });
	   	   	 
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(1)).getText().then(function(text) {
    		  expect(text).toBe('Test2');	
	   	   	 });
	   	   	 
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(2)).getText().then(function(text) {
    		  expect(text).toBe('Test3');	
	   	   	 });
	   	   	 
	   	   	 browser.sleep(2000);
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
	   	   		
	   	   	 //eklenen etiketten ortada olanı siliyor.
	   	   	 
	   	     element(by.repeater('tag in tagList.items track by track(tag)').row(1)).element(by.css('[class="remove-button ng-binding"]')).click();
	   	     element(by.css('[ng-click="submitEditor()"]')).click();
	   	    
	   	     browser.sleep(2000);	     
	     	 
	   	     //silinen etiketi sağ paneli açıp kontrol ediyor.
	   	   	 
	   	  expect(lcnt.count()).toEqual(2);
	   	  
	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(0)).getText().then(function(text) {
   		  expect(text).toBe('Test1');	
	   	   	 });
	   	   	 
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(1)).getText().then(function(text) {
   		  expect(text).toBe('Test3');	
	   	   	 });
	   	   	 
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
	   	   	
	   	     //eklenen diğer etiketleri siliyor.
	   	   	 
	   	   	 element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[class="remove-button ng-binding"]')).click();
	   	   	 element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[class="remove-button ng-binding"]')).click();
	   	   	 element(by.css('[ng-click="submitEditor()"]')).click();
	   	   	 
	   	   	 //silinen etiketleri sağ paneli açıp kontrol ediyor.
	   	   	 
	   	   	 expect(lcnt.count()).toEqual(0);
	   	   	 
	   	   	 //notu siliyor.
	   	   	 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
	   	   	
  	    });
       
});