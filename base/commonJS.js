var path = require('path')
var Promise = require('bluebird')
var file = require('./file')
var getDepends = require('./getDepends')
var getJS = require('./getJS')

module.exports = function(config, mainPath, fouce){
	return new Promise(function(resolve, reject) {
		getDepends(config, mainPath, fouce).then(function(res){
			getJS(config, res.depends).then(function(source){
				source = source.join('\n;\n')
				resolve(source);

			}, function(err){
				reject(err)
			})
		}, function(err){
			reject(err)
		})
	})
} 
