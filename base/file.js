var path = require('path')
var fs = require('fs')

exports.getSource = function(filePath){
	if(!path.extname(filePath))
		filePath += '.js'

	if(!fs.existsSync(filePath))
		return ''

//	console.log('----', filePath)
	var source = fs.readFileSync(filePath, 'utf8')
//	console.log('===', source)

	return source
} 

exports.getContent = function(modPath, modSource){
		switch(path.extname(modPath)){
/*
			case '.vue' : 
				return modSource 
				break;
*/

			default : 
				var jsfile = [
					'define("' + modPath + '",function(require, exports){'
					, modSource 
					, '});'
				]
				return jsfile.join('\n')
				break;
		}
	}

