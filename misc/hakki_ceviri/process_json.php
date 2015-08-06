<?
// Code goes here

$sureler=[];
$sureler[96] = "ALAK";
$sureler[68] = "KALEM";
$sureler[73] = "MÜZZEMMİL";
$sureler[1] = "FÂTİHA";
$sureler[74] = "MÜDDESSİR";
$sureler[111] = "TEBBET";
$sureler[81] = "TEKVÎR";
$sureler[87] = "A‘LÂ";
$sureler[92] = "LEYL";
$sureler[89] = "FECR";
$sureler[93] = "DUHÂ";
$sureler[94] = "İNŞİRÂH";
$sureler[103] = "ASR";
$sureler[100] = "ÂDİYÂT";
$sureler[108] = "KEVSER";
$sureler[102] = "TEKÂSÜR";
$sureler[107] = "MÂÛN";
$sureler[109] = "KÂFİRÛN";
$sureler[105] = "FİL";
$sureler[113] = "FELÂK";
$sureler[114] = "NÂS";
$sureler[112] = "İHLÂS";
$sureler[53] = "NECM";
$sureler[80] = "ABESE";
$sureler[97] = "KADR";
$sureler[91] = "ŞEMS";
$sureler[85] = "BURUC";
$sureler[95] = "TÎN";
$sureler[106] = "KUREYŞ";
$sureler[101] = "KÂRİAH";
$sureler[75] = "KIYÂMET";
$sureler[104] = "HÜMEZE";
$sureler[77] = "MÜRSELÂT";
$sureler[50] = "KÂF";
$sureler[90] = "BELED";
$sureler[86] = "TÂRIK";
$sureler[54] = "KAMER";
$sureler[38] = "SÂD";
$sureler[7] = "A‘RÂF";
$sureler[72] = "CİN";
$sureler[36] = "YÂ-SÎN";
$sureler[25] = "FURKÂN";
$sureler[35] = "FÂTIR";
$sureler[19] = "MERYEM";
$sureler[20] = "TÂ-HÂ";
$sureler[56] = "VÂKIA";
$sureler[26] = "ŞU‘ARÂ";
$sureler[27] = "NEML";
$sureler[28] = "KASAS";
$sureler[17] = "İSRÂ";
$sureler[10] = "YÛNUS";
$sureler[11] = "HÛD";
$sureler[12] = "YÛSUF";
$sureler[15] = "HİCR";
$sureler[6] = "EN‘ÂM";
$sureler[37] = "SÂFFÂT";
$sureler[31] = "LOKMÂN";
$sureler[34] = "SEBE";
$sureler[39] = "ZÜMER";
$sureler[40] = "MÜ’MİN";
$sureler[41] = "FUSSILET";
$sureler[42] = "ŞÛRÂ";
$sureler[43] = "ZUHRUF";
$sureler[44] = "DUHÂN";
$sureler[45] = "CÂSİYE";
$sureler[46] = "AHKÂF";
$sureler[51] = "ZÂRİYÂT";
$sureler[88] = "ĞÂŞİYE";
$sureler[18] = "KEHF";
$sureler[16] = "NAHL";
$sureler[71] = "NÛH";
$sureler[14] = "İBRÂHÎM";
$sureler[21] = "ENBİYÂ";
$sureler[23] = "MÜ’MİNÛN";
$sureler[32] = "SECDE";
$sureler[52] = "TÛR";
$sureler[67] = "MÜLK";
$sureler[69] = "HÂKKA";
$sureler[70] = "ME‘ÂRİC";
$sureler[78] = "NEBE";
$sureler[79] = "NÂZİÂT";
$sureler[82] = "İNFİTÂR";
$sureler[84] = "İNŞİKÂK";
$sureler[30] = "RÛM";
$sureler[29] = "ANKEBÛT";
$sureler[83] = "MUTAFFİFÎN";
$sureler[2] = "BAKARA";
$sureler[8] = "ENFÂL";
$sureler[3] = "ÂL-İ İMRÂN";
$sureler[33] = "AHZÂB";
$sureler[60] = "MÜMTEHİNE";
$sureler[4] = "NİSÂ";
$sureler[99] = "ZİLZAL";
$sureler[57] = "HADÎD";
$sureler[47] = "MUHAMMED";
$sureler[13] = "RA‘D";
$sureler[55] = "RAHMÂN";
$sureler[76] = "İNSÂN";
$sureler[65] = "TALÂK";
$sureler[98] = "BEYYİNE";
$sureler[59] = "HAŞR";
$sureler[24] = "NÛR";
$sureler[22] = "HAC";
$sureler[63] = "MÜNÂFIKÛN";
$sureler[58] = "MÜCÂDELE";
$sureler[49] = "HUCURÂT";
$sureler[66] = "TAHRÎM";
$sureler[64] = "TEĞÂBÜN";
$sureler[61] = "SAFF";
$sureler[62] = "CUMA";
$sureler[48] = "FETİH";
$sureler[5] = "MÂİDE";
$sureler[9] = "TEVBE";
$sureler[110] = "NASR";

