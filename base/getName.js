var path = require('path')

module.exports = function(urlpath, extname){
	var names = urlpath.split('?')
	return path.join(path.dirname(names[0], extname),  path.basename(names[0], extname))
}


