var fs = require('fs')
var path = require('path')
var util = require('util')
var objectAssign = require('object-assign');

var settings = {
	apps : {
		config : require('../config/apps.json')
		, path : 'config.json'
	}
	, depends : {
		config : require('../config/depends.json')
		, path : 'depends.json'
	}
}

exports.apps = function(hostname, hostPath){
	var config = getConfig(hostname, hostPath, 'apps')

	config.JCSTATIC_BASE = 'http://' + hostname + '/'
	config.hostPath = hostPath

	return config
} 

exports.depends = function(hostname, hostPath){
	var config = getConfig(hostname, hostPath, 'depends')
	return config
} 


function getConfig(hostname, hostPath, type){
	var setting = settings[type]

	try{
		var newConfig = JSON.parse(JSON.stringify(setting.config))
	}catch(e){
		console.log(e)
		var newConfig = {}
	}

	var configPath = path.join(hostPath, setting.path) 

	if(fs.existsSync(configPath)){
		var config = JSON.parse(fs.readFileSync(configPath, 'utf8')||'{}')

		for(var name in config){
			if(util.isObject(config[name]) && !util.isArray(config[name])){
				newConfig[name] = objectAssign({}, newConfig[name], config[name])

			}else{
				newConfig[name] = config[name]
			}
		}
	}

	return newConfig
}

