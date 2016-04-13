var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var file = require('./file')
var getCSS = require('./getCSS')

module.exports = function(config, mainPath){
	var modNameArray = mainPath.split(path.sep)
	var lessPath = path.join(config.hostPath, config.path.less)
	var mainFilepath = path.join(lessPath, mainPath+'.less')

	if(config.corePath && modNameArray[0] == 'core'){
		modNameArray.splice(0,1)
		mainPath = modNameArray.join(path.sep)

		mainFilepath = path.join(config.corePath, 'less', mainPath+'.less')
	}

	var mainSource = file.getSource(mainFilepath)

	return getCSS(config, mainSource)
} 

