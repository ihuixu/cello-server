var path = require('path')
var fs = require('fs')

exports.getSource = function(filePath){
	if(!path.extname(filePath))
		filePath += '.js'

	if(fs.existsSync(filePath)){
		return fs.readFileSync(filePath, 'utf8') 

	}else{
		return ''
	}

} 

exports.getJSContent = function(modPath, modSource){
	var jsfile = ''
	if(modSource){
		jsfile = 'define("' + modPath + '",function(require, exports){\n' + modSource + '\n});\n'

	}else{
		jsfile = 'console.log("' + modPath + ' is lost!");\n'

	}
	return jsfile
}

function mkFile(fileName, content){
  fs.createWriteStream(fileName, {
    flags: "w",
    encoding: "utf-8",
    mode: 0666
  }).write(content + "\n");

	console.log('updateFile', fileName)
}

function mkDir(dirName){
	fs.mkdirSync(dirName)
	console.log('mkdir', dirName)
}

function readFile(fileName){
  var file = fs.readFileSync(fileName, 'utf-8')
  return file
}

function readDir(dirName){
  var files = fs.readdirSync(dirName)
  return files
}

exports.mkFile = mkFile
exports.readFile = readFile
exports.readDir = readDir
