var server = require('cello-server')
var config = require('./compile.json')

server.compile(config).then(function(res){
	console.log('COMPILE DONE.')
}, function(err){
	console.log('COMPILE FAIL!')
})
