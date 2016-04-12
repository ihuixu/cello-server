var path = require('path')
var Promise = require('bluebird')
var file = require('./file')
var getDepends = require('./getDepends')
var getCode = require('./getCode')

module.exports = function(config, mainPath, fouce){
	return new Promise(function(resolve, reject) {
		getDepends(config, mainPath, fouce).then(function(res){
			getCode(config, res.depends).then(function(source){
				source = source.join('\n;\n')
				resolve(source);
			})
		})
	})
} 
