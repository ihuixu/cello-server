var fs = require("fs")
var path = require("path")
var less = require("less")
var Promise = require("bluebird")

var defaultLess = {
	'atom': fs.readFileSync('./lib/atom.less', 'utf8')
}

module.exports = function(block, name, lessPath){
	return new Promise(function(resolve, reject) {
		var content = []
		var atomLessPath = path.join(lessPath,'atom.less')

		if(fs.existsSync(atomLessPath)){
			content.push(fs.readFileSync(atomLessPath, 'utf8'))
		}else{
			content.push(defaultLess['atom'])
		}

		content.push(block.scoped 
				? '.'+ name+'{' + block.content + '}'
				: block.content)
		
		less.render(content.join('\n'), {
			paths:lessPath ? [lessPath] : []
			, compress:true

		}, function(error, output){
			if(error){
				reject(error);

			}else{

				resolve(output.css);
			}
		})

	})
}
