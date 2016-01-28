var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');

var defaultConfig = require('./config.json')

module.exports = function(config){
	config = objectAssign(defaultConfig, config || {})

	for(var hostname in config.hosts){
		var hostPath = path.join(config.hosts[hostname])

		config[hostname] = {
			path:{
				"src":"./src/"
				, "dist":"./dist/"
				, "less":"./less/"
				, "css":"./css/"
				, "components":"./components/"
			}
			, depends : {}
		}

		if(fs.existsSync(hostPath)){
			var configPath = path.join(hostPath, 'config.json')

			if(fs.existsSync(configPath)){
				var appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))

				for(var name in config[hostname]){
					config[hostname][name] = objectAssign(config[hostname][name] , appConfig[name])
				}
			}
		}
	}

	return config
}

