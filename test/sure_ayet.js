var sureler = (function () {
   
	var aramabtn = element.all(by.css('[class="caret pull-right"]'));
	var aramakutu = element(by.model('$select.search'));
	
	var yazarbtn = element.all(by.css('[class="fa fa-user"]'));
	var yazargnd = element(by.css('[ng-click="updateAuthors()"]'));
	
	var tmpautid1;
	var tmpautid2;
	var tmpautid3;
	var tmpautid4;
	
	 function sureler() {
	       
	    }
	 
	 sureler.prototype.sayfa = function () {
	    	browser.get('http://kurancalis.com/#/chapter/1/author/1040/verse/1');
	    };
	    
	    sureler.prototype.sureyegit = function (sure) {
	    	aramabtn.click();
	    	
	    	aramakutu.clear();
	    	aramakutu.sendKeys(sure);
	    	browser.sleep('1000');
	    	aramakutu.sendKeys(protractor.Key.ENTER);
	    	element(by.id('list_translations')).click();
	    };
	    
	    sureler.prototype.sureayetegit = function (sure, ayet) {
	    	aramabtn.click();
	    	
	    	aramakutu.clear();
	    	aramakutu.sendKeys(sure);
	    	browser.sleep('1000');
	    	aramakutu.sendKeys(protractor.Key.ENTER);
	    	element(by.model('$parent.verse_number')).clear();
    		element(by.model('$parent.verse_number')).sendKeys(ayet);
	    	element(by.id('list_translations')).click();
	    	
	    	browser.sleep('5000');
	    };
	    
	    sureler.prototype.yazaragit = function (yazar1, yazar2, yazar3, yazar4) {
	    	
	    	yazarbtn.click();
	        
	    	if(tmpautid1==null)
	    	{
	    		element(by.repeater('author in authors').row(4)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	    	    element(by.repeater('author in authors').row(10)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	    	}
	    	else
	    		{
	    		element(by.repeater('author in authors').row(tmpautid1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	    		element(by.repeater('author in authors').row(tmpautid2)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	    		element(by.repeater('author in authors').row(tmpautid3)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	    		element(by.repeater('author in authors').row(tmpautid4)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
		    	}
	    	
	    	 element(by.repeater('author in authors').row(yazar1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	     	 element(by.repeater('author in authors').row(yazar2)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	     	 element(by.repeater('author in authors').row(yazar3)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	     	 element(by.repeater('author in authors').row(yazar4)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
	 	    	       
	     	tmpautid1 = yazar1;
	    	tmpautid2 = yazar2;
	    	tmpautid3 = yazar3;
	    	tmpautid4 = yazar4;
		      	
	      	yazargnd.click();
	    };
	    
	    sureler.prototype.sureayetsatir = function (sure, satirsec, ayet) {
	    	aramakutu.clear();
	    	aramakutu.sendKeys(sure);
	    	browser.sleep(3000);
	    	element(by.repeater('chapter in $select.items').row(satirsec)).click();
	    	
	    	element(by.model('$parent.verse_number')).clear();
    		element(by.model('$parent.verse_number')).sendKeys(ayet);
	    	element(by.id('list_translations')).click();
	    	
	    };
	    
	    sureler.prototype.sureayettab = function (sure, ayet) {
	    	aramakutu.clear();
	    	aramakutu.sendKeys(sure);
	    	browser.sleep(3000);
	    	aramakutu.sendKeys(protractor.Key.TAB);
	    	
	    	element(by.model('$parent.verse_number')).clear();
    		element(by.model('$parent.verse_number')).sendKeys(ayet);
	    	element(by.id('list_translations')).click();
	    	
	    };
	    
	    sureler.prototype.karala = function (elm, korx, not, renk) {
		  
	    	elm = element(by.id(elm)).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
	    	browser.actions().mouseMove(elm,{x: korx, y: 0}).doubleClick().perform();
	    	
	    	if(not!='-')
	    		{
	    		    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
		    	    element(by.model('annotationModalData.text')).sendKeys(not);
		    	    element(by.css('[value="' + renk + '"]')).click();
		    	    element(by.css('[ng-click="submitEditor()"]')).click();
	    		
	    		}
	    
	    };

    return sureler;

})();

module.exports = sureler;



