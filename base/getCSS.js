var path = require('path')
var Promise = require('bluebird')
var less = require('less')

module.exports = function(config, mainSource){
	var lessPath = path.join(config.hostPath, config.path.less)
	var corePath = path.join(config.corePath, 'less')

	var opts = {
		paths: [lessPath, corePath]
	}

	return new Promise(function(resolve, reject) {
		less.render(mainSource, opts, function(err, output){
			if(err){
				reject(err)

			}else{
				resolve(output.css)

			}
		})
	})
} 

