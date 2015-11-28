var path = require('path')
var fs = require('fs')
var file = require('./file')
var objectAssign = require('object-assign');

var tags = ['style', 'template', 'script']

var filePath = '/Users/xuhui/xiaoyemian/static/components/a.vue'
var mainSource = file.getSource(filePath)
getBlock(mainSource)


function getBlock(mainSource){
	var code = {}
	tags.map(function(tagname){
		code[tagname] = []
	})

	var blockReg = new RegExp('<(' + tags.join('|') + ')(.*?)>((\\n|.)*?)<\\/(' + tags.join('|') + ')>', 'ig')
	var tagReg = new RegExp('<(' + tags.join('|') + ')(.*?)>', 'i')
	var contentReg = new RegExp('<(\\/?)('+ tags.join('|') + ')(.*?)>', 'ig')
	var attrsReg = new RegExp('(\\S+)=("[^"]*"|\'[^\']*\'|(\\S+))?|(\\S+)', 'ig')

	var blocks = mainSource.match(blockReg) 

	blocks && blocks.map(function(block){
		var source = {}	
		var tagArray = block.match(tagReg)
		var tagname = tagArray[1]
		var attrs = tagArray[2].match(attrsReg)

		attrs && attrs.map(function(attr){
			var obj = new Function('var obj={};obj.' + (/=/.test(attr) ? attr : attr+'=true') + ';return obj;')()
			source = objectAssign(obj, source)
			
		})

		source.content = block.replace(contentReg, '')
		
		code[tagname].push(source)

	})

	//console.log(code)
	return code;
}


module.exports = function(srcPath, mainPath){
	var filePath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(filePath)

	return {'code': getBlock(mainSource)}
} 


