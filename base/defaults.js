var fs = require('fs')
var path = require('path')

var modulesPath = path.join(__dirname, '../node_modules/')
if(!fs.existsSync(modulesPath)){
	modulesPath = path.join(__dirname, '../../')
}


exports.singleJS = {
	'loader' : fs.readFileSync(path.join(__dirname, '../lib/loader.js'), 'utf8')
}

exports.defaultJS = {
	'loadStyle' : fs.readFileSync(path.join(__dirname, '../lib/loadStyle.js'), 'utf8')
}
exports.defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, '../lib/less/cssresetwww.less'), 'utf8')
	, 'cssresetm': fs.readFileSync(path.join(__dirname, '../lib/less/cssresetm.less'), 'utf8')
}

