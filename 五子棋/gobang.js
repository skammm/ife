(function(window,undefined){
    var canvas=document.querySelector('#cheer');
    var bg = document.querySelector('#bg');
    var flag=true;
    var over=false;
    //二维数组用于判断棋盘上是否有子
    var cheerArr=[];
    //三维数组，统计棋盘上所有的赢法数组，包含棋盘上所有能连成的线
    var wins=[];
    //赢法统计数组
    var myWin=[];//我方计分数组
    var computerWin=[];//电脑计分数组
    var count=0;//赢法种类的索引，每种连法的id

    
    for(var i=0;i<15;i++){
        cheerArr[i]=[];
        for(var j=0;j<15;j++){
            cheerArr[i][j]=0;
        }
    }
    //创建一个三维数组
    for(var i=0;i<15;i++){
        wins[i]=[];
        for(var j=0;j<15;j++){
            wins[i][j]=[];
        }
    }
    //竖向
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++ ){
            for(var k=0;k<5;k++){
                wins[i][j+k][count]=true;
            }
            count++;           
        }
    }
    //横向
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[j+k][i][count]=true;
            }
            count++;           
        }
    }
    //正斜向
    for(var i=0;i<11;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i+k][j+k][count]=true;
            }
            count++;           
        }
    }
    //反斜向
    for(var i=0;i<11;i++){
        for(var j=14;j>3;j--){
            for(var k=0;k<5;k++){
                wins[i+k][j-k][count]=true;
            }
            count++;           
        }
    }
    for(var i=0;i<count;i++){
        myWin[i]=0;
        computerWin[i]=0;
    }
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
        var backImg = bg.getContext('2d');
        ctx.strokeStyle = '#000';
        var logo = new Image();
        logo.onload = function(){
            backImg.globalAlpha = 0.7;
            backImg.drawImage(logo,0,0,450,450);
            createCheer();
        }
        logo.src = '../../css/image/x18.jpg';          
    }
    function createCheer(){
        for(var i=0;i<15;i++){
            ctx.beginPath();
            ctx.moveTo(15+30*i,15);
            ctx.lineTo(15+30*i,435);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(15,15+30*i);
            ctx.lineTo(435,15+30*i);
            ctx.stroke();
        }
    }
    function cheers(x,y,me){
        ctx.beginPath();
        ctx.arc(15+30*x,15+30*y,15,0,2*Math.PI);
        var radgrad = ctx.createRadialGradient(15+30*x,15+30*y,15,15+30*x+3,15+30*y+3,5);
        if(me){
            radgrad.addColorStop(0, '#0A0A0A');
            radgrad.addColorStop(1, '#636766');
        }else{
            radgrad.addColorStop(0, '#D1D1D1');
            radgrad.addColorStop(1, '#F9F9F9');
        }
        ctx.fillStyle = radgrad;
        ctx.fill();
    }
    canvas.onclick=function(e){
        if(over){
            return;
        }
        if(!flag){
            return;
        }
        var x=e.offsetX;
        var y=e.offsetY;
        var i=Math.floor(x/30);
        var j=Math.floor(y/30);
        
        if(cheerArr[i][j]===0){
            cheers(i,j,flag);
            cheerArr[i][j]=1;          
            for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k]=6;
                if(myWin[k]===5){
                    window.alert('你赢了');
                    over=true;
                }
            }
           }
           if(!over){
            flag=!flag;
            computerAI();
        }
        }
        
    }
    var computerAI=function(){
    //判断得分
    var myScore=[];
    var computerScore=[];
    var max=0;
    var u=0;
    var v=0;
    for(var i=0;i<15;i++){
        myScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }//统计每一个还没有落子的坐标上的点的得分，找出得分最大的坐标的点
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                if( cheerArr[i][j]===0){
                    for(var k=0;k<count;k++){
                        if(wins[i][j][k]){
                            if(myWin[k]===1){
                                myScore[i][j]+=200
                            }else if(myWin[k]===2){
                                myScore[i][j]+=400;
                            }else if(myWin[k]===3){
                                myScore[i][j]+=2000;
                            }else if(myWin[k]===4){
                                myScore[i][j]+=10000;
                            }
                            if(computerWin[k]===1){
                                computerScore[i][j]+=210
                            }else if(computerWin[k]===2){
                                computerScore[i][j]+=410;
                            }else if(computerWin[k]===3){
                                computerScore[i][j]+=2100;
                            }else if(computerWin[k]===4){
                                computerScore[i][j]+=20000;
                            }
                        }
                    }
                    if(myScore[i][j]>max){
                        max=myScore[i][j];
                        u=i;
                        v=j;
                    }else if(myScore[i][j]===max){
                        if(computerScore[i][j]>computerScore[u][v]){
                            u=i;
                            v=j;
                        }
                    }
                    if(computerScore[i][j]>max){
                        max=computerScore[i][j];
                        u=i;
                        v=j;
                    }else if(computerScore[i][j]===max){
                        if(myScore[i][j]>myScore[u][v]){
                            u=i;
                            v=j;
                        }
                    }
                }
            }
        }
       
        cheers(u,v,false);
        cheerArr[u][v]=2;
        //刷新赢法数组
        for(var k=0;k<count;k++){
            if(wins[u][v][k]){
                computerWin[k]++;
                myWin[k]=6;//在这种赢法上，我方已经不可能连上五颗子
                if(computerWin[k]===5){
                    window.alert('电脑赢了');
                    over=true;
                }
            }
           }
           if(!over){
            flag=!flag;
           }
    }

   
})(window);