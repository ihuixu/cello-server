var getCSS = require('./getCSS')
var path = require('path')

module.exports = function(config, mainPath){
	var mainPathArray = mainPath.split(path.sep)
	var mainSource = ''
	var modPath = mainPath 

	if(config.corePath && mainPathArray[0] == 'core'){
		mainPathArray.splice(0,1)
		modPath = mainPathArray.join(path.sep)
	}


	var mainSource = '@import "'+ modPath +'.less";'

	return getCSS(config, mainSource)
} 

