var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var commonJS = require('../base/commonJS')
var commonCSS = require('../base/commonCSS')
var vueJS = require('../base/vueJS')
var getConfig = require('../config')
var file = require('../base/file')

var defaults = require('../base/defaults')
var defaultJS = defaults.defaultJS
var defaultCSS = defaults.defaultCSS

function getName(urlpath){
	var reg = new RegExp('^(\/(dist|css)\/)|(\.(js|css))$', 'g')
	return urlpath.replace(reg, '')
}


module.exports = function(config){
	config = getConfig(config) 

	function compileJS(hostname){
		var srcPath = path.join(config.hosts[hostname], config[hostname].path.src)
		var distPath = path.join(config.hosts[hostname], config[hostname].path.dist)

		var jss = fs.readdirSync(srcPath)

		console.log(jss)
		for(var fileName in jss){

			if(defaultJS[modName]){
				var content = defaultJS[modName]
				file.mkFile(fileName, content)

			}else{
				commonJS(config[hostname], hostPath, modName)
					.then(function(source){
						var content = UglifyJS.minify(source, {fromString: true}).code
						file.mkFile(fileName, content)
					})
			}
		}
	}

	function compileCSS(hostname){
		var lessPath = path.join(config.hosts[hostname], config[hostname].path.less)
		var cssPath = path.join(config.hosts[hostname], config[hostname].path.css)

		var css = fs.readdirSync(lessPath)

		console.log(css)
	}

	for(var hostname in config.hosts){
		compileJS(hostname)
		//compileCSS(hostname)
	}

}

