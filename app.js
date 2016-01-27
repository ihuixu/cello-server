exports.start = require('./service/start')

exports.compile = function(config){
	config = getConfig(config) 
	console.log(config)

	for(var hostname in config.hosts){
		var srcPath = path.join(config.hosts[hostname], config[hostname].path.src)
		var distPath = path.join(config.hosts[hostname], config[hostname].path.dist)
		var lessPath = path.join(config.hosts[hostname], config[hostname].path.less)
		var cssPath = path.join(config.hosts[hostname], config[hostname].path.css)

		console.log(distPath)
	}

}


