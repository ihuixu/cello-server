var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');

var defaultAppConfig = require('../config/apps.json')

module.exports = function(hostname, hostPath){
	try{
		var appConfig = JSON.parse(JSON.stringify(defaultAppConfig))
	}catch(e){
		console.log(e)
		var appConfig = {}
	}

	var configPath = path.join(hostPath, 'config.json')

	if(fs.existsSync(configPath)){
		var config = JSON.parse(fs.readFileSync(configPath, 'utf8')||'{}')

		for(var name in config){
			if(typeof config[name] == 'object'){
				appConfig[name] = objectAssign({}, appConfig[name], config[name])

			}else{
				appConfig[name] = config[name]
			}
		}

	}

	appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'
	appConfig.hostPath = hostPath

	return appConfig
}

