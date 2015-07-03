var canvas;

function createCanvas()
{
	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	canvas.setAttribute('width', '1024');
	canvas.setAttribute('height', '768');
	canvas.style.position = 'fixed';
	canvas.style.top = '25px';
	canvas.style.right ='25px';
	canvas.style.width = '640px';
	canvas.style.hegiht = '480px';

	return canvas;
}

function getBase64Image(img){
	var canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;

	var ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL('image/png');
}

function getHTMLWithStyles(id)
{
	var element = document.getElementById(id);
	var newElement = element.cloneNode(true);
	var list = newElement.getElementsByTagName('*');
	for(var i=0; i<list.length; ++i){
		var style = window.getComputedStyle(list[i]);
		var styleStr = '';
		var first = true;
		for(prop in style){
			if(/^[a-z\-]+$/.test(prop) && typeof style[prop] == 'string' && style[prop].length > 1){
				//CSS property (max-width)
				if(!first) styleStr = styleStr + ';';
				styleStr = styleStr + prop + ':' + style[prop];
				first = false;
			}
		}
		list[i].setAttribute('style', styleStr);
		if(list[i].tagName == 'img') list[i].src = getBase64Image(list[i]);
	}

	return newElement.outerHTML;
}

function screenshot(id)
{
	canvas = document.getElementById('canvas');
	if(!canvas) canvas = createCanvas();

	var ctx = canvas.getContext('2d');
	var html = getHTMLWithStyles(id);
	var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768">'
		+ '<foreignObject width="100%" height="100%">'
			+ html
           	+'</foreignObject>'
	+'</svg>';
	var img = new Image();
	var url = window.URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml;charset=utf-8'}));
	img.onload = function(){
		ctx.drawImage(img, 0, 0);
		window.URL.revokeObjectURL(url);
	};
	img.src = url;
}
