// Code goes here
var sureler=[];
sureler[96] = "ALAK";
sureler[68] = "KALEM";
sureler[73] = "MÜZZEMMİL";
sureler[1] = "FÂTİHA";
sureler[74] = "MÜDDESSİR";
sureler[111] = "TEBBET";
sureler[81] = "TEKVÎR";
sureler[87] = "A‘LÂ";
sureler[92] = "LEYL";
sureler[89] = "FECR";
sureler[93] = "DUHÂ";
sureler[94] = "İNŞİRÂH";
sureler[103] = "ASR";
sureler[100] = "ÂDİYÂT";
sureler[108] = "KEVSER";
sureler[102] = "TEKÂSÜR";
sureler[107] = "MÂÛN";
sureler[109] = "KÂFİRÛN";
sureler[105] = "FİL";
sureler[113] = "FELÂK";
sureler[114] = "NÂS";
sureler[112] = "İHLÂS";
sureler[53] = "NECM";
sureler[80] = "ABESE";
sureler[97] = "KADR";
sureler[91] = "ŞEMS";
sureler[85] = "BURUC";
sureler[95] = "TÎN";
sureler[106] = "KUREYŞ";
sureler[101] = "KÂRİAH";
sureler[75] = "KIYÂMET";
sureler[104] = "HÜMEZE";
sureler[77] = "MÜRSELÂT";
sureler[50] = "KÂF";
sureler[90] = "BELED";
sureler[86] = "TÂRIK";
sureler[54] = "KAMER";
sureler[38] = "SÂD";
sureler[7] = "A‘RÂF";
sureler[72] = "CİN";
sureler[36] = "YÂ-SÎN";
sureler[25] = "FURKÂN";
sureler[35] = "FÂTIR";
sureler[19] = "MERYEM";
sureler[20] = "TÂ-HÂ";
sureler[56] = "VÂKIA";
sureler[26] = "ŞU‘ARÂ";
sureler[27] = "NEML";
sureler[28] = "KASAS";
sureler[17] = "İSRÂ";
sureler[10] = "YÛNUS";
sureler[11] = "HÛD";
sureler[12] = "YÛSUF";
sureler[15] = "HİCR";
sureler[6] = "EN‘ÂM";
sureler[37] = "SÂFFÂT";
sureler[31] = "LOKMÂN";
sureler[34] = "SEBE";
sureler[39] = "ZÜMER";
sureler[40] = "MÜ’MİN";
sureler[41] = "FUSSILET";
sureler[42] = "ŞÛRÂ";
sureler[43] = "ZUHRUF";
sureler[44] = "DUHÂN";
sureler[45] = "CÂSİYE";
sureler[46] = "AHKÂF";
sureler[51] = "ZÂRİYÂT";
sureler[88] = "ĞÂŞİYE";
sureler[18] = "KEHF";
sureler[16] = "NAHL";
sureler[71] = "NÛH";
sureler[14] = "İBRÂHÎM";
sureler[21] = "ENBİYÂ";
sureler[23] = "MÜ’MİNÛN";
sureler[32] = "SECDE";
sureler[52] = "TÛR";
sureler[67] = "MÜLK";
sureler[69] = "HÂKKA";
sureler[70] = "ME‘ÂRİC";
sureler[78] = "NEBE";
sureler[79] = "NÂZİÂT";
sureler[82] = "İNFİTÂR";
sureler[84] = "İNŞİKÂK";
sureler[30] = "RÛM";
sureler[29] = "ANKEBÛT";
sureler[83] = "MUTAFFİFÎN";
sureler[2] = "BAKARA";
sureler[8] = "ENFÂL";
sureler[3] = "ÂL-İ İMRÂN";
sureler[33] = "AHZÂB";
sureler[60] = "MÜMTEHİNE";
sureler[4] = "NİSÂ";
sureler[99] = "ZİLZAL";
sureler[57] = "HADÎD";
sureler[47] = "MUHAMMED";
sureler[13] = "RA‘D";
sureler[55] = "RAHMÂN";
sureler[76] = "İNSÂN";
sureler[65] = "TALÂK";
sureler[98] = "BEYYİNE";
sureler[59] = "HAŞR";
sureler[24] = "NÛR";
sureler[22] = "HAC";
sureler[63] = "MÜNÂFIKÛN";
sureler[58] = "MÜCÂDELE";
sureler[49] = "HUCURÂT";
sureler[66] = "TAHRÎM";
sureler[64] = "TEĞÂBÜN";
sureler[61] = "SAFF";
sureler[62] = "CUMA";
sureler[48] = "FETİH";
sureler[5] = "MÂİDE";
sureler[9] = "TEVBE";
sureler[110] = "NASR";

