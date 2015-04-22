// spec.js
//

describe('ceviri gosterimi', function() {

    var theVerses = element.all(by.repeater('verse in verses'));
    var authors = element.all(by.repeater('translation in verse.translations'));

    var aramabtn = element.all(by.css('[class="caret pull-right"]'));
    var aramakutu = element(by.model('$select.search'));

    var yazarbtn = element.all(by.css('[class="fa fa-user"]'));
    var yazargnd = element(by.css('[ng-click="updateAuthors()"]'));

    var tmpautid1;
    var tmpautid2;
    var tmpautid3;

    beforeEach(function() {
        browser.get('http://kurancalis.com/#/chapter/1/author/1040/verse/1');
        //browser.sleep(50000); // if your test is outrunning the browser
        // browser.waitForAngular();
        // pageLoadedStatus = true;
    });

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

    function yildiz(chapterNo) {

        element.all(by.css('[class="caret pull-right"]')).click();

        element(by.model('$select.search')).clear();
        element(by.model('$select.search')).sendKeys(chapterNo);
        element(by.model('$select.search')).sendKeys(protractor.Key.ENTER);

        yazarbtn.click();

        element(by.repeater('author in authors').row(3)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
        element(by.repeater('author in authors').row(8)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();
        element(by.repeater('author in authors').row(10)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();

        element(by.repeater('author in authors').row(4)).element(by.css('[ng-click="toggleSelection(author.id)"]')).click();

        yazargnd.click();

        element.all(by.repeater('verse in verses')).get(0).element(by.linkText('*')).click();
    }

    function karala(elm, korx, kory) {

        browser.actions().
            mouseDown(elm).
            mouseMove({x: korx, y: kory}).
            mouseMove({x: korx, y: kory}).
            mouseMove({x: korx, y: kory}).
            mouseMove({x: korx, y: kory}).
            mouseUp().
            perform();
    }

    function not_yaz(not_deger) {

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));

        karala(elm, -12, 0);
        element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
        element(by.model('annotationModalData.text')).sendKeys(not_deger);
        element(by.css('[value="red"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();
    }

    it('should get chapter translations', function() {

        //Sure numaras� ve yazar row numaralar�n� g�ndererek sayfada olu�an ayet, yazar say�s�n�n ve ayet i�eri�inin kontrol�.

        listTranslations(2, 0, 6, 9 );
        expect(theVerses.count()).toEqual(287);
        expect(authors.count()).toEqual(861);

        element(by.id('t_12482')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('???');
        });

        element(by.id('t_37421')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('ALM.');
        });

        element(by.id('t_56238')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Elif-L�m-M�m.');
        });

        element(by.id('t_12625')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('?? ??? ???? ???? ?? ?????? ???????? ???? ?????? ??? ???? ??? ?????? ?????? ???? ?? ???? ????? ?????? ???? ??? ????? ????? ????? ??????? ??? ???? ?? ???? ??? ???? ???? ??? ??????');
        });

        element(by.id('t_37564')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('We see the shifting of your face towards the heaven; We will thus set for you a focal point that will be pleasing to you: "You shall set yourself towards the Restricted Temple; and wherever you may be, you shall all set yourselves towards it." Those who have been given the Book know it is the truth from their Lord. And God is not unaware of what you do.');
        });

        element(by.id('t_56381')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Biz, (ey Peygamber) senin s�k s�k y�z�n� (bir k�lavuz aray��� i�inde) g��e �evirdi�ini g�r�yoruz: ve �imdi seni tam tatmin edecek bir k�bleye d�nd�r�yoruz. Art�k y�z�n� Mescid-i Har�m\'a �evir; ve siz, hepiniz, nerede olursan�z olun, y�z�n�z� (namaz esnas�nda) o y�ne d�nd�r�n. Do�rusu, daha �nce kendilerine vahiy tevd� edilmi� olanlar, bu emrin Rablerinden gelen bir hakikat oldu�unu �ok iyi bilirler; ve Allah onlar�n yapt�klar�ndan habersiz de�ildir.');
        });

        element(by.id('t_12767')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('?? ???? ???? ???? ??? ????? ??? ?? ???? ?????? ?? ?????? ???? ?? ??????? ?? ????? ?? ?????? ???? ??? ???? ????? ???? ??? ????? ??? ????? ?? ????? ???? ??? ?????? ?? ?? ???? ??? ?? ???? ??? ????? ??? ??????? ??? ?????? ??????? ??? ????? ???????');
        });

        element(by.id('t_37706')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('God does not burden a soul except with what it can bear. For it is what it earns, and against it is what it earns. "Our Lord, do not mind us if we forget or make mistakes; our Lord, do not place a burden upon us as You have placed upon those before us; our Lord, do not place upon us what we cannot bear; pardon us, and forgive us, and have mercy on us; You are our patron, so grant us victory over the disbelieving people."');
        });

        element(by.id('t_56523')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('\"Allah hi� kimseye ta�iyabileceginden daha fazlasini y�klemez: ki�inin yaptigi her iyilik kendi lehinedir, her k�t�l�k de kendi aleyhine." "Ey Rabbimiz! Unutur veya bilmeden hata yaparsak bizi sorgulama!" "Ey Rabbimiz! Bizden �ncekilere y�kledi�in gibi bize de a��r y�kler y�kleme! Ey Rabbimiz! G�� yetiremeyece�imiz y�kleri bize ta��tma!" "Ve g�nahlar�m�z� affet, bizi ba���la ve rahmetini ya�d�r �st�m�ze! Sen Y�ce Mevl�m�zs�n, hakikati inkar eden topluma kar�� bize yard�m et!\"');
        });


        listTranslations(4, 1, 7, 10);
        expect(theVerses.count()).toEqual(177);
        expect(authors.count()).toEqual(531);

        element(by.id('t_64373')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Bismill�hir rahm�nir rah�m.');
        });

        element(by.id('t_64372')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('In the name of GOD, Most Gracious, Most Merciful. ,');
        });

        element(by.id('t_64376')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Rahman ve Rahim Allah\'�n ad�yla...');
        });

        element(by.id('t_25524')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Fe m� lekum fil mun�fik�ne fieteyni vall�hu erkesehum bi m� keseb� e tur�d�ne en tehd� men edallall�h|u|, ve men yudlilill�hu fe len tecide lehu seb�l�(seb�len).');
        });

        element(by.id('t_19291')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Why should you divide yourselves into two groups regarding hypocrites (among you)? GOD is the one who condemned them because of their own behavior. Do you want to guide those who are sent astray by GOD? Whomever GOD sends astray, you can never find a way to guide them.,');
        });

        element(by.id('t_50575')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Size ne oluyor da m�naf�klar hakk�nda iki gruba ayr�l�yorsunuz? Allah onlar� kazand�klar� y�z�nden ba� a�a�� etmi�ken, Allah\'�n sapt�rd���n� yola getirmek mi istiyorsunuz? Allah\'�n �a��rtt���na sen asla yol sa�layamazs�n.');
        });

        element(by.id('t_25612')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Yesteft�nek|e|, kulill�hu yuft�kum f�l kel�leh(kel�leti) inimruun heleke leyse leh� veled(veledun), ve leh� uhtun fe leh� n�sfu m� terak|e|, ve huve yerisuh� in lem yekun leh� veled(veledun), fe in k�netesneteyni fe le humes sulus�ni mimm� terak|e| ve in k�n� �hveten ric�len ve nis�en fe liz zekeri mislu hazz�l unseyeyn|i|, yubeyyinull�hu lekum en tad�ll� vall�hu bi kulli �ey�in al�m(al�mun).');
        });

        element(by.id('t_19379')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('They consult you; say, "GOD advises you concerning the single person. If one dies and leaves no children, and he had a sister, she gets half the inheritance. If she dies first, he inherits from her, if she left no children. If there were two sisters, they get two-thirds of the inheritance. If the siblings are men and women, the male gets twice the share of the female." GOD thus clarifies for you, lest you go astray. GOD is fully aware of all things.,');
        });

        element(by.id('t_50663')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Fetva istiyorlar senden. De ki: "Allah size, ana-babas�z ve �ocuksuz ki�i hakk�nda ��yle fetva veriyor: ?�ocu�u olmayan, bir k�zkarde�i bulunan ki�i �ld���nde, onun terekesinin yar�s� k�zkarde�inindir. B�yle bir ki�i, �ocu�u olmayan k�zkarde�i �ld���nde, onun terekesinin tamam�na miras�� olur. E�er �lenin iki k�zkarde�i varsa terekenin ��te ikisi onlar�nd�r. E�er miras��lar, kad�n-erkek, bir�ok karde�lerse bu durumda erkek karde�e, iki k�zkarde�in pay� kadar verilir." Allah size a��k-se�ik bildiriyor ki sapmayas�n�z. Allah, her�eyi gere�ince bilmektedir.');
        });

        listTranslations(7, 3, 8 ,10);
        expect(theVerses.count()).toEqual(207);
        expect(authors.count()).toEqual(621);

        element(by.id('t_7195')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Alif-lam-meem-sad');
        });

        element(by.id('t_959')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Alif. Lam. Mim.*');
        });

        element(by.id('t_50949')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Elif, Lam, Mim, Sad.');
        });

        element(by.id('t_7297')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Thumma baAAathna min baAAdihim moosabi-ayatina ila firAAawna wamala-ihifathalamoo biha faonuthurkayfa kana AAaqibatu almufsideena');
        });

        element(by.id('t_1061')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('AND AFTER those [early people] We sent Moses with Our messages unto Pharaoh and his great ones, and they wilfully rejected them:* and behold what happened in the end to those spreaders of corruption!');
        });

        element(by.id('t_51051')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Onlar�n ard�ndan Musa\'y�, ayetlerimizle Firavun\'a ve kodamanlar�na g�nderdik de ayetlerimiz kar��s�nda zalimce davrand�lar. Bir bak, nas�l olmu�tur bozguncular�n sonu!');
        });


        element(by.id('t_7400')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Inna allatheena AAinda rabbika layastakbiroona AAan AAibadatihi wayusabbihoonahuwalahu yasjudoona');
        });

        element(by.id('t_1164')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Behold, those who are near unto thy Sustainer* are never too proud to worship Him; and they extol His limitless glory, and prostrate themselves before Him [alone].');
        });

        element(by.id('t_51154')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Rabbinin kat�nda olanlar, b�y�kl�k taslay�p O\'na kulluktan y�z �evirmezler; O\'nu tespih ederler ve yaln�z O\'na secde ederler.');
        });

        //Ayet i�inde bulunan * buttonu a��l�m� ve i�erik kontrolu

        var result="Besmele";

        yildiz(1);

        element(by.repeater('translation in verse.translations').row(0)).element(by.css('[class="col-xs-11 footnotebg"]')).getText().then(function(text) {
            var text1 = text.substring(0,7);
            expect(text1).toBe(result);
        });

    });

    it('Not ekleme', function() {

        //Burada �ye giri�i i�in i�lem pause edilmesi

        browser.sleep(50000);

        //�yenin not yazabilmesi ve yazd��� notla ilgili kelimenin ald��� renk se�ti�i renkle e�it olma durumu kontrolu.

        var not_deger='ASlaskalfjoasjfFIOJ�oefj.:/*\'ffefefel�c�c�l,;�����i!^+%&/()=?_�<">@>�#$�6{}\;`lkkvd';

        not_yaz(not_deger);

        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).getText().then(function(text) {
            expect(text).toBe('Rahim');
        });

        //�yenin yazd��� notun sa�da a��lan ekranda g�r�ld���n�n kontrolu.

        var elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]'));
        karala(elm, 0, 0);

        element(by.css('[class="s_a_text"]')).getText().then(function(text) {
            expect(text).toBe(not_deger);
        });

        //�yenin yazd��� notu silme ve panel kapama i�lemi.

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
        element(by.id('cd-panel-right')).click();

        //�yenin yapt��� karalamada karalama alan�n� a�t���nda uyar� vermesinin kontrolu.

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));
        karala(elm, 0, 10);

        element(by.css('[class="annotator-notice annotator-notice-show annotator-notice-error"]')).getText().then(function(text) {
            expect(text).toBe('Sadece meal i�erisini karalamal�s�n�z');
        });
    });

    it('Silinen not do�rulanmas�', function() {

        browser.refresh();

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));

        karala(elm, -12, 0);
        expect(element(by.id('cd-panel-right')).isDisplayed()).toBe(false);
    });

    it('Etiket i�lemleri', function() {

        var not_deger='ASlaskalfjoasjfFIOJ�oefj.:/*\'ffefefel�c�c�l,;�����i!^+%&/()=?_�<">@>�#$�6{}\;`lkkvd';

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));

        //karalama yap�yor not ve etiket ekliyor

        karala(elm, -12, 0);
        element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
        element(by.model('annotationModalData.text')).sendKeys(not_deger);
        element(by.model('newTag.text')).sendKeys('Test1');
        element(by.css('[value="red"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).click();

        //eklenen etiketi sa� paneli a��p kontrol ediyor.

        var lcnt = element.all(by.repeater('annotationTag in annotation.tags'));
        expect(lcnt.count()).toEqual(1);

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();

        //Nota iki adet daha etiket ekliyor

        element(by.model('newTag.text')).sendKeys('Test2');
        element(by.model('annotationModalData.text')).click();
        element(by.model('newTag.text')).sendKeys('Test3');
        element(by.model('annotationModalData.text')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        element(by.id('cd-panel-right')).click();
        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).click();

        //eklenen etiketleri sa� paneli a��p kontrol ediyor.

        expect(lcnt.count()).toEqual(3);

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();

        //eklenen etiketten ortada olan� siliyor.

        element(by.repeater('tag in tagList.items track by track(tag)').row(1)).element(by.css('[class="remove-button ng-binding"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        element(by.id('cd-panel-right')).click();
        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).click();

        //silinen etiketi sa� paneli a��p kontrol ediyor.

        expect(lcnt.count()).toEqual(2);

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();

        //eklenen di�er etiketleri siliyor.

        element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[class="remove-button ng-binding"]')).click();
        element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[class="remove-button ng-binding"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        //silinen etiketleri sa� paneli a��p kontrol ediyor.

        expect(lcnt.count()).toEqual(0);

        //notu siliyor.
        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
        element(by.id('cd-panel-right')).click();

    });

});