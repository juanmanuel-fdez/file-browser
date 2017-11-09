file-browser
============
file-browser is a utility to browse and upload files on your file system using your browser. Its equivalent of creating a file share that can be accessed over http. Using this you can share files between different machines, and across different operating systems. 

Based on the sumitchawla/file-browser, this version includes the posibility to upload files and a different UI to browse the file system.

## How to install
```js
  npm -g install file-browser
```

## How to Run
Change directory to the directory you want to browse. Then run the following command in that directory.
```js
  file-browser
```
You would see the message <b>Please open the link in your browser http://<YOUR-IP>:8088</b> in your console. Now you can point your browser to your IP. 
For localhost access the files over http://127.0.0.1:8088 

file-browser supports following command line switches for additional functinality.

```js
    -p, --port <port>        Port to run the file-browser. Default value is 8088
    -e, --exclude <exclude>  File extensions to exclude. To exclude multiple extension pass -e multiple times. e.g. ( -e .js -e .cs -e .swp)
    -d, --directory <dir>    Path to the directory you want to serve. Default is current directory.

``` 

## Screenshot
![alt File browser screenshot](https://raw.githubusercontent.com/juanmanuel-fdez/file-browser/master/file-browser.png" "File browser screenshot")

## References & sources

### Original idea & code
sumitchawla: [Blog post](https://chawlasumit.wordpress.com/2014/08/04/how-to-create-a-web-based-file-browser-using-nodejs-express-and-jquery-datatables/) & [Code](https://github.com/sumitchawla/file-browser)

### Upload feature 
FadyMak @ coligo-io [Blog post](https://coligo.io/building-ajax-file-uploader-with-node/) & [Code](https://github.com/coligo-io/file-uploader)

### Icons
[hawcons](https://www.iconfinder.com/iconsets/hawcons) by Yannick Lung

### Generic Logo
[gtdesigns](http://www.gtdesigns.it/overusedlogos/)