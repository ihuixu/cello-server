var path = require('path')
var getName = require('../base/getName')
var file = require('../base/file')
var Promise = require('bluebird')
var fs = require('fs')

var commonCSS = require('../base/commonCSS')

var defaults = require('../base/defaults')

module.exports = function(hostname, config){
	console.log('Start:' , 'COMPILE CSS', '-->' , hostname)

	var lessPath = path.join(config.hostPath, config.path.less)
	var cssPath = path.join(config.hostPath, config.path.css)

	if(!fs.existsSync(lessPath)){
		file.mkDir(lessPath)
	}

	if(!fs.existsSync(cssPath)){
		file.mkDir(cssPath)
	}

	var len = 0

	return new Promise(function(resolve, reject){

		var coreCSS = ['cssresetm', 'cssresetwww']
		var corePath = path.join(cssPath, 'core')

		if(!fs.existsSync(corePath)){
			file.mkDir(corePath)
		}

		coreCSS.map(function(modName){
			len++

			var distFilePath = path.join(cssPath, modName+'.css')
			commonCSS(config, modName).then(function(content){
				file.mkFile(distFilePath, content).then(done)

			}, function(err){
				console.log(modName, err)
				done()
			})
		})

		compile()

		function compile(basePath){
			basePath = basePath || ''
			var distFilePath = path.join(cssPath, basePath)

			switch(path.extname(basePath)){
				case '.less' :
					len++
					var modName = getName(basePath, '.less')
					distFilePath = path.join(cssPath, modName+'.css')

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

					var files = file.readDir(path.join(lessPath, basePath))
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
				console.log('Success:' , 'COMPILE CSS', '-->' , hostname)
				resolve({hostname:hostname, type:'css'})
			}
		}
	})
}


