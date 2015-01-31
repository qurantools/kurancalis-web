// spec.js
//

describe('ceviri gosterimi', function() {

    var chapterInput = element(by.model('chapter_id'));
    var listTranslationsButton = element(by.id('list_translations'));
    var theVerses = element.all(by.repeater('verse in verses'));


    function listTranslations(chapterNo) {

        //chapterInput.click();
        //chapterInput.sendKeys(protractor.Key.BACK);
        chapterInput.clear();
        chapterInput.sendKeys(chapterNo).then(function() {   process.stdout.write("send success"); }, function(err) { process.stdout.write("send fail"); });
        //fooInput.sendKeys("dennem");
        listTranslationsButton.click();
        //expect(chapterInput.getText()).toEqual(chapterNo);
    }

    beforeEach(function() {
        //browser.get('http://localhost:63342/kurancalis-web/#/');
        browser.get('http://kurancalis.com');
    });

    it('should get chapter translations', function() {
        //browser.ignoreSynchronization = true;


        listTranslations(2);
        expect(theVerses.count()).toEqual(287);
        listTranslations(4);
        expect(theVerses.count()).toEqual(177);
        listTranslations(114);
        expect(theVerses.count()).toEqual(7);


        //process.stdout.write("count:" + theVerses.count().toString());
        expect(theVerses.count()).toEqual(7);

    });

});