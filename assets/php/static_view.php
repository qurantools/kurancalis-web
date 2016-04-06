<?

$SITE_ROOT = "https://securewebserver.net/jetty/qt/rest/";


if( $_GET['page'] == "translations" ){
	$chapter = $_GET['chapter'];
	$author = $_GET['author'];
	$content = getChapter($SITE_ROOT,$chapter,$author);
	showChapter($chapter,$author, $content);
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
    <meta charset="utf-8" />
        <meta property="fb:app_id" content="295857580594128" />
        <meta property="og:url"    content="http://kurancalis.com/__/inference/display/<?php echo $data->id; ?>" />
        <meta property="og:title" content="<?php echo $data->title; ?>" />
        <meta property="og:description" content="<?php echo $data->brief; ?>" />
        <meta property="og:image" content="<?php echo $data->image; ?>" />
        <meta property="og:type"   content="website" />
    </head>
    <body>
        <p><?php echo $data->content; ?></p>
        <img src="<?php echo $data->image; ?>">
    </body>
    </html>
<?php
}

function showChapter($chapter, $author, $content){
?>
    <!DOCTYPE html>
    <html>
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
        <p><?php echo $content; ?></p>
        <img src="http://kurancalis.com/assets/img/kurancalis_logo.png">
    </body>
    </html>
<?php
}


