var path = require('path')
var fs = require('fs')
var objectAssign = require('object-assign');
var file = require('./base/file')
var component = require('./base/component')

var tagnames = ['style', 'template', 'script']
var defaultLang = {
  template: 'ejs',
  style: 'less',
  script: 'js'
}

module.exports = function(srcPath, mainPath){
	var filePath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(filePath)

	var name = getName(mainPath)
	var tags = getTags(mainSource) 

	var code

	for(var name in tags){
		var blocks = tags[name]
		blocks.map(function(block){
			var lang = block['lang'] || defaultLang[name]
			console.log(name, block)
			console.log(lang)


			switch(name){
				case 'style' :
					break;

				default:
					break;
			}

		})
	}

	return {'code':tags}
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
		var type = blockArray[1] ? 0 : (blockArray[6] ? 1 : (blockArray[11] ? 2 : -1))

		var name = blockArray[1+type*5]
		var attrs = blockArray[2+type*5].match(new RegExp(attrRegStr, 'ig'))
		var content = blockArray[3+type*5]
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



