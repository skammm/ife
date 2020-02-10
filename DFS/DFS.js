


/*
  TASK23   24   25二叉树广度优先和深度优先搜索
   */
window.onload = function () {
  (function (window, undefined) {

    function $(id) {
      return document.getElementById(id);
    }
    $.addEvent = function (element, event, listener) {
      if (element.addEventListener) { //标准
        element.addEventListener(event, listener, false);
      } else if (element.attachEvent) { //低版本ie
        element.attachEvent("on" + event, listener);
      } else { //都不行的情况
        element["on" + event] = listener;
      }
    };
    $.delegateEvent = function (ele, goal, event, fun) {
      $.addEvent(ele, event, function () {
        var e = window.event;
        var target = e.target;
        if (target && target.tagName === goal.toUpperCase()) {
          fun.call(target, event);
        }
      })
    };
    var div = document.querySelectorAll('div'),
      that = null,
      sec = $('sec'),
      queue = [],
      startTime = 0,
      isAnimation = false;
    $.addEvent($('search'), 'focus', function () {
      this.value = '';
    });
    $.delegateEvent($('sec'), 'div', 'click', show);
    function show() {
      that = this;

      for (var i = 0; i < div.length; i++) {
        div[i].style.background = '#fff';
      }
      this.style.background = 'yellow';

    }
    function reset(){
      queue = [];
      var p = null;
      var next = null;
      var child = $('sec').getElementsByTagName('div')
      for(var i=0;i<child.length;i++){
        child[i].classList.remove('onclick');
      }

    

    }
    function add() {
      var value = $('addtext').value.trim();
      if (value) {
        var addBox = document.createElement('div');
        var lvl = parseInt(that.className.slice(6, 7)) + 1;
        lvl = lvl > 6 ? 6 : lvl;
        addBox.className = `level-${lvl} ${value}`;
        addBox.innerHTML = value;
        that.appendChild(addBox);
        div = document.querySelectorAll('div');

      }
    }

    function del() {
      that.parentNode.removeChild(that);
    }
    function BFS(node, name) {
      var arr = [];
      queue = [];
      if (node) {
        arr.push(node);
      }
      while (arr.length > 0) {
        var p = arr.shift();
        if (p.tagName === name) {
          queue.push(p);
        }
        if (p.firstElementChild) {
          p = p.firstElementChild;
          arr.push(p);
          while (p.nextElementSibling) {
            p = p.nextElementSibling;
            arr.push(p);
          }
        }
      }

    }
    function preDFS(node, name) {
      
      reset();
      (function DFS(node, name) {

        if (node) {
          
            queue.push(node);
            if (node.firstElementChild) {
              DFS(node.firstElementChild);
              next = node.firstElementChild.nextElementSibling;
              while (next) {
                p = next;
                DFS(next);
                next = p.nextElementSibling;
              }
            }
        }
     
      })(node, name);

    }
    function inDFS(node, name) {
      reset();

      (function DFS(node, name) {
        if (node) {

          DFS(node.firstElementChild);
          queue.push(node);
          if (node.firstElementChild) {
            next = node.firstElementChild.nextElementSibling;
            while (next) {
              p = next;
              DFS(next);

              next = p.nextElementSibling;
            }

          }
        }
      })(node, name);

    }
    function postDFS(node, name) {
      
      reset();
      (function DFS(node, name) {
        if (node) {
          DFS(node.firstElementChild);
          if (node.firstElementChild) {
            next = node.firstElementChild.nextElementSibling;
            while (next) {
              p = next;
              DFS(next);
              next = p.nextElementSibling;
            }
          }
          queue.push(node);
        }




      })(node, name);

    }
  
    function render(value) {
      var i = 0;
     
      var timer = setInterval(function () {
        if (i <= queue.length) {
          if (i > 0) {
            queue[i - 1].classList.remove('onclick');
          }
          var node = queue[i];
          if (node) {
            if (node.firstChild.nodeValue.trim() === value) {
              node.classList.add('onclick');

              var endTime = new Date();
              var time = endTime - startTime;
              clearInterval(timer);
              isAnimation = false;
              alert('Bingo!本次搜索用时：' + time / 1000 + 's');
             
              return;


            }
            node.classList.add('onclick');
          }
          i++;

        } else {
          clearInterval(timer);
          isAnimation = false;
          alert('没有找到相关查询')
         
           
        }
      }, 600)
    }
    $.delegateEvent($('choose'), 'button', 'click', action);
    function action() {
      if(isAnimation){
        alert('in animating');
        return
      }
      isAnimation = true
      var value = $('search').value.trim();
      startTime = new Date();
      switch (this.id) {
        case 'add':
          add();
          isAnimation = false;
          break;
        case 'delete':
          del();
          isAnimation = false;
          break;
        case 'BFS':
          if (value) {
            BFS(sec, 'DIV');
            render(value);
          } else {
            alert('请先输入查询内容');
          }
          break;
        case 'preDFS':
          if (value) {
            preDFS(sec, 'DIV');
            render(value);
          } else {
            alert('请先输入要查询的内容');

          }
          break;
        case 'inDFS':
          if (value) {
            inDFS(sec, 'DIV');
            render(value);
          } else {
            alert('请先输入要查询的内容');

          }
          break;
        case 'postDFS':
          if (value) {
            postDFS(sec, 'DIV');
            render(value);
          } else {
            alert('请先输入要查询的内容');

          }
          break;
      }
      

    }
  })(window);
}

