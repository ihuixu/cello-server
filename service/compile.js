var http = require('http')
var path = require('path')
var commonCSS = require('../base/commonCSS')
var commonJS = require('../base/commonJS')
var getConfig = require('./config')
var getName = require('../base/getName')
var file = require('../base/file')
var Promise = require('bluebird')
var fs = require('fs')
var UglifyJS = require("uglify-js");

var defaults = require('../base/defaults')
var defaultCSS = defaults.defaultCSS

module.exports = function(globalConfig){
	return new Promise(function(resolve, reject){
		getConfig(globalConfig).then(function(globalConfig){
			var fns = []
			for(var hostname in globalConfig.apps){
				var config = globalConfig.apps[hostname]
				fns.push(compileJS(hostname, config))
				fns.push(compileCSS(hostname, config))
			}

			new Promise.all(fns).then(function(res){
				resolve(res)
			})

			function compileJS(hostname, config){
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

					function done(){
						if(len == 0){
							console.log('Success:' , 'COMPILE JS', '-->' , hostname)
							resolve({hostname:hostname, type:'js'})
						}
					}

					compile('./')

					function compile(basePath){
						var files = file.readDir(path.join(srcPath, basePath))

						files.map(function(filename){
							var filePath = path.join(basePath, filename)
							var distFilePath = path.join(distPath, filePath)

							switch(path.extname(filename)){
								case '.js' :
									len++
									var modName = getName(filePath, '.js')
									commonJS(config, modName).then(function(source){
										try{
											var content = UglifyJS.minify(source, {fromString: true}).code
										}catch(e){
											console.log(modName)
											console.log(e)

											var content = ''
										}
										file.mkFile(distFilePath, content).then(function(){
											len--
											done()
										})
									})

									break;
				
								case '.json' :
									break;

								default :
									if(!fs.existsSync(distFilePath)){
										file.mkDir(distFilePath)
									}
									compile(filePath)
									break;
							}

						})
					} 

				})
			}

			function compileCSS(hostname, config){
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

					function done(){
						if(len == 0){
							console.log('Success:' , 'COMPILE CSS', '-->' , hostname)
							resolve({hostname:hostname, type:'css'})
						}
					}

					compile('./')

					function compile(basePath){
						var files = file.readDir(path.join(lessPath, basePath))

						files.map(function(filename){
							var filePath = path.join(basePath, filename)
							var distFilePath = path.join(cssPath, filePath)

							switch(path.extname(filename)){
								case '.less' :
									len++
									var modName = getName(filePath, '.less')
									var content = defaultCSS[modName]
									distFilePath = path.join(cssPath, modName+'.css')

									if(content){
										file.mkFile(distFilePath, content).then(function(){
											len--
											done()
										})


									}else{
										commonCSS(config, modName).then(function(source){
											file.mkFile(distFilePath, content).then(function(){
												len--
												done()
											})
										})
									}

									break;
				
								case '.json' :
									break;

								default :
									if(!fs.existsSync(distFilePath)){
										file.mkDir(distFilePath)
									}
									compile(filePath)
									break;

							}

						})
					}

				})
			}
		})
	})
}

