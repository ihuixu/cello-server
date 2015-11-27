var http = require('http')
var path = require('path')
var config = require('./config')
var commonjs = require('./base/commonjs')
var vuejs = require('./base/vuejs')

function onRequest(req, res){
	var hostPath = path.join(config.path.root, config.virtualHost[req.headers.host])

	var fileArray = req.url.split(path.sep)
	var fileType = fileArray.splice(0,2).join('/')
	var fileName = fileArray.join('/')

	switch(fileType){
		case '/dist' : 
			res.end(commonjs(fileName, hostPath))
			break;

		case '/components' : 
			res.end(vuejs(fileName, hostPath))
			break;

		default :
			res.end('')
			break;
	}

}

http.createServer(onRequest).listen(config.etc.onPort || 80)