function sureId($isim){
	$sureler = $GLOBALS['sureler'];
	foreach ($sureler as $index => $value) {
      if($sureler[$index] == $isim){
        return $index;
      }
	}

}

//dipnot giris sql dondurur.
function dipnotIsle($chapter_no,$ayet_no,$ayetDipnotlari){


    $result="";
    if($ayetDipnotlari !== null && count($ayetDipnotlari)>0) {

	    
        foreach ($ayetDipnotlari as $dipnotNo)
        {
            //$dipnotNo = $dipnot->match(/\d+/);
            $result .= "insert into footnote (author_id, verse_id, tracode, chapter, verse, footnote_number, content, translation_id) " .
            "values (262144, " . (1000 * $chapter_no + $ayet_no) . ",\"iste\"," . $chapter_no . "," . $ayet_no . "," .$dipnotNo . ",\"\",@translationID);\n";
        }
    }
    return $result;
}

function getTranslationInsert($chapterId,$verse,$metin,$ayetDipnotlari){
    $result="";
    $verseId = 1000*$chapterId+$verse;
    $result .= "insert into translation (chapter,verse_id,verse,author_id,version,content) "
    ."values(".$chapterId.",".$verseId.",".$verse.",262144,1,\"".$metin."\");\n";
    $result .= "SET @translationID=LAST_INSERT_ID();\n";
    $result .= dipnotIsle($chapterId,$verse,$ayetDipnotlari);
    return $result;
}

/**
 * $contextChapterId: icinde bulundugumuz default sure
 */
 
function getNextVerseNumber($chapterId,$contextChapterId,$ayetler,$index,$necmler,$necmIndex){
	$ayet = $ayetler[$index]->ayet;
	$simdikiSon = 0;
	$ikili = explode(",",$ayet);
	$aralikli = explode("-",$ayet);
	if(count($ikili) == 2){
		$simdikiSon = $ikili[1];
	}
	else if(count($aralikli)== 2){ //x-y
		$simdikiSon = $aralikli[1];
	}
	else{ //tek ayet
		$simdikiSon = $ayet;
	}
	$simdikiSon = $chapterId*1000+$simdikiSon;
	
	$sonrakiAyet = 0;
	if(isset($ayetler[$index+1])){
		$sonrakiAyet=$ayetler[$index+1]->ayet;
		$ikili = explode(",",$sonrakiAyet);
		$aralikli = explode("-",$sonrakiAyet);
		if(count($ikili) == 2){
			$sonrakiAyet = $ikili[0];
		}
		else if(count($aralikli)== 2){ //x-y
			$sonrakiAyet = $aralikli[0];
		}
		else{ //tek ayet
			$sonrakiAyet = $sonrakiAyet;
		}
		
		if(isset($ayetler[$index+1]->sure_id)){
			$sonrakiAyet=$ayetler[$index+1]->sure_id*1000+$sonrakiAyet;
		}
		else{
			$sonrakiAyet=$contextChapterId*1000+$sonrakiAyet;
		}
		
		if($sonrakiAyet != $simdikiSon+1){
			return $sonrakiAyet;
		}
	}
	else if(isset($necmler[$necmIndex+1])){
		if(isset($necmler[$necmIndex+1]->ayetler[0])){
			$sonrakiAyet=$necmler[$necmIndex+1]->ayetler[0]->ayet;
			$ikili = explode(",",$sonrakiAyet);
			$aralikli = explode("-",$sonrakiAyet);
			if(count($ikili) == 2){
				$sonrakiAyet = $ikili[0];
			}
			else if(count($aralikli)== 2){ //x-y
				$sonrakiAyet = $aralikli[0];
			}
			else{ //tek ayet
				$sonrakiAyet = $sonrakiAyet;
			}
			
			if(isset($ayetler[$index+1]->sure_id)){
				$sonrakiAyet=$ayetler[$index+1]->sure_id*1000+$sonrakiAyet;
			}
			else{
				$sonrakiAyet=$contextChapterId*1000+$sonrakiAyet;
			}
			
			if($sonrakiAyet != $simdikiSon+1){
				return $sonrakiAyet;
			}
		}
	}
	else{
		return 0;
	}
}

