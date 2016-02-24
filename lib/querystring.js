exports.parase = function(str){
  var arrtmp = str.split('&');
  for(var i=0 , len = arrtmp.length;i < len;i++){
    var paramCount = arrtmp[i].indexOf('=');
    if(paramCount > 0){
      var name = arrtmp[i].substring(0 , paramCount);
      var value = arrtmp[i].substr(paramCount + 1);
      try{
				if (value.indexOf('+') > -1) value= value.replace(/\+/g,' ')
					options[name] = decodeURIComponent(value);
      }catch(exp){}
    }
  }
	return options
}


