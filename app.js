var http = require('http')
var path = require('path')
var config = require('./config')
var commonjs = require('./base/commonjs')
var vuejs = require('./base/vuejs')

function getName(urlpath){
	var reg = new RegExp('^(\/dist\/)|(\.js)$', 'g')
	return urlpath.replace(reg, '')
}

function onRequest(req, res){
	var hostPath = path.join(config.path.root, config.virtualHost[req.headers.host])

	var fileArray = req.url.split(path.sep)
	var fileType = fileArray.splice(0,2).join('/')
	var filePath = fileArray.join('/')

	switch(fileType){
		case '/dist' : 
			var modName = getName(filePath)
			res.end(commonjs(modName, hostPath))
			break;

		case '/components' : 
			res.end(vuejs(filePath, hostPath))
			break;

		default :
			res.end('')
			break;
	}

}

http.createServer(onRequest).listen(config.etc.onPort || 80)


