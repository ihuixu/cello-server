var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var component = require('./base/component')

var tagnames = ['style', 'template', 'script']

module.exports = function(config, hostPath, mainPath){
	return new Promise(function(resolve, reject) {
		var components = component(config, hostPath, mainPath)
		var coms = components.coms
		var name = components.name

		var len = 0
		var source = {}
		var code = []

		function done(){
			if(len) return;

			code.push('var loadStyleLib = require("loadStyle");')
			code.push('loadStyleLib('+JSON.stringify(source['style'].join(''))+');')

			code.push('var template = ' + JSON.stringify('<div class="' + name + '">' + source['template'].join('') + '</div>'))
			code.push('var opts = (function(){' + source['script'] + '})();')
			code.push('var components = Vue.extend(opts);')
			code.push('Vue.component("'+ name +'", components)')
			code.push('return components')

			resolve(code.join('\n'));
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


