var http = require('http')
var path = require('path')
var config = require('./config')
var commonJS = require('./base/commonJS')

function onRequest(req, res){
	var hostname = req.headers.host
	var filename = req.url 

	var hostPath = path.join(config.path.root, config.virtualHost[hostname])

	switch(path.extname(filename)){
		case '.js' : 
			res.end(commonJS(filename, hostPath))
			break;

		default :
			res.end('')
			break;
	}

}

http.createServer(onRequest).listen(config.etc.onPort || 80)


