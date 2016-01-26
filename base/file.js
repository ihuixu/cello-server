var path = require('path')
var fs = require('fs')

exports.getSource = function(filePath){
	if(!path.extname(filePath))
		filePath += '.js'

	if(fs.existsSync(filePath)){
		return fs.readFileSync(filePath, 'utf8') 

	}else{
		return ''
	}

} 

exports.getJSContent = function(modPath, modSource){
	var jsfile = ''
	if(modSource){
		jsfile = 'define("' + modPath + '",function(require, exports){\n' + modSource + '\n});\n'

	}else{
		jsfile = 'console.log("' + modPath + ' is lost!");\n'

	}
	return jsfile
}

