var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var component = require('./base/component')

var tagnames = ['style', 'template', 'script']
var method = {
	'style' : getStyle
	, 'template' : getTemplate
}

function getStyle(res){
	console.log(res)
	var source = []
	source.push('var loadStyle = require("loadStyle");')
	source.push('var styles = ' + JSON.stringify(res) + ';')
	source.push('exports.loadStyle = function(id){loadStyle(styles, id);}')

	return source.join('\n')
}
function getTemplate(res){
	var source = []
//	source.push(res)

	return source.join('')
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
				//console.log(coms[tagname])
				
				Promise.all(coms[tagname]).then(function(res){
					len--
					var source = method[tagname]
							? method[tagname](res)
							: res 

					code.push(source)

					done()

				})
			})(tagname)
		}

	})

} 