function sureId(isim){

  
  for (var s in sureler){
      if(sureler[s] == isim){
        return s;
      }
  } 

}

//dipnot giris sql dondurur.
function dipnotIsle(chapter_no,ayet_no,ayetDipnotlari){


    var result="";
    if(ayetDipnotlari !== null) {

        for (var dipnot of ayetDipnotlari)
        {
            var dipnotNo = dipnot.match(/\d+/);

            result += "insert into footnote (author_id, verse_id, tracode, chapter, verse, footnote_number, content, translation_id) " +
            "values (262144, " + (1000 * chapter_no + ayet_no) + ",\"iste\"," + chapter_no + "," + ayet_no + "," + dipnotNo + ",\"\",5)\n";
        }
    }
    return result;
}

function getTranslationInsert(chapterId,verse,metin,ayetDipnotlari){
    var result="";
    var verseId = 1000*chapterId+parseInt(verse);
    result += "insert into translation (chapter,verse_id,verse,author_id,version,content) "
    +"values("+chapterId+","+verseId+","+verse+","+262144+"1,\""+metin+"\");\n";
    result += dipnotIsle(chapterId,verse,ayetDipnotlari);
    return result;
}

function processJson(){

  var theInput = document.getElementById('jsonTextID').value;
  var result="";
  var sureler = JSON.parse(theInput);
  var i=1;

  
  for (var sure of sureler) {
    console.log(sure.sure+":"+sureId(sure.sure) );
  }

  for (var sure of sureler) {
    var chapterId = sureId(sure.sure);
    //result += chapterId+":"+ sure.sure+"\n";
    //result += sure.donem+"\n";
    for (necm of sure.necmler) {
      for (var ayet of necm.ayetler) {
        var ayetDipnotlari = ayet.metin.match(/\*\*DIP\[(\d+)\]DIP\*\*/g);
        if(ayetDipnotlari !== null) {
            for (var dipnot of ayetDipnotlari)
            {
                ayet.metin = ayet.metin.replace(dipnot, "*");
            }
        }
        //x,y
        //x ve y icin ayni ayet
        //ayetin basina (x,y) yazılacak
        var ikili = ayet.ayet.split(",");
        var aralikli = ayet.ayet.split("-");
        if(ikili.length == 2){
          var x = +ikili[0];  
          var y = +ikili[1];  
          //result +="ikili:|"+x+"|"+y;
          result += getTranslationInsert(chapterId,x,ayet.metin,ayetDipnotlari);

          result += getTranslationInsert(chapterId,y,ayet.metin,ayetDipnotlari);
        }
        else if(aralikli.length == 2){ //x-y
          var x = +aralikli[0];  
          var y = +aralikli[1];
          //result +="aralik:|"+x+"|"+y;
          for(var i=x; i<=y; i++){
            result += getTranslationInsert(chapterId,i,ayet.metin,ayetDipnotlari);
          }
        }
        else{ //tek ayet
          result += getTranslationInsert(chapterId,ayet.ayet,ayet.metin,ayetDipnotlari);
        }
        
        
        //x den y ye yadar ayni ayet
        //ayetin basina (x-y) yazılacak
        
        //x

        
        
        //dipnot yazisini sil
        
      }
    }
  }


  document.getElementById('output').value = result;
  
  
}

