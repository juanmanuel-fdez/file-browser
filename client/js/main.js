;(function () {
	
	/****************************************************************************************************************/
	/* File browser fucntions */
	/****************************************************************************************************************/
	
	var imgExtensions = [".png", ".jpg", ".jpeg", ".gif"];
	
	var ebookExtensions = [".epub"];
	
    var extensionsMap = {
		".zip"	: 	"compress.png",         
		".gz"	:	"compress.png",         
		".bz2"	:	"compress.png",         
		".xz"	:	"compress.png",         
		".rar"	:	"compress.png",         
		".tar"	:	"compress.png",            
		".tgz"	:	"compress.png",                
		".tbz2"	:	"compress.png",           
		".z"	:	"compress.png",             
		".7z"	:	"compress.png",               
		".mp3"	:	"music.png",        
		".flac"	:	"music.png",        
		".wav"	:	"music.png",        	
		".mpga"	:	"music.png",        
		".mid"	:	"music.png",         
		".midi"	:	"music.png",        
		".cs"	:	"unknown.png",         
		".c++"	:	"unknown.png",         
		".cpp"	:	"unknown.png", 
		".log"	:	"unknown.png",          
		".xml"	:	"xml.png",            
		".html"	:	"xml.png",
		".htm"	:	"xml.png",
		".js"	:	"unknown.png",         
		".css"	:	"unknown.png",
		".png"	:	"image.png",              
		".jpg"	:	"image.png",              
		".jpeg"	:	"image.png",            
		".gif"	:	"image.png", 
		".bmp"	:	"image.png",
		".mpeg"	:	"video.png",         
		".mpg"	:	"video.png",
		".mp4"	:	"video.png",  
		".mkv"	:	"video.png",         		
		".wmv"	:	"video.png",
		".ogv"	:	"video.png",
		".mov"	:	"video.png",
		".pdf"	:	"pdf.png",         
		".xls"	:	"spreadsheet.png",         
		".xlsx"	:	"spreadsheet.png",
		".doc"	:	"doc.png",          
		".docx"	:	"doc.png",             
		".ppt"	:	"slides.png",             
		".pptx"	:	"slides.png",          
		".txt"	:	"txt.png",         
		".epub"	:	"ebook.png",
		".pdb"	:	"ebook.png",
		".fb2"	:	"ebook.png",
		".ibooks"	:	"ebook.png",
		".azw"	:	"ebook.png",
		".azw1"	:	"ebook.png",
		".azw3"	:	"ebook.png",
		".azw4"	:	"ebook.png",
		".kf8"	:	"ebook.png",
		".mobi"	:	"ebook.png",
	};		

	function getFileIcon(ext) {
		return ( ext && extensionsMap[ext.toLowerCase()]) || 'unknown.png';
	}
	
	function loadFiles (path){
		var uri = "/files";
		if(path){
			uri += "?path="+ path;
		}
		//go to the top of the page
		$('html, body').animate({ scrollTop: 0 }, 'slow');
		
		//make the request to get the files of the current document
        $.getJSON(uri, function (data) {
				var grid = document.querySelector('#file-grid');

				//remove previous content of the div#file-grid
				$('#file-grid').empty();
				
				
				//the first element is always a link to the parent folder except it we are on the root level
				var parentPath = upFolder(path);
				if(path){
					var h = '<div class="file-item defaultPadding">';
					h += '<div class="file-icon"><a href="'+parentPath+'" class="folder"><img src="./images/parentFolder.png" alt="Parent Folder"></a></div>';
					h += '<div class="file-name"><a href="'+parentPath+'" class="folder">Parent Folder</a></div>';
					h += '</div>';

					grid.insertAdjacentHTML('beforeend', h);
					
				}		
				
            $(data).each(function (i, file) {
				//create the content of the new element of the grip
				var aClass = "file-grid-img";
				var icon2show = "./images/unknown.png"
				var alt = "Unknown file";
				var href= "";
				
				if (file.IsDirectory) {
					//show the folder icon and remove the popup  class
					aClass += " folder";
					icon2show = "./images/folder.png";
					alt = file.Name+" Folder";
					href= file.Path;
				}else if(imgExtensions.indexOf(file.Ext.toLowerCase()) !=-1){
					//show image and allow to be showed in the carrousell
					aClass += " image-popup";
					icon2show = "/"+file.Path;
					alt = file.Name;
					href= "/"+file.Path;
				}else{
					//show file icon and open it in a new window
					var fileIcon = getFileIcon(file.Ext,file.Name);
					
					aClass += "";
					icon2show = "./images/"+fileIcon;
					alt = file.Name;
					href= "/"+file.Path;
				}
				
				var h = '<div class="file-item defaultPadding">';
				h += '<div class="file-icon"><a href="'+href+'" class="'+aClass+'" target="_blank"><img src="'+icon2show+'" alt="'+alt+'"></a></div>';
				h += '<div class="file-name"><a href="'+href+'" class="'+aClass+'" target="_blank">'+file.Name+'</a></div>';
				if (!file.IsDirectory) {
					h += '<div class="file-download"><a href="'+href+'" class="download" download><img src="./images/download.png" alt="'+alt+'"></a></div>';
				}
				h += '</div>';

				grid.insertAdjacentHTML('beforeend', h);
            });
						
			//update the natigation title
			if ("undefined" == typeof path) {
				path="";
			}
			$('.breadcrumb').text("/"+path.replace(/\\/g, '\/'));
        });
	};
	
	// Change folder when we select it from an icon
	var changeFolder = function() {
		$(document).on('click', 'a.folder', function(e){
			e.preventDefault();
			// replace the content for a loading icon
			
			//move to the destination path
			loadFiles ($(this).attr('href'));
		});
	};
	
	// Change to the parent folder
	var upFolder = function(currentPath) {
		if (!currentPath) return;
	
		var idx = currentPath.lastIndexOf("/");
		if(idx==-1){
			idx = currentPath.lastIndexOf("\\"); //for windows systems
		}
		var path = currentPath.substr(0, idx);

		return path;
	};
	
	$(function(){
		loadFiles();
		changeFolder();
		upFolder();
	});

	
	/*******************************/
	/******** UPLOAD FEATURE *******/
	/*******************************/
	/** github:coligo-io/file-uploader https://coligo.io/building-ajax-file-uploader-with-node/ **/	
	
	
	$('.upload-btn').on('click', function (){
	    $( "#dialog" ).dialog();
		$('#upload-input').click();
		$('.progress-bar').text('0%');
		$('.progress-bar').width('0%');
	});

	$('#upload-input').on('change', function(){

	  var files = $(this).get(0).files;

	  if (files.length > 0){
		// create a FormData object which will be sent as the data payload in the
		// AJAX request
		var formData = new FormData();

		// loop through all the selected files and add them to the formData object
		for (var i = 0; i < files.length; i++) {
		  var file = files[i];
		  // add the files to formData object for the data payload
		  formData.append('uploads[]', file, file.name);
		}

		var destinationPath = $('p#breadcrumb').text().substr(1);
		$.ajax({
		  url: '/upload?path='+destinationPath,
		  type: 'POST',
		  data: formData,
		  processData: false,
		  contentType: false,
		  success: function(data){
			  console.log('upload successful!\n' + data);
			  //reload the content of the current path
			  loadFiles (destinationPath);
		  },
		  xhr: function() {
			// create an XMLHttpRequest
			var xhr = new XMLHttpRequest();

			// listen to the 'progress' event
			xhr.upload.addEventListener('progress', function(evt) {

			  if (evt.lengthComputable) {
				// calculate the percentage of upload completed
				var percentComplete = evt.loaded / evt.total;
				percentComplete = parseInt(percentComplete * 100);

				// update the Bootstrap progress bar with the new percentage
				$('.progress-bar').text(percentComplete + '%');
				$('.progress-bar').width(percentComplete + '%');

				// once the upload reaches 100%, set the progress bar text to done
				if (percentComplete === 100) {
				  $('.progress-bar').append('Done');
				}
			  }
			}, false);

			return xhr;
		  }
		});

	  }
	});

}());
