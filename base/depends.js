var path = require('path')
var fs = require('fs')

module.exports = depends

function depends(srcPath, mainPath){

	var depends = []
		, finaljs = []

	return getDepends(mainPath)	

	function getDepends(modPath){
		var source = getSource(modPath)
		var jsLine = source.split('\n')
		var reg = /\brequire\b/

		function require(modName){
			if (modName === modPath){
				grunt.log.errorlns('Error File "' + modPath + '" 调用自身.');
				return;
			}

			if (modName && depends.indexOf(modName) == -1){
				depends.push(modName)
				finaljs.push(getContent(modName, source))
				getDepends(modName)
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

		return {depends:depends,code:finaljs.join('\n')}
	}

	function getSource(modPath){
		if(!path.extname(modPath))
			modPath += '.js'

		var filepath = path.join(srcPath, modPath)

		if(!fs.existsSync(filepath))
			return ''

		return fs.readFileSync(filepath, 'utf8')
	}

	function getContent(modPath, source){
		switch(path.extname(modPath)){
			case '.vue' : 
				return source 
				break;

			default : 
				var jsfile = [
					'define("' + modPath + '",function(require, exports){'
					, source 
					, '});'
				]
				return jsfile.join('\n')
				break;
		}
	}


} 
