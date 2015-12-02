var path = require('path')
var fs = require('fs')

exports.getSource = function(filePath){
	if(!path.extname(filePath))
		filePath += '.js'

	if(!fs.existsSync(filePath))
		return ''

	var source = fs.readFileSync(filePath, 'utf8')

	return source
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

