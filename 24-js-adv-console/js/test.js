url = "http://127.0.0.1:8000/media/thumbnails/contents/original/374/840/480x/Kubo_MS_2.jpg"
var filename =url.substring(url.lastIndexOf('/')+1);
console.log('filename: ', filename);


function getFileName() {
//this gets the full url
	var url = document.location.href;
	console.log('url: ', url);
//this removes the anchor at the end, if there is one
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	console.log('url- #', url.indexOf("#") == -1);
//this removes the query after the file name, if there is one
url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
//this removes everything before the last slash in the path
url = url.substring(url.lastIndexOf("/") + 1, url.length);
console.log('url: ', url);
//return
return url;
}

getFileName();
