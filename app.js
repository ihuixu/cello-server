var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var config = require('./config')
var commonJS = require('./commonJS')
var vueJS = require('./vueJS')
var objectAssign = require('object-assign');

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
				 var name = configname.replace('.json','') 
				 var content = fs.readFileSync(path.join(configPath, configname), 'utf8')
				 var obj = JSON.parse(content)

				 config[hostname][name] = objectAssign(config[hostname][name], obj)

				 })(i);
			}
	}

	var srcPath = path.join(hostPath, config[hostname].path.src)
		, componentsPath = path.join(hostPath, config[hostname].path.components)

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

			jsfile = vueJS(componentsPath, modName).code

			res.end(JSON.stringify(jsfile))
			break;

		default :
			res.end('')
			break;
	}
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


