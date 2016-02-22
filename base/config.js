var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('./file')

var defaultConfig = require('../config/server.json')
var defaultAppConfig = require('../config/apps.json')
var mustMake = ['src', 'less', 'components']

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

		setConfig(hostname, hostPath)

	}

	function setConfig(hostname, hostPath){

		try{
			var appConfig = JSON.parse(JSON.stringify(defaultAppConfig))
		}catch(e){
			console.log(e)
			var appConfig = {}
		}

		var configPath = path.join(hostPath, 'config.json')

		if(fs.existsSync(configPath)){
			configs = JSON.parse(fs.readFileSync(configPath, 'utf8')||'{}')

			for(var name in configs){
				if(typeof configs[name] == 'object'){
					appConfig[name] = objectAssign({}, appConfig[name], opts[name] || configs[name])

				}else if(name == 'version'){

					if(configs[name]){
						appConfig[name] = configs[name]+1
					}

				}else{
					if(typeof opts[name] !== undefined){
						appConfig[name] = opts[name]

					}else{ 
						appConfig[name] = configs[name]
					}
				}
			}

		}


		appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'
		appConfig.hostPath = hostPath

		console.log(appConfig)

		file.mkFile(configPath, JSON.stringify(appConfig, null, 4))

		config.apps[hostname] = appConfig


		mustMake.map(function(name){
			var pathPath = path.join(hostPath, appConfig.path[name])
			if(!fs.existsSync(pathPath)){
				file.mkDir(pathPath)
			}
		})
	}

	return config
}

