var path = require('path')
var getName = require('../base/getName')
var file = require('../base/file')
var Promise = require('bluebird')
var fs = require('fs')

var commonCSS = require('../base/commonCSS')

module.exports = function(hostname, config){
	console.log('Start:' , 'COMPILE CSS', '-->' , hostname)

	var srcPath = path.join(config.hostPath, config.path.less)
	var distPath = path.join(config.hostPath, config.path.css)
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
		compile(path.join(config.corePath, 'less'), distCorePath)
		compile(srcPath, distPath)

		function compile(srcPath, distPath, basePath, fouce){
			basePath = basePath || ''
			var distFilePath = path.join(distPath, basePath)

			switch(path.extname(basePath)){
				case '.less' :
					len++
					var modName = getName(basePath, '.less')
					distFilePath = path.join(distPath, modName+'.css')

					commonCSS(config, modName).then(function(content){
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
				console.log('Success:' , 'COMPILE CSS', '-->' , hostname)
				resolve({hostname:hostname, type:'css'})
			}
		}
	})
}


