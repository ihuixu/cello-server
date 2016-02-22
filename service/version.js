var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('../base/file')

var defaultAppConfig = require('./config/apps.json')

module.exports = function(hostname, hostPath, opts){
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
				appConfig[name] = objectAssign({}, appConfig[name], opts[name] || config[name])

			}else if(name != 'version'){

				if(typeof opts[name] !== undefined){
					appConfig[name] = opts[name]

				}else{ 
					appConfig[name] = config[name]
				}

			}
		}

	}

	appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'
	appConfig.hostPath = hostPath

	file.mkFile(configPath, JSON.stringify(appConfig, null, 4))

	return appConfig
}

