var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var component = require('./base/component')

var tagnames = ['style', 'template', 'script']
var method = {
	'style' : getStyle
}

function getStyle(content){
	var source = []
	source.push('var loadStyle = require("loadStyle");')
	source.push('loadStyle.addStyle("' + content + '");')

	return source.join('\n')
}

module.exports = function(config, hostPath, mainPath){
	var coms = component(config, hostPath, mainPath)

	return new Promise(function(resolve, reject) {
		var len = 0
		var code = []

		function done(){
			if(len) return;

			resolve(code);
		}

		for(var tagname in coms){
			len++
			(function(tagname){
				console.log(coms[tagname])
				
				Promise.all(coms[tagname]).then(function(res){
					len--
					var content = res.join('')
					var source = method[tagname]
							? method[tagname](content)
							: content

					code.push(source)

					done()

				})
			})(tagname)
		}

	})

} 


