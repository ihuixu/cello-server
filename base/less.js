var less = require("less")
var Promise = require("bluebird")

module.exports = function(block, name, lessPath){
	return new Promise(function(resolve, reject) {

		less.render(block.content, {
			paths:lessPath ? [lessPath] : []
			, compress:true

		}, function(error, output){
			if(error){
				reject(error);

			}else{

				var res = {
					code : block.scoped 
						? '['+ name+']{' + output.css + '}'
						: output.css
				}
				block.id && (res.id = block.id);

				resolve(res);
			}
		})

	})
}
