var path = require('path')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')

var defaults = require('../base/defaults')

module.exports = function(config, modNames){
	var fns = []

	if(typeof modNames == 'string')
		modNames = modNames.split('+')

	modNames = modNames || []

	modNames.map(function(modName){
		fns.push(getJS(modName))
	})
		
	function getJS(modName){
		return new Promise(function(resolve, reject){
			switch(path.extname(modName)){
				case '.vue':
					vueJS(config, modName).then(function(source){
						resolve(file.getJSContent(modName, source))
					}, function(err){
						reject(err)
					})
					break;

				default:
					var source = ''

					if(defaults.singleJS[modName]){
						source = defaults.singleJS[modName]

					}else{
						if(defaults.defaultJS[modName]){
							source = file.getJSContent(modName, defaults.defaultJS[modName])

						}else{
							var modNameArray = modName.split(path.sep)

							if(config.corePath && modNameArray[0] == 'core'){
								modNameArray.splice(0,1)

								if(modNameArray[0] == 'package'){
									var modPath = path.join(config.corePath, modNameArray.join(path.sep))
									source = file.getSource(modPath)

								}else{
									var modPath = path.join(config.corePath, 'script-ss', modNameArray.join(path.sep))
									source = file.getJSContent(modName, file.getSource(modPath))
								}
								
							}else{
								var modPath = path.join(config.hostPath, config.path.src, modName)
								source = file.getJSContent(modName, file.getSource(modPath))
							}
						}
					}

					resolve(source);
					break;
			}
		})
	}

	return new Promise.all(fns)
} 
