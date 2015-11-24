var path = require('path')
var fs = require('fs')

var loader = fs.readFileSync('./lib/loader.js', 'utf8')  

function readPath(filepath){
	var files = fs.readdirSync(filepath)
	for(var i in files){
		(function(i){
			var filename = files[i]
			var extname = path.extname(filename)
			if(extname == '.swp') return;

			console.log(filename)

		})(i);
	}
}




