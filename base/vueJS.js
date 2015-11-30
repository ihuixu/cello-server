var path = require('path')
var fs = require('fs')
var file = require('./file')
var objectAssign = require('object-assign');

var tags = ['style', 'template', 'script']
var blockRegArray = [] 
tags.map(function(tagname){
	blockRegArray.push('<(\\b' + tagname + '\\b)(.*?)>((\\n|.)*?)<\\/\\b(' + tagname + ')\\b>')
})
var blockRegStr = blockRegArray.join('|')
var attrRegStr = '(\\S+)=("[^"]*"|\'[^\']*\'|(\\S+))?|(\\S+)'


function getBlock(mainSource){
	var code = {}
	tags.map(function(tagname){
		code[tagname] = []
	})

	var blocks = mainSource.match(new RegExp(blockRegStr, 'ig')) 
	blocks && blocks.map(function(block){
		var blockArray = block.match(new RegExp(blockRegStr, 'i'))
		var type = blockArray[1] ? 0 : (blockArray[6] ? 1 : (blockArray[11] ? 2 : -1))

		var tagname = blockArray[1+type*5]
		var attrs = blockArray[2+type*5].match(new RegExp(attrRegStr, 'ig'))
		var content = blockArray[3+type*5]
		var source = { 'content' : content }	

		attrs && attrs.map(function(attr){
			if((/=(?!")/i).test(attr))
				return;

			var opts = new Function('var opts={};opts.' + (/=/.test(attr) ? attr : attr+'=true') + ';return opts;')()
			source = objectAssign(source, opts)
		})

		code[tagname].push(source)
	})
	console.log(code)

	return code;
}

module.exports = function(srcPath, mainPath){
	var filePath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(filePath)

	return {'code': getBlock(mainSource)}
} 

