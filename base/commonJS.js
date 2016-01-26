var path = require('path')
var fs = require('fs')
var vueJS = require('./vueJS')
var Promise = require('bluebird')
var file = require('./file')

var defaultJS = {
	'loadStyle' : fs.readFileSync(path.join(__dirname, '../lib/loadStyle.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(__dirname, '../lib/vue.js'), 'utf8')
}

module.exports = function(config, hostPath, mainPath, exclude){
	var excludes = (exclude||'').split(',')
	var srcPath = path.join(hostPath, config.path.src)
	var mainFilepath = path.join(srcPath, mainPath)
	var mainSource = file.getSource(mainFilepath)

	return new Promise(function(resolve, reject) {
		var reg = /\brequire\(["']([^,;\n]*)["']\)/ig
		var depends = []
		var code = []
		var len = 0

		getDepends(mainPath, mainSource)	

		function done(){
			if(len) return;

			depends.push(mainPath)
			code.push(file.getContent(mainPath, mainSource))
			resolve(code.join('\n'));
		}

		function getDepends(modPath, modSource){
			var requires = modSource.match(reg) || []
			len += requires.length
			done()

			requires.map(function(line){
				try {
					var evaFn = new Function('require' , line)
					evaFn(require)

				}catch(err){
					console.log(err, line)
				}

			})

			function require(modName){
				if (modName === modPath){
					console.log('Error File "' + modPath + '" 调用自身.');
					len--;
					done()
					return;
				}

				if (modName && depends.indexOf(modName) == -1 && excludes.indexOf(modName) == -1 && modName != mainPath){
					depends.push(modName)

					switch(path.extname(modName)){
						case '.vue':
							vueJS(config, hostPath, modName).then(function(source){
								code.push(file.getContent(modName, source))
								getDepends(modName, source)

								len--;
								done()
							})
							break;

						default:
							var source = defaultJS[modName]
												? defaultJS[modName]
												: file.getSource(path.join(srcPath, modName))

							code.push(file.getContent(modName, source))
							getDepends(modName, source)

							len--;
							done()
							break;
					}

				}else{
					len--;
					done()
				}
			}
		}
	})
} 

