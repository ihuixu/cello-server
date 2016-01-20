var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var config = require('./config')
var commonJS = require('./base/commonJS')
var commonCSS = require('./base/commonCSS')
var vueJS = require('./base/vueJS')
var objectAssign = require('object-assign');

var defaultJS = {
	'loader' : fs.readFileSync('./lib/loader.js', 'utf8')
	, 'vue' : fs.readFileSync('./lib/vue.js', 'utf8')
}

var defaultCSS = {
	'cssresetwww': fs.readFileSync('./lib/cssresetwww.less', 'utf8')
	,'cssresetm': fs.readFileSync('./lib/cssresetm.less', 'utf8')
}

function getName(urlpath){
	var reg = new RegExp('^(\/(dist|css)\/)|(\.(js|css))$', 'g')
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
		case '/src' : 
			if(defaultJS[modName]){
				res.end(defaultJS[modName])

			}else{
				commonJS(config[hostname], hostPath, modName).then(function(source){
					res.end(source)
				})
			}
			break;


		case '/dist' : 
			if(defaultJS[modName]){
				res.end(defaultJS[modName])

			}else{
				commonJS(config[hostname], hostPath, modName).then(function(source){
					res.end(UglifyJS.minify(source, {fromString: true}).code)
				})
			}
			break;

		case '/components' : 
			vueJS(config[hostname], hostPath, modName).then(function(source){
				res.end(source)
			})
			break;

		case '/css' : 
			if(defaultCSS[modName]){
				res.end(defaultCSS[modName])

			}else{
				commonCSS(config[hostname], hostPath, modName).then(function(source){
					res.end(source)
				})
			}
			break;

		default :
			res.end('')
			break;
	}
}

http.createServer(onRequest).listen(config.etc.onPort || 80)


