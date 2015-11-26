var http = require('http')
var path = require('path')
var config = require('./config')
var commonJS = require('./base/commonJS')
var mkCSS = require('./base/mkCSS')
var mkHtml = require('./base/mkHtml')

function onRequest(req, res){
	var hostname = req.headers.host
	var filename = req.url 

	var content = '' 

	switch(path.extname(filename)){
		case '.js' : 
			content = commonJS(filename, hostname)
			break;

		case '.css' :
			content = mkCSS(filename, hostname)
			break;

		case '.html' :
			content = mkHtml(filename, hostname)
			break;

		default :
			break;

	}

	res.end(content)
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


