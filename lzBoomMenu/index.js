/**
 * 悬浮菜单
 * create by lz
 * time 20170810
 * 
 * 若使用模板创建节点，不需要添加额外的样式（已内置）
 * 
 * 若使用DOM节点，请使用如下样式表
 * .lz-boommenu-container .main,.lz-boommenu-container ul li{
		width: 30px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		position: absolute;
		left: 0px;
		right: 0px;
		list-style: none;
		background: pink;
		border-radius: 50%;
		margin: 0 0;
		padding: 0 0;
		transition: all .3s;
	}
	.lz-boommenu-container ul{
		z-index: -1;
		position: absolute;
		left: 0px;
		right: 0px;
		list-style: none;
		margin: 0 0;
		padding: 0 0;
 	}
 */
;(function(global){
	var _default = {
		subMenuPosition: 'top',//top bottom left right around
		animationTime: 'together',//togethre delay
		delay: 0,//delay time
		
		radius: 50,//当subMenuPosition为around 环形半径 
		
		mainElem: null,//容器对象，dom节点
		tpl: '<div>1</div><ul><li>2</li></ul>',//模板内容
		mode: 0,//节点创建模式，0 模板，1 节点
		
		show: false,//当前状态，true显示子菜单，false隐藏
		
		elems: {},//内部使用节点集合
		
		setPosition: null,//用户自定子菜单位置，function原型function(len) len为子节点个数 / array
		menuClick: null,//子元素点击事件，function原型function(event,idx) event点击事件，idx为子菜单序号从0开始
	}
	
	/**
	 * 主函数
	 * @param {Object} config 配置
	 */
	function lzBoomMenu(config){
		this._config = {};
		Object.assign(this._config,_default);
		Object.assign(this._config,config);
		
		this.init();
	}
	
	/**
	 * 初始化
	 */
	lzBoomMenu.prototype.init = function(){
		var cfg = this._config;
		if(cfg.mode == 0){
			cfg.mainElem.innerHTML= cfg.tpl;
		}
				
		cfg.elems = {};
		cfg.elems.div = $cls('div',cfg.mainElem);	
		cfg.elems.div = cfg.elems.div[0];
		cfg.elems.ul = $cls('ul',cfg.mainElem);
		cfg.elems.ul = cfg.elems.ul[0];
		cfg.elems.li = $cls('li',cfg.elems.ul);

		this.addEvent();
		
		/*将css样式内置*/
		if(cfg.mode == 0){
			this.initCss();
		}
		
		var elems = this._config.elems;
		addClass(this._config.mainElem,'lz-boommenu-container');
		addClass(elems.div,'main');
	}
	
	lzBoomMenu.prototype.initCss = function (){

		var cls = {
			width: '30px',
			height: '30px',
			'line-height': '30px',
			'text-align': 'center',
			position: 'absolute',
			left: '0px',
			right: '0px',
			'list-style': 'none',
			background: 'pink',
			'border-radius': '50%',
			margin: '0 0',
			padding: '0 0',
			transition: 'all .3s',
		}
		
		var ulCls = {
			'z-index': '-1',
			position: 'absolute',
			left: '0px',
			right: '0px',
			'list-style': 'none',
			margin: '0 0',
			padding: '0 0',
		}
		
		/*动态加载样式表*/
//		addStylesheetRules([['.lz-boommenu-container',{'over-flow':'hidden'}]]);
		addStylesheetRules([['.lz-boommenu-container .main',cls]]);
		addStylesheetRules([['.lz-boommenu-container ul',ulCls]]);
		addStylesheetRules([['.lz-boommenu-container ul li',cls]]);
	}
	
	
	
	/**
	 * 添加处理事件
	 */
	lzBoomMenu.prototype.addEvent = function(){
		var self = this;
		var cfg = this._config;
		cfg.elems.div.addEventListener('click',function(){
			self.toggle();
		})
		
		_.map(cfg.elems.li,function(item,idx){
			item.addEventListener('click',function(e){
				self.toggle();
				isFunction(cfg.menuClick) && cfg.menuClick(e,idx);
			});
		});
	}
	
	/**
	 * 获取子菜单显示位置
	 */
	lzBoomMenu.prototype.getMenuPosition = function(){
		var cfg = this._config;
		
		/*检查是否用户自定义位置*/
		var customPos = cfg.setPosition
		if(customPos){
			/*函数处理*/
			if(isFunction(customPos)){
				return customPos(cfg.elems.li.length);
			}else if(isArray(customPos)){//数组处理
				return customPos;
			}
		}
		
		var result = [];
		_.map(cfg.elems.li,function(item,idx){
			switch (cfg.subMenuPosition){
				case 'top':
					result.push({
						x: 0,
						y: -(+idx + 1) * 40
					})
					break;
				case 'bottom':
					result.push({
						x: 0,
						y: (+idx + 1) * 40
					})
					break;
				case 'right':
					result.push({
						x: (+idx + 1) * 40,
						y: 0
					})
					break;
				case 'left':
					result.push({
						x: -(+idx + 1) * 40,
						y: 0
					})
					break;
				case 'around':
					var count = cfg.elems.li.length;
					var angle = 360 / count;
					var x = Math.sin(angle * idx / 360 * 2 * Math.PI) * cfg.radius;
					var y = Math.cos(angle * idx / 360 * 2 * Math.PI) * cfg.radius;
					result.push({
						x: x,
						y: y
					})
					break;
				default:
					break;
			}
		})
		return result;
	}
	
	/**
	 * 显示子菜单
	 */
	lzBoomMenu.prototype.show = function(){
		if(this._config.show){
			return ;
		}
		
		this._config.show = true;
		
		var cfg = this._config;
		var pos = this.getMenuPosition();
		
		setCss(cfg.elems.ul,{
			'display': 'block'
		});
		
		setTimeout(function(){

			var delay = 0;
			if(cfg.animationTime == 'delay'){
				delay = cfg.delay
			}

			_.map(cfg.elems.li,function(item,i){
				setCss(item,{
					'transform': 'translate(' + pos[i].x + 'px,' + pos[i].y + 'px)',
					'transition-delay': (i * delay) + 's'
				})
			});
		},1000 / 60);
	}
	
	/**
	 * 隐藏子菜单
	 */
	lzBoomMenu.prototype.hide = function(){
		if(!this._config.show){
			return ;
		}
		
		this._config.show = false;
		
		var cfg = this._config;
		_.map(cfg.elems.li,function(item,i){
			setCss(item,{
				'transform': 'translate(0px,0px)',
			})
		});
	}
	
	/**
	 * 切换子菜单状态
	 */
	lzBoomMenu.prototype.toggle = function(){
		if(this._config.show){
			this.hide();
		}else{
			this.show();
		}
	}
	
	/*===================util=====================*/
	
	function $id(id){
		return document.getElementById(id);
	}
	
	function $cls(str,elem){
		elem = elem || document;
		return elem.querySelectorAll(str);
	}
	
	function getCss(){
		
	}
	
	function setCss(elem,key,value){
		if(isObject(key)){
			_.map(key,function(item,idx){
				elem.style[idx] = item;
			});
		}else{
			elem.style[key] = value;
		}
	}
	
	function attr(elem,key,value){
		if(value){
			elem.setAttribute(key,value);
		}else{
			elem.getAttribute(key);
		}
	}
	
	function addClass(elem,value){
		var cls = attr(elem,'class') || '';
		cls = _.trim(cls);
		var old = cls.split(' ');
		var news = value.split(' ');
//		cls.replace(/\s{0,}/g,' ');
		var str = '';
		for(var i = 0 , len = news.length ; i < len ; ++i ){
			if(old.indexOf(news[i]) == -1){
				str += ' ' + news[i];
			}
		}
		attr(elem,'class', cls + str);
	}
	
	/*
	 * 动态添加css样式
	 * @param decls = [[样式名,样式表],[样式名,样式表]...]
	 */
	function addStylesheetRules(decls) {
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
			}else if(typeof decl[1] === "object"){
				var map = decl[1];
				for(var j in map){
					var rule = map[j];
					rulesStr += j + ':' + rule + ';\n';
				}
			}
	
			if (s.insertRule) {
				s.insertRule(selector + '{' + rulesStr + '}', s.cssRules.length);
				
			} else { /* IE */
				s.addRule(selector, rulesStr, -1);
			}
		
		}
	}
	
	
	
	var _ = {};
	var isType = function(type){
		return function(obj){
			return Object.prototype.toString.call(obj) == '[object ' + type + ']';
		}
	}
	
	_.trim = function(str){
		return str.replace(/\s^|\s$/g,'');
	}
	
	var isObject = isType('Object');
	var isFunction = function(obj){
		return typeof obj === "function";
	}
	
	var isArray = Array.isArray || isType('Array');
	
	_.map = function(obj,callback){
		for(var i in obj){
			if(obj.hasOwnProperty(i))
				callback(obj[i],i,obj);
		}
	}
	
	
	/*实例构造器对象*/
	function create(){}
	
	create.prototype = lzBoomMenu.prototype;
	/*获取实例方法*/
	create.prototype.getInstance = function(config){
		return new lzBoomMenu(config);
	}
	/*绑定命名空间*/
	global.lzBoomMenu = global.lzBoomMenu || new create();
})(window);
