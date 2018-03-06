// spec.js
//
var uyelik = require('./uyelik');

describe('ceviri gosterimi', function() {
	
	  beforeEach(function() {
		  
		  browser.ignoreSynchronization = false;
	      browser.get(baseAddress + '/#!/chapter/1/author/1040/verse/1');
	      
	    });

   
    function karala(elm, korx, kory) {
    	
    	browser.actions().doubleClick(elm).perform();
    	
    }
    
function not_yaz(alan, not_deger) {
        
    	elm = element(by.id(alan)).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
       	
    	karala(elm, -40, 0);
    	element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
        element(by.model('annotationModalData.text')).sendKeys(not_deger);
        element(by.css('[value="red"]')).click();
        element(by.css('[ng-click="submitEditor2()"]')).click();
    }
	  
    it('Not ekleme', function() {
       	var uye = new uyelik();
       	
       	 uye.cikis();
         uye.sil();
         uye.giris();
         
       	//Üyenin not yazabilmesi ve yazdığı notla ilgili kelimenin aldığı renk seçtiği renkle eşit olma durumu kontrolu.
       	
    	browser.sleep(5000);
    	
       	not_yaz('t_49995', 'Deneme1');
       	
       	browser.sleep(2000);
       	
       	element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).getText().then(function(text) {
       		 expect(text).toBe('Rahim');	
           });
           
        not_yaz('t_31182', 'Deneme2');
       	
       	browser.sleep(2000);
       	
       	element(by.id('t_31182')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).getText().then(function(text) {
       		 expect(text).toBe('Rahim');	
           });
           
           
        not_yaz('t_50001','Deneme3');
       	
       	browser.sleep(2000);
       	
       	element(by.id('t_50001')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).getText().then(function(text) {
       		 expect(text).toBe('dökülmemişlerin');	
        });
       	     	
       	browser.sleep(2000);
       	elm = element(by.id('t_50001')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="annotator-hl a_hl_red"]'));
       	
       	browser.actions().doubleClick(elm).perform();
       	     	
       	browser.sleep(2000);
       	
       	element(by.css('[class="fa fa-trash-o"]')).click();
       	
       	browser.sleep(2000);
       	
       	var d1 = element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText();
       	browser.sleep(2000);
       	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
       	browser.sleep(2000);
       	expect(element(by.model('annotationModalData.text')).getAttribute('value')).toBe(d1);	
       	
       	element(by.css('[ng-click="submitEditor2()"]')).click();
       	browser.sleep(2000);
       	
       	var d2 = element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_text"]')).getText();
        browser.sleep(2000);
       	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
       	browser.sleep(2000);
       	expect(element(by.model('annotationModalData.text')).getAttribute('value')).toBe(d2);	
       
        element(by.css('[ng-click="submitEditor2()"]')).click();
       	browser.sleep(2000);
       
       	var d3 = element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).element(by.css('[class="s_a_text"]')).getText();
        browser.sleep(2000);
       	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
       	browser.sleep(2000);
       	expect(element(by.model('annotationModalData.text')).getAttribute('value')).toBe(d3);	
       
        element(by.css('[ng-click="submitEditor2()"]')).click();
       	browser.sleep(2000);
       	element(by.css('[onclick="closePanel()"]')).click();
       	browser.sleep(2000);
       	
        elm = element(by.id('t_50001')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="annotator-hl a_hl_red"]'));
       	browser.actions().doubleClick(elm).perform();
       	browser.sleep(2000);
       	
       	var d1 = element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText();
       	browser.sleep(2000);
       	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
       	browser.sleep(2000);
       	expect(element(by.model('annotationModalData.text')).getAttribute('value')).toBe(d1);	
       	
       	element(by.css('[ng-click="submitEditor2()"]')).click();
       	
       	browser.sleep(5000);
//       	//Üyenin yazdığı notun sağda açılan ekranda görüldüğünün kontrolu.
//       	   
//       	element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
//       	 //karala(elm, 0, 0);
//       
//       	 element(by.css('[class="s_a_text"]')).getText().then(function(text) {
//       		 expect(text).toBe(not_deger);	
//       	 });   	
//       
//       	 
//       	element(by.css('[onclick="closePanel()"]')).click();
//       							
//       		browser.sleep(2000);
//    	    element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
//    	   	
//    	    browser.sleep(2000);
//    	    element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
//    	    browser.sleep(2000);
//    	    
//    	   	browser.refresh();
//    	   	browser.sleep(10000);
//    	   	
//    	   	var elm = element(by.id('t_49995')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
//    	
//    	   	karala(elm,0,0);
//    	   	
//       	  	expect(element(by.id('cd-panel-right')).isDisplayed()).toBe(false);
//       //Üyenin yaptığı karalamada karalama alanını aştığında uyarı vermesinin kontrolu.

//    	 browser.sleep(2000);
//    	 
//    	 elm = element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
//    	 karala(elm, 0, 10);
//    	 
//    	 browser.actions().keyDown(protractor.Key.SHIFT).perform();
//    	 element(by.id('t_49996')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).click();
//    	 browser.actions().keyUp(protractor.Key.SHIFT).perform();
//    	 
//    	 element(by.css('[class="annotator-notice annotator-notice-show annotator-notice-error"]')).getText().then(function(text) {
//    		 expect(text).toBe('Sadece meal içerisini karalamalısınız');	
//        });	
//    	 
     });
    
});