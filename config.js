var path = require('path')

var etc = require('./config/etc.json')
var virtualHost = require('./config/virtual_host.json')
var cpath = require ('./config/path.json')

cpath.root = path.join(__dirname , cpath.root)

exports.etc = etc
exports.path = cpath 
exports.virtualHost = virtualHost


