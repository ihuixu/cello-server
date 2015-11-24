var http = require('http')
var path = require('path')
var config = require('./config')
var commonJS = require('./base/commonJS')
var mkCSS = require('./base/mkCSS')
var mkHtml = require('./base/mkHtml')

function onRequest(req, res){
	var hostname = req.headers.host
	var filename = req.url 
	var modelName = config.virtualHost[hostname]

	console.log(modelName, filename)

	var content = '' 

	switch(path.extname(filename)){
		case '.js' : 
			content = commonJS(filename, modelName)
			break;

		case '.css' :
			content = mkCSS(filename, modelName)
			break;

		case '.html' :
			content = mkHtml(filename, modelName)
			break;

		default :
			break;

	}

	res.end(content)
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


