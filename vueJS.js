var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var getComponent = require('./base/getComponent')

var tagnames = ['style', 'template', 'script']

module.exports = function(hostPath, mainPath, config, cbk){
	var coms = getComponent(hostPath, mainPath, config)

	var getComs = new Promise(function(resolve, reject) {
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
					var content = res.join('\n')
					console.log(tagname, content)	

					switch(tagname){
						case 'style' : 
							var style = 'var addStyle = require("addStyle");'
										+ 'addStyle(\"' + content + '\");'

							code.push(style)
							break;

						default:
							break;
					}

					done()

				})
			})(tagname)
		}

	})

	Promise.all(getComs).then(cbk)
} 


