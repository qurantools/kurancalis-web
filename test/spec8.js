var sureler = require('./sure_ayet');
var uyelik = require('./uyelik');

describe('ceviri gosterimi', function() {
	
	 var aramabtn = element.all(by.css('[class="caret pull-right"]'));
	 var aramakutu = element(by.model('$select.search'));
	 
	it('Sure listesi kontrolu', function() {
	
	 var uye = new uyelik();
       	
       	 uye.cikis();
         uye.sil();
         uye.giris();
          
		 var sure = new sureler();
		 sure.sayfa();
		 
aramabtn.click();
	    	
	    	sure.sureayettab(7, 2);
	    	
	    	element(by.id('t_32134')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
	       		 expect(text).toBe('Bu, sana indirilen bir kitaptır. Onunla uyarman ve gerçeği onaylayanlara öğüt vermen konusunda göğsünde bir kuşku ve sıkıntı olmasın.');	
	           });
	    	
	    	browser.sleep(3000);
	    	
aramabtn.click();
	    	
			sure.sureayettab('ba', 15);
	    	
	    	element(by.id('t_50016')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
	       		 expect(text).toBe('Allah onlarla alay ediyor da kendilerini kendi azgınlıkları içinde bocalar bir halde sürüklüyor.');	
	           });
	    	
	    	browser.sleep(3000);
	    	
aramabtn.click();
	    	
	    	aramakutu.clear();
	    	aramakutu.sendKeys('çğş');
	    	browser.sleep(3000);
	    	browser.sleep('1000');
	    	
	    	element(by.model('$parent.verse.number')).clear();
    		element(by.model('$parent.verse.number')).sendKeys('şç');
	    	element(by.id('list_translations')).click();
	    	
	    	element(by.css('[class="ui-select-match-text pull-left"]')).getText().then(function(text) {
	       		 expect(text).toBe('2: Bakara');	
	           });
	    	
	    	element(by.id('t_64344')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
	       		 expect(text).toBe('Rahman, Rahim Allah\'ın ismiyle');	
	           });
	    	
	    	browser.sleep(5000);
	});
});