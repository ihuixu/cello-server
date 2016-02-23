var fs = require('fs')
var path = require('path')

exports.singleJS = {
	'loader' : fs.readFileSync(path.join(__dirname, '../lib/loader.js'), 'utf8')
	, 'loadStyle' : fs.readFileSync(path.join(__dirname, '../lib/loadStyle.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(__dirname, '../lib/src/vue.js'), 'utf8')
	, 'vue-touch' : fs.readFileSync(path.join(__dirname, '../lib/src/vue-touch.js'), 'utf8')
}

exports.defaultJS = {
}
exports.defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, '../lib/less/cssresetwww.less'), 'utf8')
	, 'cssresetm': fs.readFileSync(path.join(__dirname, '../lib/less/cssresetm.less'), 'utf8')
}

