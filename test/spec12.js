var sureler = require('./sure_ayet');

describe('ceviri gosterimi', function() {
	 
	it('Dipnot Kontrolu', function() {
		var sure = new sureler();
		 //sure.sayfa();
	  
		 browser.sleep(3000);
		 
		 element(by.id('t_31180')).element(by.css('[class="footnote_asterisk"]')).click();
		 
		 element(by.css('[class="col-xs-11 footnotebg"]')).getText().then(function(text) {
   		  
			 var text1 = text.substring(0,7);
   		     expect(text1).toBe('Besmele');
		 });
		 
   		  element(by.linkText('27:30')).click();
   		
   		  expect(element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('27');
   		  expect(element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('30');
   		  expect(element(by.model('$parent.showVerseData.data.authorId')).getAttribute('value')).toBe('16');
   		  expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('"O, Süleyman\'dandır ve o, ‘Rahman ve Rahim ALLAH\'ın İsmiyle\' dir."*');
      	
   		  //Yaşar Nuri Öztürk olarak değiştirilir.
   		  element(by.model('$parent.showVerseData.data.authorId')).click();
   		  element(by.repeater('author in $parent.authors').row(10)).click();
   		  element(by.model('$parent.showVerseData.data.authorId')).click();
   		  
   		  expect(element(by.model('$parent.showVerseData.data.authorId')).getAttribute('value')).toBe('1024');
 		  expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('"Süleyman\'dan bir mektup. Rahman ve Rahim Allah\'ın adıyla başlıyor."');

 		 browser.sleep('3000');
   		  
   		  //Ayet 93 olarak değiştirilir. Git buttonuna basılır.
   		element(by.model('$parent.showVerseData.data.verse')).clear();
   		element(by.model('$parent.showVerseData.data.verse')).sendKeys('93');
   		element(by.css('[ng-click="$parent.showVerseByParameters(\'go\')"]')).click();
   		  
   		  expect(element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('27');
		  expect(element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('93');
		  expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Ve şöyle yakar: "Hamd olsun Allah\'a. O size ayetlerini gösterecek de siz onları tanıyacaksınız. Senin Rabbin, yapmakta oldukarınızdan habersiz değildir."');

		  browser.sleep('3000');
		  
		  //Sağ ok tuşu tıklanır.
		  element(by.css('[class="fa fa-arrow-circle-o-right large_icon"]')).click();
		  
		  expect(element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('28');
		  expect(element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('0');
		  expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Rahman ve Rahim Allah\'ın adıyla...');
 
		  browser.sleep('3000');
		  
		  //Sol ok tuşu tıklanır.
		  element(by.css('[class="fa fa-arrow-circle-o-left large_icon"]')).click();
		  
		  expect(element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('27');
		  expect(element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('93');
		  expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Ve şöyle yakar: "Hamd olsun Allah\'a. O size ayetlerini gösterecek de siz onları tanıyacaksınız. Senin Rabbin, yapmakta oldukarınızdan habersiz değildir."');
  
		  browser.sleep('3000');
		  
		  //17:88 tıklanır.
		  element(by.linkText('17:88')).click();
		  
		  expect(element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('17');
   		  expect(element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('88');
   		  expect(element(by.model('$parent.showVerseData.data.authorId')).getAttribute('value')).toBe('16');
   		  expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('De ki: "Tüm insanlar ve cinler bu Kuran\'ın bir benzerini oluşturmak amacıyla toplansalar ve bu konuda birbirlerine destek olsalar bile onun bir benzerini oluşturamazlar."');
      	
   		browser.sleep('3000');
   		
   		  //Fatiha suresi 4. ayet * tıklanır.
   		  
   		element(by.model('$parent.verse_number')).clear();
   		element(by.model('$parent.verse_number')).sendKeys('4');
   		element(by.css('[ng-click="goToChapter()"]')).click();
   		
   		browser.sleep('5000');
   		
   			element(by.id('t_31183')).element(by.css('[class="footnote_asterisk"]')).click();
   			
   			browser.sleep('3000');
   			element(by.id('t_31183')).element(by.linkText('82:15')).click();
   			
   			expect(element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('82');
   			expect(element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('15');
   			expect(element(by.model('$parent.showVerseData.data.authorId')).getAttribute('value')).toBe('16');
   			expect(element(by.css('[class="showVerseData"]')).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Din Günü oraya girerler.');
     	
  		  
   			expect(element(by.repeater('verse in verses').row(3)).element(by.css('show-verse')).isDisplayed()).toBe(true); 
   			
   			browser.sleep('2000');

		//Dipnot kapatılır ve kapandığı doğrulanır.

		element(by.id('t_31183')).element(by.css('[class="footnote_asterisk activated"]')).click();
   			expect(element(by.id('fn_31183')).isPresent()).toEqual(false);
   			browser.sleep(10000);
	});
});
