var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign');
var file = require('../base/file')
var util = require('util')
var Promise = require('bluebird')
var getDepends = require('../base/getDepends')

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

module.exports = function(globalConfig, opts){
	opts = opts || {}
	globalConfig = objectAssign({}, defaultConfig, globalConfig||{})

	var fns = []
	for(var hostname in globalConfig.hosts){
		fns.push(setConfig(hostname))
	}

	return new Promise(function(resolve, reject){
		new Promise.all(fns).then(function(res){
			res.map(function(v){
				globalConfig.apps[v.hostname] = v.config

				file.mkFile(path.join(v.hostPath, 'config.json'), JSON.stringify(v.config, null, 4))

			})

			resolve(globalConfig)
		})
	})

	function setConfig(hostname){
		return new Promise(function(resolve, reject){ 
			var hostPath = path.join(globalConfig.appPath, globalConfig.hosts[hostname])
			if(!fs.existsSync(hostPath)){
				file.mkDir(hostPath)
			}
			if(/^\//ig.test(hostname)){
				hostname = '127.0.0.1:' + globalConfig.onPort + hostname
			}

			var config = getConfig(hostname, hostPath, 'apps')

			config.JCSTATIC_BASE = 'http://' + hostname + '/'
			config.hostPath = hostPath

			config.isDebug = !!opts.isDebug

			if(typeof config.version == "undefined" || opts.update){
				config.version = Date.parse(new Date)/1000
			}

			mustMake.map(function(name){
				var pathPath = path.join(hostPath, config.path[name])
				if(!fs.existsSync(pathPath)){
					file.mkDir(pathPath)
				}
			})

			var dependsConfig = getConfig(hostname, hostPath, 'depends')
			var fns = [], list = []
			for(var key in dependsConfig){
				list.push(key)
				fns.push(getDepends(config, dependsConfig[key], true))
			}

			new Promise.all(fns).then(function(res){
				config.depends = {}

				var depends = []

				for(var key in list){
					res[key].depends.map(function(v){
						if(depends.indexOf(v) == -1)
							depends.push(v)
					})
				}

				config.depends.global = depends.join('+')

				resolve({hostname:hostname, hostPath:hostPath, config:config})
			})
		})
	}
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
      console.log('error set config', err)
    }

		for(var name in config){
			if(util.isArray(config[name])){
				if(!newConfig[name])
					newConfig[name] = []

				config[name].map(function(v){
					newConfig[name].push(v)
				})

			}else if(typeof config[name] == "object"){
				newConfig[name] = objectAssign({}, newConfig[name], config[name])

			}else{
				newConfig[name] = config[name]
			}
		}
  }

  return newConfig
}


