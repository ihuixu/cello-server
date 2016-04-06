var path = require('path')
var getName = require('../base/getName')
var file = require('../base/file')
var Promise = require('bluebird')
var fs = require('fs')

var commonJS = require('../base/commonJS')
var UglifyJS = require("uglify-js");

module.exports = function(hostname, config){
	console.log('Start:' , 'COMPILE JS', '-->' , hostname)

	var srcPath = path.join(config.hostPath, config.path.src)
	var distPath = path.join(config.hostPath, config.path.dist)
	
	if(!fs.existsSync(srcPath)){
		file.mkDir(srcPath)
	}

	if(!fs.existsSync(distPath)){
		file.mkDir(distPath)
	}

	var len = 0

	return new Promise(function(resolve, reject){

		compile('./'+config.depends.global+'.js')
//		compile('./')

		function compile(basePath){
			var distFilePath = path.join(distPath, basePath)

			switch(path.extname(basePath)){
				case '.js' :
					len++
					var modName = getName(basePath, '.js')
					commonJS(config, modName).then(function(source){
						try{
							var content = UglifyJS.minify(source, {fromString: true}).code

						}catch(e){
							console.log(modName)
							console.log(e)

							var content = ''
						}
						file.mkFile(distFilePath, content).then(done)
					})
					break;

				case '.json' :
					break;

				default :
					if(!fs.existsSync(distFilePath)){
						file.mkDir(distFilePath)
					}

					var files = file.readDir(path.join(srcPath, basePath))
					files.map(function(filename){
						var filePath = path.join(basePath, filename)
						compile(filePath)
					})
					break;
			}
		} 

		function done(){
			len--
			if(len == 0){
				console.log('Success:' , 'COMPILE JS', '-->' , hostname)
				resolve({hostname:hostname, type:'js'})
			}
		}
	})
}
