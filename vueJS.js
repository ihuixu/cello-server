var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var component = require('./base/component')

var tagnames = ['style', 'template', 'script']

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
				
				Promise.all(coms[tagname]).then(function(res){
					len--
					var content = res.join('')

					switch(tagname){
						case 'style' : 
							var style = []
							style.push('var loadStyle = require("loadStyle");')
							style.push('loadStyle.addStyle("' + content + '");')

							code.push(style.join('\n'))
							break;

						default:
							break;
					}

					done()

				})
			})(tagname)
		}

	})

} 


