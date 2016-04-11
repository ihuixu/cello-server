var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var file = require('./file')
var less = require('less')

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

	return new Promise(function(resolve, reject) {
		less.render(mainSource, {
			paths:lessPath ? [lessPath] : []
			, compress:true

		}, function(error, output){
			if(error){
//				reject(error);
				resolve(error);

			}else{

				resolve(output.css);
			}
		})
	})
} 

