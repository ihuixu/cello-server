var path = require('path')
var fs = require('fs')
var UglifyJS = require("uglify-js");
var depends = require('./depends')

var loader = fs.readFileSync('./lib/loader.js', 'utf8')  

module.exports = function(urlpath, hostPath){

	var config = {
		path:{
			"src":"./src/",
			"dist":"./dist/"
		}
	}

	if(fs.existsSync(hostPath)){
		
		var configPath = path.join(hostPath, 'config')
		var configs = {}

		if(fs.existsSync(configPath))
			configs = fs.readdirSync(configPath)

		for(var i in configs){
			(function(i){
			 var configname = configs[i]
			 var content = fs.readFileSync(path.join(configPath, configname), 'utf8')

			 config[configname.replace('.json', '')] = JSON.parse(content)

			 })(i);
		}

		var srcPath = path.join(hostPath, config.path.src)
		var jsfile = depends(srcPath, getName(urlpath)).code

		return UglifyJS.minify(jsfile, {fromString: true}).code

		function getName(urlpath){
			var reg = new RegExp('^(\/dist\/)|(\.js)$', 'g')
			return urlpath.replace(reg, '')
		}

	}

	return ''
}
