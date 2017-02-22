/*
 * js操作工具库
 * by lz
 * time 20160215
 */

;(function(){
	
	function lzTooler(){
		this.version = "1.0";//版本号
		
		this.development = false;//是否为发布模式
		
		this.toastConfig = {//toast相关配置
			'id' : 'lz-toast-container',//容器id
			'txtElem' : null,//文字标签
			'elem' : null,//容器标签
			'showing' : false,//是否正在显示
			'txtArray' : [],
		};
	}
	
	var prototype = lzTooler.prototype;
	
	/*屏幕可见区域尺寸*/
	lzTooler.prototype.winSize = {
		height : window.innerHeight,
		width : window.innerWidth,
	}
	
	/*
	 * 动态添加css样式
	 * @param decls = [[样式名,样式表],[样式名,样式表]...]
	 */
	lzTooler.prototype.addStylesheetRules = function (decls) {
		var style = document.createElement('style');
		document.getElementsByTagName('head')[0].appendChild(style);
		if (!window.createPopup) { /* For Safari */
			style.appendChild(document.createTextNode(''));
		}
		var s = document.styleSheets[document.styleSheets.length - 1];
		
		for (var i = 0; i < decls.length; i++) {
			var j = 1,
				decl = decls[i],
				selector = decl[0],
				rulesStr = '';
			if (Object.prototype.toString.call(decl[1][0]) === '[object Array]') {
				decl = decl[1];
				j = 0;
			}
			
			if(typeof decl[1] === "string"){
				rulesStr = decl[1];
			}else{
				for (var rl = decl.length; j < rl; j++) {
					var rule = decl[j];
					rulesStr += rule[0] + ':' + rule[1] + (rule[2] ? ' !important' : '') + ';\n';
				}
			}
	
			if (s.insertRule) {
				s.insertRule(selector + '{' + rulesStr + '}', s.cssRules.length);
				
			} else { /* IE */
				s.addRule(selector, rulesStr, -1);
			}
		
		}
	}
	
	/*判断是否为微信浏览器*/
	prototype.isWeixin = function() {
		var a = navigator.userAgent.toLowerCase();
		return "micromessenger" == a.match(/MicroMessenger/i) ? !0 : !1
	}
	
	/*判断是否为QQ浏览器
	 *此方法不可靠，微信浏览器也会被认为是QQ浏览器
	 */
	prototype.isQQ = function(){
		return navigator.userAgent.indexOf('QQBrowser') !== -1 || navigator.userAgent.indexOf('QQ') !== -1;
	}
	
	/*判断是否为QQ浏览器
	 *此方法移除了微信浏览器的判断
	 */
	prototype.isRealQQ = function (){
		return this.isQQ() && !this.isWeixin() ;
	}
	
	/*判断是否为微信或QQ浏览器*/
	prototype.isWXorQQ = function (){
		return isWeixin() || isQQ();
	}
	
	/*判断当前手机操作系统为Android*/
	prototype.isAndroid = function (){
		var android = navigator.userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
	    if(android) return true;
	}
	
	/*判断当前手机操作系统为IOS*/
	prototype.isIOS = function (){
		var ua = navigator.userAgent;
		
		var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
		var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
		var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	    
	    if (iphone && !ipod) return true;
	    if (ipad) return true;
	    if (ipod) return true;
	}
	
	/*
	 *将对象解析成键值对字符串，用于post信息
	 * @param obj 需要解析的对象
	 */
	prototype.objToStrForPost = function (obj){
		var result = "";
		if(typeof obj === "object"){
			for (var i in obj) {
				result += i + "=" + obj[i] + "&"
			}
			
			if(result.length > 0){
				result = result.substr(0,result.length - 1);
			}
		}else if(typeof obj === "string"){
			return obj;
		}
		
		return result;
	}
	
	/*数据类型检测，参考sea.js源码*/
	function isType(type) {
	  	return function(obj) {
	    	return {}.toString.call(obj) == "[object " + type + "]";
	  	}
	}
	
	prototype.isObject = isType("Object");
	prototype.isString = isType("String");
	prototype.isArray = Array.isArray || isType("Array");
	prototype.isFunction = isType("Function");
	prototype.isUndefined = isType("Undefined");

	/*
	 * 检测字符是否纯数字字符
	 * @param str 待检测字符
	 */
	prototype.isNumber = function (str){
		if(/[^0-9]/.test(str)){
			return false;
		}
		
		return true;
	}
	
	/*
	 *打印调试信息
	 * @param str 调试内容
	 */
	prototype.log = function (str){
		if(!lzTooler.development)
			console.log(str);
	}
	
	/*
	 *模拟toast信息提示
	 * @param str 需要显示的内容|字符串类型
	 */
	prototype.toast = function (str){
		var elem = this.toastConfig.elem;
		var config = this.toastConfig;
		
		function show(){
			if(!config.showing){
				config.txtElem.textContent = config.txtArray.splice(0,1);

				config.showing = true;
				config.elem.style.display = "block";
				
				setTimeout(function(){
					config.showing = false;
					config.elem.style.display = "none";
					
					if(config.txtArray.length > 0){
						show();	
					}
				},2000);
			}
		}
		
		if(!elem){
			elem = document.createElement("div");
			elem.id = config.id;
			elem.style.position = 'fixed';
			elem.style.bottom = '5%';
			elem.style.width = '100%';
			config.elem = elem;
			
			var div = document.createElement("div");
			div.style.margin = '0 auto';
			div.style.textAlign = 'center';
			div.style.width = '80%';

			var span = document.createElement("span");
			span.style.background = 'rgba(0,0,0,0.7)';
			span.style.padding = '5px 10px';
			span.style.borderRadius = '10px';
			span.style.color = 'white';
			span.style.display = 'inline-block';
			config.txtElem = span;
			
			div.appendChild(span);
			elem.appendChild(div);
			document.getElementsByTagName("body")[0].appendChild(elem);
		}
		
//		config.txtElem.textContent = str;
		config.txtArray.push(str);
		show();
	}
	
	window.lzTooler = window.lzTooler || new lzTooler();
})(); 
