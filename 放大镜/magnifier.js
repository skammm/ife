		/*
		*js实现放大镜效果
		 */
		(function(window,undefined){
			window.onload=function(){
				var smallBox=document.querySelector('#small-box');
				var floatBox=document.querySelector('#float-box');
				var demo=document.querySelector('#demo');
				var bigBox=document.querySelector('#big-box');
				var img=bigBox.querySelector('img');

				smallBox.onmouseover=function(){
					floatBox.style.display='block';
					bigBox.style.display='block';
				};
				smallBox.onmouseout=function(){
					floatBox.style.display='none';
					bigBox.style.display='none';
				};
				smallBox.onmousemove=function(ev){
				
					var that = this;
                	var	x = ev || window.event;
                	
                	
                	var	left=x.clientX-demo.offsetLeft-floatBox.offsetWidth/2;
                	var	top=x.clientY-demo.offsetTop-floatBox.offsetHeight/2;
                		if(left<0){
                			left=0;
                		}else if(left>smallBox.offsetWidth-floatBox.offsetWidth){
                			left=smallBox.offsetWidth-floatBox.offsetWidth;
                		}
                		if(top<0){
                			top=0;
                		}else if(top>smallBox.offsetHeight-floatBox.offsetHeight){
                			top=smallBox.offsetHeight-floatBox.offsetHeight;
                		}
                		floatBox.style.top=top+'px';
                		floatBox.style.left=left+'px';
                		
                		img.style.top=-floatBox.offsetTop*(bigBox.offsetHeight/floatBox.offsetHeight)+'px';
                		img.style.left=-floatBox.offsetLeft*(bigBox.offsetWidth/floatBox.offsetWidth)+'px';

                		
				};
			};
		})(window);