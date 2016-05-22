<?php
/* Redirect browser */
$id = $_GET["id"];
header("Location: https://www.facebook.com/$id");
 
/* Make sure that code below does not get executed when we redirect. */
exit;
?>