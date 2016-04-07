var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')
var getDepends = require('./getDepends')
var getCode = require('./getCode')

module.exports = function(config, mainPath, fouce){
	return new Promise(function(resolve, reject) {
		getDepends(config, mainPath, fouce).then(function(res){
			console.log(res)
			getCode(config, res.depends).then(function(source){
				source = source.join('\n')
				resolve(source);
			})
		})
	})
} 
