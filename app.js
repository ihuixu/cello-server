var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var config = require('./config')
var commonJS = require('./commonJS')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
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

	switch(fileType){
		case '/dist' : 
			if(defaultJS[modName]){
				res.end(defaultJS[modName])
				return;
				
			}

			var getDeps = commonJS(config[hostname], hostPath, modName)
			Promise.all(getDeps).then(function(source){
				source = source.join('\n')
				res.end(source)
//			res.end(UglifyJS.minify(source, {fromString: true}).code)
			})

			break;

		case '/components' : 
			var getComs = vueJS(config[hostname], hostPath, modName)
			Promise.all(getComs).then(function(source){
				source = source.join('\n')
				res.end(source)
			})
			break;

		default :
			res.end('')
			break;
	}
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


