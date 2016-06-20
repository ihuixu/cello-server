var path = require('path')

module.exports = function(urlpath, extname){
	var names = urlpath.split('?')

	if(extname)
		return path.join(path.dirname(names[0], extname),  path.basename(names[0], extname))
	else
		return names[0]
}


