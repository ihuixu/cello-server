var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('./base/file')

var defaultConfig = require('./config.json')

var defaultAppConfig = {
	path:{
		"src":"./src/"
		, "dist":"./dist/"
		, "less":"./less/"
		, "css":"./css/"
		, "components":"./components/"
	}
	, depends : {}
}

module.exports = function(config){
	config = objectAssign({}, defaultConfig, config || {})

	for(var hostname in config.hosts){
		setConfig(hostname)
	}

	function setConfig(hostname){
		var hostPath = path.join(config.hosts[hostname])
		if(!fs.existsSync(hostPath)) return;

		var configPath = path.join(hostPath, 'config.json')
	 console.log(configPath, 111111111)
		var appConfig = {}

		if(fs.existsSync(configPath)){
			appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8') || '{}')
		}
		appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'
		appConfig.HOST_NAME = hostname

		file.mkFile(configPath, JSON.stringify(appConfig, null, 4))

		for(var name in defaultAppConfig){
			appConfig[name] = objectAssign({}, defaultAppConfig[name], appConfig[name])
		}


		config[hostname] = appConfig
	}

	console.log(config)
	return config
}

