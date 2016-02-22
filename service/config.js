var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('../base/file')

var defaultConfig = require('./config/server.json')
var mustMake = ['src', 'less', 'components']

var setAppConfig = require('./apps')


module.exports = function(config, opts){
	opts = opts || {}
	config = objectAssign({}, defaultConfig, config||{})

	for(var hostname in config.hosts){
		var hostPath = path.join(config.appPath, config.hosts[hostname])

		if(!fs.existsSync(hostPath)){
			file.mkDir(hostPath)
		}

		if(/^\//ig.test(hostname)){
			hostname = '127.0.0.1:' + config.onPort + hostname
		}

		var appConfig = setAppConfig(hostname, hostPath, opts)

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

