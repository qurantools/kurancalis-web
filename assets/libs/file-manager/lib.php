<?php

require_once('config.php');
require_once('functions.php');

if(isset($_POST["toggle"]) AND $_POST["toggle"] != ""){
	if(isset($_SESSION['tinymce_toggle_view'])){
		if($_SESSION['tinymce_toggle_view'] == 'grid'){
			$_SESSION['tinymce_toggle_view'] = 'list';	
		}else{
			$_SESSION['tinymce_toggle_view'] = 'grid';	
		}
	}else{
		$_SESSION['tinymce_toggle_view'] = 'list';	
	}
}

$output = array();

$output["success"] = 1;

if(isset($_POST["path"]) AND $_POST["path"] != ""){
	if(!startsWith(urldecode($_POST["path"]), LIBRARY_FOLDER_PATH)){
		$current_folder = LIBRARY_FOLDER_PATH;
	}else{
		$current_folder = urldecode(clean($_POST["path"]));
	}
}else{
	$current_folder = LIBRARY_FOLDER_PATH;
}

include 'contents.php';


header("Content-type: text/plain;");
echo json_encode($output);
exit();
