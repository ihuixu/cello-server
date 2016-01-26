var server = require('cello-server')
var etc = require('./config/etc.json')
var virtualHost = require('./config/virtual_host.json')


server.start({etc:etc, virtualHost:virtualHost})

