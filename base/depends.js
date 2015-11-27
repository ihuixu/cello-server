var path = require('path')
var fs = require('fs')

module.exports = function(srcPath, mainPath){
	var mainSource = getSource(mainPath)
	var depends = []
		, code = []

	getDepends(mainPath, mainSource)	

	depends.push(mainPath)
	code.push(mainSource)

	return {'depends':depends ,'code':code.join('\n')}


	function getDepends(modPath, modSource){
		var jsLine = modSource.split('\n')
		var reg = /\brequire\b/

		function require(modName){
			if (modName === modPath){
				console.log('Error File "' + modPath + '" 调用自身.');
				return;
			}

			if (modName && depends.indexOf(modName) == -1){
				depends.push(modName)
				code.push(getContent(modName, modSource))
				getDepends(modName, getSource(modName))
			}
		}

		jsLine.forEach(function(line){
			if (!reg.test(line))
				return

			line = line.replace(/,/g , ';')

			try {
				var evaFn = new Function('require' , line)
				evaFn(require)

			}catch(err){
				console.log(err, line)
			}

		})
	}

	function getSource(modPath){
		if(!path.extname(modPath))
			modPath += '.js'

		var filepath = path.join(srcPath, modPath)

		if(!fs.existsSync(filepath))
			return ''

		return fs.readFileSync(filepath, 'utf8')
	}

	function getContent(modPath, modSource){
		switch(path.extname(modPath)){
			case '.vue' : 
				return modSource 
				break;

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

} 
