var path = require('path')

var cpath = require ('./config/path.json')
cpath.root = path.join(__dirname , cpath.root)
exports.path = cpath 

exports.etc = require('./config/etc.json')
exports.virtualHost = require('./config/virtual_host.json')

