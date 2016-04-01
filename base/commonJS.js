var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')

var defaults = require('../base/defaults')
var defaultJS = defaults.defaultJS
var singleJS = defaults.singleJS

module.exports = function(config, mainPath){
	var excludes = []
	for(var key in config.depends){
		var exclude = config.depends[key].split('+')
		for(var i in exclude){
			excludes.push(exclude[i])
		}
	}
	var srcPath = path.join(config.hostPath, config.path.src)

	return new Promise(function(resolve, reject) {
		var reg = /\brequire\(["']([^,;\n]*)["']\)/ig
		var depends = []
		var code = []
		var len = 0

		getDepends(mainPath)
		depends.push(mainPath)


		function done(){
			if(len == 0)
				resolve(code.join('\n'));
		}

		function getDepends(modPath){
			len++
			getCode(modPath).then(function(source){
				code.push(source)

				source = source.replace(/(\/\/([^,;\n]*))/ig, '\n')
				var lines = source.split('\n')
				lines.map(function(line){
					var requiresInLine = line.match(reg)
					if(requiresInLine){
						requiresInLine.map(function(requireInLine){
							try {
								var evaFn = new Function('require' , requireInLine)
								evaFn(require)

							}catch(err){
								console.log(err, requireInLine)
							}
						})
					}
				})

				len--
				done()
			})

			function require(modName){
				if (!modName
						|| modName == modPath 
						|| modName == mainPath
						|| depends.indexOf(modName) != -1
						|| depends.indexOf(modName) != -1 
						|| excludes.indexOf(modName) != -1 
						)
					return;

				depends.push(modName)
				getDepends(modName)
			}
		}
	})

	function getCode(modName){
		return new Promise(function(resolve, reject) {
			switch(path.extname(modName)){
				case '.vue':
					vueJS(config, modName).then(function(source){
						resolve(file.getJSContent(modName, source))
					})
					break;

				default:
					var source = ''
					if(singleJS[modName]){
						source = singleJS[modName]

					}else if(defaultJS[modName]){
						source = file.getJSContent(modName, defaultJS[modName])

					}else{
						source = file.getJSContent(modName, file.getSource(path.join(srcPath, modName)))
					}

					resolve(source);
					break;
			}
		})
	}
} 
