var cluster = require('cluster')

var config = require('./config.json')
var numCPUs = config.etc.cpuNums || require('os').cpus().length

cluster.setupMaster({
	exec: './server.js',
	args: [],
	silent: false
})

for (var i = numCPUs; i--;) {
	cluster.fork()
}

cluster.on('exit', function(worker) {
	var st = new Date

	st = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate() + ' ' + st.toLocaleTimeString()
	console.log('worker ' + worker.process.pid + ' died at:', st)
	cluster.fork()
})


var fs = require("fs")

fs.createWriteStream("cmd/pids", {
	flags: "a",
	encoding: "utf-8",
	mode: 0666
}).write(process.pid + "\n")
