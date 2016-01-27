var http = require('http')
var fs = require('fs')
var path = require('path')
var UglifyJS = require("uglify-js");
var commonJS = require('../base/commonJS')
var commonCSS = require('../base/commonCSS')
var vueJS = require('../base/vueJS')
var getConfig = require('./config')

var defaultJS = {
	'loader' : fs.readFileSync(path.join(__dirname, '../lib/loader.js'), 'utf8')
	, 'vue' : fs.readFileSync(path.join(__dirname, '../lib/vue.js'), 'utf8')
}
var defaultCSS = {
	'cssresetwww': fs.readFileSync(path.join(__dirname, '../lib/cssresetwww.less'), 'utf8')
	,'cssresetm': fs.readFileSync(path.join(__dirname, '../lib/cssresetm.less'), 'utf8')
}

function getName(urlpath){
	var reg = new RegExp('^(\/(dist|css)\/)|(\.(js|css))$', 'g')
	return urlpath.replace(reg, '')
}

function compile(hostname){
}

