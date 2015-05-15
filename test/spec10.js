var sureler = require('./sure_ayet');
var uyelik = require('./uyelik');

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
        var uye = new uyelik();

        uye.sil();
        uye.giris();

		sure.sayfa();

		browser.sleep('5000');
		var sure = new sureler();
		sure.sayfa();

		sure.sureayetegit(60,1)
		sure.yazaragit(11,12,13,15);
		browser.sleep('5000');

		data[0] = 'Etk2';
		data[1] = 'Etk3';
		sure.karalaetiket('t_95736',100,'Zaman sıralamasında üçüncü sırada. Ayet sıralamasında ilk sırada.','yellow',data, 2);

		sure.sureayetegit(60,12)
		sure.yazaragit(11,12,13,15);
		browser.sleep('5000');

		data[0] = 'Etk1';
		data[1] = 'Etk2';
		data[2] = 'Etk3';
		sure.karalaetiket('t_95747',100,'Zaman sıralamasında ikinci sırada. Ayet sıralamasında üçüncü sırada.','yellow',data, 3);

		browser.sleep('5000');
		sure.sureayetegit(60,6)
		browser.sleep('3000');

		data[0] = 'Etk1';
		data[1] = 'Etk3';
		sure.karalaetiket('t_116606',100,'Zaman sıralamasında ilk sırada. Ayet sıralamasında ikinci sırada.','green',data, 2);

		browser.sleep(3000);

		//Sure ve ayete gidilerek yazarlar seçilir sağ panel açılarak doğrulamalar yapılıyor.
		element(by.css('[onclick="openPanel()"]')).click();
		browser.sleep(3000);

		var sagsatir = element.all(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch'));

		//İlk yapılan kayıt sırasına göre gelen listeyi doğruluyoruz.

		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_header ng-binding"]')).getText()).toEqual('60:1');
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_header ng-binding"]')).getText()).toEqual('60:12');
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).element(by.css('[class="s_a_header ng-binding"]')).getText()).toEqual('60:6');

        browser.sleep(10000);
		expect(sagsatir.count()).toEqual(3);
		browser.sleep(3000);

		//Zaman sıralamasına dayalı Sıralama doğrulaması notlar ile yapılıyor.
		element(by.model('filterOrderSelect')).click();
		element(by.css('[value="-updated"]')).click();
		element(by.css('[class="cd-panel-content"]')).click();

		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Zaman sıralamasında ilk sırada. Ayet sıralamasında ikinci sırada.');
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Zaman sıralamasında ikinci sırada. Ayet sıralamasında üçüncü sırada.');
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Zaman sıralamasında üçüncü sırada. Ayet sıralamasında ilk sırada.');

		browser.sleep(3000);

		//Ayet sıralaması yapılıyor Sıralama doğrulaması notlar ile yapılıyor.
		element(by.model('filterOrderSelect')).click();
		element(by.css('[value="verseId"]')).click();
		element(by.css('[class="cd-panel-content"]')).click();

		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Zaman sıralamasında üçüncü sırada. Ayet sıralamasında ilk sırada.');
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(1)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Zaman sıralamasında ilk sırada. Ayet sıralamasında ikinci sırada.');
		expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(2)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Zaman sıralamasında ikinci sırada. Ayet sıralamasında üçüncü sırada.');

		browser.sleep(3000);

		//Karalama kelimesi ile arama yapılıyor.
		var arama = element(by.model('searchText'));
		arama.clear();
		arama.sendKeys('onlarda');
		expect(sagsatir.count()).toEqual(1);

		browser.sleep(3000);

		//Eklenen not içinden kelime ile arama yapılıyor.
		arama.clear();
		arama.sendKeys('sırada');
		expect(sagsatir.count()).toEqual(3);

		browser.sleep(3000);

		//Eklenen etiket ile arama yapılıyor.
		arama.clear();
		arama.sendKeys('etk3');
		expect(sagsatir.count()).toEqual(3);

		element(by.css('[ng-click="resetAnnotationFilter()"]')).click();

		browser.sleep(3000);

		element(by.css('[class="fa fa-bars"]')).click();
		browser.sleep("5000");
		element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();

		browser.sleep(3000);


	});

});

