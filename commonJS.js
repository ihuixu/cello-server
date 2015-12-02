var path = require('path')
var fs = require('fs')
var file = require('./base/file')
var vueJS = require('./vueJS')
var Promise = require('bluebird')

module.exports = function(config, hostPath, mainPath, cbk){
	var srcPath = path.join(hostPath, config.path.src)
	var mainFilepath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(mainFilepath)

	var getDeps = new Promise(function(resolve, reject) {
		var depends = []
		var code = []
		len = 0

		getDepends(mainPath, mainSource)	

		function done(){
			if(len) return;

			depends.push(mainPath)
			code.push(file.getContent(mainPath, mainSource))
			resolve(code);
		}

		function getDepends(modPath, modSource){
			var jsLine = modSource.split('\n')
			var reg = /\brequire\b/

			function require(modName){
				if (modName === modPath){
					console.log('Error File "' + modPath + '" 调用自身.');
					return;
				}

				if (modName && depends.indexOf(modName) == -1){
					len++
					depends.push(modName)
					switch(path.extname(modName)){
						case '.vue':

							vueJS(config, hostPath, modName, function(component){
								var source = component.join('\n')
								code.push(file.getContent(modName, source))
								getDepends(modName, source)
								len--
								done()
							})
							break;


						default:
							var filepath = path.join(srcPath, modName)
							var source = file.getSource(filepath)
							code.push(file.getContent(modName, source))
							getDepends(modName, source)
							len--
							done()
							break;

					}
				}
			}

			jsLine.forEach(function(line){
				if (!reg.test(line))
					return

				line = line.replace(/,/g , ';')

				try {
					var evaFn = new Function('require' , line)
					evaFn(require)

				}catch(err){
					console.log(err, line)
				}

			})
		}


	})

	Promise.all(getDeps).then(cbk)

} 
