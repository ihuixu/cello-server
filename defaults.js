var fs = require('fs')
var path = require('path')

exports.defaultJS = {
	'loader' : fs.readFileSync(path.join(__dirname, './lib/src/loader.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(__dirname, './lib/src/vue.js'), 'utf8')
	, 'loadStyle' : fs.readFileSync(path.join(__dirname, './lib/components/loadStyle.js'), 'utf8')
}
exports.defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, './lib/less/cssresetwww.less'), 'utf8')
	,'cssresetm': fs.readFileSync(path.join(__dirname, './lib/less/cssresetm.less'), 'utf8')
}

