<?

$SITE_ROOT = "https://securewebserver.net/jetty/qttest/rest/";

$jsonData = getData($SITE_ROOT);
makePage($jsonData, $SITE_ROOT);


function getData($siteRoot) {
    $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $rawData = file_get_contents($siteRoot.'inferences/'.$id);
    return json_decode($rawData);
}

function makePage($data, $siteRoot) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
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