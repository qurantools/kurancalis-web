<?php

session_start();

/** Full path to the folder that images will be used as library and upload. Include trailing slash */
define('FOLDER_PATH', 'uploads/');

/** Full URL to the folder that images will be used as library and upload. Include trailing slash and protocol (i.e. http://) */
define('FOLDER_URL', 'http://localhost:63342/kurancalis-web/assets/libs/file-manager/uploads/');
//define('FOLDER_URL', 'http://uskk43071273.sulutruk.koding.io/kurancalis/assets/libs/file-manager/uploads/');

/** The extensions for to use in validation */
define('ALLOWED_IMG_EXTENSIONS', 'gif,jpg,jpeg,png');

/** Should the files be renamed to a random name when uploading */
define('RENAME_UPLOADED_FILES', true);

/** Number of folders/images to display per page */
define('ROWS_PER_PAGE', 12);


/** Should Images be resized on upload. You will then need to set at least one of the dimensions sizes below */
define('RESIZE_ON_UPLOAD', true);

/** If resizing, width */
define('RESIZE_WIDTH', 800);
/** If resizing, height */
define('RESIZE_HEIGHT', 600);


/** Should a thumbnail be created? */
define('THUMBNAIL_ON_UPLOAD', true);

/** If thumbnailing, thumbnail postfix */
define('THUMBNAIL_POSTFIX', '_thumb');
/** If thumbnailing, maximum width */
define('THUMBNAIL_WIDTH', 100);
/** If thumbnailing, maximum height */
define('THUMBNAIL_HEIGHT', 100);
/** If thumbnailing, hide thumbnails in listings */
define('THUMBNAIL_HIDE', true);



/**  Use these 9 functions to check cookies and sessions for permission. 
Simply write your code and return true or false */





/** If you would like each user to have their own folder and only upload 
 * to that folder and get images from there, you can use this funtion to 
 * set the folder name base on user ids or usernames. NB: make sure it return 
 * a valid folder name. */
function CurrentUserFolder(){
    if(isset($_GET['user_id'])){
    	$user_id = clean($_GET['user_id']);
    }else if(isset($_POST['user_id'])){
        	$user_id = clean($_POST['user_id']);
    }
    else{
        
        $user_id = "tmp";
        $result = file_put_contents("/tmp/log.txt", var_export($_POST,true), FILE_APPEND);
        $result = file_put_contents("/tmp/log.txt", var_export($_GET,true), FILE_APPEND);

    }

	return $user_id;
}


function CanAcessLibrary(){
	return true;
}

function CanAcessUploadForm(){
	return true;
}

function CanAcessAllRecent(){
	return false;
}

function CanCreateFolders(){
	return false;
}

function CanDeleteFiles(){
	return false;
}

function CanDeleteFolder(){
	return false;
}

function CanRenameFiles(){
	return false;
}

function CanRenameFolder(){
	return false;
}


define("ENCRYPTION_KEY", "!@#$%^&*");