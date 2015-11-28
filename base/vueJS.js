var path = require('path')
var fs = require('fs')
var file = require('./file')
var objectAssign = require('object-assign');

var tags = ['style', 'template', 'script']

var blockRegStr = '<(\\b' + tags.join('|') + '\\b)(.*?)>((\\n|.)*?)<\\/\\b(' + tags.join('|') + ')\\b>'
var attrRegStr = '(\\S+)=("[^"]*"|\'[^\']*\'|(\\S+))?|(\\S+)'

var filePath = '/Users/xuhui/xiaoyemian/static/components/a.vue'
var mainSource = file.getSource(filePath)
getBlock(mainSource)


function getBlock(mainSource){
	var code = {}
	tags.map(function(tagname){
		code[tagname] = []
	})

	var blocks = mainSource.match(new RegExp(blockRegStr, 'ig')) 

	blocks && blocks.map(function(block){
		var blockArray = block.match(new RegExp(blockRegStr, 'i'))
		var tagname = blockArray[1]
		var attrs = blockArray[2].match(new RegExp(attrRegStr, 'ig'))
		var content = blockArray[3]
		var source = { 'content' : content }	

		attrs && attrs.map(function(attr){
			var opts = new Function('var opts={};opts.' + (/=/.test(attr) ? attr : attr+'=true') + ';return opts;')()
			source = objectAssign(opts, source)
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

