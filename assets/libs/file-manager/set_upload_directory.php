<?php

require_once('config.php');
require_once('functions.php');

$output = array();

$output["success"] = 1;
$output["msg"] = "";

if(isset($_POST["path"]) AND $_POST["path"] != ""){
	$current_folder = urldecode(clean($_POST["path"]));
}else{
	$current_folder = LIBRARY_FOLDER_PATH;
}

if(!startsWith($current_folder, LIBRARY_FOLDER_PATH)){
	$output["success"] = 0;
	$output["msg"] = lang('you_can_not_upload_to_this_folder');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

$_SESSION["tinymce_upload_directory"] = $current_folder;

header("Content-type: text/plain;");
echo json_encode($output);
exit();
