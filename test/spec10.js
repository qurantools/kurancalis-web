var sureler = require('./sure_ayet');

describe('ceviri gosterimi', function() {

	function kontrol(rowc, renk)
	{
		var data=[];

		data[0] = element(by.repeater('annotation in annotations').row(rowc)).element(by.css('[class="s_a_header ng-binding"]')).getText();
		data[1] = element(by.repeater('annotation in annotations').row(rowc)).element(by.css('[ng-bind-html="annotation.translation_content | mark_verse_annotation:annotation:1 | newLineAllowed | to_trusted"]')).getText();
		data[2] = element(by.repeater('annotation in annotations').row(rowc)).element(by.css('[ng-bind-html="annotation.text | newLineAllowed | to_trusted"]')).getText();
		data[3] = element(by.repeater('annotation in annotations').row(rowc)).element(by.css('[class="annotator-hl a_hl_' + renk + '"]')).getText();

		return data;
	}

	it('Arama filtreleme', function() {

		var data = [];
		var sure = new sureler();
		sure.sayfa();

		browser.sleep('5000');
		var sure = new sureler();
		sure.sayfa();

		sure.sureayetegit(60,4)
		sure.yazaragit(11,12,13,15);
		browser.sleep('5000');

		data[0] = 'Etk2';
		data[1] = 'Etk3';
		sure.karalaetiket('t_87548',100,'Not2 Not3','yellow',data, 2);

		browser.sleep('3000');
		sure.sureayetegit(60,10)
		browser.sleep('3000');

		data[0] = 'Etk1';
		data[1] = 'Etk3';
		sure.karalaetiket('t_104004',100,'Not1 Not2 Not3','green',data, 2);

		browser.sleep(3000);

		//Sure ve ayete gidilerek yazarlar seçilir sağ panel açılarak doğrulamalar yapılıyor.
		element(by.css('[onclick="openPanel()"]')).click();
		browser.sleep(3000);

		var sagsatir = element.all(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch'));

		//Ayet sıralamasına dayalı ilk Sıradaki meal doğrulaması yapılıyor.
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Not2 Not3');
		expect(sagsatir.count()).toEqual(2);
		browser.sleep(3000);

		//Zaman sıralamasına dayalı ilk sıradaki meal doğrulaması yapılıyor.
		element(by.model('filterOrderSelect')).click();
		element(by.css('[value="-updated"]')).click();
		element(by.css('[class="cd-panel-content"]')).click();

		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Not1 Not2 Not3');
		browser.sleep(3000);

		//Tekrar ayet sıralaması yapılıyor ilk sıradaki meal doğrulaması yapılıyor.
		element(by.model('filterOrderSelect')).click();
		element(by.css('[value="verseId"]')).click();
		element(by.css('[class="cd-panel-content"]')).click();

		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Not2 Not3');
		browser.sleep(3000);

		//Karalama kelimesi ile arama yapılıyor.
		var arama = element(by.model('searchText'));
		arama.clear();
		arama.sendKeys('أَبَدًا');
		expect(sagsatir.count()).toEqual(1);

		browser.sleep(3000);

		//Eklenen not içinden kelime ile arama yapılıyor.
		arama.clear();
		arama.sendKeys('Not3');
		expect(sagsatir.count()).toEqual(2);

		browser.sleep(3000);

		//Eklenen etiket ile arama yapılıyor.
		arama.clear();
		arama.sendKeys('etk3');
		expect(sagsatir.count()).toEqual(2);

		element(by.css('[ng-click="resetAnnotationFilter()"]')).click();

		browser.sleep(3000);

		element(by.css('[class="fa fa-bars"]')).click();
		browser.sleep("5000");
		element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();

		browser.sleep(3000);

		for(var x=0; x<2;x++)
		{
			element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="deleteAnnotation2(annotation)"]')).click();
			browser.sleep("1000");
		}

		browser.sleep(10000);
	});

});

