var cache = {},deponCache = {}, outputed = {};

var now = new Date;
var lastModified = outputed[req.url] || (new Date).toUTCString();
var expires = new Date(now.getFullYear() , now.getMonth() , now.getDate()+30);

var contentType = 'text/plain'
if ('css' == filetype) contentType = 'text/css'
else if ('js' == filetype || !filetype) contentType = 'application/javascript'

res.writeHeader(200 ,{
		"Content-Type" :  contentType +';charset=utf-8',
		"Last-Modified" : lastModified,
		"Expires" : expires.toUTCString()
});
