var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('../base/file')
var util = require('util')

var defaultConfig = require('../config/server.json')
var mustMake = ['src', 'less', 'components']

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

module.exports = function(config, opts){
	opts = opts || {}
	config = objectAssign({}, defaultConfig, config||{})

	for(var hostname in config.hosts){
		var hostPath = path.join(config.appPath, config.hosts[hostname])
		var configPath = path.join(hostPath, 'config.json')

		if(!fs.existsSync(hostPath)){
			file.mkDir(hostPath)
		}

		if(/^\//ig.test(hostname)){
			hostname = '127.0.0.1:' + config.onPort + hostname
		}

		var appConfig = getConfig(hostname, hostPath, 'apps')

		appConfig.JCSTATIC_BASE = 'http://' + hostname + '/'
		appConfig.hostPath = hostPath
		appConfig.isDebug = !!opts.isDebug

		if(typeof appConfig.version == "undefined" || opts.update){
			appConfig.version = Date.parse(new Date)/1000 
		}

		var depends = getConfig(hostname, hostPath, 'depends')
		depends.global.splice(0,0,'loader')
		for(var key in depends){
			depends[key] = depends[key].join('+')
		}
		console.log(depends)


		appConfig.depends = depends

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
