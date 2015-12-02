var path = require('path')
var fs = require('fs')
var file = require('./base/file')

module.exports = function(srcPath, mainPath){
	var mainFilepath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(mainFilepath)
	var depends = []
	var code = []
	getDepends(mainPath, mainSource)	

	depends.push(mainPath)
	code.push(file.getContent(mainPath, mainSource))

	function getDepends(modPath, modSource){
		var jsLine = modSource.split('\n')
		var reg = /\brequire\b/

		function require(modName){
			console.log(modName)
			if (modName === modPath){
				console.log('Error File "' + modPath + '" 调用自身.');
				return;
			}

			if (modName && depends.indexOf(modName) == -1){
				depends.push(modName)
				var filepath = path.join(srcPath, modName)
				var source = file.getSource(filepath)
				code.push(file.getContent(modName, source))
				getDepends(modName, source)
			}
		}

		jsLine.forEach(function(line){
			if (!reg.test(line))
				return

			line = line.replace(/,/g , ';')

			try {
				console.log(line)
				var evaFn = new Function('require' , line)
				evaFn(require)

			}catch(err){
				console.log(err, line)
			}

		})
	}

	return {'depends':depends ,'code':code.join('\n')}
} 
