        
        
        (function(window,undefined){
            var basicFunction= {};
            //给add按钮添加事件
            var addButton = document.querySelector('.craft-add');
            addButton.addEventListener('click',command.addButton);
            //给每个li添加事件
            var craftControl = document.querySelectorAll('.craft-control');
            for(var i=0;i<craftControl.length;i++){
                craftControl[i].addEventListener('click',function(){
                    for(var j=0;j<craftControl.length;j++){
                        craftControl[j].classList.remove('selected');
                    }
                    
                    this.classList.add('selected');
                })
            }
          
           
            //对象存储select数据
            var systemType = {
                powerType:[ {type: "前进号", deg: 3, consumeEnergy: 5},
                {type: "奔腾号", deg: 5, consumeEnergy: 7},
                {type: "超越号", deg: 8, consumeEnergy: 9}],
                energyType:[{type: "劲量型", solarEnergy: 2},
                {type: "光能型", solarEnergy: 3},
                {type: "永久型", solarEnergy: 4}]
            }
            //初始化select控件
            basicFunction.initSelectButton = function(){
                var systemSelect = document.getElementById('system-select');
                var rateSelect = document.getElementById('rate-select');
                var innerHTML = '';
                var txt = '';
                var power = systemType.powerType;
                var energy = systemType.energyType;
 
                for(var i = 0;i<power.length;i++){
                    innerHTML+='<option> '+power[i].type+'(速率：'+power[i].deg+'deg/s,能耗'+power[i].consumeEnergy+'%/s)</option>';
                }
                rateSelect.innerHTML = innerHTML;
                for(var i = 0;i<energy.length;i++){
                    txt+='<option>'+energy[i].type+' (补充能源速度'+energy[i].solarEnergy+' %/s)</option>';

                }
                
                systemSelect.innerHTML = txt;
            }
            //渲染控制台
            basicFunction.renderConsole = function(html){
                var output = document.querySelector('.console');
                var p = document.createElement('p');
                p.innerHTML = html;
               
                if(output.childNodes.length===10){
                    output.removeChild(output.firstChild);
                }
                output.appendChild(p);
                
            }
            //初始化开始按钮
            basicFunction.initStartButton = function(){
                var start = document.querySelectorAll('.start');
                for(var i = 0;i <start.length;i++){
               
                    command.start(i,start);
                }
               
            };
            //初始化停止按钮
            basicFunction.initStopButton = function(){
                var stop = document.querySelectorAll('.stop');
               
                for(var i=0;i<stop.length;i++){
               
                command.stop(i,stop);
            }   
        }
        //初始化摧毁按钮
        basicFunction.initDestoryButton = function(){
            var destory = document.querySelectorAll('.destory');
            for(var i=0;i<destory.length;i++){
              
                command.destory(i, destory);
            }
        }
        //点击圆盘播放音乐
    
            basicFunction.play = function(){
                var btn = document.querySelector('.play');
                var key =false;
                btn.addEventListener('click',function(){
                   
                    key = !key;
                    if(key){
                        backgroundAudio.play();
                        basicFunction.swithAnimation(0);
                    }else{
                        backgroundAudio.pause();
                        basicFunction.swithAnimation(-40);
                    }
                })
            }
           //拨杆动画
        basicFunction.swithAnimation = function(end){
           
            var timer = setInterval(function(){
                var swith = document.querySelector('.swith');
                var st = window.getComputedStyle(swith, null);
                var tr = st.transform;
                var values = tr.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                if(angle === end){
                    clearInterval(timer);
                }
                console.log('Rotate: ' + angle + 'deg');
                var speed = (angle-end)/5;
                speed = speed>0?Math.ceil(speed):Math.floor(speed);
                swith.style.transform = 'rotate('+(angle-speed)+'deg)';
            },30);
        }
        //加载声音文件
            var backgroundAudio = new Audio('Time.mp3');
            backgroundAudio.loop = true;
            backgroundAudio.volume = .25;
            backgroundAudio.load();
            var timer = setInterval(function(){
                if(backgroundAudio.readyState === 4){
                    clearInterval(timer);
                    window.basicFunction = basicFunction;
                    window.systemType = systemType;
                    basicFunction.initSelectButton();
                    basicFunction.initStartButton();
                    basicFunction.initStopButton();
                    basicFunction.initDestoryButton();
                    basicFunction.play();
                }
            },100)
          
                
         
                
                
        })(window)