var getConfig = require('./config')

module.exports = function(config){
	config = getConfig(config, {update:true}) 
}

