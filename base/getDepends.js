var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getCode = require('./getCode')

module.exports = function(config, mainPaths){
	return new Promise(function(resolve, reject) {
		var reg = /\brequire\(["']([^,;\n]*)["']\)/ig
		var depends = []
		var len = 0

		if(typeof mainPaths == 'string')
			mainPaths = [mainPaths]

		mainPaths = mainPaths || []

		getDepends(mainPaths)

		function done(){
			if(len == 0){
				mainPaths.map(function(mainPath){
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
						)
					return;

				depends.push(modName)
				getDepends(modName)
			}
		}
	})
} 
