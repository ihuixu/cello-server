var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var commonJS = require('./base/commonJS')
var commonCSS = require('./base/commonCSS')
var vueJS = require('./base/vueJS')
var getConfig = require('./config')

var defaultJS = {
	'loader' : fs.readFileSync(path.join(__dirname, './lib/loader.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(__dirname, './lib/vue.js'), 'utf8')
}
var defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, './lib/cssresetwww.less'), 'utf8')
	,'cssresetm': fs.readFileSync(path.join(__dirname, './lib/cssresetm.less'), 'utf8')
}

function getName(urlpath){
	var reg = new RegExp('^(\/(dist|css)\/)|(\.(js|css))$', 'g')
	return urlpath.replace(reg, '')
}

exports.start = function(config){
	var outputed = {}
	config = getConfig(config) 

	function onRequest(req, res){
		var hostname = req.headers.host

		if(!config.hosts[hostname]){
			send(400, 'Not exist: config.hosts['+ hostname +']!')
			return; 
		}

		var hostPath = path.join(config.hosts[hostname])

		var fileArray = req.url.split('/')
		var fileOption = fileArray.splice(0,2).join('').split('~')
		var fileType = fileOption[0]
		var filePath = fileArray.join('/')

		var modName = getName(filePath)

		switch(fileType){
			case 'src' : 
				if(defaultJS[modName]){
					send(200, defaultJS[modName], 'js')

				}else{
					commonJS(config[hostname], hostPath, modName, fileOption[1])
						.then(function(source){
							send(200, source, 'js')
						})
				}
				break;

			case 'dist' : 
				if(defaultJS[modName]){
					send(200, defaultJS[modName], 'js')

				}else{
					commonJS(config[hostname], hostPath, modName, fileOption[1])
						.then(function(source){
							send(200, UglifyJS.minify(source, {fromString: true}).code, 'js')
						})
				}
				break;

			case 'components' : 
				vueJS(config[hostname], hostPath, modName)
					.then(function(source){
						send(200, source, 'js')
					})
				break;

			case 'css' : 
				if(defaultCSS[modName]){
					send(200, defaultCSS[modName], 'css')

				}else{
					commonCSS(config[hostname], hostPath, modName)
						.then(function(source){
							send(200, source, 'css')
						})
				}
				break;

			default :
				send(200)
				break;
		}

		function send(state, content, filetype){
			var now = new Date
			var lastModified = outputed[req.url] || (new Date).toUTCString()
			var expires = new Date(now.getFullYear() , now.getMonth() , now.getDate()+30)

			var contentType = 'text/plain'
			if ('css' == filetype) contentType = 'text/css'
			else if ('js' == filetype) contentType = 'application/javascript'

			res.writeHeader(state ,{
					"Content-Type" :  contentType +';charset=utf-8',
					"Last-Modified" : lastModified,
					"Expires" : expires.toUTCString()
			});

			outputed[req.url] = lastModified

			res.write(content || '')
			res.end()
		}
	}

	http.createServer(onRequest).listen(config.onPort || 80)
}

exports.compile = function(config){
	config = getConfig(config) 
	console.log(config)

	for(var hostname in config.hosts){
		var srcPath = path.join(config.hosts[hostname], config[hostname].path.src)
		var distPath = path.join(config.hosts[hostname], config[hostname].path.dist)
		var lessPath = path.join(config.hosts[hostname], config[hostname].path.less)
		var cssPath = path.join(config.hosts[hostname], config[hostname].path.css)

		console.log(distPath)
	}

}


