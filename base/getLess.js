var less = require("less")
var Promise = require("bluebird")

module.exports = function(lessPath, content, scoped, name){
	return new Promise(function(resolve, reject) {

		less.render(content, {
			paths:lessPath ? [lessPath] : []
			, compress:true

		}, function(error, output){
			if(error){
				reject(error);

			}else{

				var style = scoped 
						? '['+ name+']{' + output.css + '}'
						: output.css

				resolve(style);
			}
		})

	})
}
