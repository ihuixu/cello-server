var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var config = require('./config')
var commonJS = require('./base/commonJS')
var vueJS = require('./base/vueJS')

function getName(urlpath){
	var reg = new RegExp('^(\/dist\/)|(\.js)$', 'g')
	return urlpath.replace(reg, '')
}

function onRequest(req, res){
	var hostname = req.headers.host
	var hostPath = path.join(config.path.root, config.virtualHost[hostname])

	var fileArray = req.url.split(path.sep)
	var fileType = fileArray.splice(0,2).join('/')
	var filePath = fileArray.join('/')

	config[hostname] = {
		path:{
			"src":"./src/",
			"dist":"./dist/",
			"components":"./components/"
		}
	}

	if(fs.existsSync(hostPath)){
		var configs = {}
		var configPath = path.join(hostPath, 'config')

		if(fs.existsSync(configPath))
			configs = fs.readdirSync(configPath)

		for(var i in configs){
			(function(i){
			 var configname = configs[i]

			 var content = fs.readFileSync(path.join(configPath, configname), 'utf8')

			 config[hostname][configname.replace('.json', '')] = JSON.parse(content)

			 })(i);
		}
	}

	var srcPath = path.join(hostPath, config[hostname].path.src)

	switch(fileType){
		case '/dist' : 
			var modName = getName(filePath)
			var jsfile = ''

			if(modName == 'loader'){
				jsfile = UglifyJS.minify(loader, {fromString: true}).code

			}else{
				jsfile = commonJS(srcPath, modName).code

				//jsfile = UglifyJS.minify(jsfile, {fromString: true}).code
			}

			res.end(jsfile)
			break;

		case '/components' : 
			var modName = getName(filePath)
			var jsfile = ''

			if(modName == 'loader'){
				jsfile = UglifyJS.minify(loader, {fromString: true}).code

			}else{
				jsfile = vueJS(srcPath, modName).code

				//jsfile = UglifyJS.minify(jsfile, {fromString: true}).code
			}

			res.end(jsfile)
			break;

		default :
			res.end('')
			break;
	}
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


