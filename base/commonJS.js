var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getDepends = require('./getDepends')
var getCode = require('./getCode')

module.exports = function(config, mainPath, fouce){
	var excludes = []
	for(var key in config.depends){
		var depends = config.depends[key].split('+')
		depends.map(function(v){
			if(excludes.indexOf(v) == -1)
				excludes.push(v)
		})
	}

	return new Promise(function(resolve, reject) {
		if(excludes.indexOf(mainPath) != -1){
			getCode(config, mainPath).then(function(source){
				source = source.join('\n')
				resolve(source);
			})

		}else{

			getDepends(config, mainPath).then(function(depends){
				var depend = []
				if(fouce){
					depend = depends

				}else{
					depends.map(function(v){
						if(excludes.indexOf(v) == -1)
							depend.push(v)
					})
				}

				getCode(config, depend).then(function(source){
					source = source.join('\n')
					resolve(source);
				})
			})
		}
	})
} 
