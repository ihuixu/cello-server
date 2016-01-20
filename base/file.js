var path = require('path')
var fs = require('fs')

exports.getSource = function(filePath){
	if(!path.extname(filePath))
		filePath += '.js'

	if(!fs.existsSync(filePath))
		return ''

	return fs.readFileSync(filePath, 'utf8') 
} 

exports.getContent = function(modPath, modSource){
	switch(path.extname(modPath)){
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

