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
	
	var distCorePath = path.join(distPath, 'core')

	if(!fs.existsSync(srcPath)){
		file.mkDir(srcPath)
	}

	if(!fs.existsSync(distPath)){
		file.mkDir(distPath)
	}

	if(!fs.existsSync(distCorePath)){
		file.mkDir(distCorePath)
	}

	var len = 0

	return new Promise(function(resolve, reject){

	//	compile('loader.js', true)
		compile(srcPath, distPath, config.depends.global+'.js', true)
		compile(srcPath, distPath)
		compile(path.join(config.corePath, 'package'), path.join(distCorePath, 'package'))
		compile(path.join(config.corePath, 'script-ss'), path.join(distCorePath, 'script-ss'))

		function compile(srcPath, distPath, basePath, fouce){
			basePath = basePath || ''
			var fullPath = fouce ? basePath.replace(/\//g, '~') : basePath
			var distFilePath = path.join(distPath, fullPath)

			switch(path.extname(basePath)){
				case '.js' :
					len++
					var modName = getName(basePath, '.js')
					commonJS(config, modName, fouce).then(function(source){
						try{
							var content = UglifyJS.minify(source, {fromString: true}).code
							//var content = source

						}catch(e){
							console.log(modName, e)

							var content = ''
						}
						file.mkFile(distFilePath, content).then(done)

					}, function(err){
						console.log(modName, err)
						done()
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
						compile(srcPath, distPath, filePath)
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
