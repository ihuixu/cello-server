var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var commonJS = require('../base/commonJS')
var commonCSS = require('../base/commonCSS')
var vueJS = require('../base/vueJS')
var getConfig = require('../config')
var file = require('../base/file')

var defaults = require('../base/defaults')
var defaultJS = defaults.defaultJS
var defaultCSS = defaults.defaultCSS

function getName(urlpath){
	var reg = new RegExp('^(\/(dist|css)\/)|(\.(js|css))$', 'g')
	return urlpath.replace(reg, '')
}


module.exports = function(config){
	config = getConfig(config) 

	for(var hostname in config.hosts){
		compile(hostname)
	}

	function compile(hostname){
		var hostPath = config.hosts[hostname]

		if(!fs.existsSync(hostPath)){
			return;
		}

		var appPath = config[hostname]

		var srcPath = path.join(hostPath, appPath.path.src)
		var distPath = path.join(hostPath, appPath.path.dist)
		
		var lessPath = path.join(hostPath, appPath.path.less)
		var cssPath = path.join(hostPath, appPath.path.css)

		if(!fs.existsSync(distPath)){
			file.mkDir(distPath)
		}

		if(!fs.existsSync(cssPath)){
			file.mkDir(cssPath)
		}

		compileJS('./')
		compileCSS('./')

		function compileJS(basePath){
			if(!fs.existsSync(srcPath)){
				file.mkDir(srcPath)
			}

			var files = fs.readdirSync(path.join(srcPath, basePath))

			files.map(function(filename){
				var filePath = path.join(basePath, filename)
				var distFilePath = path.join(distPath, filePath)

				switch(path.extname(filename)){
					case '.js' :
						var modName = getName(filePath)

						if(defaultJS[modName]){
							var content = UglifyJS.minify(defaultJS[modName], {fromString: true}).code
							file.mkFile(distFilePath, content)

						}else{
							commonJS(config[hostname], hostPath, modName)
								.then(function(source){
									var content = UglifyJS.minify(source, {fromString: true}).code
									file.mkFile(distFilePath, content)
								})
						}

						break;
	

					default :
						if(!fs.existsSync(distFilePath)){
							file.mkDir(distFilePath)
						}
						compileJS(filePath)
						break;
				}

			})
		} 

		function compileCSS(basePath){

			if(!fs.existsSync(lessPath)){
				file.mkDir(lessPath)
			}

			var files = fs.readdirSync(path.join(lessPath, basePath))

			files.map(function(filename){
				var filePath = path.join(basePath, filename)
				var distFilePath = path.join(cssPath, filePath)

				switch(path.extname(filename)){
					case '.less' :
						var modName = getName(filePath)
						var content = defaultCSS[modName]

						if(content){
							file.mkFile(distFilePath, content)

						}else{
							commonCSS(config[hostname], hostPath, modName)
								.then(function(source){
									file.mkFile(distFilePath, source)
								})
						}

						break;
	

					default :
						if(!fs.existsSync(distFilePath)){
							file.mkDir(distFilePath)
						}
						compileCSS(filePath)
						break;
				}

			})
		}
	}

}

