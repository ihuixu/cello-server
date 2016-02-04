var fs = require('fs')
var path = require('path')

exports.defaultJS = {
	'loader' : fs.readFileSync(path.join(__dirname, '../lib/loader.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(__dirname, '../lib/vue.js'), 'utf8')
	, 'loadStyle' : fs.readFileSync(path.join(__dirname, '../lib/loadStyle.js'), 'utf8')
}
exports.defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, '../lib/cssresetwww.less'), 'utf8')
	,'cssresetm': fs.readFileSync(path.join(__dirname, '../lib/cssresetm.less'), 'utf8')
}

