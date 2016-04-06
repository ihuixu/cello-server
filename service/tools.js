var getConfig = require('./config')

exports.version = function(config){
	getConfig(config, {update:true}).then(function(config){
	//	console.log(config)
	})
}

