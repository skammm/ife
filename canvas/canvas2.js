/*
			*用H5canvas开发简单的游戏
			*学习对象封装
			 */
			(function(window,undefined){
				var canvas=document.createElement('canvas');
				var ctx=canvas.getContext('2d');
				canvas.width=512;
				canvas.height=480;
				document.body.appendChild(canvas);
				var bgImage=new Image();
				var heroImage=new Image();
				var monsterImage=new Image();
				var bgReady=false;
				var heroReady=false;
				var monsterReady=false;
				var count = 0;
				bgImage.onload=function(){
					bgReady=true;
				}
				heroImage.onload=function(){
					heroReady=true;
				}
				monsterImage.onload=function(){
					monsterReady=true;
				}
				 bgImage.src='./background.png';
				 heroImage.src='./hero.png';
				 monsterImage.src='./monster.png';
				//英雄对象的相关属性
				var hero={
					speed:256,
					x:0,
					y:0
				};
				//怪物相关属性
				var monster={
					x:0,
					y:0,
				};
				//记录抓到怪物的次数
				var monsterCaught=0;
				/*
				*处理用户的输入
				*{
				   38：true,
				   39:true,
				   37:true,
				*}
				 */
				
				var keyDown={};
				
				addEventListener('keydown',function(e){
					 
					keyDown[e.keyCode]=true;
				},false);
				addEventListener('keyup',function(e){
					keydown = false;
					delete keyDown[e.keyCode];
				},false);
				//开始一轮游戏，把英雄放在中心怪物随机放置
				var reset=function(){
					hero.x=canvas.width/2;
					hero.y=canvas.height/2;
					monster.x=36+(Math.random()*(canvas.width-64));
					monster.y=36+(Math.random()*(canvas.width-64));
				}
				
				// *根据keyDown对象来更新位子
				// *这里的参数modefier是根据执行一次函数的时间差决定的，
				// *这样无论我们的代码跑的有多慢，但是hero的速度都是恒定的
				// *
				 
				var update=function(modefier){
					if(38 in keyDown){
						hero.y-=hero.speed*modefier;
					}
					if(40 in keyDown){
						hero.y+=hero.speed*modefier;
					}
					if(37 in keyDown){
						hero.x-=hero.speed*modefier;
					}
					if(39 in keyDown){
						hero.x+=hero.speed*modefier;

					}
					if(hero.x<=(monster.x+32)
						&&hero.y<=(monster.y+32)
						&&monster.x<=(hero.x+32)
						&&monster.y<=(hero.y+32)
						){
						monsterCaught++;
						reset();
					}
					console.log('bb')
				}
				//渲染物体
				var render=function(){
					console.log(bgReady)
					if(bgReady){
						ctx.drawImage(bgImage,0,0);
					
					}
					if(heroReady){
						ctx.drawImage(heroImage,hero.x,hero.y);
					}
					if(monsterReady){
						ctx.drawImage(monsterImage,monster.x,monster.y);
					}
					//计分
					ctx.fillStyle="rgb(250, 250, 250)";
					ctx.font="24px Helvetica";
					ctx.textAlign='left';
					ctx.textBaseline = "top";
					ctx.fillText('monsterCaught:'+monsterCaught,32,32);
				};
				var count = 0
				var main=function(){
					var date=new Date();
				    count++;
					var delta=date-then;
				
					update(delta / 1000);
					render();
					
					then=date;
					//requestAnimationFrame的兼容性处理
					var w=window;
                  
					requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
					//请求浏览器来执行一个函数来更新动画
				
					requestAnimationFrame(main);
					
				};
				var then = Date.now();
				reset();
				main();
				


			})(window);