return function(name, css){
	if(!css) return;

//	if(document.getElementById(name)) return;

	var style = document.createElement("style")
	style.type = 'text/css'
	style.id = name

	if(style.styleSheet){
		style.styleSheet.cssText = css;

	}else{
		style.appendChild(document.createTextNode(css));
	}

	document.getElementsByTagName("head")[0].appendChild(style)
}

