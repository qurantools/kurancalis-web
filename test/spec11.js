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

         var uye = new uyelik();
		 var sure = new sureler();

         uye.cikis();
         uye.sil();
         uye.giris();

			  
		 		browser.sleep('5000');
				  	 
	    	  sure.tekyazar(12);
			  sure.sureayetegit(19,10)
		   	  //browser.sleep('5000');
		   	  
		   	  var data=[];	    	  
		   	  data[0] = 'Etk1';
		   	  sure.karalaetiket('t_92845',100,'Not1','red',data, 1);
		   	  browser.sleep('5000');
		   	  
		   	 element(by.model('$parent.verse_number')).clear();
		   	 element(by.model('$parent.verse_number')).sendKeys('0');
		   	 sure.tekyazar(13);
		   	 sure.sureayetegit(60,4)
		   	  //browser.sleep('5000');
		 	  
		 	  data[0] = 'Etk2';
		 	  data[1] = 'Etk3';
			  sure.karalaetiket('t_103998',100,'Not2 Not3','yellow',data, 2);
			  //browser.sleep('5000');
			  
			  element(by.model('$parent.verse_number')).clear();
			  element(by.model('$parent.verse_number')).sendKeys('0');
			  sure.tekyazar(1);
			  sure.sureayetegit(86,16)
			  //browser.sleep('5000');
			    	  
			  data[0] = 'Etk1';
			  sure.karalaetiket('t_30890',100,'Not4','green',data, 1);
			  browser.sleep('5000');
			      
			  element(by.model('$parent.verse_number')).clear();
			  element(by.model('$parent.verse_number')).sendKeys('0');
			  sure.tekyazar(6);
			  sure.sureayetegit(101,10)
			  //browser.sleep('5000');
			   	  
			  data[0] = 'Etk4';
			  data[1] = 'Etk2';
			  sure.karalaetiket('t_43678',100,'Not3 Not4','yellow',data, 2);
			  browser.sleep('8000');
				  
			  element(by.model('$parent.verse_number')).clear();
			  element(by.model('$parent.verse_number')).sendKeys('0');
			  sure.tekyazar(15);
			  sure.sureayetegit(112,2)
			  //browser.sleep('5000');
			    	  
			  data[0] = 'Etk3';
			  sure.karalaetiket('t_117471',100,'Not1 Not2 Not3','red',data, 1);
			      
			  browser.sleep(5000);
			  
	    	  //Tüm notlara girilir. Ayet sıralaması ile ilk, orta ve sondan doğrulanma yapılır.
	 		 element(by.css('[class="fa fa-bars"]')).click();
	 		 browser.sleep("5000");
	 		 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
	 		 
	 		browser.sleep("3000");
	 		
	 		var donen=kontrol(0, 'red');
	 		 
	 		expect(donen[0]).toBe('19:10');
			expect(donen[1]).toBe('Dedi ki: "Rabbim, bana bir alamet (ayet) ver." Dedi ki: "Senin alametin, sapasağlam iken, üç tam gece insanlarla konuşmamandır."');
			expect(donen[2]).toBe('Not1');
			expect(donen[3]).toBe('Rabbim');
			
			
			donen=kontrol(1, 'yellow');
	 		 
	 		expect(donen[0]).toBe('60:4');
			expect(donen[1]).toBe('İbrahim\'de ve onunla beraber olanlarda, sizin için gerçekten güzel bir örnek vardır. Onlar kavimlerine demişlerdi ki: "Biz sizden ve Allah\'ı bırakıp taptıklarınızdan uzağız. Sizi tanımıyoruz. Siz bir tek Allah\'a inanıncaya kadar, sizinle bizim aramızda sürekli bir düşmanlık ve öfke belirmiştir." Şu kadar var ki, İbrahim babasına: "Andolsun senin için mağfiret dileyeceğim. Fakat Allah\'tan sana gelecek herhangi bir şeyi önlemeye gücüm yetmez" demişti. (O müminler şöyle dediler:) Rabbimiz! Ancak sana dayandık, sana yöneldik. Dönüş de ancak sanadır.*');
			expect(donen[2]).toBe('Not2 Not3');
			expect(donen[3]).toBe('onunla');
			
			
			donen=kontrol(2, 'green');
	 		 
	 		expect(donen[0]).toBe('86:16');
			expect(donen[1]).toBe('Ve ekîdu keydâ(keyden).');
			expect(donen[2]).toBe('Not4');
			expect(donen[3]).toBe('keydâ');
			
			
			donen=kontrol(3, 'yellow');
	 		 
	 		expect(donen[0]).toBe('101:10');
			expect(donen[1]).toBe('And how would you know what it is?');
			expect(donen[2]).toBe('Not3 Not4');
			expect(donen[3]).toBe('would');
			
			
			donen=kontrol(4, 'red');
	 		 
	 		expect(donen[0]).toBe('112:2');
			expect(donen[1]).toBe('Allah Samed\'dir.*');
			expect(donen[2]).toBe('Not1 Not2 Not3');
			expect(donen[3]).toBe('Samed\'dir');
			
			
			browser.sleep("3000");
	 		element(by.css('[class="fa fa-search"]')).click();
	 		browser.sleep("3000");
	 		 
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(4)).click()
			element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(5)).click()
	 	
	        //Not1 arama kelimesine yazılır ve Ali Bulaç seçilir. Tamam tıklanır.
	 		element(by.model('allAnnotationsSearchInput')).clear();
	 		element(by.model('allAnnotationsSearchInput')).sendKeys('Not1');
	 	
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(12)).click()
	 		element(by.css('[ng-click="search_all_annotations()"]')).click();
	 		
	 		browser.sleep("3000");
		 	
	 		donen=kontrol(0, 'red');
	 		
	 		 expect(donen[0]).toBe('19:10');
			 expect(donen[1]).toBe('Dedi ki: "Rabbim, bana bir alamet (ayet) ver." Dedi ki: "Senin alametin, sapasağlam iken, üç tam gece insanlarla konuşmamandır."');
			 expect(donen[2]).toBe('Not1');
			 expect(donen[3]).toBe('Rabbim');
	 		
			 element(by.css('[class="fa fa-search"]')).click();
		 		
	 		//Not3 arama kelimesine, Etk2 etiket kelime içine yazılır ve Diyanet İşleri seçilir.
	 		element(by.model('allAnnotationsSearchInput')).clear();
	 		element(by.model('allAnnotationsSearchInput')).sendKeys('Not3');
	 		element(by.model('filterTags')).element(by.model('newTag.text')).sendKeys('Etk2');
	 	
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(12)).click()
	 		
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(13)).click()
		 
	 		element(by.css('[ng-click="search_all_annotations()"]')).click();
	 		
	 		 browser.sleep("3000");
	 		 
		 		donen=kontrol(0, 'yellow');
		 		
		 		 expect(donen[0]).toBe('60:4');
				 expect(donen[1]).toBe('İbrahim\'de ve onunla beraber olanlarda, sizin için gerçekten güzel bir örnek vardır. Onlar kavimlerine demişlerdi ki: "Biz sizden ve Allah\'ı bırakıp taptıklarınızdan uzağız. Sizi tanımıyoruz. Siz bir tek Allah\'a inanıncaya kadar, sizinle bizim aramızda sürekli bir düşmanlık ve öfke belirmiştir." Şu kadar var ki, İbrahim babasına: "Andolsun senin için mağfiret dileyeceğim. Fakat Allah\'tan sana gelecek herhangi bir şeyi önlemeye gücüm yetmez" demişti. (O müminler şöyle dediler:) Rabbimiz! Ancak sana dayandık, sana yöneldik. Dönüş de ancak sanadır.*');
				 expect(donen[2]).toBe('Not2 Not3');
				 expect(donen[3]).toBe('onunla');	 
			 	 
	 		 element(by.css('[class="fa fa-search"]')).click();
	 		
	 		//Not3 arama kelimesine, etk1 ve etk3 etiket kelime içine yazılır. Süleyman Ateş seçilir.
	 		element(by.model('allAnnotationsSearchInput')).clear();
	 		element(by.model('allAnnotationsSearchInput')).sendKeys('Not3');
	 		
	 		element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[ng-click="tagList.remove($index)"]')).click();
	 		
	 		element(by.model('filterTags')).element(by.model('newTag.text')).sendKeys('Etk1');
	 		element(by.model('allAnnotationsSearchInput')).click();
	 		element(by.model('filterTags')).element(by.model('newTag.text')).sendKeys('Etk3');
	 		
	 	    element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(13)).click()
	 		
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(15)).click()
	 			 		
	 		element(by.css('[ng-click="search_all_annotations()"]')).click();
	 		
	 		browser.sleep("3000");
		 	
	 		var donen=kontrol(0, 'red');
	 		
	 		 expect(donen[0]).toBe('112:2');
			 expect(donen[1]).toBe('Allah Samed\'dir.*');
			 expect(donen[2]).toBe('Not1 Not2 Not3');
			 expect(donen[3]).toBe('Samed\'dir');
	      
			 browser.sleep("5000");
			 
			 element(by.css('[class="fa fa-search"]')).click();
			 
			 //Aramalar silinir
			 element(by.model('allAnnotationsSearchInput')).clear();
			 element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[ng-click="tagList.remove($index)"]')).click();
			 element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[ng-click="tagList.remove($index)"]')).click();
		 		
			element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(1)).click()
			element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(6)).click()
			element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(12)).click()
			element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(13)).click()
				
			element(by.css('[ng-click="search_all_annotations()"]')).click();
	    	 
			//Zaman sıralamasına göre ilk,orta ve sondan doğrulama yaptırılıyor.
			browser.sleep('5000');
			 			 
			element(by.model('allAnnotationsOrderBy')).click();
			element(by.css('[value="time"]')).click();
            browser.sleep('1000');
			element(by.repeater('annotation in annotations').row(0)).click();
			
			donen=kontrol(0, 'red');
	 		 
	 		expect(donen[0]).toBe('112:2');
			expect(donen[1]).toBe('Allah Samed\'dir.*');
			expect(donen[2]).toBe('Not1 Not2 Not3');
			expect(donen[3]).toBe('Samed\'dir');
			
			donen=kontrol(2, 'green');
	 		 
	 		expect(donen[0]).toBe('86:16');
			expect(donen[1]).toBe('Ve ekîdu keydâ(keyden).');
			expect(donen[2]).toBe('Not4');
			expect(donen[3]).toBe('keydâ');
			
			var donen=kontrol(4, 'red');
	 		 
	 		expect(donen[0]).toBe('19:10');
			expect(donen[1]).toBe('Dedi ki: "Rabbim, bana bir alamet (ayet) ver." Dedi ki: "Senin alametin, sapasağlam iken, üç tam gece insanlarla konuşmamandır."');
			expect(donen[2]).toBe('Not1');
			expect(donen[3]).toBe('Rabbim');

	     
	 });
	    
});
