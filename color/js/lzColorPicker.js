(function(){
	/*颜色转换方法*/
	var colorMethods = {
		hexToRgb: function(hex) {
			hex = this.validateHex(hex);
	
			var r='00', g='00', b='00';
			
			/*
			if (hex.length == 3) {
				r = hex.substring(0,1);
				g = hex.substring(1,2);
				b = hex.substring(2,3);
			} else if (hex.length == 6) {
				r = hex.substring(0,2);
				g = hex.substring(2,4);
				b = hex.substring(4,6);
			*/
			if (hex.length == 6) {
				r = hex.substring(0,2);
				g = hex.substring(2,4);
				b = hex.substring(4,6);	
			} else {
				if (hex.length > 4) {
					r = hex.substring(4, hex.length);
					hex = hex.substring(0,4);
				}
				if (hex.length > 2) {
					g = hex.substring(2,hex.length);
					hex = hex.substring(0,2);
				}
				if (hex.length > 0) {
					b = hex.substring(0,hex.length);
				}					
			}
			
			return { r:this.hexToInt(r), g:this.hexToInt(g), b:this.hexToInt(b) };
		},
		validateHex: function(hex) {
			hex = new String(hex).toUpperCase();
			hex = hex.replace(/[^A-F0-9]/g, '0');
			if (hex.length > 6) hex = hex.substring(0, 6);
			return hex;
		},
		rgbToHex: function (rgb) {
			// rgb(x, y, z)
			var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
			var hex = "#";
			for (var i = 0; i < 3; i++) {
				// 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
				// 'color[i]' 是数组，要转换成字符串.
				// 如果结果是一位数，就在前面补零。例如： A变成0A
				hex += ("0" + Number(color[i]).toString(16)).slice(-2);
			}
			return hex;
		},
		hexToInt: function (hex){
			return(parseInt(hex,16));
		},
		intToHex: function (dec){
			var result = (parseInt(dec).toString(16));
			if (result.length == 1)
				result = ("0" + result);
			return result.toUpperCase();
		},
		rgbToHsv: function (rgb) {
	
			var r = rgb.r / 255;
			var g = rgb.g / 255;
			var b = rgb.b / 255;
	
			hsv = {h:0, s:0, v:0};
	
			var min = 0
			var max = 0;
	
			if (r >= g && r >= b) {
				max = r;
				min = (g > b) ? b : g;
			} else if (g >= b && g >= r) {
				max = g;
				min = (r > b) ? b : r;
			} else {
				max = b;
				min = (g > r) ? r : g;
			}
	
			hsv.v = max;
			hsv.s = (max) ? ((max - min) / max) : 0;
	
			if (!hsv.s) {
				hsv.h = 0;
			} else {
				delta = max - min;
				if (r == max) {
					hsv.h = (g - b) / delta;
				} else if (g == max) {
					hsv.h = 2 + (b - r) / delta;
				} else {
					hsv.h = 4 + (r - g) / delta;
				}
	
				hsv.h = parseInt(hsv.h * 60);
				if (hsv.h < 0) {
					hsv.h += 360;
				}
			}
			
			hsv.s = parseInt(hsv.s * 100);
			hsv.v = parseInt(hsv.v * 100);
	
			return hsv;
		},
		hsvToRgb: function (hsv) {
	
			rgb = {r:0, g:0, b:0};
			
			var h = hsv.h;
			var s = hsv.s;
			var v = hsv.v;
	
			if (s == 0) {
				if (v == 0) {
					rgb.r = rgb.g = rgb.b = 0;
				} else {
					rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100);
				}
			} else {
				if (h == 360) {
					h = 0;
				}
				h /= 60;
	
				// 100 scale
				s = s/100;
				v = v/100;
	
				var i = parseInt(h);
				var f = h - i;
				var p = v * (1 - s);
				var q = v * (1 - (s * f));
				var t = v * (1 - (s * (1 - f)));
				switch (i) {
					case 0:
						rgb.r = v;
						rgb.g = t;
						rgb.b = p;
						break;
					case 1:
						rgb.r = q;
						rgb.g = v;
						rgb.b = p;
						break;
					case 2:
						rgb.r = p;
						rgb.g = v;
						rgb.b = t;
						break;
					case 3:
						rgb.r = p;
						rgb.g = q;
						rgb.b = v;
						break;
					case 4:
						rgb.r = t;
						rgb.g = p;
						rgb.b = v;
						break;
					case 5:
						rgb.r = v;
						rgb.g = p;
						rgb.b = q;
						break;
				}
	
				rgb.r = parseInt(rgb.r * 255);
				rgb.g = parseInt(rgb.g * 255);
				rgb.b = parseInt(rgb.b * 255);
			}
	
			return rgb;
		}
	}
	
	function lzColorPicker(){
		this.version = "0.0.1";
	}
	
	var lzQ = function(id){
		return document.getElementById(id);
	}

	/*元素变量获取*/
	var canvas = lzQ("canvas");
	
	var color_r = lzQ("color_r");
	var color_g = lzQ("color_g");
	var color_b = lzQ("color_b");
	
	var color_hex = lzQ("color_hex");
	
	/*默认配置*/
	var _default = {
		panel_select : {
			x: 10,
			y: 10,
			w: 3,
			h: 3
		},
		panel_base: {
			x: 350,
			y: 10,
			w: 20,
			h: 1
		},
		current: {
			rgb : {
				r: 255,
				g: 0,
				b: 0
			},
			hex: "#ffffff",
			base:{
				y: 0,
			},
			select:{
				x: 0,
				y: 0,
			}
		}
	}
	
	var ctx = canvas.getContext("2d");
	/*面板绘制方法*/
	var panelMethods = {
		drawPanel : function (){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			this.drawColorBase(_default.panel_base.x,_default.panel_base.y,_default.panel_base.w,_default.panel_base.h);
			this.drawColorPanel(_default.panel_select.x,_default.panel_select.y,_default.panel_select.w,_default.panel_select.h);
		},
		
		drawColorBase : function (x,y,w,h){
			for(var i = 0; i <= 360 ; ++i){
				ctx.beginPath();
				ctx.fillStyle = 'HSLA('+ i +',100%,50%,1)'
				ctx.fillRect(x,i * h + y , w , h );
				ctx.fill();
			}
		},
		
		drawColorPanel : function (x,y,w,h){
			for(var i = 0; i <= 100 ; ++i){
				for(var j = 0; j <= 100; ++j){
					var b;
					var s;
					if(i + j <= 100){
						b = 100;
						s = j + i - 1;
					}else{
						s = 100;
						b = 100 - ((j + i - 100) - 1);
					}
					
					var color = colorMethods.hsvToRgb({
						h:_default.current.base.y,
						s:s,
						v:b
					});
					ctx.beginPath();
					ctx.fillStyle = 'rgba('+ color.r +',' + color.g + ',' + color.b + ',1)'
					ctx.fillRect(x + j * w ,i * h + y , w , h );
					ctx.fill();
				}
			}
		},
		
		getPositionByHSB: function(s,b){
			var result = 0;
			if(s == 100){
				result = 100 - b + 1 + 100;
			}else if(b == 100){
				result = s + 1 ;
			}
			
			var i = j = Math.floor(result / 2);
			
			return {
				x: j * _default.panel_select.w + _default.panel_select.x + 1,
				y: i * _default.panel_select.h + _default.panel_select.y + 1
			}
		},
		
		drawSelectCircle : function (x,y){
			_default.current.select.x = x;
			_default.current.select.y = y;
			
			ctx.beginPath();
			ctx.strokeStyle = "rgb(255,255,255)";
			ctx.arc(x,y,5,0,Math.PI * 2);
			ctx.stroke();
		},
		
		drawSelectColorBase: function (y){
			ctx.beginPath();
			ctx.fillStyle = "rgb(255,0,0)";
			ctx.moveTo(_default.panel_base.x , y );
			ctx.lineTo(_default.panel_base.x - 5 ,y + 5);
			ctx.lineTo(_default.panel_base.x - 5 ,y - 5);
			ctx.closePath();
			ctx.fill();
			
			var right = _default.panel_base.x + _default.panel_base.w;
			ctx.beginPath();
			ctx.moveTo(right , y );
			ctx.lineTo(right + 5 ,y + 5);
			ctx.lineTo(right + 5 ,y - 5);
			ctx.closePath();
			ctx.fill();
		}
	}
	
	/*===================监听事件begin==========================*/
	var moving = false;
	var	base_moving = false;
	canvas.addEventListener("mouseout",function(e){
		e.preventDefault();
		
		moving = false;
		base_moving = false;
	});
	
	canvas.addEventListener("mouseup",function(e){
		e.preventDefault();
		
		moving = false;
		base_moving = false;
		
	});
	
	canvas.addEventListener("mousedown",function(e){
		e.preventDefault();
		
		var x = e.offsetX;
		var y = e.offsetY;

		if(x >= _default.panel_select.x && x <= _default.panel_select.x + 3 * 101 && y > _default.panel_select.y && y <= _default.panel_select.y + 3 * 101){
			moving = true;
			
			panelMethods.drawPanel();
			panelMethods.drawSelectCircle(x,y)
			panelMethods.drawSelectColorBase(_default.panel_base.y + _default.current.base.y);
			getSelectRGB()
		}
		
		/*颜色基础*/
		if(x >= _default.panel_base.x && x <= _default.panel_base.x + _default.panel_base.w && y >= _default.panel_base.y && y <= _default.panel_base.y + 361){
			base_moving = true;
			_default.current.base.y = y - _default.panel_base.y;
			
			panelMethods.drawPanel();
			panelMethods.drawSelectCircle(_default.current.select.x,_default.current.select.y)
			panelMethods.drawSelectColorBase(_default.panel_base.y + _default.current.base.y);
			getSelectRGB()
		}
		
	});
	
	canvas.addEventListener("mousemove",function(e){
		e.preventDefault();
		var x = e.offsetX;
		var y = e.offsetY;
		
		if(!moving && !base_moving) return;
		
		if(x >= _default.panel_select.x && x <= _default.panel_select.x + 3 * 101 && y > _default.panel_select.y && y <= _default.panel_select.y + 3 * 101){
			
//			x < panel_x.min && (x = panel_x.min);
//			x > panel_x.max && (x = panel_x.max);
//			y < panel_y.min && (x = panel_y.min);
//			y > panel_y.max && (x = panel_y.max);
			
			panelMethods.drawPanel();
			panelMethods.drawSelectCircle(x,y)
			panelMethods.drawSelectColorBase(_default.panel_base.y + _default.current.base.y);
			
			getSelectRGB();
		}
		
		/*颜色基础*/
		if(x >= _default.panel_base.x && x <= _default.panel_base.x + _default.panel_base.w && y >= _default.panel_base.y && y <= _default.panel_base.y + 361){
			_default.current.base.y = y - _default.panel_base.y;
			
			panelMethods.drawPanel();
			panelMethods.drawSelectCircle(_default.current.select.x,_default.current.select.y)
			panelMethods.drawSelectColorBase(_default.panel_base.y + _default.current.base.y);
			
			getSelectRGB();
		}
	});
	/*===================监听事件end==========================*/
	
	function log() {
		console.log.apply(console,arguments);
	}
	
	function getSelectRGB(){

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		var index = _default.current.select.y * imageData.width + _default.current.select.x;
		//一个像素占4字节，p为当前指针的位置
		var p = index * 4;

		var r = imageData.data[p + 0];
		var g = imageData.data[p + 1];
		var b = imageData.data[p + 2];

		setSelectRGB(r,b,g);
		
		var hex = colorMethods.rgbToHex("rgb(" + r + "," + g + "," + b + ")");
		color_hex.value = hex;
		
		return {
			r: r,
			g: g,
			b: b
		}
	}
	
	function setSelectRGB(r,b,g){
		color_r.value = r;
		color_g.value = g;
		color_b.value = b;
	}
	
	panelMethods.drawPanel();
	panelMethods.drawSelectCircle( _default.panel_select.x + 100, _default.panel_select.y  + 100 )
	panelMethods.drawSelectColorBase(_default.panel_base.y);
	
	var nowc = getSelectRGB();
	
	/*初始化配置*/
	lzColorPicker.prototype.init = function(config){
		_default.extends(config);
	}
	
	/*扩展对象属性*/
	Object.prototype.extends = Object.prototype.extends || function(obj){
		for(var i in obj){
			if(typeof obj[i] === "object"){
				this[i].extends(obj[i]);
			}else{
				this[i] = obj[i];
			}
		}
	}
	
	choice.addEventListener("click",function(){
		var hex = color_rgb.value;
		var color_hex_value = hex;
		hex = hex.replace("#","");
		if(hex == "") return ;
		
		hex = colorMethods.hexToRgb(hex);
		var hsb = colorMethods.rgbToHsv(hex);
		
		_default.current.base.y = hsb.h;

		var pos = panelMethods.getPositionByHSB(hsb.s,hsb.v);
	
		panelMethods.drawPanel();
		panelMethods.drawSelectCircle(pos.x, pos.y )
		panelMethods.drawSelectColorBase(_default.panel_base.y + _default.current.base.y);
		
		getSelectRGB();
		color_hex.value = color_hex_value;
	});
	
	/*绑定命名空间*/
	window.lzColorPicker = window.lzColorPicker || new lzColorPicker();
})();