function processJson(){

  $file = "out.txt";
  $theInput = file_get_contents("hakki_yilmaz_meal.txt");
  $result="";
  $sureler = json_decode($theInput);
  $i=1;

  //reset the file
  file_put_contents($file,"");
  
  foreach ($sureler as $sure) {
    //file_put_contents($file,$sure->sure.":".sureId($sure->sure)."\n" , FILE_APPEND); 
  }

  $nuzulSirasi = 1;
  foreach ($sureler as $sure) {
    $sure_id = sureId($sure->sure);
    //result += chapterId+":"+ sure.sure+"\n";
    //result += sure.donem+"\n";
    $sonAyet=0;
    foreach ($sure->necmler as $necmIndex => $necm) {
      foreach ($necm->ayetler as $index => $ayet) {
      	if(isset($ayet->sure_id)){
      		$chapterId = $ayet->sure_id;
      	}
      	else{
      		$chapterId = $sure_id;
      	}
      	$sonrakiText = "";
      	$sonraki = getNextVerseNumber($chapterId,$sure_id,$necm->ayetler,$index,$sure->necmler,$necmIndex);
      	
      	if($sonraki!=0){
      		$sonrakiAyetNo = $sonraki%1000;
      		$sonrakiSureNo = floor($sonraki/1000);
      		$sonrakiText = "(Sonraki ".$sonrakiSureNo.":".$sonrakiAyetNo.")";
      		print ($chapterId.":".$ayet->ayet."->".$sonrakiSureNo.":".$sonrakiAyetNo."\n");
      	}
      	
      	$count = preg_match_all("/\*\*DIP\[(\d+)\]DIP\*\*/", $ayet->metin, $ayetDipnotlari);
        if($count != 0) {
            foreach ($ayetDipnotlari[0] as $dipnot)
            {
                $ayet->metin = str_replace($dipnot, "*", $ayet->metin);
            }
        }
        //x,y
        //x ve y icin ayni ayet
        //ayetin basina (x,y) yazılacak
        
        $ikili = explode(",",$ayet->ayet);
        $aralikli = explode("-",$ayet->ayet);
        if(count($ikili) == 2){
          $x = $ikili[0];  
          $y = $ikili[1];  
          //result +="ikili:|"+x+"|"+y;
          $result .= getTranslationInsert($chapterId,$x,"(".$ayet->ayet.")".$ayet->metin.$sonrakiText,$ayetDipnotlari[1]);
		  $result .= "insert into translation_order (author_id,chapter,verse,translation_id,order_no,necm) values (262144,".$chapterId.",".$x.",@translationID,".$nuzulSirasi.",".$necm->necm_no.");\n";
          $nuzulSirasi++;
		  $result .= getTranslationInsert($chapterId,$y,"(".$ayet->ayet.")".$ayet->metin.$sonrakiText,$ayetDipnotlari[1]);
		  
// 		  if($sonAyet+1 != $chapterId*1000+$y){
// 		  	print($sure->sure.":".$sonAyet." !< " .$sure->sure.":".$y."\n");
// 		  }
		  $sonAyet = $chapterId*1000+$y;
        }
        else if(count($aralikli)== 2){ //x-y
          $x = $aralikli[0];  
          $y = $aralikli[1];
          //result +="aralik:|"+x+"|"+y;
          for($i=$x; $i<=$y; $i++){
          	$result .= getTranslationInsert($chapterId,$i,"(".$ayet->ayet.")".$ayet->metin.$sonrakiText,$ayetDipnotlari[1]);
          	if($i==$x){
          		$result .= "insert into translation_order (author_id,chapter,verse,translation_id,order_no,necm) values (262144,".$chapterId.",".$x.",@translationID,".$nuzulSirasi.",".$necm->necm_no.");\n";
          		$nuzulSirasi++;
          	}
          }
//           if($sonAyet+1 != $chapterId*1000+$y){
//           	print($sure->sure.":".$sonAyet." !< " .$sure->sure.":".$y."\n");
//           }
          $sonAyet = $chapterId*1000+$y;
        }
        else{ //tek ayet
            $result .= getTranslationInsert($chapterId,$ayet->ayet,$ayet->metin.$sonrakiText,$ayetDipnotlari[1]);
            $result .= "insert into translation_order (author_id,chapter,verse,translation_id,order_no,necm) values (262144,".$chapterId.",".$ayet->ayet.",@translationID,".$nuzulSirasi.",".$necm->necm_no.");\n";
            $nuzulSirasi++;
//             if($sonAyet+1 != $chapterId*1000+$ayet->ayet){
//             	print($sure->sure.":".$sonAyet." !< " .$sure->sure.":".$ayet->ayet."\n");
//             }
            $sonAyet = $chapterId*1000+$ayet->ayet;
        }
        
        
        //x den y ye yadar ayni ayet
        //ayetin basina (x-y) yazılacak
        
        //x

        
        
        //dipnot yazisini sil
        
      }
    }
  }


  file_put_contents($file,$result, FILE_APPEND);
  
  
}

//phpinfo();



processJson();
