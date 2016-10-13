var path = require('path')
var fs = require('fs')
var objectAssign = require('object-assign')
var file = require('./file')

var tagnames = ['style', 'template', 'script']

module.exports = function(config, mainPath){
	var mainPathArray = mainPath.split(path.sep)
	var mainSource = ''
	var modPath = ''

	if(config.corePath && mainPathArray[0] == 'core'){
		mainPathArray.splice(0,1)
		var modPath = path.join(config.corePath, 'components', mainPathArray.join(path.sep))
		
	}else{
		var modPath = path.join(config.hostPath, config.path.components, mainPath)
	}

	mainSource = file.getSource(modPath)

	var name = getName(mainPath)
	var tags = getTags(mainSource) 

	var components = {}

	for(var tagname in tags){
		components[tagname] = []
		tags[tagname].map(function(block){
			components[tagname].push(block)
		})
	}
	
	return {'components':components,'name':name}
}

function getName(mainPath){
	var reg = new RegExp('(\.vue)$', 'g')
	return 'comp-' + mainPath.replace(reg, '').split(path.sep).join('-')
}


function getTags(mainSource){
	var tags = {}
	var blockRegArray = [] 

	tagnames.map(function(name){
		tags[name] = []
		blockRegArray.push('<(\\b' + name + '\\b) ?(.*)>((\\n|.)*?)<\\/\\b' + name + '\\b>')
	})
	var blockRegStr = blockRegArray.join('|')

	var attrRegStr = '(\\S+)=("[^"]*"|\'[^\']*\'|(\\S+))?|(\\S+)'

	var blocks = mainSource.match(new RegExp(blockRegStr, 'ig')) 

	blocks && blocks.map(function(block){
		var blockArray = block.match(new RegExp(blockRegStr, 'i'))
		var type = (blockArray[1] ? 0 : (blockArray[5] ? 1 : (blockArray[9] ? 2 : -1))) *4

		var name = blockArray[1+type]
		var attrs = blockArray[2+type].match(new RegExp(attrRegStr, 'ig'))
		var content = blockArray[3+type]
		var source = { 'content' : content }	

		attrs && attrs.map(function(attr){
			if((/=(?!")/i).test(attr))
				return;

			var opts = new Function('var opts={};opts.' + (/=/.test(attr) ? attr : attr+'=true') + ';return opts;')()
			source = objectAssign({}, source, opts)
		})

		tags[name].push(source)
	})

	return tags
}

