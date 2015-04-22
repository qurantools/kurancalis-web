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

        //Sure numarası ve yazar row numaralarını göndererek sayfada oluşan ayet, yazar sayısının ve ayet içeriğinin kontrolü.

        listTranslations(2, 0, 6, 9 );
        expect(theVerses.count()).toEqual(287);
        expect(authors.count()).toEqual(861);

        element(by.id('t_12482')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('الم');
        });

        element(by.id('t_37421')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('ALM.');
        });

        element(by.id('t_56238')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Elif-Lâm-Mîm.');
        });

        element(by.id('t_12625')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('قد نرى تقلب وجهك �?ى السماء �?لنولينك قبلة ترضىها �?ول وجهك شطر المسجد الحرام وحيث ما كنتم �?ولوا وجوهكم شطره وان الذين اوتوا الكتب ليعلمون انه الحق من ربهم وما الله بغ�?ل عما يعملون');
        });

        element(by.id('t_37564')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('We see the shifting of your face towards the heaven; We will thus set for you a focal point that will be pleasing to you: "You shall set yourself towards the Restricted Temple; and wherever you may be, you shall all set yourselves towards it." Those who have been given the Book know it is the truth from their Lord. And God is not unaware of what you do.');
        });

        element(by.id('t_56381')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Biz, (ey Peygamber) senin sık sık yüzünü (bir kılavuz arayışı içinde) göğe çevirdiğini görüyoruz: ve şimdi seni tam tatmin edecek bir kıbleye döndürüyoruz. Artık yüzünü Mescid-i Harâm\'a çevir; ve siz, hepiniz, nerede olursanız olun, yüzünüzü (namaz esnasında) o yöne döndürün. Doğrusu, daha önce kendilerine vahiy tevdî edilmiş olanlar, bu emrin Rablerinden gelen bir hakikat olduğunu çok iyi bilirler; ve Allah onların yaptıklarından habersiz değildir.');
        });

        element(by.id('t_12767')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('لا يكل�? الله ن�?سا الا وسعها لها ما كسبت وعليها ما اكتسبت ربنا لا تواخذنا ان نسينا او اخطانا ربنا ولا تحمل علينا اصرا كما حملته على الذين من قبلنا ربنا ولا تحملنا ما لا طاقة لنا به واع�? عنا واغ�?ر لنا وارحمنا انت مولىنا �?انصرنا على القوم الك�?رين');
        });

        element(by.id('t_37706')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('God does not burden a soul except with what it can bear. For it is what it earns, and against it is what it earns. "Our Lord, do not mind us if we forget or make mistakes; our Lord, do not place a burden upon us as You have placed upon those before us; our Lord, do not place upon us what we cannot bear; pardon us, and forgive us, and have mercy on us; You are our patron, so grant us victory over the disbelieving people."');
        });

        element(by.id('t_56523')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('\"Allah hiç kimseye taşiyabileceginden daha fazlasini yüklemez: kişinin yaptigi her iyilik kendi lehinedir, her kötülük de kendi aleyhine." "Ey Rabbimiz! Unutur veya bilmeden hata yaparsak bizi sorgulama!" "Ey Rabbimiz! Bizden öncekilere yüklediğin gibi bize de ağır yükler yükleme! Ey Rabbimiz! Güç yetiremeyeceğimiz yükleri bize taşıtma!" "Ve günahlarımızı affet, bizi bağışla ve rahmetini yağdır üstümüze! Sen Yüce Mevlâmızsın, hakikati inkar eden topluma karşı bize yardım et!\"');
        });


        listTranslations(4, 1, 7, 10);
        expect(theVerses.count()).toEqual(177);
        expect(authors.count()).toEqual(531);

        element(by.id('t_64373')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Bismillâhir rahmânir rahîm.');
        });

        element(by.id('t_64372')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('In the name of GOD, Most Gracious, Most Merciful. ,');
        });

        element(by.id('t_64376')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Rahman ve Rahim Allah\'ın adıyla...');
        });

        element(by.id('t_25524')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Fe mâ lekum fil munâfikîne fieteyni vallâhu erkesehum bi mâ kesebû e turîdûne en tehdû men edallallâh|u|, ve men yudlilillâhu fe len tecide lehu sebîlâ(sebîlen).');
        });

        element(by.id('t_19291')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Why should you divide yourselves into two groups regarding hypocrites (among you)? GOD is the one who condemned them because of their own behavior. Do you want to guide those who are sent astray by GOD? Whomever GOD sends astray, you can never find a way to guide them.,');
        });

        element(by.id('t_50575')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Size ne oluyor da münafıklar hakkında iki gruba ayrılıyorsunuz? Allah onları kazandıkları yüzünden baş aşağı etmişken, Allah\'ın saptırdığını yola getirmek mi istiyorsunuz? Allah\'ın şaşırttığına sen asla yol sağlayamazsın.');
        });

        element(by.id('t_25612')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Yesteftûnek|e|, kulillâhu yuftîkum fîl kelâleh(kelâleti) inimruun heleke leyse lehû veled(veledun), ve lehû uhtun fe lehâ nısfu mâ terak|e|, ve huve yerisuhâ in lem yekun lehâ veled(veledun), fe in kânetesneteyni fe le humes sulusâni mimmâ terak|e| ve in kânû ıhveten ricâlen ve nisâen fe liz zekeri mislu hazzıl unseyeyn|i|, yubeyyinullâhu lekum en tadıllû vallâhu bi kulli şey’in alîm(alîmun).');
        });

        element(by.id('t_19379')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('They consult you; say, "GOD advises you concerning the single person. If one dies and leaves no children, and he had a sister, she gets half the inheritance. If she dies first, he inherits from her, if she left no children. If there were two sisters, they get two-thirds of the inheritance. If the siblings are men and women, the male gets twice the share of the female." GOD thus clarifies for you, lest you go astray. GOD is fully aware of all things.,');
        });

        element(by.id('t_50663')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Fetva istiyorlar senden. De ki: "Allah size, ana-babasız ve çocuksuz kişi hakkında şöyle fetva veriyor: Çocuğu olmayan, bir kızkardeşi bulunan kişi öldüğünde, onun terekesinin yarısı kızkardeşinindir. Böyle bir kişi, çocuğu olmayan kızkardeşi öldüğünde, onun terekesinin tamamına mirasçı olur. Eğer ölenin iki kızkardeşi varsa terekenin üçte ikisi onlarındır. Eğer mirasçılar, kadın-erkek, birçok kardeşlerse bu durumda erkek kardeşe, iki kızkardeşin payı kadar verilir." Allah size açık-seçik bildiriyor ki sapmayasınız. Allah, herşeyi gereğince bilmektedir.');
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
            expect(text).toBe('Onların ardından Musa\'yı, ayetlerimizle Firavun\'a ve kodamanlarına gönderdik de ayetlerimiz karşısında zalimce davrandılar. Bir bak, nasıl olmuştur bozguncuların sonu!');
        });


        element(by.id('t_7400')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Inna allatheena AAinda rabbika layastakbiroona AAan AAibadatihi wayusabbihoonahuwalahu yasjudoona');
        });

        element(by.id('t_1164')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Behold, those who are near unto thy Sustainer* are never too proud to worship Him; and they extol His limitless glory, and prostrate themselves before Him [alone].');
        });

        element(by.id('t_51154')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).getText().then(function(text) {
            expect(text).toBe('Rabbinin katında olanlar, büyüklük taslayıp O\'na kulluktan yüz çevirmezler; O\'nu tespih ederler ve yalnız O\'na secde ederler.');
        });

        //Ayet içinde bulunan * buttonu açılımı ve içerik kontrolu

        var result="Besmele";

        yildiz(1);

        element(by.repeater('translation in verse.translations').row(0)).element(by.css('[class="col-xs-11 footnotebg"]')).getText().then(function(text) {
            var text1 = text.substring(0,7);
            expect(text1).toBe(result);
        });

    });

    it('Not ekleme', function() {

        //Burada üye girişi için işlem pause edilmesi

        browser.sleep(50000);

        //Üyenin not yazabilmesi ve yazdığı notla ilgili kelimenin aldığı renk seçtiği renkle eşit olma durumu kontrolu.

        var not_deger='ASlaskalfjoasjfFIOJıoefj.:/*\'ffefefelöcşcöl,;üğşçöi!^+%&/()=?_é<">@>£#$½6{}\;`lkkvd';

        not_yaz(not_deger);

        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).getText().then(function(text) {
            expect(text).toBe('Rahim');
        });

        //Üyenin yazdığı notun sağda açılan ekranda görüldüğünün kontrolu.

        var elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]'));
        karala(elm, 0, 0);

        element(by.css('[class="s_a_text"]')).getText().then(function(text) {
            expect(text).toBe(not_deger);
        });

        //Üyenin yazdığı notu silme ve panel kapama işlemi.

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
        element(by.id('cd-panel-right')).click();

        //Üyenin yaptığı karalamada karalama alanını aştığında uyarı vermesinin kontrolu.

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));
        karala(elm, 0, 10);

        element(by.css('[class="annotator-notice annotator-notice-show annotator-notice-error"]')).getText().then(function(text) {
            expect(text).toBe('Sadece meal içerisini karalamalısınız');
        });
    });

    it('Silinen not doğrulanması', function() {

        browser.refresh();

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));

        karala(elm, -12, 0);
        expect(element(by.id('cd-panel-right')).isDisplayed()).toBe(false);
    });

    it('Etiket işlemleri', function() {

        var not_deger='ASlaskalfjoasjfFIOJıoefj.:/*\'ffefefelöcşcöl,;üğşçöi!^+%&/()=?_é<">@>£#$½6{}\;`lkkvd';

        elm = element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span'));

        //karalama yapıyor not ve etiket ekliyor

        karala(elm, -12, 0);
        element(by.css('[class="annotator-adder"]')).element(by.css('button')).click();
        element(by.model('annotationModalData.text')).sendKeys(not_deger);
        element(by.model('newTag.text')).sendKeys('Test1');
        element(by.css('[value="red"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).click();

        //eklenen etiketi sağ paneli açıp kontrol ediyor.

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

        //eklenen etiketleri sağ paneli açıp kontrol ediyor.

        expect(lcnt.count()).toEqual(3);

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();

        //eklenen etiketten ortada olanı siliyor.

        element(by.repeater('tag in tagList.items track by track(tag)').row(1)).element(by.css('[class="remove-button ng-binding"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        element(by.id('cd-panel-right')).click();
        element(by.id('t_31180')).element(by.css('[class="col-xs-12 col-sm-9 translation_content"]')).element(by.css('span')).element(by.css('[class="annotator-hl a_hl_red"]')).click();

        //silinen etiketi sağ paneli açıp kontrol ediyor.

        expect(lcnt.count()).toEqual(2);

        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-pencil-square-o"]')).click();

        //eklenen diğer etiketleri siliyor.

        element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[class="remove-button ng-binding"]')).click();
        element(by.repeater('tag in tagList.items track by track(tag)').row(0)).element(by.css('[class="remove-button ng-binding"]')).click();
        element(by.css('[ng-click="submitEditor()"]')).click();

        //silinen etiketleri sağ paneli açıp kontrol ediyor.

        expect(lcnt.count()).toEqual(0);

        //notu siliyor.
        element(by.repeater('annotation in annotations | filter:annotationFilter | filter: annotationTextSearch').row(0)).element(by.css('[class="fa fa-trash-o"]')).click();
        element(by.id('cd-panel-right')).click();

    });

});