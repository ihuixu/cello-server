var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')

var defaults = require('../base/defaults')
var defaultJS = defaults.defaultJS
var singleJS = defaults.singleJS

module.exports = function(config, modNames){
	var fns = []

	if(typeof modNames == 'string')
		modNames = [modNames]

	modNames = modNames || []

	modNames.map(function(modName){
		fns.push(getCode(modName))
	})
		
	function getCode(modName){
		return new Promise(function(resolve, reject){
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
						source = file.getJSContent(modName, file.getSource(path.join(config.hostPath, config.path.src, modName)))
					}

					resolve(source);
					break;
			}
		})
	}

	return new Promise.all(fns)
} 
