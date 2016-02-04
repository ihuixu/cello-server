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
	, depends : {global:[]}
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
		var appConfig = {}

		if(fs.existsSync(configPath)){
			var content = fs.readFileSync(configPath, 'utf8')
			appConfig = JSON.parse(content||'{}')
		}
		appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'
		appConfig.HOST_NAME = hostname

		file.mkFile(configPath, JSON.stringify(appConfig, null, 4))

		for(var name in defaultAppConfig){
			appConfig[name] = objectAssign({}, defaultAppConfig[name], appConfig[name])
		}

		config[hostname] = appConfig
	}

	return config
}

