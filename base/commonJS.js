var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getDepends = require('./getDepends')
var getCode = require('./getCode')

module.exports = function(config, mainPath){
	return new Promise(function(resolve, reject) {
		getDepends(config, mainPath).then(function(depends){
			getCode(config, depends).then(function(source){
				source = source.join('\n')
				resolve(source);
			})
		})
	})
} 
