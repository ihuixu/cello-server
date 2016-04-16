var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var getComponent = require('./getComponent')
var getCSS = require('./getCSS')
var getName = require('../base/getName')

var tagnames = ['style', 'template', 'script']
var defaultLang = {
	style : 'less'
}
var defaultFn = {
	less : function(config, content){
		content = '@import "atom.less";\n' + content

		return new Promise(function(resolve, reject){
			getCSS(config, content).then(function(res){
				resolve({tagname:'style', content:res})

			}, function(err){
				reject(err)
			})
		})
	}
}

module.exports = function(config, mainPath){
	return new Promise(function(resolve, reject) {
		var comp = getComponent(config, mainPath)
		var components = comp.components
		var name = comp.name

		var source = {}
		var fns = []

		for(var tagname in components){
			source[tagname] = []
			components[tagname].map(function(v){
				v.lang = v.lang || defaultLang[tagname]

				if(v.lang && defaultFn[v.lang]){
					fns.push(defaultFn[v.lang](config, v.content))

				}else{
					var content = v.content
					source[tagname].push(content)
				}
			})
		}

		Promise.all(fns).then(function(res){
			res.map(function(v){
				source[v.tagname].push(v.content)
			})

			var style = JSON.stringify(source['style'].join(''))
			var template = JSON.stringify(source['template'].join(''))
			//var template = JSON.stringify('<div class="' + name + '">' + source['template'].join('') + '</div>')
			var script = source['script'].join('') || 'return {}'

			var code = 'require("loadStyle")("'+ name + '",' + style +');\n'
							+ 'var opts = (function(){' + script + '})();\n'
							+ 'opts.template = ' + template + ';\n'

			resolve({
				opts : code + '\nreturn opts;' 
//				, source : code + '\nreturn Vue.component("'+ name +'", function(resolve){$.getScript("http://127.0.0.1:6002/fex/glk/component/'+ getName(mainPath, '.vue') + '.js' +'", function(res){console.log(res)});resolve(opts);})' 
				, source : code + '\nreturn Vue.component("'+ name +'", opts)' 
			})

		}, function(err){
			reject(err)

		})

	})
} 


