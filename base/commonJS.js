var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getDepends = require('./getDepends')
var getCode = require('./getCode')

module.exports = function(config, mainPath){
/*
	var fns = []
	for(var key in config.depends){
		var exclude = config.depends[key].split('+')
		for(var i in exclude){
			fns.push(getGlobalDepends(exclude[i]))
		}
	}

	function getGlobalDepends(mainPath){
		return getDepends(config, mainPath)
	}

	new Promise.all(fns).then(function(excludes){
		console.log(excludes)
	})
*/


	return new Promise(function(resolve, reject) {
		getDepends(config, mainPath).then(function(depends){


			getCode(config, depends).then(function(source){
				source = source.join('\n')
				resolve(source);
			})
		})
	})
} 
