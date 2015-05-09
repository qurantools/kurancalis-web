var sureler = require('./sure_ayet');

describe('ceviri gosterimi', function() {
	
	function yedek(){
		

		  
	}
	
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
	       	
		 var sure = new sureler();
		 sure.sayfa();
		 
			browser.sleep('5000');
		  		var sure = new sureler();
				 sure.sayfa();
				 
			  sure.sureayetegit(19,10)
		   	  sure.yazaragit(12,15,17,4);
		   	  browser.sleep('5000');
		   	  
		   	  var data=[];	    	  
		   	  data[0] = 'Etk1';
		   	  sure.karalaetiket('t_92845',100,'Not1','red',data, 1);
		   	  
		   	  
		   	sure.sureayetegit(60,4)
		 	  sure.yazaragit(11,12,13,15);
		 	  browser.sleep('5000');
		 	  
		 	  data[0] = 'Etk2';
		 	  data[1] = 'Etk3';
			  sure.karalaetiket('t_87548',100,'Not2 Not3','yellow',data, 2);
			  
			  
			  sure.sureayetegit(60,4)
		   	  sure.yazaragit(11,12,13,15);
		   	  browser.sleep('5000');
		   	  
		   	  data[0] = 'Etk1';
		   	  data[1] = 'Etk3';
			  sure.karalaetiket('t_103998',100,'Not2 Not3 Not4','green',data, 2);
			  
			      
			  sure.sureayetegit(86,16)
			  sure.yazaragit(11,13,17,1);
			  browser.sleep('5000');
			    	  
			  data[0] = 'Etk1';
			  sure.karalaetiket('t_30890',100,'Not4','green',data, 1);
			      
			      
			  sure.sureayetegit(101,10)
			  sure.yazaragit(1,6,11,12);
			  browser.sleep('5000');
			   	  
			  data[0] = 'Etk4';
			  data[1] = 'Etk2';
			  sure.karalaetiket('t_43678',100,'Not3 Not4','yellow',data, 2);
				  
				  
			  sure.sureayetegit(112,2)
			  sure.yazaragit(6,13,15,17);
			  browser.sleep('5000');
			    	  
			  data[0] = 'Etk3';
			  sure.karalaetiket('t_117471',100,'Not1 Not2 Not3','red',data, 1);
			      
			  browser.sleep(5000);
			  
	    	  //Sure ve ayete gidilerek yazarlar seçilir sağ panel açılarak doğrulamalar yapılıyor.
	    	  sure.sureayetegit(60,4)
	       	  sure.yazaragit(11,12,13,15);
	    	  browser.sleep(3000);
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
		    	  
	    	  expect(element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="s_a_text"]')).getText()).toEqual('Not2 Not3 Not4');
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
	    	 
 browser.sleep(3000);
	    	  
	    	  //Tüm notlara girilir.
	 		 element(by.css('[class="fa fa-bars"]')).click();
	 		 browser.sleep("5000");
	 		 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
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
		 	
	 		var donen=kontrol(0, 'red');
	 		
	 		 expect(donen[0]).toBe('19:10');
			 expect(donen[1]).toBe('Dedi ki: "Rabbim, bana bir alamet (ayet) ver." Dedi ki: "Senin alametin, sapasağlam iken, üç tam gece insanlarla konuşmamandır."');
			 expect(donen[2]).toBe('Not1');
			 expect(donen[3]).toBe('Rabbim');
	 		
			 element(by.css('[class="fa fa-search"]')).click();
		 		
	 		//Not3 arama kelimesine, Etk2 etiket kelime içine yazılır ve Sait Yıldırım - The Monotheist Group - Arapça (Harekeli) seçilir.
	 		element(by.model('allAnnotationsSearchInput')).clear();
	 		element(by.model('allAnnotationsSearchInput')).sendKeys('Not3');
	 		element(by.model('filterTags')).element(by.model('newTag.text')).sendKeys('Etk2');
	 	
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(12)).click()
	 		
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(6)).click()
		 	element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(11)).click()
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(17)).click()
	 		
	 		element(by.css('[ng-click="search_all_annotations()"]')).click();
	 		
	 		 browser.sleep("3000");
	 		 
		 		donen=kontrol(0, 'yellow');
		 		
		 		 expect(donen[0]).toBe('60:4');
				 expect(donen[1]).toBe('قَدْ كَانَتْ لَكُمْ أُسْوَةٌ حَسَنَةٌ فِي إِبْرَاهِيمَ وَالَّذِينَ مَعَهُ إِذْ قَالُوا لِقَوْمِهِمْ إِنَّا بُرَآءُ مِنكُمْ وَمِمَّا تَعْبُدُونَ مِن دُونِ اللَّهِ كَفَرْنَا بِكُمْ وَبَدَا بَيْنَنَا وَبَيْنَكُمُ الْعَدَاوَةُ وَالْبَغْضَاءُ أَبَدًا حَتَّى تُؤْمِنُوا بِاللَّهِ وَحْدَهُ إِلَّا قَوْلَ إِبْرَاهِيمَ لِأَبِيهِ لَأَسْتَغْفِرَنَّ لَكَ وَمَا أَمْلِكُ لَكَ مِنَ اللَّهِ مِن شَيْءٍ رَّبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ');
				 expect(donen[2]).toBe('Not2 Not3');
				 expect(donen[3]).toBe('أَبَدًا');	 
				 donen=kontrol(1, 'yellow');
			 		
		 		 expect(donen[0]).toBe('101:10');
				 expect(donen[1]).toBe('And how would you know what it is?');
				 expect(donen[2]).toBe('Not3 Not4');
				 expect(donen[3]).toBe('would');
				 
	 		 element(by.css('[class="fa fa-search"]')).click();
	 		
	 		//Not2 arama kelimesine, etk1 ve etk3 etiket kelime içine yazılır. Transliterasyon - Süleyman Ateş seçilir.
	 		element(by.model('allAnnotationsSearchInput')).clear();
	 		element(by.model('allAnnotationsSearchInput')).sendKeys('Not4');
	 		
	 		element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[ng-click="tagList.remove($index)"]')).click();
	 		
	 		element(by.model('filterTags')).element(by.model('newTag.text')).sendKeys('Etk1');
	 		element(by.model('allAnnotationsSearchInput')).click();
	 		element(by.model('filterTags')).element(by.model('newTag.text')).sendKeys('Etk3');
	 		
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(6)).click()
		 	element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(11)).click()
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(17)).click()
	 		
	 		element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(1)).click()
		 	element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(15)).click()
	 			 		
	 		element(by.css('[ng-click="search_all_annotations()"]')).click();
	 		
	 		browser.sleep("3000");
		 	
	 		var donen=kontrol(0, 'green');
	 		
	 		 expect(donen[0]).toBe('86:16');
			 expect(donen[1]).toBe('Ve ekîdu keydâ(keyden).');
			 expect(donen[2]).toBe('Not4');
			 expect(donen[3]).toBe('keydâ');
	      
			 browser.sleep("5000");
			 
			 element(by.css('[class="fa fa-search"]')).click();
			 
			 element(by.model('allAnnotationsSearchInput')).clear();
			 element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[ng-click="tagList.remove($index)"]')).click();
			 element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[ng-click="tagList.remove($index)"]')).click();
		 		
			 element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(4)).click()
			 element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(6)).click()
			 element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(11)).click()
			 element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(12)).click()
			 element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(13)).click()
			 element(by.css('[class="selectable_list"]')).element(by.repeater('author in authors').row(17)).click()
		 		
			 element(by.css('[ng-click="search_all_annotations()"]')).click();
	    	 
			 for(var x=0; x<6;x++)
			 {
			   element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="deleteAnnotation2(annotation)"]')).click();
			   browser.sleep("1000");
			 }
			 
	  	  browser.sleep(10000);
	 });  
	    
});
