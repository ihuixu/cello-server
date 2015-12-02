var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var config = require('./config')
var commonJS = require('./commonJS')
var vueJS = require('./vueJS')
var objectAssign = require('object-assign');

var defaultJS = {
	loader : fs.readFileSync('./lib/loader.js', 'utf8')
	, vue : fs.readFileSync('./lib/vue.js', 'utf8')
}

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
			"less":"./less/",
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

	var modName = getName(filePath)
	var srcPath = path.join(hostPath, config[hostname].path.src)

	switch(fileType){
		case '/dist' : 
			var jsfile = defaultJS[modName]
									? defaultJS[modName]
									: commonJS(srcPath, modName).code

			res.end(jsfile)
//			res.end(UglifyJS.minify(jsfile, {fromString: true}).code)

			break;

		case '/components' : 
			vueJS(hostPath, modName, config[hostname], function(component){
				res.end(component.join('\n'))
			})
			break;

		default :
			res.end('')
			break;
	}
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


