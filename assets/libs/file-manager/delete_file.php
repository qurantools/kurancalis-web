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


if(!CanDeleteFiles()){
	$output["success"] = 0;
	$output["msg"] = lang('you_do_not_have_permission_to_delete_files');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

if(isset($_POST["file"]) AND $_POST["file"] != ""){
	$file = urldecode(clean($_POST["file"]));
}else{
	$output["success"] = 0;
	$output["msg"] = lang('the_file_name_is_required');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

if(!startsWith($file, LIBRARY_FOLDER_PATH)){
	$output["success"] = 0;
	$output["msg"] = lang('you_can_not_delete_this_file');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

if(!file_exists($file)){
	$output["success"] = 0;
	$output["msg"] = lang('the_file_does_not_exist');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

if(!is_file($file)){
	$output["success"] = 0;
	$output["msg"] = lang('that_is_not_a_file');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

if(!unlink($file)){
	$output["success"] = 0;
	$output["msg"] = lang('the_file_could_not_be_deleted');
	header("Content-type: text/plain;");
	echo json_encode($output);
	exit();
}

include 'contents.php';


header("Content-type: text/plain;");
echo json_encode($output);
exit();
