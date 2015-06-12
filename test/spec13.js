var sureler = require('./sure_ayet');
var uyelik = require('./uyelik');

describe('ceviri gosterimi', function() {
	 
	 var cevreler = element.all(by.repeater('item in cevreadlar'));
	 var kisiler = element.all(by.repeater('item in kisiliste'));
	 var cevrekisiler = element.all(by.repeater('item in cevrekisiler'));
	 
	it('Dipnot Kontrolu', function() {
		var sure = new sureler();
		//sure.sayfa();

        var uye = new uyelik();
        uye.cikis();
        uye.sil();
        uye.giris();
        
		 browser.sleep(3000);
		
		element(by.css('[onclick="toggleLeftPanel()"]')).click();
		browser.sleep(3000);
		element(by.css('[ng-class="{active: currentPage == \'people\'}"]')).click();
		browser.sleep(3000);
		element(by.css('[href="#/people/circles/"]')).click();
		
		//3 Adet Çevre Eklenir.
		element(by.css('[ng-click="toggleModal()"]')).click();
		browser.sleep(3000);
		element(by.model('cevread.text')).sendKeys('Çevre1');
		
		element(by.css('[ng-click="cevrekle(cevread.text)"]')).click();
		
		browser.sleep(3000);
		
		element(by.css('[ng-click="toggleModal()"]')).click();
		browser.sleep(3000);
		element(by.model('cevread.text')).sendKeys('Çevre2');
		
		element(by.css('[ng-click="cevrekle(cevread.text)"]')).click();
		
		browser.sleep(3000);
		
		element(by.css('[ng-click="toggleModal()"]')).click();
		browser.sleep(3000);
		element(by.model('cevread.text')).sendKeys('Çevre3');
		
		element(by.css('[ng-click="cevrekle(cevread.text)"]')).click();
		
		//Eklenen Çevre İsimleri ve Kişi Sayılarının 0 Olduğu Doğrulanıyor.
		element(by.repeater('item in cevreadlar').row(0)).element(by.model('cevrenm')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Çevre1');	
    	});
		
		element(by.repeater('item in cevreadlar').row(2)).element(by.model('cevrenm')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Çevre3');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(0)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('0');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(1)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('0');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(2)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('0');	
    	});
    	
		browser.sleep(3000);
		
		//Çevre2 Tıklanıyor ve Açıldığı Doğrulanıyor
		element(by.id("Çevre2")).click();
		
		element(by.css('h6')).getText().then(function(text) {
    		  var text1 = text.substring(0,6);
    		  expect(text1).toBe('Çevre2');	
    	});
    	
		browser.sleep(3000);
		
		//Çevre için kişi ekleniyor. Ekleme aşamasında girilen kullanıcı adı ile listelenen bilgiler doğrulanıyor.
		element(by.css('[ng-click="kisieskleModal()"]')).click();
		browser.sleep(2000);
		element(by.model('kisieklead.text')).sendKeys('c');
		element(by.model('kisieklead.text')).sendKeys('a');
		element(by.model('kisieklead.text')).sendKeys('r');
		element(by.model('kisieklead.text')).sendKeys('t');
		
		expect(kisiler.count()).toEqual(2);
		
		element(by.css('[ng-click="kisiekle(\'611\',cvrid)"]')).click();
		
		browser.sleep(3000);
		
		element(by.css('[ng-click="kisieskleModal()"]')).click();
		browser.sleep(2000);
		element(by.model('kisieklead.text')).sendKeys('Murat Demirsoy');
		
		element(by.css('[ng-click="kisiekle(\'261\',cvrid)"]')).click();
		
		browser.sleep(3000);
		
		element(by.css('[ng-click="kisieskleModal()"]')).click();
		browser.sleep(2000);
		element(by.model('kisieklead.text')).sendKeys('c');
		
		element(by.css('[ng-click="kisiekle(\'211\',cvrid)"]')).click();
		
		browser.sleep(3000);
		
		element(by.css('[ng-click="kisieskleModal()"]')).click();
		browser.sleep(2000);
		element(by.model('kisieklead.text')).sendKeys('c');
		
		element(by.css('[ng-click="kisiekle(\'717\',cvrid)"]')).click();
		
		browser.sleep(3000);
		
		element(by.css('[ng-click="kisieskleModal()"]')).click();
		browser.sleep(2000);
		element(by.model('kisieklead.text')).sendKeys('m');
		
		element(by.css('[ng-click="kisiekle(\'212\',cvrid)"]')).click();
		
		
		//Eklenen Kişi Sayısı, İsimler ve Çevre Kutusundaki Kişi Sayısı Doğrulanıyor.
		expect(cevrekisiler.count()).toEqual(5);
		
		element(by.repeater('item in cevrekisiler').row(0)).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Carteiras Baratos');	
    	});
    	
    	element(by.repeater('item in cevrekisiler').row(1)).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Murat Demirsoy');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(1)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('5');	
    	});
    	
    	//Kişi Seçilerek Çevre3 İçine Eklenir. Çevre3 Kişi Sayısı Doğrulanır.
    	element(by.repeater('item in cevrekisiler').row(0)).element(by.model('secimyap')).click();
    	browser.sleep(2000);
    	element(by.repeater('item in cevrekisiler').row(1)).element(by.model('secimyap')).click();
    	browser.sleep(2000);
    	element(by.repeater('item in cevrekisiler').row(2)).element(by.model('secimyap')).click();
    	browser.sleep(2000);
    	element(by.repeater('item in cevrekisiler').row(3)).element(by.model('secimyap')).click();
    	browser.sleep(2000);
    	element(by.repeater('item in cevrekisiler').row(4)).element(by.model('secimyap')).click();
    	browser.sleep(2000);
    	element(by.css('[ng-click="digercevremodal()"]')).click();
    	browser.sleep(2000);
    	element(by.repeater('item in dcevreadlar').row(2)).element(by.model('csecim')).click();
    	browser.sleep(2000);
    	element(by.css('[ng-click="kisiekcevre()"]')).click();
    	
    	element(by.repeater('item in cevreadlar').row(2)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('5');	
    	});    	
    	
    	//Sayfa yenileniyor.
    	browser.get(baseAddress + '/#/chapter/1/author/1040/verse/1');
    	browser.sleep(3000);
    	
		element(by.css('[onclick="toggleLeftPanel()"]')).click();
		browser.sleep(3000);
		element(by.css('[ng-class="{active: currentPage == \'people\'}"]')).click();
		browser.sleep(3000);
		element(by.css('[href="#/people/circles/"]')).click();
		
		browser.sleep(2000);
		element(by.repeater('item in cevreadlar').row(1)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('5');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(2)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('5');	
    	});
		
		element(by.id("Çevre2")).click();
		browser.sleep(2000);
		
    	//Kişi Seçilerek Çevre2 İçinden Silinir. Çevre2 Kişi Sayısı Doğrulanır.
    	element(by.repeater('item in cevrekisiler').row(0)).element(by.model('secimyap')).click();
    	browser.sleep(2000);
    	element(by.css('[ng-click="kisisilModal()"]')).click();
    	browser.sleep(2000);
    	element(by.css('[ng-click="kisisilme(cvrid)"]')).click();
    	
    	element(by.repeater('item in cevreadlar').row(1)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('4');	
    	});
    	
    	//Çevre Adı Değiştirilir ve Doğrulanır.
    	element(by.id("bt1Çevre1")).click();
    	browser.sleep(2000);
    	element(by.model('cevredgsad.text')).clear();
    	element(by.model('cevredgsad.text')).sendKeys('Çevre Değişti');
    	browser.sleep(2000);
    	element(by.css('[ng-click="cevredegistir(cvrid,cevredgsad.text)"]')).click();
    	
    	element(by.repeater('item in cevreadlar').row(0)).element(by.model('cevrenm')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Çevre Değişti');	
    	});
    	
    	//Sayfa yenileniyor.
    	browser.get(baseAddress + '/#/chapter/1/author/1040/verse/1');
    	browser.sleep(3000);
    	
		element(by.css('[onclick="toggleLeftPanel()"]')).click();
		browser.sleep(3000);
		element(by.css('[ng-class="{active: currentPage == \'people\'}"]')).click();
		browser.sleep(3000);
		element(by.css('[href="#/people/circles/"]')).click();
		
		browser.sleep(2000);
		
		//Tüm Çevre İsimleri ve Kişi Sayılarının 0 Olduğu Doğrulanıyor.
		element(by.repeater('item in cevreadlar').row(0)).element(by.model('cevrenm')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Çevre Değişti');	
    	});
		
		element(by.repeater('item in cevreadlar').row(1)).element(by.model('cevrenm')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Çevre2');	
    	});
    	
		element(by.repeater('item in cevreadlar').row(2)).element(by.model('cevrenm')).getText().then(function(text) {
    		  
    		  expect(text).toBe('Çevre3');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(0)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('0');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(1)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('4');	
    	});
    	
    	element(by.repeater('item in cevreadlar').row(2)).element(by.model('kisicnt')).getText().then(function(text) {
    		  
    		  expect(text).toBe('5');	
    	});
    	
    	//Çevre Silinir ve Doğrulanır.
    	element(by.id("bt2Çevre3")).click();
    	browser.sleep(2000);
    	element(by.css('[ng-click="cevresil(cid)"]')).click();
    	browser.sleep(2000);
    	expect(cevreler.count()).toEqual(2);
    	
		browser.sleep(10000);
	});
});
