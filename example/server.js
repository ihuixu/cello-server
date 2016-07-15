var server = require('cello-server')
var config = require('./config.json')
var fs = require('fs')

server.start(config)

fs.createWriteStream("cmd/pids", {
	flags: "a",
	encoding: "utf-8",
	mode: 0666
}).write(process.pid + "\n");

