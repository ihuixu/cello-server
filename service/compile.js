var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var commonJS = require('../base/commonJS')
var commonCSS = require('../base/commonCSS')
var vueJS = require('../base/vueJS')
var getConfig = require('./config')
var file = require('../base/file')

var defaults = require('../base/defaults')
var defaultJS = defaults.defaultJS
var singleJS = defaults.singleJS
var defaultCSS = defaults.defaultCSS

function getName(urlpath){
	var reg = new RegExp('^(\/(dist|css)\/)|(\.(js|css|less))', 'g')
	var names = urlpath.replace(reg, '').split('?')
	return names[0]
}

module.exports = function(config){
	config = getConfig(config) 

	for(var hostname in config.apps){
		compile(hostname)
	}

	function compile(hostname){
		var appConfig = config.apps[hostname]
		var hostPath = appConfig.hostPath 

		if(!fs.existsSync(hostPath)){
			return;
		}

		var srcPath = path.join(hostPath, appConfig.path.src)
		var distPath = path.join(hostPath, appConfig.path.dist)
		
		var lessPath = path.join(hostPath, appConfig.path.less)
		var cssPath = path.join(hostPath, appConfig.path.css)


		if(!fs.existsSync(distPath)){
			file.mkDir(distPath)
		}

		if(!fs.existsSync(cssPath)){
			file.mkDir(cssPath)
		}


		for(var modName in singleJS){
			try{
				var content = UglifyJS.minify(singleJS[modName], {fromString: true}).code
				file.mkFile(path.join(distPath, modName+'.js'), content)

			}catch(err){
				console.log('error compile', modName, err)
			}
		}

		for(var modName in defaultJS){
			try{
				var content = UglifyJS.minify(file.getJSContent(defaultJS[modName]), {fromString: true}).code
				file.mkFile(path.join(distPath, modName+'.js'), content)

			}catch(err){
				console.log('error compile', modName, err)
			}
		}

		for(var i in defaultCSS){
			file.mkFile(path.join(cssPath, i+'.css'), defaultCSS[i])
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
							commonJS(appConfig, modName)
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
						distFilePath = path.join(cssPath, modName+'.css')

						if(content){
							file.mkFile(distFilePath, content)

						}else{
							commonCSS(appConfig, modName)
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

