#!/usr/bin/env node

var http = require('http');
var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');
var formidable = require('formidable');

var program = require('commander');

function collect(val, memo) {
  if(val && val.indexOf('.') != 0) val = "." + val;
  memo.push(val);
  return memo;
}

program
  .option('-p, --port <port>', 'Port to run the file-browser. Default value is 8088')
  .option('-e, --exclude <exclude>', 'File extensions to exclude. To exclude multiple extension pass -e multiple times. e.g. ( -e .js -e .cs -e .swp) ', collect, [])
  .option('-d, --directory <dir>', 'Path to the directory you want to serve. Default is current directory')
  .parse(process.argv);

var app = express();
//by default the working dir will be the root one
var dir =  process.cwd();
//in case of get a different directory from the options it is changed here
if (program.directory) dir = program.directory;

var cover = false;
//in case of has the cover flag active
if (program.cover) cover = program.cover;

app.use(express.static(dir)); //app public directory
app.use(express.static(__dirname)); //module directory
var server = http.createServer(app);

if(!program.port) program.port = 8088;

server.listen(program.port);
console.log("Please open the link in your browser http://<YOUR-IP>:" + program.port);

app.get('/files', function(req, res) {

	var currentDir =  dir;
	var query = req.query.path || '';
 
	if (query) currentDir = path.join(dir, query);
	console.log("browsing ", currentDir);
	fs.readdir(currentDir, function (err, files) {
		if (err) {
			throw err;
		}
		
		
		var data = [];
		files.filter(function (file) {
			return true;
		}).forEach(function (file) {
			try {
				//console.log("processing ", file);
				//if the file or directory starts with '.' is a hidden file or directory so we shouldn't show it
				if(!file.startsWith('.')){
					var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
					if (isDirectory) {
					  data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
					} else {
						var ext = path.extname(file);
						if(program.exclude && _.contains(program.exclude, ext)) {
							console.log("excluding file ", file);
							return;
						}				  
						data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
					}
				}
			} catch(e) {
			  console.log(e); 
			}        
		});
		  
		// sorted by directories and the sorted by name
		data = _.sortBy(( _.sortBy(data, 'Name')).reverse(), 'IsDirectory').reverse();
		res.json(data);
	});
});


app.post('/upload', function(req, res){
	var currentDir =  dir;
	var query = req.query.path || '';
	if (query) currentDir = path.join(dir, query);
	console.log("uploading to ", currentDir);
	fs.readdir(currentDir, function (err, files) {
		if (err) {
			throw err;
		}

		// create an incoming form object
		var form = new formidable.IncomingForm();

		// specify that we want to allow the user to upload multiple files in a single request
		form.multiples = true;

		// store all uploads in the indicated directory
		form.uploadDir = path.join(currentDir);

		// data to be returned to the client
		var fileData = [];

		// every time a file has been uploaded successfully,
		// rename it to it's orignal name
		form.on('file', function(field, file) {
			var filePath = path.join(form.uploadDir, file.name);
			fs.rename(file.path, filePath);
			var ext = path.extname(file.name);
			if(program.exclude && _.contains(program.exclude, ext)) {
				console.log("excluding file ", file.name);
				return;
			}   

			fileData.push({ Name : file.name, Ext : ext, IsDirectory: false, Path : filePath });
		});

		// log any errors that occur
		form.on('error', function(err) {
			console.log('An error has occured: \n' + err);
		});

		// once all the files have been uploaded, send a response to the client
		form.on('end', function() {
			// data of the files uploaded 
			res.json(fileData);
		});

		// parse the incoming request containing the form data
		form.parse(req);
	});
});

app.get('/', function(req, res) {
	res.redirect('client/index.html'); 
});
