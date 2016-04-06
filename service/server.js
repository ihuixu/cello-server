var http = require('http')
var path = require('path')
var commonCSS = require('../base/commonCSS')
var commonJS = require('../base/commonJS')
var getConfig = require('./config')
var getName = require('../base/getName')
var file = require('../base/file')

var defaults = require('../base/defaults')
var defaultCSS = defaults.defaultCSS

module.exports = function(config){
	var outputed = {}
	getConfig(config, {isDebug:true, update:true}).then(function(config){
		http.createServer(onRequest).listen(config.onPort || 80)

		function onRequest(req, res){
			var hosturl = req.headers.host + req.url 
			var hostname = ''
			var requrl = ''

			for(var name in config.apps){
				var reg = new RegExp(name, 'ig')
				if(reg.test(hosturl)){
					hostname = name
					requrl = hosturl.replace(reg, '')
				}
			}

			if(!hostname){
				console.log('error', 'Not exist: config.hosts['+ hostname +']!')
				send(400, 'Not exist: config.hosts['+ hostname +']!')
				return; 
			}

			var fileArray = requrl.split('/')
			var fileOption = fileArray.splice(0,2).join('').split('~')
			var fileType = fileOption[0]
			var filePath = fileArray.join('/')

			switch(fileType){
				case 'src' : 
					var modName = getName(filePath, '.js')

					commonJS(config.apps[hostname], modName).then(function(source){
						send(200, source, 'js')					
					})

					break;

				case 'less' : 
					var modName = getName(filePath, '.css')

					if(defaultCSS[modName]){
						send(200, defaultCSS[modName], 'css')

					}else{
						commonCSS(config.apps[hostname], modName).then(function(source){
							send(200, source, 'css')
						})
					}
					break;

				default :
					send(200)
					break;
			}

			function send(state, content, filetype){
				var now = new Date
				var lastModified = outputed[hosturl] || (new Date).toUTCString()
				var expires = new Date(now.getFullYear() , now.getMonth() , now.getDate()+30)

				var contentType = 'text/plain'
				if ('css' == filetype) contentType = 'text/css'
				else if ('js' == filetype) contentType = 'application/javascript'

				res.writeHeader(state ,{
						"Content-Type" :  contentType +';charset=utf-8',
						"Last-Modified" : lastModified,
						"Expires" : expires.toUTCString()
				});

				outputed[hosturl] = lastModified

				res.write(content || '')
				res.end()
			}
		}

	})
}

