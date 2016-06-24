var path = require('path')
var fs = require('fs')
var zlib = require('zlib')
var Promise = require('bluebird')


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
	return new Promise(function(resolve, reject) {
		fs.writeFile(filePath, content, "utf-8", function(){
			
			console.log('updateFile', filePath)
			resolve();

		})
	})
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

exports.getSource = function(filePath){
	var filePaths = filePath.split('?')
	filePath = filePaths[0]

	console.log(path.extname(filePath))

	if(path.extname(filePath) != '.js')
		filePath += '.js'

	return readFile(filePath)
} 

exports.getJSContent = function(modPath, modSource){
	if(path.extname(modPath) == '.map')
		return modSource||''

	var jsfile = 'define("' + modPath + '",function(require, exports){\n' + (modSource||'') + '\n});\n'
	return jsfile
}

