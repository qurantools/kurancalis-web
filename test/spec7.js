var uyelik = require('./uyelik');
describe('ceviri gosterimi', function() {
	
	var aramabtn = element.all(by.css('[class="caret pull-right"]'));
	var aramakutu = element(by.model('$select.search'));
	
	var yazarbtn = element.all(by.css('[class="fa fa-user"]'));
	var yazargnd = element(by.css('[ng-click="updateAuthors()"]'));
	
	var tmpautid1;
	var tmpautid2;
	
function listTranslations(chapterNo, autid1) {
    	
    	aramabtn.click();
    	
    	aramakutu.clear();
    	aramakutu.sendKeys(chapterNo);
    	aramakutu.sendKeys(protractor.Key.ENTER);
    	
    	yazarbtn.click();
        
    	if(tmpautid1==null)
    	{
    		element(by.repeater('author in authors').row(4)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
    	    element(by.repeater('author in authors').row(10)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
    	}
    	else
    		{
    		element(by.repeater('author in authors').row(tmpautid1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
    	    }
    		
    	
   	 element(by.repeater('author in authors').row(autid1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
           
    	yazargnd.click();
    	
    	//element(by.id('list_translations')).click();
   	 
   	 tmpautid1=autid1;
   	 
    }

function listTranslations2(chapterNo, autid1, autid2) {
	
	aramabtn.click();
	
	aramakutu.clear();
	aramakutu.sendKeys(chapterNo);
	aramakutu.sendKeys(protractor.Key.ENTER);
	
	yazarbtn.click();
    
	if(tmpautid1==null)
	{
		element(by.repeater('author in authors').row(4)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	    element(by.repeater('author in authors').row(10)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	}
	else
		{
		element(by.repeater('author in authors').row(tmpautid1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
		}
		
	
	 element(by.repeater('author in authors').row(autid1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	 element(by.repeater('author in authors').row(autid2)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	       
	yazargnd.click();
	
	//element(by.id('list_translations')).click();
	 
	 tmpautid1=autid1;
	 tmpautid2=autid2;
	 
}

	  beforeEach(function() {
	        browser.get(baseAddress + '/#/chapter/1/author/1040/verse/1');
	        
	       //browser.sleep(50000); // if your test is outrunning the browser
	       // browser.waitForAngular(); 
	       // pageLoadedStatus = true; 
	    });
		  
	 it('Not ekleme', function() {
	       	   
	       	      var uye = new uyelik();
       	
       	 uye.cikis();
         uye.sil();
         uye.giris();
          
	    	 listTranslations(2, 4);
	    	  
	    	  var elm = element(by.id('t_31193')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  
	    		element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('7');
	    		element(by.id('list_translations')).click();
	    			
	    		browser.sleep(5000);
	    		
	    		browser.actions().mouseMove(elm,{x: 100, y: 0}).doubleClick().perform();
	    		
	    	    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	    	    element(by.model('annotationModalData.text')).sendKeys('Test1');
	    	    element(by.model('newTag.text')).sendKeys('EkT1');
	    	    element(by.model('annotationModalData.text')).click();
	    	    element(by.model('newTag.text')).sendKeys('EkT2');
	    	    element(by.css('[value="green"]')).click();
	    	    element(by.css('[ng-click="submitEditor2()"]')).click();
			  
			  browser.sleep(3000);
	           listTranslations(3, 4);
	    	  
	    	  elm = element(by.id('t_31477')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  
	    	  	element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('5');
	    		element(by.id('list_translations')).click();
	    			
	    		browser.sleep(5000);
	    		
	    		browser.actions().mouseMove(elm,{x: 100, y: 0}).doubleClick().perform();
	    		
	    	    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	    	    element(by.model('annotationModalData.text')).sendKeys('Test2');
	    	    element(by.model('newTag.text')).sendKeys('EkT1');
	    	    element(by.css('[value="red"]')).click();
	    	    element(by.css('[ng-click="submitEditor2()"]')).click();	    	    
			  
	listTranslations(70, 4);
		    	  
	    	  	elm = element(by.id('t_36561')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  
	    	  	element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('10');
	    		element(by.id('list_translations')).click();
	    			
	    		browser.sleep(5000);
	    		
	    		browser.actions().mouseMove(elm,{x: 100, y: 0}).doubleClick().perform();
	    		
	    	    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	    	    element(by.model('annotationModalData.text')).sendKeys('Test3');
	    	    element(by.model('newTag.text')).sendKeys('EkT1');
	    	    element(by.model('annotationModalData.text')).click();
	    	    element(by.model('newTag.text')).sendKeys('EkT2');
	    	    element(by.model('annotationModalData.text')).click();
	    	    element(by.model('newTag.text')).sendKeys('EkT3');
	    	    element(by.css('[value="yellow"]')).click();
	    	    element(by.css('[ng-click="submitEditor2()"]')).click();
	    	    
	listTranslations(70, 4);
		    	  
	    	  	elm = element(by.id('t_36562')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  
	    	  	element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('11');
	    		element(by.id('list_translations')).click();
	    			
	    		browser.sleep(5000);
	    		
	    		browser.actions().mouseMove(elm,{x: 100, y: 0}).doubleClick().perform();
	    		
	    	    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	    	    element(by.model('annotationModalData.text')).sendKeys('Test6');
	    	    element(by.model('newTag.text')).sendKeys('EkT1');
	    	    element(by.css('[value="red"]')).click();
	    	    element(by.css('[ng-click="submitEditor2()"]')).click();
	    	    
	listTranslations(74, 4);
	    	  
				elm = element(by.id('t_36705')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  
				element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('34');
	    		element(by.id('list_translations')).click();
	    			
	    		browser.sleep(5000);
	    		
	    		browser.actions().mouseMove(elm,{x: 120, y: 0}).doubleClick().perform();
	    		
	    	    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	    	    element(by.model('annotationModalData.text')).sendKeys('Test4');
	    	    element(by.model('newTag.text')).sendKeys('EkT2');
	    	    element(by.css('[value="red"]')).click();
	    	    element(by.css('[ng-click="submitEditor2()"]')).click();
	    	   
			  
	listTranslations(114, 4);
	    	  
	    	  	elm = element(by.id('t_37412')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  
	    	  	element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('6');
	    		element(by.id('list_translations')).click();
	    			
	    		browser.sleep(5000);
	    		
	    		browser.actions().mouseMove(elm,{x: 100, y: 0}).doubleClick().perform();
	    		
	    	    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
	    	    element(by.model('annotationModalData.text')).sendKeys('Test5');
	    	    element(by.model('newTag.text')).sendKeys('EkT1');
	    	    element(by.model('annotationModalData.text')).click();
	    	    element(by.model('newTag.text')).sendKeys('EkT3');
	    	    element(by.css('[value="yellow"]')).click();
	    	    element(by.css('[ng-click="submitEditor2()"]')).click(); 
	    	    
	    	    
	    	    listTranslations2(70, 4, 10);
	    	    element(by.model('$parent.verse.number')).clear();
	    		element(by.model('$parent.verse.number')).sendKeys('10');
	    		element(by.id('list_translations')).click();
	    		
	    		browser.sleep('5000');
	    		 
	    		//Etikete tıklanarak açılıyor.
	    		element(by.id("v_70010")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON').row(0)).element(by.css('[ng-click="goToVerseTag(verse.id,verseTag.tag)"]')).click();
	      
	    		browser.sleep('5000');
	    		
	    		//Etiket ebatının ve renginin değiştirildiği doğrulanıyor.
	    		element(by.id("v_70010")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON').row(0)).element(by.css('[class="btn verse_tag ng-binding btn-warning btn-sm"]')).getText().then(function(text) {
		    		  expect(text).toBe('ekt1');	
		        });
	    		
	    		//Tıklanan etikette ayetler doğrulanıyor.
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(1)).getText().then(function(text) {
		    		  expect(text).toBe('3:5 Yerde ve gökte hiçbir şey ALLAH\'a gizli kalmaz.');	
		        });
	    		
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(3)).getText().then(function(text) {
		    		  expect(text).toBe('70:11 Birbirlerine gösterilirler. Suçlu, o günün azabından kurtulmak için fidye vermek ister: Oğullarını,');	
		        });
	    		
	    		//Yazar Değiştiriliyor.
	    		element(by.id("v_70010")).element(by.model('verseTagContentAuthor')).click();
	    		element(by.css('[value="1"]')).click();
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(3)).click();
	    		
	    		//Değişen yazarda yorumların değiştiği doğrulanıyor.
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(1)).getText().then(function(text) {
		    		  expect(text).toBe('3:5 Allah... Gökte ve yerde hiçbir şey O\'na gizli kalmaz.');	
		        });
	    		
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(3)).getText().then(function(text) {
		    		  expect(text).toBe('70:11 Birbirlerine gösterilirler. Suçlu, o günün azabından kurtulmak için oğullarını fidye vermeyi bile ister.');	
		        });
	    		
	    		browser.sleep('5000');
	    		
	    		//Diğer etiket tıklanıyor.
	    		element(by.id("v_70010")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON').row(0)).element(by.css('[class="btn btn-xs btn-info verse_tag ng-binding"]')).click();
	  	      
	    		browser.sleep('5000');
	    		
	    		//Etiket ebatının ve renginin değiştirildiği doğrulanıyor.
	    		element(by.id("v_70010")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON').row(0)).element(by.css('[class="btn verse_tag ng-binding btn-warning btn-sm"]')).getText().then(function(text) {
		    		  expect(text).toBe('ekt2');	
		        });
	    		
	    		//Etiket değiştirildiğinde önceki etikette seçili olan yazarın seçili olarak görülmesinin doğrulanması.
	    		
	    		expect(element(by.id("v_70010")).element(by.model('verseTagContentAuthor')).getAttribute('value')).toEqual('1');
	    		
	    		
	    		//Tıklanan etikette ayetler doğrulanıyor.
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(0)).getText().then(function(text) {
		    		  expect(text).toBe('2:7 Allah onların kalpleri, kulakları üzerine mühür basmıştır. Onların kafa gözleri üstünde de bir perde vardır. Onlar için korkunç bir azap öngörülmüştür.');	
		        });
	    		
	    		element(by.id("v_70010")).element(by.repeater('verseTagContentTranslation in verseTagContent.translations').row(2)).getText().then(function(text) {
		    		  expect(text).toBe('74:34 Andolsun sabaha, ağarıp ışıdığında,');	
		        });
	    		
	    		//Diğer ayetteki etiket tıklanıyor.
	    		element(by.id("v_70011")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON').row(0)).element(by.css('[class="btn btn-xs btn-info verse_tag ng-binding"]')).click();
	  	      
	    		browser.sleep('5000');
	    		
	    		//Önceki ayetteki listenin kapandığı doğrulanıyor.
	    		expect(element(by.id("v_70010")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON')).element(by.model('verseTagContentAuthor')).isPresent()).toBeFalsy();
	    		
	    		//Açık olan etiketin listesi kapatılıyor ve doğrulanıyor.
	    		element(by.id("v_70011")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON').row(0)).element(by.css('[class="btn verse_tag ng-binding btn-warning btn-sm"]')).click();
	    		expect(element(by.id("v_70011")).element(by.repeater('(verseTagsKey, verseTagsVal) in verseTagsJSON')).element(by.model('verseTagContentAuthor')).isPresent()).toBeFalsy();
	      
	    		//İşlemlerin silinmesi.
	      
	    		 browser.sleep('3000');
				 
				 element(by.css('[class="fa fa-bars"]')).click();
				 browser.sleep("5000");
				 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
				 browser.sleep("2000");
				 
	    		 browser.executeScript('window.scrollTo(0,0);');
				 
				 var cnt;
				 
				 for(var x=0; x<6;x++)
					 {
					   element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="deleteAnnotation2(annotation)"]')).click();
					   browser.sleep("1000");
					 }
	      
		  	browser.sleep(10000);
		 });	
});