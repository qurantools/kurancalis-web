var sureler = require('./sure_ayet');

describe('ceviri gosterimi', function() {
	
	 var aramabtn = element.all(by.css('[class="caret pull-right"]'));
	 var aramakutu = element(by.model('$select.search'));
	 
	it('Sure listesi kontrolu', function() {
		
		 var sure = new sureler();
		 sure.sayfa();
		 
		 //Seçilen sayfaya gidilir ve karalanarak not yazılır.
		 sure.sureayetegit(5,7);
		 sure.karala('t_50670',100,'Deneme','red');
		 
		 //Tüm notlara girilir.
		 element(by.css('[class="fa fa-bars"]')).click();
		 browser.sleep("5000");
		 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
		 
		 //meal doğrulanır.
		 browser.sleep(3000);
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-bind-html="annotation.translation_content | mark_verse_annotation:annotation:1 | newLineAllowed | to_trusted"]')).getText()).toBe('Allah\'ın, üzerinizdeki nimetini ve sizi bağladığı misakını unutmayın. Hani, "işittik, boyun eğdik" demiştiniz. Allah\'tan korkun. Allah, göğüslerin içindekini çok iyi bilir.');
	    
		 //Çark tıklanarak yazar, sure ve ayet doğrulanır.
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="showVerse(annotation)"]')).click();
		 
		 browser.sleep(3000);
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.authorId')).getAttribute('value')).toEqual('1024');
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.chapter')).getAttribute('value')).toBe('5');
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('7');
				
		 //Yazar değiştirilir.
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.authorId')).click();
		 element(by.repeater('annotation in annotations').row(0)).element(by.repeater('author in $parent.authors').row(17)).click();
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.authorId')).click();
			
		 browser.sleep(3000);
		 
		 //meal doğrulanır.
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Allah\'ın size lütfettiği nimeti ve sizin “duyduk ve itaat ettik, baş üstüne! ” dediğiniz vakit, sizden aldığı sözünüzü hatırlayın. Allah\'a karşı gelmekten sakının. Çünkü Allah sinelerde saklı bütün sırları bilir.*');
		    
		 //İleri tıklanarak ayet numarası ve meal doğrulanır.
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="fa fa-arrow-circle-o-right large_icon"]')).click();
		 
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Ey iman edenler! Haktan yana olup vargücünüzle ve bütün işlerinizde adaleti gerçekleştirin ve adalet numunesi şahitler olun. Bir topluluğa karşı, içinizde beslediğiniz kin ve öfke, sizi adaletsizliğe sürüklemesin. Âdil davranın, takvâya en uygun hareket budur. Allah\'a karşı gelmekten sakının. Çünkü Allah yaptığınız her şeyden haberdardır.');
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('8');
				
		 browser.sleep(1000);
	
		 //2 kez geri tıklanarak ayet numarası ve meal doğrulanır.			
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="fa fa-arrow-circle-o-left large_icon"]')).click();
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="fa fa-arrow-circle-o-left large_icon"]')).click();
		 
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('6');
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Ey iman edenler! Namaza kalkmak istediğinizde yüzlerinizi ve dirseklere kadar ellerinizi yıkayın Başlarınızı meshedip topuklarınızla birlikte ayaklarınızı da yıkayın. Cünüp iseniz tastamam yıkanın (boy abdesti alın). Eğer hasta veya yolcu iseniz veya tuvaletten gelmişseniz, yahut kadınlarla münasebette bulunmuş olup da su bulamazsanız temiz toprağa teyemmüm edin, (mânen arınma niyeti ile) ondan yüzlerinize ve ellerinize meshedin. Allah size güçlük çıkarmak istemez, fakat şükredesiniz diye sizi temizleyip arındırmak ve size olan nimetlerini tamama erdirmek ister. [4, 43]*');
			
		 browser.sleep(1000);
		 
		 //Ayet numarası girilerek. Surenin son ayetine ulaşılır.
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).clear();
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).sendKeys('120');
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="$parent.showVerseByParameters(\'go\')"]')).click();
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Göklerin, yerin ve oradaki her şeyin hakimiyeti Allah\'ındır ve O her şeye hakkıyla kadirdir.');
			
		 browser.sleep(1000);
		 
		 //Son ayette iken ileri tıklanarak meal numarasının 0 olduğu doğrulanır.
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="fa fa-arrow-circle-o-right large_icon"]')).click();
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('0');
		
		 browser.sleep(1000);
		 
		 //İlk ayette iken geri tıklanarak surenin son ayetine döndüğü doğrulanır.
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="fa fa-arrow-circle-o-left large_icon"]')).click();
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).getAttribute('value')).toBe('120');
			
		 browser.sleep(1000);
		 
		 //Yazar Sure ve Ayet değiştirilerek meal doğrulaması.
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.authorId')).click();
		 element(by.repeater('annotation in annotations').row(0)).element(by.repeater('author in $parent.authors').row(1)).click();
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.authorId')).click();
		
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.chapter')).clear();
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.chapter')).sendKeys('80');
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).clear();
		 element(by.repeater('annotation in annotations').row(0)).element(by.model('$parent.showVerseData.data.verse')).sendKeys('21');
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="$parent.showVerseByParameters(\'go\')"]')).click();
	      
		 expect(element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-bind-html="data.content | mark_verse_annotation:$parent.annotation:$parent.markVerseAnnotations | newLineAllowed | to_trusted"]')).getText()).toBe('Summe emâtehu fe akberah|u|.');
		 
		 browser.sleep(3000);
		 
		 element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="deleteAnnotation2(annotation)"]')).click();
		  
	  	  browser.sleep(10000);
	});
});