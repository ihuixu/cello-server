var path = require('path')
var fs = require('fs')

exports.getSource = function(filePath){
	var filePaths = filePath.split('?')
	filePath = filePaths[0]

	if(!path.extname(filePath))
		filePath += '.js'

	if(fs.existsSync(filePath)){
		return fs.readFileSync(filePath, 'utf8') 

	}else{
		return ''
	}

} 

exports.getJSContent = function(modPath, modSource){
	var jsfile = 'define("' + modPath + '",function(require, exports){\n' + (modSource||'') + '\n});\n'
	return jsfile
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
  var file = ''
	if(fs.existsSync(filePath)){
		file = fs.readFileSync(filePath, 'utf-8')
	}
  return file
}

function readDir(dirName){
  var files = fs.readdirSync(dirName)
  return files
}

exports.mkFile = mkFile
exports.mkDir = mkDir
exports.readFile = readFile
exports.readDir = readDir
