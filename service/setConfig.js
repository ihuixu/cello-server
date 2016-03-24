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
	for(var key in config){
		config[key] = config[key].join('+')
	}

	return config
} 


function getConfig(hostname, hostPath, type){
	var setting = settings[type]
	var configPath = path.join(hostPath, setting.path) 
	var newConfig = {}
	var config = {}

	try{
		newConfig = JSON.parse(JSON.stringify(setting.config))
	}catch(e){
		console.log(e)
	}

	if(fs.existsSync(configPath)){
		try{
			config = JSON.parse(fs.readFileSync(configPath, 'utf8') || '{}')
		}catch(err){
			console.log('error setConfig', err)
		}

		setConfig(newConfig, config)
	}

	return newConfig
}

function setConfig(newConfig, config){
	for(var name in config){
		if(typeof config[name] == "object" && !util.isArray(config[name])){
			newConfig[name] = objectAssign({}, newConfig[name], config[name])

		}else{
			newConfig[name] = config[name]
		}
	}
}

