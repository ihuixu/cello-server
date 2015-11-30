var path = require('path')
var fs = require('fs')
var less = require('less')
var objectAssign = require('object-assign')
var file = require('./base/file')
var Promise = require('bluebird')

var tagnames = ['style', 'template', 'script']
var defaultLang = {
  template: 'ejs',
  style: 'less',
  script: 'js'
}
















module.exports = function(hostPath, mainPath, config){
	var componentsPath = path.join(hostPath, config.path.components)
		, lessPath = path.join(hostPath, config.path.less)

	var filePath = path.join(componentsPath, mainPath)
	var mainSource = file.getSource(filePath)

	var name = getName(mainPath)
	var tags = getTags(mainSource) 

	var code = {}

	for(var tagname in tags){
		var blocks = tags[tagname]
		blocks.map(function(block){
			var lang = block.lang || defaultLang[tagname]
			var scoped = block.scoped || false
			var content = block.content
			var type = tagname

			switch(lang){
				case 'less' :
					less.render(content, {
						paths:[lessPath]
						, compress:true
					}, function(error, output){
						if(error){
						}

						var style = scoped
							? '['+ name+']{' + output.css + '}'
							: output.css

						console.log(333)
					})
				
					console.log(111)
					break;

				default:
					console.log(222)
					break;
			}

		})
	}

	console.log(code)

	return {'code':code}
} 

function addStyle(css){
	var style = document.createElement("style")
	style.type = 'text/css'

	if(style.styleSheet){
		style.styleSheet.cssText = css;

	}else{
		style.appendChild(document.createTextNode(css));
	}

	document.getElementsByTagName("head")[0].appendChild(style)
}

function getTags(mainSource){
	var tags = {}
	var blockRegArray = [] 

	tagnames.map(function(name){
		tags[name] = []
		blockRegArray.push('<(\\b' + name + '\\b)(.*?)>((\\n|.)*?)<\\/\\b(' + name + ')\\b>')
	})
	var blockRegStr = blockRegArray.join('|')
	var attrRegStr = '(\\S+)=("[^"]*"|\'[^\']*\'|(\\S+))?|(\\S+)'

	var blocks = mainSource.match(new RegExp(blockRegStr, 'ig')) 
	blocks && blocks.map(function(block){
		var blockArray = block.match(new RegExp(blockRegStr, 'i'))
		var type = (blockArray[1] ? 0 : (blockArray[6] ? 1 : (blockArray[11] ? 2 : -1))) *5

		

		var name = blockArray[1+type]
		var attrs = blockArray[2+type].match(new RegExp(attrRegStr, 'ig'))
		var content = blockArray[3+type]
		var source = { 'content' : content }	

		attrs && attrs.map(function(attr){
			if((/=(?!")/i).test(attr))
				return;

			var opts = new Function('var opts={};opts.' + (/=/.test(attr) ? attr : attr+'=true') + ';return opts;')()
			source = objectAssign(source, opts)
		})

		tags[name].push(source)
	})

	return tags
}

function getName(mainPath){
	return mainPath
}



