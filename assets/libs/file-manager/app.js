$(document).ready(function(){
	
	var originalWidth, originalHeight, loaded = false;
	
	function MySerach(needle, haystack){
		var results = new Array();
		var counter = 0;
		var rgxp = new RegExp(needle, "g");
		var temp = new Array();
		for(i=0;i<haystack.length;i++){
			temp = haystack[i][1].match(rgxp);
			if(temp && temp.length > 0){
				results[counter] = haystack[i];
				counter = counter + 1;
			}
		}
		return results;
	}
	
	function getFileExtension(filename) {
		var re = /(?:\.([^.]+))?$/;
		return re.exec(filename)[1];
	}
	
	function getArray(object){
		var array = [];
		for(var key in object){
			var item = object[key];
			array[parseInt(key)] = (typeof(item) == "object")?getArray(item):item;
		}
		return array;
	}

    function no_images(){
        $('#gallery-images').empty().append('<center>' + trans_no_images_in_lib + '</center>');
    }

    function empty_append(id, text){
        $(id).empty().append(text);
    }

    function loader_gif(){
        empty_append('#gallery-images', '<div id="ajax-loader-div"><img src="bootstrap/img/ajax-loader.gif" alt="' + trans_loading + '..." class="ajax-loader"></div>');
    }

    function load_from_lib(path, toggle, page){
        loader_gif();

        if(toggle == undefined){
            toggle = "";
        }

        if(page == undefined){
            page = "";
        }

        $.post('lib.php' + '?user_id='+user_id+'&dummy=' + new Date().getTime(),{path: path, toggle: toggle, page: page}, function(returned){
            if(returned.success == 1){
                empty_append('#gallery-images', returned.html);
            }else{
                no_images();
            }
        }, 'json');
    }
	
	var search_haystack = new Array();
	
	$("#search").focus(function () {
		$("#lib-back").attr('disabled','disabled');
		$("#newfolder_name").attr('disabled','disabled');
		$("#newfolder_btn").attr('disabled','disabled');
		
		$("#refresh").attr("rel", "searching");
		
		empty_append('#lib-title', trans_searching + '... <a href="" id="clear-search">' + trans_clear + '</a>');
		
		$.post('search.php',{}, function(returned){
			search_haystack = getArray(returned);
		}, 'json');
	});

	$(document).on('click', 'a#clear-search', function () {
		$('#lib-title').empty().append("Home");

		$("#newfolder_name").removeAttr("disabled", "disabled");
		$("#newfolder_btn").removeAttr("disabled", "disabled");

		$("#refresh").attr("rel", lib_folder_path);

		$("#search").val("");

        load_from_lib("");

		return false;
	});

	$("#search").keyup(function(event) {
    		if(this.value.length > 1){


                loader_gif();

                var results = MySerach(this.value, search_haystack);

                if(results.length > 0){
                    for(i=0;i<results.length;i++){
                        $('#gallery-images').empty().append('<div class="item"><a href="" class="img-thumbs" rel="' + results[i][0] + '" title="' + results[i][1] + '"><img src="timthumb.php?src=' + results[i][0] + '&w=130&h=90" class="img-polaroid" width="130" height="90"></a><div><a href="" class="pull-left transparent change-file" title="Change Name" rel="' + results[i][1] + '"><i class="icon-pencil"></i></a><a href="" class="pull-right transparent delete-file" data-path="'+ results[i][3] +'" rel="'+ results[i][2] +'" title="Delete"><i class="icon-trash"></i></a><div class="clearfix"></div></div></div>');
                    }
                }else{
                    no_images();
                }
    		}else if(this.value.length == 0){
    			empty_append('#lib-title', "Home");

                $("#newfolder_name").removeAttr("disabled", "disabled");
                $("#newfolder_btn").removeAttr("disabled", "disabled");

                $("#refresh").attr("rel", lib_folder_path);

                load_from_lib("");
    		}
    	});

	$("#preview").bind("load", function () {
		if(newImage){
			if ($("#preview").get(0).naturalWidth) {
				$("#width").val($("#preview").get(0).naturalWidth);
				$("#height").val($("#preview").get(0).naturalHeight);

				originalWidth = $("#preview").get(0).naturalWidth;
				originalHeight = $("#preview").get(0).naturalHeight;
			} else if ($("#preview").attr("naturalWidth")) {
				$("#width").val($("#preview").attr("naturalWidth"));
				$("#height").val($("#preview").attr("naturalHeight"));

				originalWidth = $("#preview").attr("naturalWidth");
				originalHeight = $("#preview").attr("naturalHeight");
			}
		}else{
			newImage = true;
			if ($("#preview").get(0).naturalWidth) {
				originalWidth = $("#preview").get(0).naturalWidth;
				originalHeight = $("#preview").get(0).naturalHeight;
			} else if ($("#preview").attr("naturalWidth")) {
				originalWidth = $("#preview").attr("naturalWidth");
				originalHeight = $("#preview").attr("naturalHeight");
			}
		}
	});

	$(document).on('click', 'a.mi-close', function () {
		$(this).parent().hide();
		return false;
	});

	$(document).on('click', 'a.img-thumbs', function () {
		$(".pdf-fields").hide();
		$(".image-fields").show();

		$("#preview").attr("src", "");
		$("#width").val();
		$("#height").val();
		$("#source").val($(this).attr("rel"));
        	$("#preview").attr("src", $(this).attr("rel") + '?dummy=' + new Date().getTime());
        	$('#myTab a[href="#tab1"]').tab('show');
        	parent.document.getElementById("image-manager-src").value= $(this).attr("rel");
        	$.post("update_recent.php" + "?dummy=" + new Date().getTime(), { src: $(this).attr("rel") } );
		return false;
	});

	$(document).on('click', 'a.pdf-thumbs', function () {
		$(".pdf-fields").show();
		$(".image-fields").hide();

		$("#preview").attr("src", $(this).data("icon"));
		$("#width").val();
		$("#height").val();
		$("#source_pdf").val($(this).attr("rel"));
        $('#myTab a[href="#tab1"]').tab('show');
        parent.document.getElementById("image-manager-src").value= $(this).attr("rel");
        $.post("update_recent.php" + "?dummy=" + new Date().getTime(), { src: $(this).attr("rel") } );
		return false;
	});

	$("#source").bind("change", function () {
		$.post("update_recent.php" + "?dummy=" + new Date().getTime(), { src: this.value } );
		$("#preview").attr("src", this.value + '?dummy=' + new Date().getTime());
		parent.document.getElementById("image-manager-src").value= this.value;
	});



	$("#get-recent").bind("click", function () {
		empty_append('#recent-images', '<div id="ajax-loader-div"><img src="bootstrap/img/ajax-loader.gif" alt="Loading..." class="ajax-loader"></div>');

        $.post('recent.php',{}, function(returned){
			if(returned.success == 1){
				empty_append('#recent-images', returned.html);
			}else{
				empty_append('#recent-images', '<center>' + trans_no_images_in_recent + '</center>');
			}
		}, 'json');
	});

	$("#refresh").bind("click", function () {
		if($(this).attr("rel") == 'searching'){
			return false;
		}

        load_from_lib($(this).attr("rel"));

		return false;
	});

	$("#toggle-layout").bind("click", function () {
		if($(this).attr("rel") == 'searching'){
			return false;
		}

        load_from_lib($(this).attr("rel"), 1);

		return false;
	});

	$("#get-lib").bind("click", function () {
		if(loaded == false){
            load_from_lib("");
			loaded = true;
		}else{
            load_from_lib($("#refresh").attr("rel"));
		}
	});

	$("#uploaded-images").bind("click", function () {
		$('#uploaded-images').empty();
	});

	$(document).on('click', '#newfolder_btn', function () {
		if($('#newfolder_name').val() == ""){
			alert(trans_please_provide_name_for_new_folder);
			return false;
		}

		empty_append('#new-folder-msg', trans_creating + '...&nbsp;&nbsp;&nbsp;');

		$.post('new_folder.php' + '?dummy=' + new Date().getTime(),{path: $("#refresh").attr("rel"), folder: $('#newfolder_name').val()}, function(returned){
			if(returned.success == 1){
				$('#newfolder_name').val("");
                empty_append('#gallery-images', returned.html);
				empty_append('#new-folder-msg', '<span style="color: green;">' + trans_done + '...&nbsp;&nbsp;&nbsp;</span>');
				setTimeout(function(){ $('#new-folder-msg').empty() }, 5000);
			}else{
				empty_append('#new-folder-msg', '<span style="color: red;">' + trans_error + '...&nbsp;&nbsp;&nbsp;</span>');
				setTimeout(function(){ $('#new-folder-msg').empty() }, 5000);
				if(returned.msg != ""){
					alert(returned.msg);
				}
			}
		}, 'json');



		return false;
	});

	$(document).on('click', 'a.delete-file', function () {
		var content = $(this).parent().parent().html();
		var the_parent = $(this).parent().parent();
		var r=confirm(trans_are_you_sure_file);
		if(r==false){
			return false;
		}
		$(this).parent().parent().empty().append('<p>' + trans_deleting + '...</p>');
		$.post('delete_file.php' + '?dummy=' + new Date().getTime(),{path: $(this).data("path"),file: $(this).attr("rel")}, function(returned){
			if(returned.success == 1){
                empty_append('#gallery-images', returned.html);
			}else{
				the_parent.empty();
				the_parent.html(content);
				if(returned.msg != ""){
					alert(returned.msg);
				}
			}
		}, 'json');
		return false;
	});

	$(document).on('click', 'a.delete-folder', function () {
		var content = $(this).parent().parent().html();
		var the_parent = $(this).parent().parent();
		var r=confirm(trans_are_you_sure_folder);
		if(r==false){
			return false;
		}
		$(this).parent().parent().empty().append('<p>' + trans_deleting + '...</p>');
		$.post('delete_folder.php' + '?dummy=' + new Date().getTime(),{path: $("#refresh").attr("rel"),folder: $(this).attr("rel")}, function(returned){
			if(returned.success == 1){
				empty_append('#gallery-images', returned.html);
			}else{
				the_parent.empty();
				the_parent.html(content);
				if(returned.msg != ""){
					alert(returned.msg);
				}
			}
		}, 'json');
		return false;
	});


	$(document).on('click', 'a.change-folder', function () {
		var current_value = $(this).attr("rel");
		var content = $(this).parent().parent().html();
		var the_parent = $(this).parent().parent();
		var r=prompt(trans_please_enter_new_name,current_value);
		if(r==null || r==""){
			return false;
		}

		if(r==current_value){
			return false;
		}

		$(this).parent().parent().empty().append('<p>' + trans_saving + '...</p>');


		$.post('rename_folder.php' + '?dummy=' + new Date().getTime(),{path: $("#refresh").attr("rel"),new_name: r,current_name: current_value}, function(returned){
			if(returned.success == 1){
				empty_append('#gallery-images', returned.html);
			}else{
				the_parent.empty();
				the_parent.html(content);
				if(returned.msg != ""){
					alert(returned.msg);
				}
			}
		}, 'json');
		return false;
	});

	function getExtension(filename) {
		return filename.split('.').pop().toLowerCase();
	}

	$(document).on('click', 'a.change-file', function () {
		var current_value = $(this).attr("rel");
		var content = $(this).parent().parent().html();
		var the_parent = $(this).parent().parent();
		var extension = getExtension(current_value);
		var current_file_name = current_value.substr(0, current_value.lastIndexOf('.')) || current_value;

		var r=prompt(trans_please_enter_new_name,current_file_name);
		if(r==null || r==""){
			return false;
		}

		if((r + "." + extension) ==current_value){
			return false;
		}

		$(this).parent().parent().empty().append('<p>' + trans_saving + '...</p>');

		$.post('rename_file.php' + '?dummy=' + new Date().getTime(),{path: $("#refresh").attr("rel"),new_name: (r + "." + extension),current_name: current_value}, function(returned){
			if(returned.success == 1){
				empty_append('#gallery-images', returned.html);
			}else{
				the_parent.empty();
				the_parent.html(content);
				if(returned.msg != ""){
					alert(returned.msg);
				}
			}
		}, 'json');
		return false;
	});

	$(document).on('click', '#refresh-dirs', function () {
		empty_append('#select-dir-msg', trans_loading + '...&nbsp;&nbsp;&nbsp;');

		$.post('refresh_dir_list.php' + '?dummy=' + new Date().getTime(),{}, function(returned){
			if(returned.success == 1){
				empty_append('#select-dir-msg', '<span style="color: green;">' + trans_done + '...&nbsp;&nbsp;&nbsp;</span>');
				setTimeout(function(){ $('#select-dir-msg').empty() }, 5000);
				empty_append('#select-dir', returned.html);
			}
		}, 'json');
		return false;
	});

	$(document).on('change', '#select-dir', function () {
		empty_append('#select-dir-msg', trans_sending + '...&nbsp;&nbsp;&nbsp;');

		$.post('set_upload_directory.php' + '?dummy=' + new Date().getTime(),{path:$(this).val() }, function(returned){
			if(returned.success == 1){
				empty_append('#select-dir-msg', '<span style="color: green;">' + trans_done + '...&nbsp;&nbsp;&nbsp;</span>');
				setTimeout(function(){ $('#select-dir-msg').empty() }, 5000);
			}
		}, 'json');
		return false;
	});

	$(document).on('click', 'a.lib-folder', function () {
		var str =  decodeURIComponent($(this).attr("rel"));

		var stringArray = str.split("/");

		stringArray.pop();


		var current_folder = stringArray[stringArray.length-1];
		if((current_folder + "/") == lib_folder_path){
			current_folder = "Home";
		}

        empty_append('#lib-title', current_folder);

		$("#refresh").attr("rel", $(this).attr("rel"));

		if($("#lib-back").is(":disabled")){
			$("#lib-back").removeAttr('disabled');

		}else{
			stringArray.pop();

			$("#lib-back").attr('rel', stringArray.join("/") + "/");



		}

        load_from_lib($(this).attr("rel"));



		return false;
	});

	$(document).on('click', 'a.page-link', function () {
        load_from_lib($(this).data("path"), "", $(this).data("page"));
		return false;
	});
	
	$(document).on('click', 'button#lib-back', function () {
		if($(this).is(":disabled")){
			return false;
		}
		
		if($(this).attr("rel") == lib_folder_path){
			$(this).attr('disabled','disabled');
		}
		
		$("#refresh").attr("rel", $(this).attr("rel"));

        load_from_lib($(this).attr("rel"));
		
		var str =  $(this).attr("rel");
		var stringArray = str.split("/");
		
		stringArray.pop();
		
		var current_folder = stringArray.pop();
		
		if((current_folder + "/") == lib_folder_path){
			current_folder = "Home";
			$(this).attr("rel", lib_folder_path);
		}else{
			$(this).attr("rel", stringArray.join("/") + "/");
		}
		
		empty_append('#lib-title', current_folder);
		
		return false;
	});
});