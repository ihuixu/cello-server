function getcss(styles, id){
	var style = ''

	for(var i in styles){
		style += styles[i].code;

		if(id && (styles[i].id == id)){
			return styles[i].code;
		}

	}
	return style

}

return function(styles, id){
	var css = getcss(styles, id)
	var style = document.createElement("style")
	style.type = 'text/css'

	if(style.styleSheet){
		style.styleSheet.cssText = css;

	}else{
		style.appendChild(document.createTextNode(css));
	}

	document.getElementsByTagName("head")[0].appendChild(style)
}

