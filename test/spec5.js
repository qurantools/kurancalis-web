// spec.js
//

describe('ceviri gosterimi', function() {

	 beforeEach(function() {
	        browser.get('http://kurancalis.com/#/chapter/1/author/1040/verse/1');
	 });
     
	 function not_yaz_yeni(not_deger) {
    
		 elm = element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
   	
		 browser.actions().doubleClick(elm).perform();
		 element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
		 element(by.model('annotationModalData.text')).sendKeys(not_deger);
		 element(by.css('[value="red"]')).click();
		 element(by.css('[ng-click="submitEditor()"]')).click();
	 }

	 it('Liste halinde not gösterim', function() {
      	 
    	   browser.refresh();
    	   browser.sleep(5000);
    	   
    	   var not_deger='Test1';
        	
   		//ilk karalama ile alana not yazıyor. Kırmızı işaretlenir.		         
        	not_yaz_yeni(not_deger);
        	
        	 browser.sleep(5000);
        	 
        	//ilk not ile başka bir kelime beraber karalanır not eklenir. Yeşil işaretlenir.
           var elm = element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
        	//karala(elm, 0, 10);
           browser.actions().mouseMove(elm,{x: 58, y: 0}).doubleClick().perform();
           
           browser.actions().keyDown(protractor.Key.SHIFT).perform();
           element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
      	 
           element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
           element(by.model('annotationModalData.text')).sendKeys('Test2');
           element(by.css('[value="green"]')).click();
           element(by.css('[ng-click="submitEditor()"]')).click();
           
           browser.sleep(5000);
        	
           element(by.css('[class="cd-panel from-right ng-scope is-visible"]')).click();
    	   	   	
           browser.sleep(5000);
        	
        	//iki işaretli bölgenin kesişme alanı işaretlenir.
	           
           element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).element(by.css('[class="annotator-hl a_hl_green"]')).click();
	       	
           element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText().then(function(text) {
        	   expect(text).toBe('Test1');	
	       	});
        	 
        	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_text"]')).getText().then(function(text) {
        		expect(text).toBe('TEST\'');	
        	});
        	
        	browser.sleep(5000);
        	
        	element(by.css('[class="cd-panel from-right ng-scope is-visible"]')).click();
	   	   	
        	browser.sleep(5000);
        	
        	//Başka bir ayet işaretlenir not yazılır ve sarı işaretlenir.
        	elm = element(by.id('t_31183')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
          	
        	browser.actions().doubleClick(elm).perform();
       	
        	browser.sleep(5000);
       	
        	element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
        	element(by.model('annotationModalData.text')).sendKeys('Test3');
        	element(by.css('[value="yellow"]')).click();
        	element(by.css('[ng-click="submitEditor()"]')).click();
        	
        	browser.sleep(5000);
        	
           //İlk not yazılan alan işaretlenir ve filtre kaldırılır.
        	element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).element(by.css('[class="annotator-hl a_hl_green"]')).click();
        	
        	browser.sleep(5000);
        	
        	element(by.css('[ng-click="resetAnnotationFilter()"]')).click();
        	
        	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText().then(function(text) {
        		expect(text).toBe('Test1');	
        	});
        	 
        	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_text"]')).getText().then(function(text) {
        		expect(text).toBe('TEST\'');	
        	});
        	 
        	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).element(by.css('[class="s_a_text"]')).getText().then(function(text) {
	    	expect(text).toBe('Test3');	
	        });
        	
        	browser.sleep(5000);
        	
        	//Not değiştirilir.
        	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="fa fa-pencil-square-o"]')).click();
        	element(by.model('annotationModalData.text')).clear();
        	element(by.model('annotationModalData.text')).sendKeys('Test2 Değişti');
        	element(by.css('[value="yellow"]')).click();
	        element(by.css('[ng-click="submitEditor()"]')).click();
            
	        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_text"]')).getText().then(function(text) {
	    		  expect(text).toBe('Test2 Değişti');	
	         });
	        
	        browser.sleep(5000);
	        
	        browser.refresh();
	        
	        browser.sleep(5000);
	        
	        
	        element(by.id('t_31181')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
	       	
        	browser.sleep(5000);
        	
        	//Nota tıklandığında ilgili ayete gidiş.
        	element(by.css('[ng-click="resetAnnotationFilter()"]')).click();
        	
        	browser.sleep(5000);
        	
        	element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).click();
        	
        	browser.sleep(5000);
        	
        	//Yazılan notlar tek tek silinir.
        	
	        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[ng-click="deleteAnnotation($index)"]')).click();
	        
	        var lcnt = element.all(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch'));
	   	   	expect(lcnt.count()).toEqual(2); 
	        
	   	   	browser.sleep(5000);
	        
	        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
	        expect(lcnt.count()).toEqual(1); 
	       
	        browser.sleep(5000);
	        
	        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
	        expect(lcnt.count()).toEqual(0); 
		
	        browser.sleep(5000);
       });
});