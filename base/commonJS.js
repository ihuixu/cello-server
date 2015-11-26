var path = require('path')
var fs = require('fs')
var UglifyJS = require("uglify-js");
var config = require('../config')

var srcName = path.parse(config.path.src).name
var distName = path.parse(config.path.dist).name
var tagName = path.parse(config.path.tag).name

var loader = fs.readFileSync('./lib/loader.js', 'utf8')  

module.exports = function(urlpath, hostname){
	var modPath = getName(urlpath)
	var type = getType(urlpath)
	var modelName = config.virtualHost[hostname]

	switch(type){
		case srcName : 
			return getJS(modPath)
			break;

		case distName : 
//			return getCommonJS(modPath)

			var jsfile = getCommonJS(modPath)
			return UglifyJS.minify(jsfile, {fromString: true}).code
			break;

		case tagName : 
			return getTag(modPath)
			break;

		default : 
			return false;
			break;
	}

	function getSource(modPath){
		var filepath = path.join(config.path.root, modelName, config.path.src, modPath+'.js')
		if(!fs.existsSync(filepath))
			return 'console.log("' + modPath + '.js is lose!");'

		return fs.readFileSync(filepath, 'utf8')
	}

	function getJS(modPath){
		if(modPath == 'loader')
			return loader

		var jsfile = [
			'define("' + modPath + '",function(require, exports){'
			, getSource(modPath)
			, '});'
		]
		return jsfile.join('\n')
	}
	function getCommonJS(modPath){
		if(modPath == 'loader')
			return loader

		var fanaljs = []
		var depends = getDepends(modPath)
		depends.forEach(function(depend){
			fanaljs.push(getJS(depend))
		})
		fanaljs.push(getJS(modPath))

		return fanaljs.join('\n')
	}
	function getTag(modPath){
		var tags = createTag('loader', modPath)
		var depends = getDepends(modPath)
		depends.forEach(function(depend){
			tags += createTag(depend)
		})
		tags += createTag(modPath)
		var jsfile = 'document.write(\'' + tags + '\');' + 'var tag = document.getElementById("tag:' + modPath + '");'
//			+ 'tag.parentNode.removeChild(tag);'

		return UglifyJS.minify(jsfile, {fromString: true}).code
	}

	function getDepends(modPath, deps){
		var depends = deps || []
		var js = getSource(modPath)
		var jsLine = js.split('\n')
		var reg = /\brequire\b/

		function require(modName){
			if (modName === modPath){
				grunt.log.errorlns('Error File "' + modPath + '" 调用自身.');
				return;
			}

			if (modName && depends.indexOf(modName) == -1){
				depends.push(modName)
				getDepends(modName, depends)
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

		return depends
	}


	function getType(urlpath){
		return urlpath.split(path.sep)[1]
	}
	function getName(urlpath){
		var reg = new RegExp('^(\/' + getType(urlpath) + '\/)|(\.js)$', 'g')
		return urlpath.replace(reg, '')
	}

	function tagAttr(modName, main){
		if(!path.extname(modName))
			modName += '.js'
			
		var modPath = path.join(hostname, config.path.src, modName)
		var attr = {
			src : 'http://' + modPath 
		}
		main && (attr.main = main)
		return attr 
	}
	function createTag(modName, main){
		var attr = tagAttr(modName, main)
		var tag = '<script'
		tag += ' src="' + attr.src + '"'

		if(attr.main)
			tag += ' data-main="' + attr.main + '"'

		tag += '></script>'

		return tag 
	}



}
