

        (function(window,undefined){
            var god = {};
            var html = '';
            //放置飞船对象
            god.spaceshipObject = ['','','',''];
            //创建飞船
            god.createCraft = function(command){
                var control = document.querySelector('.orbite-' + (command.id+1));
                god.spaceshipObject.splice(command.id,1,new SpaceCraft(command.powerSystem,command.energySystem))
                console.log(god.spaceshipObject)
                //如果轨道上没飞船再创建
				if (!control.hasChildNodes()){
					var model = document.createElement('div');
					model.innerHTML = '<div class="craft-inner"><div class="craft-inner"><span class="energy-text">100</span><div class="energy"></div></div></div>';
					model.className = 'craft-model-'+ (command.id+1) +' visible';
					model.id = 'craft-' + (command.id+1);
					model.style.transform = 'rotate(0deg)';
					control.appendChild(model);
				}
				
            }
           
            god.Bus = {
                //模拟丢包，接受命令
                sendMessage:function(code){
                    setTimeout(function(){
                        if(Math.floor(Math.random()*10)>1){
                            var command = god.Bus.Adapter.decoding(code);
                            if(command.command === 'create'){
                                god.createCraft(command);
                                html = `${command.id+1}号轨道飞船创建完毕`;
                                
                              
                            }else{
                                if(god.spaceshipObject[command.id]){
                                    //改变对象状态
                                    god.spaceshipObject[command.id].radioSystem.recevieMessage(command);
                                    html =''+(command.id+1)+'号轨道飞船开始'+command.command+'';
                                    god.action(command.id);
                                }

                            }
                            basicFunction.renderConsole(html);
                        }else{
                            html = '[注意]:该命令丢包啦！！！';
                            basicFunction.renderConsole(html);
                        }
                    },3000)

                },
                Adapter:{
                    //译码
                    ecoding:function(message){
                        var code='';
                        switch(message.id){
                            case 0:code+='000';break;
                            case 1:code+='001';break;
                            case 2:code+='010';break;
                            case 3:code+='011';break;
                        }
                        switch(message.command){
                            case 'create':
                            code+='00';
                                switch(message.powerSystem){
                                    case 0:code+='00';break;
                                    case 1:code+='01';break;
                                    case 2:code+='10';break;
                                }
                                switch(message.energySystem){
                                    case 0:code+='00';break;
                                    case 1:code+='01';break;
                                    case 2:code+='10';break;
                                }
                                break;
                            case 'start':code+='01';break;
                            case 'stop':code+='10';break;
                            case 'destory':code+='11';break;
    
                        }
                        return code;
                    },
                    //解码
                    decoding : function(code){
                        var message={};
					switch(code.slice(0,3)){
						case '000':message.id=0;break;
						case '001':message.id=1;break;
						case '010':message.id=2;break;
						case '011':message.id=3;break;
						
					}
					switch(code.slice(3,5)){
						case '00':
							message.command = 'create';
							switch(code.slice(5,7)){
								case '00':message.powerSystem=0;break;
								case '01':message.powerSystem=1;break;
								case '10':message.powerSystem=2;break;
							}
							switch(code.slice(7)){
								case '00':message.energySystem=0;break;
								case '01':message.energySystem=1;break;
								case '10':message.energySystem=2;break;
							}
							break;
						case '01':message.command = 'start';break;
						case '10':message.command='stop';break;
						case '11':message.command='destory';break;
					}

					return message;
                    }

                    
                }
            }
            //运动定时器
            god.action = function(id){
                clearInterval(god[id]);
                var ship = god.spaceshipObject[id];
                var craft = document.querySelector('#craft-'+(id+1));
                var text = craft.querySelector('.energy-text');
                var energyBar = craft.querySelector('.energy');
                if (ship.destroyed ===true){
					craft.parentNode.removeChild(craft);
					god.spaceshipObject[id] = '';
				
					return;
								
                }
                god[id] = setInterval(function(){
                    ship.energySystem.solarEnergy();
                //飞行耗能
               ship.energySystem.consumeEnergy();
               text.textContent = ship.energy;
               energyBar.style.height=ship.energy+'%';
               ship.powerSystem.changeDeg();          
               craft.style.transform='rotate('+ship.deg+'deg)';
                },300)
            }
            window.god = god;
        })(window);