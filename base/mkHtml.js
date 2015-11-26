var path = require('path')
var fs = require('fs')
var ejs = require('ejs')
var config = require('../config')
var request = require('request');

function jsMod(urlpath){
	return '<script id="tag:' + urlpath + '" src="/tag/' + urlpath + '.js"></script>'
}

module.exports = function(urlpath, hostname){
	var modelName = config.virtualHost[hostname]
	var filepath = path.join(config.path.root, modelName, config.path.views, urlpath)
	var tpl = fs.readFileSync(filepath, 'utf8')  


	this.jsMod = jsMod

	return ejs.render(tpl)
}
