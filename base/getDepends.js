var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getCode = require('./getCode')

module.exports = function(config, mainPaths){
	var excludes = []
	for(var key in config.depends){
		var depends = config.depends[key].split('+')
		depends.map(function(v){
			if(excludes.indexOf(v) == -1)
				excludes.push(v)
		})
	}

	return new Promise(function(resolve, reject) {
		var reg = /\brequire\(["']([^,;\n]*)["']\)/ig
		var depends = []
		var len = 0

		if(typeof mainPaths == 'string')
			mainPaths = mainPaths.split('+')

		mainPaths = mainPaths || []

		console.log(mainPaths)
		getDepends(mainPaths)

		function done(){
			if(len == 0){
				mainPaths.map(function(mainPath){
					if(depends.indexOf(mainPath) == -1)
						depends.push(mainPath)
				})
		
				resolve(depends);
			}
		}

		function getDepends(modPaths){
			len++
			getCode(config, modPaths).then(function(source){
				source = source.join('\n')
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
						|| modPaths.indexOf(modName) != -1
						|| mainPaths.indexOf(modName) != -1
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
} 
