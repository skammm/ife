		/*
		*轮播图效果
		 */
		

		(function(window,undefined){
			window.onload = function(){
				var content = document.querySelector('#content'),
					span = document.querySelectorAll('span'),
					container = document.querySelector('#container'),
					pre = document.querySelector('#pre'),
					next = document.querySelector('#next'),
					index = 1,
					timer = null,
					animate = false;

				function buttonChange(){
					for(var i=0;i<span.length;i++){
						span[i].className = '';
					}
					span[index-1].className = 'on';
				}
			    function buttonClick(){
					
					var myIndex = parseInt(this.getAttribute('index'));
				
					var move = (myIndex - index)*(-960);
					index = myIndex;
					buttonChange();
					animation(move);
				}
				function animation(move){
					animate = true;
					
					var allTime = 300;
					var time = 10;
					var speed = parseInt(move/(allTime/time));
					var left = parseInt(content.style.left) + move ;
			        console.log(left)
					function go(){
						if(speed<0&&parseInt(content.style.left)>left || speed>0&&parseInt(content.style.left)<left ){
							content.style.left = parseInt(content.style.left) + speed +'px';
							setTimeout(go,time);
						}else{
							animate = false;
							if(left<-3840){
								content.style.left='-960px';
							}else if(left>-960){
								content.style.left='-3840px';
							}
						}
						
					}
					go();

				}
				for(var i=0;i<span.length;i++){
					span[i].addEventListener('click',buttonClick);
				}
				pre.addEventListener('click',function(){
					index--;
					if(index<1){
						index = 4;
					}
					if(!animate){
						buttonChange();
						animation(960);
					}
				})
				next.onclick=function(){
					index++;
					if(index>4){
						index = 1;
					}
					if(!animate){
						buttonChange();
						animation(-960);
					}
				}
				function play(){
					timer = setInterval(function(){
						next.onclick();
					}, 3000);
				}
				function stop(){
					clearInterval(timer);
				}
				container.addEventListener('mouseout',play);
				container.addEventListener('mouseover',stop);
				play();

			}
		})(window);

