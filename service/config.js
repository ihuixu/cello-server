var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');

var defaultConfig = require('../config.json')

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
		}

		if(fs.existsSync(hostPath)){
			var configs = {}
			var configPath = path.join(hostPath, 'config')

			if(fs.existsSync(configPath))
				configs = fs.readdirSync(configPath)

			for(var i in configs){
				(function(i){
				 var configname = configs[i]
				 var name = configname.replace('.json','') 
				 var content = fs.readFileSync(path.join(configPath, configname), 'utf8')
				 var obj = JSON.parse(content)

				 config[hostname][name] = objectAssign(config[hostname][name]||{}, obj)

				 })(i);
			}
		}

	}

	return config
}

