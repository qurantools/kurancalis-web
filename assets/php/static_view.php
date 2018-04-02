<?

$SITE_ROOT = "https://securewebserver.net/jetty/qt/rest/";

$pageExist = array_key_exists('page',$_GET);
if( $pageExist && $_GET['page'] == "translations" ){
	$chapter = $_GET['chapter'];
	$author = $_GET['author'];
	$content = getChapter($SITE_ROOT,$chapter,$author);
	showChapter($chapter,$author, $content);
}
else if($pageExist && $_GET['page'] == "annotation"){
    $jsonData = getAnnotation($SITE_ROOT);
    makeAnnotationPage($jsonData, $SITE_ROOT);
}
else if($pageExist && $_GET['page'] == "verse") {
    $jsonData = getVerseDetails($SITE_ROOT);
    makeVerseDetailsPage($jsonData, $SITE_ROOT);
}
else{
	$jsonData = getInference($SITE_ROOT);
	makePage($jsonData, $SITE_ROOT);
}

function getInference($siteRoot) {
    $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $rawData = file_get_contents($siteRoot.'inferences/'.$id);
    return json_decode($rawData);
}

function getAnnotation($siteRoot) {
    $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $rawData = file_get_contents($siteRoot.'annotations/'.$id);
    return json_decode($rawData);
}
//TODO: update
function getVerseDetails($siteRoot) {
    $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $chapter = floor( $_GET['verse']/1000 );
    $verse = $_GET['verse']%1000;
    $rawData = file_get_contents($siteRoot.'translations/?chapter='.$chapter.'&verse='.$verse);
    return json_decode($rawData);
}

function getChapter($siteRoot,$chapter,$author) {
    $pageURL = $siteRoot.'translations?chapter='.$chapter.'&author='.$author;
    $rawData = file_get_contents($pageURL);
    $verseArray = json_decode($rawData);
    $body="";
    foreach($verseArray as $verse) { //foreach element in $arr
    	$transArray = $verse->translations; //etc
    	foreach($transArray as $trans) {
    		$body = $body."<br>".$trans->chapter.":".$trans->verse." ".$trans->content;
    	}
    }
    return $body;
}



function makePage($data, $siteRoot) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title><?php echo addslashes($data->title); ?></title>
    <meta charset="utf-8" />
        <meta property="fb:app_id" content="295857580594128" />
        <meta property="og:url"    content="http://kurancalis.com/__/inference/display/<?php echo $data->id; ?>" />
        <meta property="og:title" content="<?php echo addslashes($data->title); ?>" />
        <meta property="og:description" content="<?php echo addslashes($data->brief); ?>" />
        <meta property="og:image" content="<?php echo $data->image; ?>" />
        <meta property="og:type"   content="website" />
    </head>
    <body>
        <h1><?php echo addslashes($data->title); ?></h1>
        <p><?php echo $data->content; ?></p>
        <?if($data->image !='undefined'){?>
        <img alt="Kuran Çalış" src="<?php echo $data->image; ?>">
        <?}?>
    <a href="http://kurancalis.com">kurancalis.com</a>
    </body>
    </html>
<?php
}

function makeAnnotationPage($data, $siteRoot) {
    $title = "".floor($data->verseId/1000) .":".$data->verseId%1000 . " Ayet Notu";
    ?>

    <!DOCTYPE html>
    <html>
    <head>

        <meta charset="utf-8" />
        <meta property="fb:app_id" content="295857580594128" />
        <meta property="og:url"    content="http://kurancalis.com/__/annotation/display/<?php echo $data->id; ?>" />
        <meta property="og:title" content="<?php echo addslashes($data->title); ?>" />
        <meta property="og:description" content="<?php echo addslashes($data->brief); ?>" />
        <meta property="og:image" content="<?php echo $data->image; ?>" />
        <meta property="og:type"   content="website" />
    </head>
    <body>
    <h1><?php echo addslashes($title); ?></h1>
    <strong>Not: </strong>
    <p><?php echo $data->content; ?></p>
    <strong>Karalama: </strong> <?php echo $data->quote; ?><br>
    <strong>Ayet: </strong> <?php echo $data->translation_content; ?><br>
    <?if(isset($data->image) && $data->image !='undefined'){?>
        <img alt="Kuran Çalış" src="<?php echo $data->image; ?>">
    <?}?>
    <a href="http://kurancalis.com">kurancalis.com</a>
    </body>
    </html>

    <?php
}

function showChapter($chapter, $author, $content){
?>
    <!DOCTYPE html>
    <html lang="tr">
    <head>
    <meta charset="utf-8" />
        <meta property="fb:app_id" content="295857580594128" />
        <meta property="og:url"    content="http://kurancalis.com/__/translations/yazar/<?php echo $author;?>/sure/<?php echo $chapter; ?>" />
        <meta property="og:title" content="Kuran Çalış" />
        <meta property="og:description" content="Dosdoğru yolu bulmak için birlikte kuran çalışalım." />
        <meta property="og:image" content="http://kurancalis.com/assets/img/kurancalis_logo.png" />
        <meta property="og:type"   content="website" />
    </head>
    <body>
        <?php echo $content; ?>
        <img alt="Kuran Çalış" src="http://kurancalis.com/assets/img/kurancalis_logo.png">
    </body>
    </html>
<?php
}

function makeVerseDetailsPage($data, $siteRoot) {
    $title = $data[0]->chapter.' : '.$data[0]->verse." Ayet Detayı";
    $verseId = $_GET['verse'];
    ?>

    <!DOCTYPE html>
    <html>
    <head>

        <meta charset="utf-8" />
        <meta property="fb:app_id" content="295857580594128" />
        <meta property="og:url"    content="http://kurancalis.com/__/verse/display/<?php echo $verseId; ?>" />
        <meta property="og:title" content="<?php echo addslashes(title); ?>" />
        <meta property="og:description" content="<?php echo $data[0]->content; ?>" />
        <meta property="og:image" content="<?php echo $data->image; ?>" />
        <meta property="og:type"   content="website" />
    </head>
    <body>
    <h1><?php echo addslashes($title); ?></h1>
    <strong>Not: </strong>
    <?php
        $length = sizeof($data);
        for($i = 0; $i<$length; $i++){
            echo $data[$i]->content."</br>";
        }
    ?>
    <a href="http://kurancalis.com">kurancalis.com</a>
    </body>
    </html>

    <?php
}


