var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var component = require('./base/component')

var tagnames = ['style', 'template', 'script']

module.exports = function(config, hostPath, mainPath){
	var coms = component(config, hostPath, mainPath)

	return new Promise(function(resolve, reject) {
		var len = 0
		var source = {}
		var code = []

		function done(){
			if(len) return;

			code.push('var loadStyleLib=require("loadStyle");')
			code.push('loadStyleLib('+JSON.stringify(source['style'])+');')

			code.push(source['script'])

			resolve(code);
		}

		for(var tagname in coms){
			len++
			;(function(tagname){
				Promise.all(coms[tagname]).then(function(res){
					len--
					source[tagname] = res

					done()
				})
			})(tagname)
		}

	})
} 


