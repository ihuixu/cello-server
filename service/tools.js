var getConfig = require('./config')

exports.version = function(config){
	config = getConfig(config, {update:true}) 
}

exports.debug = function(config){
	config = getConfig(config, {isDebug:true, update:true}) 
}

