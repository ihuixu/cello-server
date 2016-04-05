var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getCode = require('./getCode')

module.exports = function(config, mainPath){
	return new Promise(function(resolve, reject) {
		var reg = /\brequire\(["']([^,;\n]*)["']\)/ig
		var depends = []
		var len = 0

		getDepends(mainPath)

		function done(){
			if(len == 0){
				depends.push(mainPath)
				resolve(depends);
			}
		}

		function getDepends(modPath){
			len++
			getCode(config, modPath).then(function(source){
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
						|| modName == modPath 
						|| modName == mainPath
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
