var path = require('path')
var fs = require('fs')
var zlib = require('zlib')

exports.getSource = function(filePath){
	var filePaths = filePath.split('?')
	filePath = filePaths[0]

	if(!path.extname(filePath))
		filePath += '.js'

	return readFile(filePath)
} 

exports.getJSContent = function(modPath, modSource){
	var jsfile = 'define("' + modPath + '",function(require, exports){\n' + (modSource||'') + '\n});\n'
	return jsfile
}

function mkGzipFile(filePath, content){
/*
	try{
		content = zlib.gzipSync(content)
	}catch(err){
		console.log('error mkGzipFile', err)
	}
*/

	mkFile(filePath, content)
}

function mkFile(filePath, content){
  fs.createWriteStream(filePath, {
    flags: "w",
    encoding: "utf-8",
    mode: 0666
  }).write(content + "\n");

	console.log('updateFile', filePath)
}

function mkDir(dirName){
	fs.mkdirSync(dirName)
	console.log('mkdir', dirName)
}

function readFile(filePath){
	try{
		return fs.readFileSync(filePath, 'utf-8')

	}catch(e){
		console.log(e)
		return ''
	}

}

function readDir(filePath){
	try{
		return fs.readdirSync(filePath)

	}catch(e){
		console.log(e)
		return []
	}
}

exports.mkGzipFile = mkGzipFile
exports.mkFile = mkFile
exports.mkDir = mkDir
exports.readFile = readFile
exports.readDir = readDir

