var uyelik = require('./uyelik');

describe('Cikarim notu Ekleme',function(){
    
    var _title = element(by.model('title'));
    var _content = element(by.model('content'));
    var _tags = element.all(by.repeater('tags in inferenceTagsList'));
    var _userForSearch = element.all(by.repeater('user in ViewUsers'));
    var circleSharing = element.all(by.repeater('item in mobileAnnotationEditorCircleListForSelection'));
    
    var _addInference = element(by.id('saveInference'));
    
     beforeEach(function() {
         browser.ignoreSynchronization = false;
        browser.get(baseAddress+'/m/www/#/inference/new/');
    });
    
    function add(title,content,tags,userForSearch){


        _title.sendKeys(title);
        _content.sendKeys(content);
        
    }
    
    it('cikarim ekleme actions',function(){

        var uye = new uyelik();

        uye.cikis();
        uye.sil();
        uye.giris();

        browser.sleep(5000);

        add('test','icerik deneme','','');
        expect(_title.getText()).toEqual('test');
    });
    
});