var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('./base/file')

var defaultConfig = require('./config.json')

var now = new Date()

var defaultAppConfig = {
	path:{
		src:"./src/"
		, dist:"./dist/"
		, less:"./less/"
		, css:"./css/"
		, components:"./components/"
	}
	, isDebug : true
	, depends : {global:[]}
	, version : [now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), 0].join('')-0
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
		var appConfig = JSON.parse(JSON.stringify(defaultAppConfig))

		if(fs.existsSync(configPath)){
			configs = JSON.parse(fs.readFileSync(configPath, 'utf8')||'{}')

			for(var name in configs){
				if(typeof configs[name] == 'object'){
					appConfig[name] = objectAssign({}, appConfig[name], configs[name])

				}else if(name == 'version'){

					if(configs[name]){
						appConfig[name] = configs[name]+1
					}

				}else{
					appConfig[name] = appConfig[name] || configs[name]

				}
			}
		}

		appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'

		file.mkFile(configPath, JSON.stringify(appConfig, null, 4))

		config[hostname] = appConfig
	}

	return config
}

