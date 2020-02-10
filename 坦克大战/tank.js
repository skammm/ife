


	

     //使用匿名函数不会污染全局作用域
     (function(window,undefined){
        //创建一个对象来保存所有图像，不必每次重新创建一个新的图像,图像只需加载一次
        var imageRepositoryimg = new function(){
            this.background = new Image();
            this.enemy = new Image();
            this.ship = new Image();
            this.enemyBullet = new Image();
            this.bullet = new Image();
            var numImage = 5;
            var loaded = 0;
            var load = document.querySelector('.load');
            var proNumber = document.getElementById('proNumber');
            var progress = document.getElementById('progress');
            function imageOnload(){
                loaded++;
                proNumber.innerHTML = (loaded/numImage)*100 + '%';
                progress.style.width = (loaded/numImage)*100 + '%';
                if(loaded === numImage){
                    load.style.display = 'none';
                    init();
                }
            }
            this.background.onload =  function(){
               imageOnload();
            }
            this.ship.onload = function(){
                imageOnload();
            }
            this.bullet.onload = function(){
                imageOnload();
            }
            this.enemy.onload = function(){
                imageOnload();
            }
            this.enemyBullet.onload = function(){
                imageOnload();
            }
            this.background.src = 'image/bg.png';
            this.ship.src = 'image/ship.png';
            this.bullet.src = 'image/bullet.png';
            this.enemy.src = 'image/enemy.png';
            this.enemyBullet.src = 'image/bullet_enemy.png';
        }
        /*
        Drawable对象为抽象对象，是所有其他对象都将继承的特殊对象
        */
        function Drawable(){
            this.init = function(x,y,width,height){
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            this.speed = 0;
            this.canvasWidth = 0;
            this.canvasHeight = 0;
            this.isColliding = false;//保存每个对象是否已经发生碰撞
            this.collidiableWith = '';//每个对象都有一个与之碰撞的对象列表
            this.type = '';
            this.draw = function(){};
            this.move = function(){};
            this.isCollidiableWith = function(obj){
                return (this.collidiableWith === obj.type);
            }
        }
        //处理图像平移的背景对象
        function Background(){
            this.speed = 1;
            this.draw = function(){
                this.y += this.speed;               
                this.context.drawImage(imageRepositoryimg.background,this.x,this.y);
                this.context.drawImage(imageRepositoryimg.background,this.x,this.y-this.canvasHeight);
                if(this.y>this.canvasHeight){
                    this.y = 0;
                }
            }
        }
        Background.prototype = new Drawable();
        /*
        对象池的数据结构，该数据结构可以重复使用旧对象，防止对象创建过多
        带来的内存问题
        */
         function Pool(maxSize){
             var maxSize = maxSize;
             var pool = [];
             this.init=function(obj){
                if(obj === 'bullet'){
                    for(var i = 0;i < maxSize;i++){
                        var bullet = new Bullet('bullet');
                        bullet.collidiableWith = 'enemy';
                        bullet.type = 'bullet';
                        bullet.init(0,0,imageRepositoryimg.bullet.width,imageRepositoryimg.bullet.height);
                        pool[i] = bullet;
                    }
                }else if(obj === 'enemy'){
                    for(var i = 0;i < maxSize;i++){
                        var enemy = new Enemy();
                        enemy.init(0,0,imageRepositoryimg.enemy.width,imageRepositoryimg.enemy.height);
                        pool[i] = enemy;
                    }
                }else if(obj === 'enemyBullet'){
                    for(var i = 0;i < maxSize;i++){
                        var bullet = new Bullet('enemyBullet');
                        bullet.collidiableWith = 'ship';
                        bullet.type = 'enemyBullet';
                        bullet.init(0,0,imageRepositoryimg.enemyBullet.width,imageRepositoryimg.enemyBullet.height);
                        pool[i] = bullet;
                    }
                }
             }
             this.get = function(x,y,speed){
                 if(!pool[maxSize -1].alive){
                     pool[maxSize-1].spawn(x,y,speed);
                     pool.unshift(pool.pop());
                 }
             }
             this.getTwo = function(x1,y1,speed1,x2,y2,speed2){
                 if(!pool[maxSize-1].alive&&!pool[maxSize-2].alive){
                     this.get(x1,y1,speed1);
                     this.get(x2,y2,speed2);
                 }
             }
             //这个函数将池中所有活动对象以数组的方式返回，并将其插入四叉树
             this.getPool = function(){
                 var obj = [];
                for(var i=0;i<maxSize;i++){
                    if(pool[i].alive){
                        obj.push(pool[i]);
                    }
                }
              
                return obj;
                
             };
             this.animate = function(){
                 for(var i=0;i<maxSize;i++){
                     if(pool[i].alive){
                        if(pool[i].draw()){
                            pool[i].clear();
                            pool.push(pool.splice(i,1)[0]);
                        }
                     }else{
                         break;
                     }
                 }
             }

         }
         /*
            子弹对象，该对象提供了三种方法，生成、绘制、清除
            @param obj  表示两种不同类型的子弹,通过传入的参数来确定子弹什么时候
                        离开画布，以及在画布上绘制什么样图案
         */
        function Bullet(obj){
            this.alive = false;
            var self = obj;
            this.spawn = function(x,y,speed){
                this.x = x;
                this.y = y;
                this.speed = speed;
                this.alive = true;
            }
            this.draw = function(){
                this.context.clearRect(this.x,this.y,this.width,this.height);
                this.y -= this.speed;
                if(this.isColliding){
                    return true;
                }
                else if(self === 'bullet'&&this.y < 0-this.height){
                    return true;
                }else if(self==='enemyBullet'&&this.y>this.canvasHeight){
                    return true;
                }
                else{
                    if(self==='bullet'){                     
                        this.context.drawImage(imageRepositoryimg.bullet,this.x,this.y,this.width,this.height);                        
                    }else if(self === 'enemyBullet'){

                        this.context.drawImage(imageRepositoryimg.enemyBullet,this.x,this.y,this.width,this.height);
                    }
                    return false;
                }
                
            }
            this.clear = function(){
                this.x = 0;
                this.y = 0;
                this.speed = 0;
                this.alive = false;
                this.isColliding = false;
            }
        }
        Bullet.prototype = new Drawable();
        /*
         获得游戏键盘的输入
        */
         var KEY_CODES = {
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
         }
         var KEY_STATUS = {};
         for(p in KEY_CODES){
             KEY_STATUS[KEY_CODES[p]] = false;
         }
         document.onkeydown = function(e){
             var code = e.keyCode;
             if(KEY_CODES[code]){
                 e.preventDefault();
                 KEY_STATUS[KEY_CODES[code]] = true;
             }
         }
         document.onkeyup = function(e){
            var code = e.keyCode;
            if(KEY_CODES[code]){
                e.preventDefault();
                KEY_STATUS[KEY_CODES[code]] = false;
            }
        }
        /*
        创建一个船对象，该对象有绘制、移动、开火三种方法
        */
         function Ship(){
             
             this.alive=true;
             this.speed = 3;
             this.bulletPool = new Pool(30);
             this.bulletPool.init('bullet');
             var count = 0;
             var fireRate =15;
             this.collidiableWith = 'enemyBullet';
             this.type = 'ship';
             this.draw = function(){
                
                 this.context.drawImage(imageRepositoryimg.ship,this.x,this.y,this.width,this.height);
             };
             this.move = function(){
                 count++;
                 if(KEY_STATUS.left||KEY_STATUS.right||KEY_STATUS.up||KEY_STATUS.down){
                    this.context.clearRect(this.x,this.y,this.width,this.height);
                    if(KEY_STATUS.left){
                        this.x -= this.speed;
                        if(this.x < 0){
                            this.x = 0;
                        }
                    }else if(KEY_STATUS.right){
                        this.x += this.speed;
                        if(this.x>this.canvasWidth-this.width){
                            this.x = this.canvasWidth-this.width;
                        }
                    }else if(KEY_STATUS.up){
                        this.y -= this.speed;
                        if(this.y<this.canvasHeight/4*3+30){
                            this.y=this.canvasHeight/4*3+30;
                        }
                    }else if(KEY_STATUS.down){
                        this.y += this.speed;
                        if(this.y > this.canvasHeight-this.height){
                            
                            this.y = this.canvasHeight-this.height;
                        }
                    }
                    if(!this.isColliding){
                        this.draw();
                    }else{
                        this.alive = false;
                    }
                }
                if(KEY_STATUS.space&&count>fireRate&&!this.isColliding){
                    
                    this.fire();
                    count=0;
                }
                 
             };
             this.fire = function(){
                this.bulletPool.getTwo(this.x+6,this.y,3,this.x+33,this.y,3);
             }

         }
         Ship.prototype = new Drawable();
         /*
            创建敌舰对象，该对象有生成、绘制、开火、清除四个方法
            该对象没有自己的子弹池，是为了松耦合，防止敌舰被消灭后子弹停留在页面上
         */
         function Enemy(){
             this.percentFire = .01;
             var chance = 0;
             this.collidiableWith = 'bullet';
             this.type = 'enemy';
             this.spawn = function(x,y,speed){
                this.x=x;
                this.y=y;
                this.speed = speed;
                this.speedX = 0;
                this.speedY = speed;
                this.alive = true;
                this.leftEdge = this.x - 90;
                this.rightEdge = this.x + 90;
                this.bottomEdge = this.y + 140;
             }
             this.draw = function(){
                 this.context.clearRect(this.x,this.y,this.width,this.height);
                 this.x += this.speedX;
                 this.y += this.speedY;
                 if(this.y >= this.bottomEdge){
                     this.speedY = 0;
                     this.y -= 5;
                     this.speed = 1.5;
                     this.speedX -= this.speed;
                 }else if(this.x <= this.leftEdge){
                     this.speedX = this.speed;
                 }else if(this.x >= this.rightEdge){
                     this.speedX = -this.speed;
                 }
                 if(!this.isColliding){
                    this.context.drawImage(imageRepositoryimg.enemy,this.x,this.y,this.width,this.height);
                    chance = Math.floor(Math.random()*101);
                    if(chance/100 < this.percentFire){
                        this.fire();
                    }
                    return false;
                 }else{
                     game.playSorec +=10;
                     return true;
                 }
             }
             this.fire = function(){
                 game.enemyBulletPool.get(this.x+this.width/2,this.y+this.height,-2.5);
             }
             this.clear = function(){
                 this.x=0;
                 this.y=0;
                 this.speed=0;
                 this.speedX = 0;
                 this.speedY=0;
                 this.alive = false;
                 this.isColliding = false;
             }
         }
         Enemy.prototype = new Drawable();
         /*
            二维碰撞检测，每帧都要运行一次二维碰撞检测算法
            所以算法要执行的检查次数要越少越好
            通过空间分区，我们可以将碰撞检测从每帧5000次减少到每帧100次
         */
        /**
         * 四叉树
         *
         * 
         *     |
         *  1  |  0
         * —-+—-
         *  2  |  3
         *     |
         */
        function QuadTree(boundBox, lvl) {
            var maxObjects = 10;
            this.bounds = boundBox || {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            var objects = [];
            this.nodes = [];
            var level = lvl || 0;
            var maxLevels = 5;
            /*
             * 清楚四叉树里的所有节点对象
             */
            this.clear = function() {
                objects = [];
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].clear();
                }
                this.nodes = [];
            };
            /*
             * 得到所有在四叉树里的对象
             */
            this.getAllObjects = function(returnedObjects) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].getAllObjects(returnedObjects);
                }
                for (var i = 0, len = objects.length; i < len; i++) {
                    returnedObjects.push(objects[i]);
                }
                return returnedObjects;
            };
            /*
             * 返回所有可能会与目标发生撞击的对象
             */
            this.findObjects = function(returnedObjects, obj) {
                if (typeof obj === "undefined") {
                    console.log("UNDEFINED OBJECT");
                    return;
                }
                var index = this.getIndex(obj);
                if (index != -1 && this.nodes.length) {
                    this.nodes[index].findObjects(returnedObjects, obj);
                }
                for (var i = 0, len = objects.length; i < len; i++) {
                    returnedObjects.push(objects[i]);
                }
                return returnedObjects;
            };
            /*
             
             * 插入对象到四叉树中。如果对象数目超出了四叉树的容量，划分子节点
             */
            this.insert = function(obj) {
                if (typeof obj === "undefined") {
                    return;
                }
                if (obj instanceof Array) {
                    for (var i = 0, len = obj.length; i < len; i++) {
                        this.insert(obj[i]);
                    }
                    return;
                }
                if (this.nodes.length) {
                    var index = this.getIndex(obj);
                    //只插入能完全在子节点中的对象
                    if (index != -1) {
                        this.nodes[index].insert(obj);
                        return;
                    }
                }
                objects.push(obj);
                //防止无限划分
                if (objects.length > maxObjects && level < maxLevels) {
                    if (this.nodes[0] == null) {
                        this.split();
                    }
                    var i = 0;
                    while (i < objects.length) {
                        var index = this.getIndex(objects[i]);
                        if (index != -1) {
                            this.nodes[index].insert((objects.splice(i,1))[0]);
                        }
                        else {
                            i++;
                        }
                    }
                }
            };
            /*
              返回对象的节点索引
             */
            this.getIndex = function(obj) {
                var index = -1;
                var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
                var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
                
                var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
                
                var bottomQuadrant = (obj.y > horizontalMidpoint);
         
                if (obj.x < verticalMidpoint &&
                        obj.x + obj.width < verticalMidpoint) {
                    if (topQuadrant) {
                        index = 1;
                    }
                    else if (bottomQuadrant) {
                        index = 2;
                    }
                }
                
                else if (obj.x > verticalMidpoint) {
                    if (topQuadrant) {
                        index = 0;
                    }
                    else if (bottomQuadrant) {
                        index = 3;
                    }
                }
                return index;
            };
            /*
             * 将节点划分为四个子节点
             */
            this.split = function() {
                
                var subWidth = (this.bounds.width / 2) | 0;
                var subHeight = (this.bounds.height / 2) | 0;
                this.nodes[0] = new QuadTree({
                    x: this.bounds.x + subWidth,
                    y: this.bounds.y,
                    width: subWidth,
                    height: subHeight
                }, level+1);
                this.nodes[1] = new QuadTree({
                    x: this.bounds.x,
                    y: this.bounds.y,
                    width: subWidth,
                    height: subHeight
                }, level+1);
                this.nodes[2] = new QuadTree({
                    x: this.bounds.x,
                    y: this.bounds.y + subHeight,
                    width: subWidth,
                    height: subHeight
                }, level+1);
                this.nodes[3] = new QuadTree({
                    x: this.bounds.x + subWidth,
                    y: this.bounds.y + subHeight,
                    width: subWidth,
                    height: subHeight
                }, level+1);
            };
        }
        /*
        创建处理最终游戏的对象,更新游戏对象和动画功能
        */
        function Game(){
            this.init = function(){
                this.bgCanvas = document.getElementById('background');
                this.shipCanvas = document.getElementById('ship');
                this.mainCanvas = document.getElementById('main');
                this.playSorec = 0;
                if(this.bgCanvas.getContext){
                    this.bgContext = this.bgCanvas.getContext('2d');
                    this.shipContext = this.shipCanvas.getContext('2d');
                    this.mainContext = this.mainCanvas.getContext('2d');
                    Background.prototype.context = this.bgContext;
                    Background.prototype.canvasWidth = this.bgCanvas.width;
                    Background.prototype.canvasHeight = this.bgCanvas.height;
                    Ship.prototype.context = this.shipContext;
                    Ship.prototype.canvasWidth = this.shipCanvas.width;
                    Ship.prototype.canvasHeight = this.shipCanvas.height;
                    Bullet.prototype.context = this.mainContext;
                    Bullet.prototype.canvasWidth = this.mainCanvas.width;
                    Bullet.prototype.canvasHeight = this.mainCanvas.height;
                    Enemy.prototype.context = this.mainContext;
                    Enemy.prototype.canvasWidth = this.mainCanvas.width;
                    Enemy.prototype.canvasHeight = this.mainCanvas.height;
                    this.background = new Background();
                    this.background.init(0,0);
                    this.ship = new Ship();
                    this.shipStartX = this.shipCanvas.width/2 - imageRepositoryimg.ship.width/2;
                    this.shipStartY = this.shipCanvas.height/4*3+imageRepositoryimg.ship.height*2;

                    this.ship.init(this.shipStartX,this.shipStartY,imageRepositoryimg.ship.width,imageRepositoryimg.ship.height);
                    this.enemy = new Enemy();
                    this.enemyPool = new Pool(30);
                    this.enemyPool.init('enemy');
                    
                    this.spawnWave = function(){
                        var width = imageRepositoryimg.enemy.width;
                        var height = imageRepositoryimg.enemy.height;
                        var x = 100;
                        var y = -height;
                        var space = y*1.5;
                        for(var i=1;i<=18;i++){
                            this.enemyPool.get(x,y,2);                       
                            x+=width+25;
                            if(i%6 === 0){
                                x=100;
                                y += space+15;
                            }
                        }
                    }
                    this.spawnWave();
                    this.enemyBulletPool = new Pool(50);
                    this.enemyBulletPool.init('enemyBullet');
                    this.backgroundAudio = new Audio('Time.mp3');
                    this.backgroundAudio.loop = true;
                    this.backgroundAudio.volume = .25;
                    this.backgroundAudio.load();
                    this.gameOverAudio = new Audio('game_over.wav');
                    this.gameOverAudio.loop = true;
                    this.gameOverAudio.volume = .25;
                    this.gameOverAudio.load();
                    this.checkAdio = setInterval(checkReadyState,1000);
                    // this.reset = document.getElementById('restart');
                    
                    this.quadTree = new QuadTree({x:0,y:0,width:this.mainCanvas.width,height:this.mainCanvas.height});
                    this.gameOver = function() {
                        this.backgroundAudio.pause();
                        this.gameOverAudio.currentTime = 0;
                        this.gameOverAudio.play();
                        document.getElementById('game-over').style.display = "block";
                    };
                    this.restart = function() {
                        
                        this.gameOverAudio.pause();
                        
                        document.getElementById('game-over').style.display = "none";
                        this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
                        this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
                        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
                        this.quadTree.clear();
                        this.background.init(0,0);
                        this.ship.init(this.shipStartX, this.shipStartY,
                                       imageRepositoryimg.ship.width, imageRepositoryimg.ship.height);
                        this.enemyPool.init("enemy");
                        this.spawnWave();
                        this.enemyBulletPool.init("enemyBullet");
                        this.playSorec = 0;
                        this.backgroundAudio.currentTime = 0;
                        this.backgroundAudio.play();
                        this.ship.alive = true;
                        this.ship.isColliding = false;
                        this.start();
                    };
                   
                    return true;
                }else{
                    return false;
                }
            };
            this.start=function(){                
                this.ship.draw();
                this.backgroundAudio.play();
                animate();
            }
            
        }
        
        function checkReadyState(){
            if(game.backgroundAudio.readyState===4&&game.gameOverAudio.readyState===4){
                window.clearInterval(game.checkAdio);
                game.start();
            }
        }
        function bind(obj,handle){
            return function(){        
                return handle.apply(obj,arguments);
            }
        }
        function animate(){
            if(game.enemyBulletPool.getPool().length===0){
                game.spawnWave();
                game.enemy.percentFire+=.05;
            }
            document.getElementById('score').innerHTML = game.playSorec;
            //将对象插入到四叉树中
            game.quadTree.clear();
            game.quadTree.insert(game.ship);
            game.quadTree.insert(game.ship.bulletPool.getPool());
            game.quadTree.insert(game.enemyPool.getPool());
            game.quadTree.insert(game.enemyBulletPool.getPool());
            detectCollision();
            //循环播放动画
            
           if(game.ship.alive){
            requestAnimationFrame(animate);
            game.background.draw();
            game.ship.move();
            game.ship.bulletPool.animate();
            game.enemyPool.animate();
            game.enemyBulletPool.animate();
           }else{
               game.gameOver();
           }
           
            reset.onclick = bind(game,game.restart);
            
        }
        function detectCollision() {
            var objects = [];
           
            game.quadTree.getAllObjects(objects);//返回四叉树中所有的对象
            
            for (var x = 0, len = objects.length; x < len; x++) {
                game.quadTree.findObjects(obj = [], objects[x]);
        
                for (y = 0, length = obj.length; y < length; y++) {
        
                    // 检测两个对象是否发生撞击
                    if (objects[x].collidiableWith === obj[y].type &&
                        (objects[x].x < obj[y].x + obj[y].width &&
                         objects[x].x + objects[x].width > obj[y].x &&
                         objects[x].y < obj[y].y + obj[y].height &&
                         objects[x].y + objects[x].height > obj[y].y)) {
                        objects[x].isColliding = true;
                        
                        obj[y].isColliding = true;
                    }
                }
            }
				};
				var game = new Game();
        var reset = document.getElementById('restart');
        function init(){
           game.init();
				}
			
        
        
            
        
    
     })(window);
  

