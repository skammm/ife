

        (function(window,undefined){
            var command = {};
            var craft = [false,false,false,false];
            var rateSelect = document.querySelector('#rate-select');
            var systemSelect = document.querySelector('#system-select')
            //add按钮事件
            command.addButton = function(){
              
                var craftControl = document.querySelectorAll('.craft-control');
               
                var count = -1;
                for(var i =0;i<craft.length;i++){
                    if(!craft[i]){
                        count = i;
                        break;
                    }
                }
                if(count!==-1){
                    craftControl[count].className = craftControl[count].className.replace(/hidden/,'');
                    craft[count] = true;
                    var instruct = {
                    command:'create',
                    id:count,
                    powerSystem:rateSelect.selectedIndex,
                    energySystem:systemSelect.selectedIndex,
                    }
                    var html = `[指挥官]:向${count+1}号轨道飞船发出create的指令已发送`;
                    basicFunction.renderConsole(html);
                    god.Bus.sendMessage(god.Bus.Adapter.ecoding(instruct));
                }else{
                    basicFunction.renderConsole('[消息]：轨道以满');
                }
                

            }
            //发送开始命令
            command.start =function(m,start){
                start[m].addEventListener('click',function(){
                    var html = `[指挥官]:向${m+1}号轨道飞船发送的start指令已发送`;
                    basicFunction.renderConsole(html);
                    var instruct = {
                        command:'start',
                        id:m
                    }
                    
                    god.Bus.sendMessage(god.Bus.Adapter.ecoding(instruct));
                })
            }
            //发送停止命令
            command.stop = function(m,stop){
                stop[m].addEventListener('click',function(){
                            
                    var html = `[指挥官]:向${m+1}号轨道飞船发送的stop指令已发送`;
                    basicFunction.renderConsole(html);
                    var instruct = {
                        command:'stop',
                        id:m
                    }
                    
                    god.Bus.sendMessage(god.Bus.Adapter.ecoding(instruct));
            })
            }
            //发送销毁命令
            command.destory = function(m, destory){
               
                    destory[m].addEventListener('click',function(){
                     
                        var html = `[指挥官]:向${m+1}号轨道飞船发送的destory指令已发送`;
                        basicFunction.renderConsole(html);
                        var instruct = {
                            command:'destory',
                            id:m
                        }
                        this.parentNode.parentNode.parentNode.classList.add('hidden')
                        craft[m] = false;
                        god.Bus.sendMessage(god.Bus.Adapter.ecoding(instruct));
                })

        
            }
            window.command = command;
        })(window);