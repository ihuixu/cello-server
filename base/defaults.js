var fs = require('fs')
var path = require('path')

var modulesPath = path.join(__dirname, '../node_modules/')
if(!fs.existsSync(modulesPath)){
	modulesPath = path.join(__dirname, '../../')
}


exports.singleJS = {
	'loader' : fs.readFileSync(path.join(__dirname, '../lib/loader.js'), 'utf8')
	, 'loadStyle' : fs.readFileSync(path.join(__dirname, '../lib/loadStyle.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(modulesPath, 'vue/dist/vue.min.js'), 'utf8')
	, 'vue-touch' : fs.readFileSync(path.join(modulesPath, 'vue-touch/vue-touch.js'), 'utf8')
	, 'vue-resource' : fs.readFileSync(path.join(modulesPath, 'vue-resource/dist/vue-resource.min.js'), 'utf8')
	, 'hammer' : fs.readFileSync(path.join(modulesPath, 'hammerjs/hammer.min.js'), 'utf8')
}

exports.defaultJS = {
}
exports.defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, '../lib/less/cssresetwww.less'), 'utf8')
	, 'cssresetm': fs.readFileSync(path.join(__dirname, '../lib/less/cssresetm.less'), 'utf8')
}

