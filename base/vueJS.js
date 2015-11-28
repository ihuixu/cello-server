var path = require('path')
var fs = require('fs')
var file = require('./file')

var tags = ['style', 'template', 'script']

var filePath = '/Users/xuhui/xiaoyemian/static/components/a.vue'
var mainSource = file.getSource(filePath)

getBlock(mainSource)

function getBlock(mainSource){
	var code = {}
	var blockReg = new RegExp('<(' + tags.join('|') + ')(.*?)>((\n|.)*?)<\/(' + tags.join('|') + ')>', 'ig')
	var tagReg = new RegExp('<(' + tags.join('|') + ')(.*?)>', 'i')
	var contentReg = new RegExp('<(\/?)('+ tags.join('|') + ')(.*?)>', 'ig')

	var blocks = mainSource.match(blockReg)
	blocks.map(function(block){
		var tagArray = block.match(tagReg)
		var name = tagArray[1]
		var opts = tagArray[2].split(' ')

		opts.map(function(attr){
			if(!attr) return;

			console.log(attr)
		})

		console.log(name, opts)


		

		!code[name] && (code[name]=[]);
		code[name].push({
			'content':block.replace(contentReg, '')
		})

	})

	console.log(code)
}


module.exports = function(srcPath, mainPath){
	var filePath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(filePath)


	return {'code': getBlock(mainSource)}

} 


