describe('ceviri gosterimi', function() {
	
	var aramabtn = element.all(by.css('[class="caret pull-right"]'));
	var aramakutu = element(by.model('$select.search'));
	
	var yazarbtn = element.all(by.css('[class="fa fa-user"]'));
	var yazargnd = element(by.css('[ng-click="updateAuthors()"]'));
	
	var tmpautid1;
	var tmpautid2;
	var tmpautid3;
	
function listTranslations(chapterNo, autid1, autid2, autid3) {
    	
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
    	    element(by.repeater('author in authors').row(tmpautid2)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();    		
    	    element(by.repeater('author in authors').row(tmpautid3)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();    		
    	    }
    		
    	
   	 element(by.repeater('author in authors').row(autid1)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
     element(by.repeater('author in authors').row(autid2)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
     element(by.repeater('author in authors').row(autid3)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
           
    	yazargnd.click();
    	
    	//element(by.id('list_translations')).click();
   	 
   	 tmpautid1=autid1;
   	 tmpautid2=autid2;
   	 tmpautid3=autid3;
   	 
    }

	function not_yaz(elm, not_deger, renk, korx, kory, ayetno) {
   
		element(by.model('$parent.verse_number')).clear();
		element(by.model('$parent.verse_number')).sendKeys(ayetno);
		element(by.id('list_translations')).click();
			
		browser.sleep(5000);
		
    browser.actions().mouseMove(elm,{x: korx, y: kory}).doubleClick().perform();
	
    element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
    element(by.model('annotationModalData.text')).sendKeys(not_deger);
    element(by.css('[value="' + renk + '"]')).click();
    element(by.css('[ng-click="submitEditor()"]')).click();
   
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
	
	  beforeEach(function() {
	        browser.get(baseAddress + '/#/chapter/1/author/1040/verse/1');
	        
	       //browser.sleep(50000); // if your test is outrunning the browser
	       // browser.waitForAngular(); 
	       // pageLoadedStatus = true; 
	    });


	  it('Tüm notların sol panel uygulaması KCS-115', function() {
		 
		    //İlk 10 adet notun eklenmesi

		  var sifirekle = {
			  "1": "01",
			  "2": "02",
			  "3": "03",
			  "4": "04",
			  "5": "05",
			  "6": "06",
			  "7": "07",
			  "8": "08",
			  "9": "09",
			  "10": "10",
			  "11": "11",
			  "12": "12",
			  "13": "13",
			  "14": "14",
			  "15": "15",
			  "16": "16",
			  "17": "17",
			  "18": "18",
			  "19": "19",
			  "20": "20",
			  "21": "21",
			  "22": "22",
			  "23": "23",
			  "24": "24",
			  "25": "25",
			  "26": "26",
			  "27": "27",
			  "28": "28",
			  "29": "29",
			  "30": "30",
			  "31": "31"
		  };

		  var currentDate = new Date();
		  var tarihi = sifirekle[currentDate.getDate()] + '/' + sifirekle[currentDate.getMonth()+1] + '/' + (currentDate.getYear()+1900);


		  listTranslations(3, 1, 5, 8);
		    	  
		    	  var elm = element(by.id('t_44056')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
				  not_yaz(elm, 'Test2', 'green', 30, 0, 3);
			 
		    	  elm = element(by.id('t_25237')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
				  not_yaz(elm, 'Test1', 'red', 58, 0, 1 );
				
					 
		listTranslations(68, 0, 6, 10);		  
								 elm = element(by.id('t_42749')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
								 not_yaz(elm, 'Test6', 'red', 80, 0, 0 );
								
								 elm = element(by.id('t_17761')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
								 not_yaz(elm, 'Test8', 'yellow', 40, 0, 16 );
									
								 
		listTranslations(83, 5, 7, 8);		  
								 elm = element(by.id('t_49627')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
								 not_yaz(elm, 'Test10', 'green', 70, 0, 21 );
								
								 elm = element(by.id('t_5855')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
								 not_yaz(elm, 'Test9', 'red', 80, 0, 3 );	
						
		listTranslations(27, 3, 4, 9);		  
					 elm = element(by.id('t_59431')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
					 not_yaz(elm, 'Test4', 'green', 50, 0, 46 );
					
					 elm = element(by.id('t_34426')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
					 not_yaz(elm, 'Test5', 'red', 80, 0, 91 );
					
					 elm = element(by.id('t_34337')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
					 not_yaz(elm, 'Test3', 'yellow', 100, 0, 2 );
					
					//Aynı ayet ve yazar içinde ikinci kelimenin işaretlenmesi.
					 elm = element(by.id('t_59431')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
					 not_yaz(elm, 'Test4-1', 'yellow', 150, 0, 46 );
					
				 
					 browser.sleep('3000');
					 
					 element(by.css('[class="fa fa-bars"]')).click();
					 browser.sleep("5000");
					 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
					
				 
				 //İlk 10 notun ilk-orta-sondan doğrulanması.
	var donen=kontrol(0, 'red');
				 
				 expect(donen[0]).toBe('3:1');
				 expect(donen[1]).toBe('Elif lâm mîm.');
				 expect(donen[2]).toBe('Test1');
				 expect(donen[3]).toBe('mîm');
					 
				 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
					 var tarih = text.substring(0,10);
					 expect(tarih).toBe(tarihi);	
				 });
				 
	donen=kontrol(4, 'yellow');
				 
				 expect(donen[0]).toBe('27:46');
				 expect(donen[1]).toBe('(Salih ilahî mesaja karşı çıkanlara:) "Ey kavmim!" dedi, "İyiliği ummak yerine, neden kötülüğün çarçabuk sizi bulmasını istiyorsunuz? Belki acınıp-esirgeniriz diye niçin Allah\'tan günahlarınızı bağışlamasını istemiyorsunuz?"');
				 expect(donen[2]).toBe('Test4-1');
				 expect(donen[3]).toBe('karşı');
					 
				 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
					 var tarih = text.substring(0,10);
					 expect(tarih).toBe(tarihi);	
				 });
				 
	donen=kontrol(9, 'green');
				 
				 expect(donen[0]).toBe('83:21');
				 expect(donen[1]).toBe('To be witnessed by those brought near.');
				 expect(donen[2]).toBe('Test10');
				 expect(donen[3]).toBe('witnessed');
					 
				 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
					 var tarih = text.substring(0,10);
					 expect(tarih).toBe(tarihi);	
				 });
				 
				  browser.sleep('10000');
					 
					 element(by.css('[onclick="toggleLeftPanel()"]')).click();
					 browser.sleep("3000");
		  //element(by.css('[href="#/chapter/1/author/1040/verse/1"]')).click();
				 
					 tmpautid1 = null;
					 
				 browser.refresh();
				 
				 browser.sleep("10000");
					 
				 //10 adet daha not ekleniyor.
				 
	listTranslations(15, 1, 6, 8);
	  	  
	  	  var elm = element(by.id('t_1809')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test11', 'green', 100, 0, 3);
		 
	  	  elm = element(by.id('t_26810')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test12', 'red', 160, 0, 65 );
			  
			  
	listTranslations(47, 4, 7, 10);
	  	  
	  	  elm = element(by.id('t_35726')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test13', 'yellow', 100, 0, 5);
		 
			  elm = element(by.id('t_35743')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test14', 'red', 100, 0, 22 );
			
			  elm = element(by.id('t_54577')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test15', 'red', 100, 0, 38 );
			  
	listTranslations(75, 6, 8, 9);
	  	  
			  elm = element(by.id('t_5586')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test16', 'green', 30, 0, 31 );

	  	  elm = element(by.id('t_61767')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test17', 'yellow', 100, 0, 5);
		 
			  elm = element(by.id('t_61774')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test18', 'red', 100, 0, 12 );
			
			  elm = element(by.id('t_5586')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test19', 'red', 100, 0, 31 );
			
	listTranslations(114, 3, 5, 7);
	  	  
			  elm = element(by.id('t_12473')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="ng-binding"]'));
			  not_yaz(elm, 'Test20', 'yellow', 130, 0, 5 );

			  
			 browser.sleep('3000');
			 
			 element(by.css('[class="fa fa-bars"]')).click();
			 browser.sleep("5000");
			 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
			 
			 //Notların toplam sayısını doğruluyor.
			 var notlar = element.all(by.repeater('annotation in annotations'))
			 
			 expect(notlar.count()).toEqual(10);
			 
			//Tüm notları tıklıyor.
			 element(by.css('[ng-click="get_all_annotations()"]')).click();
			 
			//Notların toplam sayısını doğruluyor.
			 expect(notlar.count()).toEqual(20);
			 
			//Tüm notları ilk-orta-sondan kontrol ediyor. 
	donen=kontrol(0, 'red');
			 
			 expect(donen[0]).toBe('3:1');
			 expect(donen[1]).toBe('Elif lâm mîm.');
			 expect(donen[2]).toBe('Test1');
			 expect(donen[3]).toBe('mîm');
				 
			 element(by.repeater('annotation in annotations').row(0)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
	donen=kontrol(11, 'red');
			 
			 expect(donen[0]).toBe('68:0');
			 expect(donen[1]).toBe('In the name of God, the Almighty, the Merciful.');
			 expect(donen[2]).toBe('Test6');
			 expect(donen[3]).toBe('name');
				 
			 element(by.repeater('annotation in annotations').row(11)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
	donen=kontrol(18, 'green');
			 
			 expect(donen[0]).toBe('83:21');
			 expect(donen[1]).toBe('To be witnessed by those brought near.');
			 expect(donen[2]).toBe('Test10');
			 expect(donen[3]).toBe('witnessed');
				 
			 element(by.repeater('annotation in annotations').row(18)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
	 		 //Sıralamayı zaman olarak yapıyor.
	 		 element(by.model('allAnnotationsOrderBy')).click();
	 		 element(by.css('[value="time"]')).click();
	 		 element(by.model('allAnnotationsOrderBy')).click();
	 		element(by.css('[ng-click="get_all_annotations()"]')).click();
	 		
	 		//Notları zaman sıralamasına göre doğruluyor.	 		
donen=kontrol(1, 'red');
			 
			 expect(donen[0]).toBe('75:31');
			 expect(donen[1]).toBe('[Useless, though, will be his repentance:* for [as long as he was alive] he did not accept the truth, nor did he pray [for enlightenment],');
			 expect(donen[2]).toBe('Test19');
			 expect(donen[3]).toBe('though');
				 
			 element(by.repeater('annotation in annotations').row(1)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
donen=kontrol(11, 'yellow');
			 
			 expect(donen[0]).toBe('27:2');
			 expect(donen[1]).toBe('Gerçeği onaylayanlar için bir kılavuz ve müjdedir.');
			 expect(donen[2]).toBe('Test3');
			 expect(donen[3]).toBe('onaylayanlar');
				 
			 element(by.repeater('annotation in annotations').row(11)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
donen=kontrol(19, 'green');
			 
			 expect(donen[0]).toBe('3:3');
			 expect(donen[1]).toBe('He sent down to you the book with truth, authenticating what is present with it; and He sent down the Torah and the Injeel...');
			 expect(donen[2]).toBe('Test2');
			 expect(donen[3]).toBe('sent');
				 
			 element(by.repeater('annotation in annotations').row(19)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
			//Not değiştirilir ve Etiket eklenir.
	        	element(by.repeater('annotation in annotations').row(14)).element(by.css('[class="fa fa-pencil-square-o "]')).click();
	        	element(by.model('annotationModalData.text')).clear();
	        	element(by.model('annotationModalData.text')).sendKeys('Not Değişti');
	        	element(by.model('newTag.text')).sendKeys('Tag Eklendi');
	        	element(by.css('[value="yellow"]')).click();
		        element(by.css('[ng-click="submitEditor()"]')).click();
		        
		        browser.sleep('5000');
		        
		        element(by.css('[onclick="toggleLeftPanel()"]')).click();
				 browser.sleep("3000");
		  //element(by.css('[href="#/chapter/1/author/1040/verse/1"]')).click();
			 
				 tmpautid1 = null;
				 
			 browser.refresh();
			 
			 browser.sleep("5000");
			 
			 //Not eklenen sayfa açılıyor. Eklenen etiket ve not doğrulanıyor.
			 listTranslations(83, 5, 7, 8);
			 element(by.model('$parent.verse_number')).clear();
			 element(by.model('$parent.verse_number')).sendKeys('3');
			 element(by.id('list_translations')).click();
			 
			 browser.sleep("5000");
			 
			 element(by.id('t_5855')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('[class="annotator-hl a_hl_red"]')).click();
			 
			 element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.repeater('annotationTag in annotation.tags').row(0)).getText().then(function(text) {
	    		  expect(text).toBe('tag eklendi');	
	         });
			 
			 element(by.css('[class="s_a_text"]')).getText().then(function(text) {
	       		 expect(text).toBe('Not Değişti');	
	       	 });   	
				
			 browser.sleep('3000');
			 
			 element(by.css('[class="fa fa-bars"]')).click();
			 browser.sleep("5000");
			 element(by.css('[ng-class="{active: currentPage == \'annotations\'}"]')).click();
			 browser.sleep("2000");
			 element(by.css('[ng-click="get_all_annotations()"]')).click();
			 browser.sleep("5000");
			 
			 //Not Siliniyor ve Silinen satıra bir alttakinin geldiği doğrulanıyor.
			 element(by.repeater('annotation in annotations').row(9)).element(by.css('[class="fa fa-trash-o"]')).click();
			 browser.sleep("2000");
			 
			 
donen=kontrol(9, 'red');
			 
			 expect(donen[0]).toBe('47:38');
			 expect(donen[1]).toBe('İşte sizler, Allah yolunda harcamaya çağırılan insanlarsınız. Ama bir kısmınız cimrilik ediyor. Oysa ki cimrilik eden kendi aleyhine cimrileşmiş olur. Allah Gani\'dir; yoksul olan sizlersiniz. Eğer yüz çevirirseniz, Allah yerinize başka bir toplum getirir. Ve onlar, sizin benzerleriniz olmazlar.');
			 expect(donen[2]).toBe('Test15');
			 expect(donen[3]).toBe('Allah');
				 
			 element(by.repeater('annotation in annotations').row(9)).element(by.css('[class="row"]')).element(by.css('[class="ng-binding"]')).getText().then(function(text) {
				 var tarih = text.substring(0,10);
				 expect(tarih).toBe(tarihi);	
			 });
			 
			 browser.executeScript('window.scrollTo(0,0);');
			 
			 var cnt;
			 
			 for(var x=0; x<19;x++)
				 {
				   element(by.repeater('annotation in annotations').row(0)).element(by.css('[ng-click="deleteAnnotation2(annotation)"]')).click();
				   browser.sleep("1000");
				 }
			 
			 expect(notlar.count()).toEqual(0);
			 
	 		browser.sleep('10000');
		
	      }); 
	  });