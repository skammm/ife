
  window.onload = function(){
    (function(window,undefined){
    
        var $ = function(id){
           return document.getElementById(id);
        };
        $.addEvent = function (element, event, listener) {
                 if (element.addEventListener) { //标准
                     element.addEventListener(event, listener, false);
                 } else if (element.attachEvent) { //低版本ie
                     element.attachEvent("on" + event, listener);
                 } else { //都不行的情况
                     element["on" + event] = listener;
                 }
             };
        $.delegateEvent = function(ele,goal,event,fun){
           $.addEvent(ele,event,function(){
              var e = window.event;
              var target = e.target;
              if(target&&target.tagName === goal.toUpperCase()){
                 fun.call(target,event);
              }
           })
        };
        var p = document.querySelectorAll('p');
        var list = document.querySelector('.list');
        var queue = [];
        var startTime = 0;
        $.delegateEvent(list,'p','click',show);
        function show(){
          
           reset();
           this.className = 'onclick';
           
        }
        $.delegateEvent(list,'span','click',change);
        function change(){
           var next = this.parentNode.nextElementSibling;
           if(this.className === 'add'){
              var value = prompt('请输入名字');
              if(value){
                
                 if(next){
                    var li = document.createElement('li');
                    li.innerHTML = `<p>${value}<span class="add">+</span><span class="delete">x</span><span class="unfold">v</span></p>`
                    next.appendChild(li);
                 }else{
                    var ul = document.createElement('ul');
                    ul.innerHTML =  `<li><p>${value}<span class="add">+</span><span class="delete">x</span><span class="unfold">v</span></p></li>`
                    this.parentNode.parentNode.appendChild(ul);
                 }
                 p = document.querySelectorAll('p');
              }
  
           }else if(this.className === 'delete'){
              this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
           }else if(this.className === 'unfold'){
              
              if(next){
                 
                 if(next.style.display === 'none'){
                    next.style.display = 'block';
                    this.innerHTML = 'v';
                 }else{
                    next.style.display = 'none';
                    this.innerHTML = '>'; 
                 }
              }
           }
        }
        function BFS(node){
           var arr = [];
           queue = [];
           if(node){
              arr.push(node);
           }
           while(arr.length>0){
              var p = arr.shift();
              if(p.tagName === 'P'){
                 queue.push(p);
              }
              if(p.firstElementChild){
                 p = p.firstElementChild;
                 arr.push(p);
                 while(p.nextElementSibling){
                    p = p.nextElementSibling;
                    arr.push(p);
                 }
              }
           }
           
        }
        $.addEvent($('search'),'keyup',function(e){
           if(e.keyCode === 13){
              startTime = new Date();
              var value = $('search').value.trim();
              reset();
              BFS(list);
              render(value);
           }
         
        })
        function reset(){
          for(var i = 0;i<p.length;i++){
            p[i].className = '';       
         }
        }
        function render(value){
           var i = 0
           var timer = setInterval(function(){
              if(i<=queue.length){
                 if(i > 0 ){
                    queue[i-1].className = '';
                 }
                 var node = queue[i];
                 if(node){
                    if(node.firstChild.nodeValue.trim() === value){
                       node.className = 'onclick';
                       
                       var endTime = new Date();
                       var time = endTime - startTime;
                       alert('Bingo!本次搜索用时：' + time/1000 + 's');
                       clearInterval(timer)
                       return;
                      
                       
                    }
                    node.className = 'onclick';
                 }
                 i++;
                
              }else{
                 clearInterval(timer);
                 alert('没有找到相关查询');
              }
           },600)
        }
        $.addEvent($('search'),'focus',function(){
           this.value = '';
        })
        
  
        
    })(window);
  
  }
  
  