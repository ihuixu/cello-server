var less = require("less")
var Promise = require("bluebird")

module.exports = function(block, name, lessPath){
	return new Promise(function(resolve, reject) {
		var content = block.scoped 
				? '.'+ name+'{' + block.content + '}'
				: block.content

		less.render(content, {
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
