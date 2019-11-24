// url = "https://staging-catalog-contents.catalog.cc/media/catalog/contents/raw/374/840/416/file_name.jpg";
url = "https://staging-catalog-contents.catalog.cc/media/thumbnails/contents/original/catalog/374/840/raw/480x/1573686884477438_file_name.CR2";
// url = "https://staging-catalog-contents.catalog.cc/media/thumbnails/contents/original/catalog/374/840/480x/1573686912283629_file_name.png";


function getFileName(url) {
	console.log('url: ', url);
	// this removes everything before the last slash in the path
	url = url.substring(url.lastIndexOf("/") + 1, url.length);
	console.log('url: ', url);
	let index = url.indexOf('_') + 1;
	url = url.slice(index);
	console.log('url: ', url);
	return url;
}

getFileName(url);


function getFileNameFromUrl(url) {
	// removes everything before the last slash in the url
	return url.substring(url.lastIndexOf("/") + 1);
}

function removeTimestampFromFileName(url) {
	// removes everything before the first underscore in the filename
	return url.substring(url.indexOf('_') + 1);
}


