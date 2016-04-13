var getCSS = require('./getCSS')

module.exports = function(config, mainPath){
	var mainSource = '@import "'+ mainPath +'.less";'

	return getCSS(config, mainSource)
} 

