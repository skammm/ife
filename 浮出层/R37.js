	/*
		*2015
		*ife task37
		 */
		(function(window,undefined){
			var loginLink=document.querySelector('#loginLink');
			var box=document.querySelector('#loginBox');
			var boxHeader=document.querySelector('#loginBoxHeader');
			var mask=document.querySelector('#mask');
			EventHandler.drag(boxHeader);
			EventHandler.addEventHandler(loginLink,'click',function(){
				EventHandler.autoCenter(box);
				mask.style.height='100%';
			});
			EventHandler.addEventHandler(mask,'click',function(){
				mask.style.height='0';
				box.style.left='-1000px';
			})
			
      		var div=document.createElement('div');
      		div.className='resizable-right-bottom';
      		div.id='resizeBox';
      		box.appendChild(div);
      		EventHandler.resize('loginBox','resizeBox');
      
		})(window);
