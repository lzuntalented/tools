/*
 * 为页面添加刷新悬浮按钮
 * 主要针对安卓手机中微信浏览器中无刷新使用
 * 仅为测试使用制作
 * @by lz
 * @time 20160418
 */
;(function(){
	var elem = document.createElement("div");
	var elemCss = {
		'position' : 'fixed',
		'right' : '10px',
		'bottom' : '10px',
		'width' : '35px',
		'height' : '35px',
		'line-height' :'35px',
		'text-align' : 'center',
		'background' : 'rgba(0,0,0,0.6)',
		'color' : 'white',
		'z-index' : '99999'
	}
	
	for (var i in elemCss) {
		elem.style[i] = elemCss[i];
	}
	
	elem.addEventListener("click",function(){
		location.reload();
	},false);
	
	elem.textContent = "刷新";
	document.body.appendChild(elem);
})();
