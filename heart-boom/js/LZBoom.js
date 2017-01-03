/*
 *心行爆炸效果
 * by lz
 *
 */
;(function($,window){
	$.extend({
		LZBoom:function(config){
			this.version = "1.0.0";
			//默认配置
			var _default={
				width:$(window).width(),//画布宽度
				height:$(window).height(),//画布高度
				itemSize:30,//条目大小
				mainSize:{
					scale:30,//条目放大比例
					offset:0.1//条目数量
				},
				imgsrc:"img/11.png",//条目图片地址
				speed:1,//动画运行时间
				firstBack:false, //是否第一次就执行收缩效果
			};
			
			var itemDivs=[];
			var mainElem;
			
			_init=function(){
				var elem=$("<div></div>");
				var elemCss={
					position:"absolute",
					'left':0+"px",
					'top':0+"px",
					width:_default.width+"px",
					height:_default.height+"px",
					'overflow':"hidden",
				};
				elem.css(elemCss);
				mainElem=elem;
				$("body").append(mainElem);
				
				createMainDiv();
			}
			
			/**
			 * 爆照效果
			 */
			this.action = function(){
				for(var i=0;i<itemDivs.length;i++){
					var dirX=Math.floor(Math.random()*2);
					var dirY=Math.floor(Math.random()*2);
					
					var x=Math.floor(Math.random()*_default.width);
					var y=Math.floor(Math.random()*_default.height);
					
					if(dirX==1){
						x=-x;
					}
					if(dirY==1){
						y=-y;
					}
					
					itemDivs[i].css("transform","translate("+x+"px,"+y+"px)");
					itemDivs[i].css("-webkit-transform","translate("+x+"px,"+y+"px)");
					
					itemDivs[i].css("opacity","0");
				}
				
			}
			
			function createMainDiv(){
				for(var i=-1.1; i <=1.1 ; i+=_default.mainSize.offset){
					var x1=Math.pow(i,4);
					var x1=Math.pow(x1,1/3);
					
					var s=Math.sqrt(x1-4*i*i+4);
					var maxY = (Math.pow(Math.pow(i,2),1/3)+s)/2;
					var minY = (Math.pow(Math.pow(i,2),1/3)-s)/2;
					
					for(var j=minY ; j < maxY ; j+=_default.mainSize.offset){
						var item=createItemDiv(i*_default.mainSize.scale+_default.width/2,-j*_default.mainSize.scale+_default.height/2,_default.itemSize,_default.itemSize);
						item.css("transition","all "+_default.speed+"s ease-out");
						item.css("transition","all "+_default.speed+"s ease-out");
						
						itemDivs.push(item);
						mainElem.append(item);
					}
				}
				
				if(_default.firstBack){
					for(var i=0;i<itemDivs.length;i++){
						var dirX=Math.floor(Math.random()*2);
						var dirY=Math.floor(Math.random()*2);
						
						var x=Math.floor(Math.random()*_default.width);
						var y=Math.floor(Math.random()*_default.height);
						
						if(dirX==1){
							x=-x;
						}
						if(dirY==1){
							y=-y;
						}
						
						itemDivs[i].css("transform","translate("+x+"px,"+y+"px)");
						itemDivs[i].css("-webkit-transform","translate("+x+"px,"+y+"px)");
						
						itemDivs[i].css("opacity","0");
					}
				}
			}

			/**
			 * 收缩效果
			 */
			this.actionback =function(){
				for(var i=0;i<itemDivs.length;i++){
					
					itemDivs[i].css("transform","translate(0px,0px)");
					itemDivs[i].css("-webkit-transform","translate(0px,0px)");
					
					itemDivs[i].css("opacity","1");
				}
			}
			
		
			
			function createItemDiv(left,top,wid,het){
				var elem=$("<div></div>");
				var elemCss={
					position:"absolute",
					'left':left+"px",
					'top':top+"px",
//					background:"red",
//					'border-radius':'50%',
					width:wid+"px",
					height:het+"px"
				};
				elem.css(elemCss);
				if(_default.imgsrc!=null){
					elem.append(createItemImg());
				}
				return elem;
			}
			
			function createItemImg(){
				var elem=$("<img>");
				var elemCss={
					width:"100%",
				};
				elem.css(elemCss);
				elem.attr("src",_default.imgsrc);
				return elem;
			}
			
			_init();
			
			return this;
		} 
	});
})($,window);
