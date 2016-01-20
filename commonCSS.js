var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var file = require('./base/file')
var less = require('less')

module.exports = function(config, hostPath, mainPath){
	var lessPath = path.join(hostPath, config.path.less)
	var mainFilepath = path.join(lessPath, mainPath+'.less')
	var mainSource = file.getSource(mainFilepath)

	return new Promise(function(resolve, reject) {
		less.render(mainSource, {
			paths:lessPath ? [lessPath] : []
			, compress:true

		}, function(error, output){
			if(error){
				reject(error);

			}else{

				resolve(output.css);
			}
		})
	})
} 

