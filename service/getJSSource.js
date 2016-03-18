var commonJS = require('../base/commonJS')
var file = require('../base/file')

var defaults = require('../base/defaults')
var defaultJS = defaults.defaultJS
var singleJS = defaults.singleJS
var defaultCSS = defaults.defaultCSS

module.exports = function(appConfig, modName, callback){

	var modNames = modName.split('+')
	var sources = []
	var len = modNames.length

	function done(){
		len--
		if(len) return;

		callback && callback(sources.join('\n'))
	}

	for(var i in modNames){
		var name = modNames[i]

		if(singleJS[name]){
			sources.push(singleJS[name])
			done()

		}else if(defaultJS[name]){
			sources.push(file.getJSContent(defaultJS[name]))
			done()

		}else{
			commonJS(appConfig, name)
				.then(function(source){
					sources.push(source)
					done()
				})
		}
	}
}

