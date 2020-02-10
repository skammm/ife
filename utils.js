		(function(window,undefined){
		 var EventHandler = {};
		 EventHandler.addEventHandler=function(element, event, hanlder){
			if (element.addEventListener){
				return element.addEventListener(event, hanlder, false);
			}else if(element.attachEvent){
				return element.attachEvent('on' + event, hanlder);
			}else{
				return element['on' + event] = hanlder;
			}
	};
	//事件代理
		EventHandler.delegateEvent=function(element, tag, eventName,listener){
	  	 EventHandler.addEventHandler(element, eventName, function(){
	  		var event = arguments[0]||window.event;
	  		var target = event.target || event.srcElement;
	  		if (target && target.tagName === tag.toUpperCase()){
	  			listener.call(target, event);
	  		}
	  	});

	  };
	  /*
	  实现div拖拽效果
	   */
	  EventHandler.drag=function(obj){
	  		var timer = null,
            disY = 0,
            disX = 0,
            preX,
            preY,
            iSpeedX = 0,
            iSpeedY = 0;
        obj.onmousedown = function (ev) {
            var that = this,
                x = ev || window.event,
            //clientX 事件属性返回当事件被触发时鼠标指针相对于浏览器页面（或客户区）的水平坐标。客户区指的是当前窗口
                disY = x.clientY - that.offsetTop,
                disX = x.clientX - that.offsetLeft,
                preX = x.clientX,
                preY = x.clientY;
            clearInterval(timer);//运动过程中拖拽会出现闪动问题，解决方法是如果在运动过程中出现拖拽则清除运动的定时器
            document.onmousemove = function (ev) {
                var x = ev || window.event,
                    tempX = x.clientX - disX,
                    tempY = x.clientY - disY;
                //拖拽时不能超过视窗边界
                if (tempX > document.documentElement.clientWidth - obj.offsetWidth) {
                    tempX = document.documentElement.clientWidth - obj.offsetWidth;
                } else if (tempX < 0) {
                    tempX = 0;
                }
                if (tempY > document.documentElement.clientHeight - obj.offsetHeight) {
                    tempY = document.documentElement.clientHeight - obj.offsetHeight;
                } else if (tempY < 0) {
                    tempY = 0;
                }
                that.style.left = tempX + "px";
                that.style.top = tempY + "px";
                //获取最后两点的X坐标和Y坐标之间的差值
                iSpeedX = x.clientX - preX;
                iSpeedY = x.clientY - preY;
                preX = x.clientX;
                preY = x.clientY;
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            return false;//阻止默认行为
        };
        
	  };
	  
	  EventHandler.getTime=function(){
	  		var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			return  ''+year+'-'+ month +'-'+ day +' '+ hour +':'+ minute +':'+ second +'';

	  };/*
	  	元素自动居中
	    */
         EventHandler.autoCenter=function(el){
            var bodyW = document.documentElement.clientWidth;
		    var bodyH = document.documentElement.clientHeight;

		    var elW = el.offsetWidth;
		    var elH = el.offsetHeight;

		    el.style.left = (bodyW - elW) / 2 + "px";
		    el.style.top = (bodyH - elH) / 2 + "px";
         };
		 /*
		 返回对象的类型
		  */
		  EventHandler.isClass=function(o){
			if(o===null) return "Null";
		    if(o===undefined) return "Undefined";
		    return Object.prototype.toString.call(o).slice(8,-1);
		  };
		 /**
	     * 深度扩展一个对象
	     * 深度克隆
	     * 对克隆对象修改不会对原对象也修改
	     */
		  EventHandler.deepClone=function(obj){
		    var result,oClass= EventHandler.isClass(obj);
		        //确定result的类型
		    if(oClass==="Object"){
		        result={};
		    }else if(oClass==="Array"){
		        result=[];
		    }else{
		        return obj;
		    }
		    for(key in obj){
		        var copy=obj[key];
		        if( EventHandler.isClass(copy)=="Object"){
		            result[key]=arguments.callee(copy);//递归调用
		        }else if( EventHandler.isClass(copy)=="Array"){
		            result[key]=arguments.callee(copy);
		        }else{
		            result[key]=obj[key];
		        }
		    }
		    return result;
}
		 EventHandler.resize=function(bigid,smallid){
				// 1. 获取两个大小div
		    var oPanel = document.getElementById(bigid);
	
		    var oDragIcon = document.getElementById(smallid);

		    // 定义4个变量
		    var disX = 0;//鼠标按下时光标的X值
		    var disY = 0;//鼠标按下时光标的Y值
		    var disW = 0; //拖拽前div的宽
		    var disH = 0; // 拖拽前div的高
		    //3. 给小div加点击事件
		    oDragIcon.onmousedown = function (ev) {
		      var ev = ev || window.event;
		      disX = ev.clientX; // 获取鼠标按下时光标x的值
		      disY = ev.clientY; // 获取鼠标按下时光标Y的值
		      disW = oPanel.offsetWidth; // 获取拖拽前div的宽
		      disH = oPanel.offsetHeight; // 获取拖拽前div的高
		      document.onmousemove = function (ev) {
		        var ev = ev || window.event;
		        //拖拽时为了对宽和高 限制一下范围，定义两个变量
		        var W = ev.clientX - disX + disW;
		        var H = ev.clientY - disY + disH;
		        if(W<100){
		          W = 100;
		        }
		        if(W>800){
		          W =800;
		        }
		        if(H<100){
		          H = 100;
		        }
		        if(H>500){
		          H = 500;
		        }
		        oPanel.style.width =W +'px';// 拖拽后物体的宽
		        oPanel.style.height = H +'px';// 拖拽后物体的高
      }
      	
      	document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
		};
		EventHandler.htmlEncode=function(html){
			//1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement ("div");
            //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
            (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
            //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
            var output = temp.innerHTML;
            temp = null;
            return output;
		};
		EventHandler.htmlDecode=function(text){
			//1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement("div");
            //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
            temp.innerHTML = text;
            //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
		};
      window.EventHandler = EventHandler;

		})(window);