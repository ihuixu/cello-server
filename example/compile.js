var server = require('cello-server')
var config = require('./config.json')

server.compile(config).then(function(res){
  console.log('COMPILE DONE.')
})


