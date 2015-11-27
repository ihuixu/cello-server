var path = require('path')
var fs = require('fs')
var file = require('./file')

var filePath = '/Users/xuhui/xiaoyemian/static/components/a.vue'
var mainSource = file.getSource(filePath)

getBlock(mainSource)

function getBlock(mainSource){
	var tags = ['style', 'template', 'script']
	var blocks = {}
	tags.map(function(v){
		blocks[v] = []
	})

	var blockReg = new RegExp('(\/?)('+ tags.join('|') + ')', 'i')
	var tagReg = new RegExp('<' + '(\/?)('+ tags.join('|') + ')' + '(.*?)>', 'ig')

	var jsLine = mainSource.split('\n')
	var state = ''
	var source = [] 

	jsLine.forEach(function(line){
		var tags = line.match(tagReg)
		if(tags){
			var content = line.replace(tagReg, '')
			tags.map(function(tag){
				var blockArray = tag.match(blockReg)
				var name = blockArray[2]
				state = blockArray[1] ? 'end' : 'start'

				if(state == 'start'){
					content && source.push(content)
				}

				if(state == 'end'){
					blocks[name].push({
						'source' : source.join('\n')
					})
					source = [] 
				}

			})

		}else{
			if(state == 'start'){
				source.push(line)
			}
		}
	})

	console.log(blocks)
}


module.exports = function(srcPath, mainPath){
	var filePath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(filePath)


	return {'source': getBlock(mainSource)}

} 


