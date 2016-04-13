var getConfig = require('./config')
var Promise = require('bluebird')

var compileJS = require('./compileJS')
var compileCSS = require('./compileCSS')

module.exports = function(config){
	return new Promise(function(resolve, reject){
		getConfig(config).then(function(config){
			var fns = []
			for(var hostname in config.apps){
				fns.push(compileJS(hostname, config.apps[hostname]))
				fns.push(compileCSS(hostname, config.apps[hostname]))
			}

			new Promise.all(fns).then(function(res){
				resolve(res)

			}, function(err){
				reject(err)
			})
		})
	})
}

