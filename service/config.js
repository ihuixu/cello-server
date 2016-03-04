var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('../base/file')

var defaultConfig = require('../config/server.json')
var mustMake = ['src', 'less', 'components']

var setConfig = require('./setConfig')

module.exports = function(config, opts){
	opts = opts || {}
	config = objectAssign({}, defaultConfig, config||{})

	for(var hostname in config.hosts){
		var hostPath = path.join(config.appPath, config.hosts[hostname])
		var configPath = path.join(hostPath, 'config.json')

		if(!fs.existsSync(hostPath)){
			file.mkDir(hostPath)
		}

		if(/^\//ig.test(hostname)){
			hostname = '127.0.0.1:' + config.onPort + hostname
		}

		var appConfig = setConfig.apps(hostname, hostPath)
		appConfig.isDebug = !!opts.isDebug

		if(typeof appConfig.version == "undefined" || opts.update){
			appConfig.version = Date.parse(new Date)/1000 
		}


		var dependsConfig = setConfig.depends(hostname, hostPath) 
		appConfig.depends = dependsConfig

		file.mkFile(configPath, JSON.stringify(appConfig, null, 4))

		mustMake.map(function(name){
			var pathPath = path.join(hostPath, appConfig.path[name])
			if(!fs.existsSync(pathPath)){
				file.mkDir(pathPath)
			}
		})

		config.apps[hostname] = appConfig
	}

	return config
}

