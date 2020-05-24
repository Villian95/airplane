//获得主界面
var main = document.getElementById('main');
//获得开始界面
var bgstart = document.getElementById('start');
//获得开始游戏按钮
var playgame = bgstart.getElementsByTagName('a')[0];
//获取分数
var showScore = document.getElementById('showScore');
//获取暂停控制界面
var control = document.getElementById('control');
var jixu = control.getElementsByTagName('a')[0];//继续按钮
var chongxin = control.getElementsByTagName('a')[1];//重新按钮
var fanhui = control.getElementsByTagName('a')[2];//返回按钮
//获取游戏结束界面
var gameover = document.getElementById('gameover');
//获取游戏结束总分界面
var total_score = document.getElementById('total_score');
//获取游戏结束重新开始按钮
var again = document.getElementById('again');
var settime;//计时器
var bullets = [];
var enemys = [];
var scores = 0;//得分
//点击开始游戏
playgame.addEventListener('click',gameStart);
function gameStart(){
	gameover.style.display = 'none';
	bgstart.style.display = 'none';
	settime = setInterval(begin,20);
	main.addEventListener('mousemove',planMove);
	
}
//重新开始
again.addEventListener('click',gameAgain);
function gameAgain(){
	location.reload(true);
}
//创建飞机
function airPlane(life,x,y,sizeW,sizeH,score,speed,boomImg,normalImg,dieTime){
	this.life = life;
	this.survive = true;
	this.x = x;
	this.y = y;
	this.sizeW = sizeW;
	this.sizeH = sizeH;
	this.score = score;
	this.speed = speed;
	this.boomImg = boomImg;
	this.normalImg = normalImg;
	this.dieTimes=0;
	this.dieTime = dieTime;
	this.imgNode = null;
	this.init = function(){
		this.imgNode = document.createElement('img');
		this.imgNode.src = normalImg;
		this.imgNode.style.left = this.x + 'px';
		this.imgNode.style.top = this.y + 'px';
		main.appendChild(this.imgNode);
	}
	this.enemyMove = function (){
		if(scores <= 5000){
			this.imgNode.style.top = this.imgNode.offsetTop + this.speed + 'px';
		}
		else if(scores > 5000 && scores <= 10000){
			this.imgNode.style.top = this.imgNode.offsetTop + this.speed + 1 + 'px';
		}
		else if(scores > 10000 && scores <= 15000){
			this.imgNode.style.top = this.imgNode.offsetTop + this.speed + 2 + 'px';
		}
		else if(scores > 15000 && scores <= 20000){
			this.imgNode.style.top = this.imgNode.offsetTop + this.speed + 3 + 'px';
		}
		else{
			this.imgNode.style.top = this.imgNode.offsetTop + this.speed + 4 + 'px';
		}
	}
	this.init();
}
//设置友方飞机
function myAirPlane(X,Y){
	airPlane.call(this,1,X,Y,66,80,0,0,'img/本方飞机爆炸.gif','img/我的飞机.gif')
	this.imgNode.setAttribute('id','ourplan');
}
//设置敌方飞机
function enemyAirPlane(life,a,b,sizeW,sizeH,score,speed,boomImg,normalImg,dieTime){
	airPlane.call(this,life,random(a,b),-100,sizeW,sizeH,score,speed,boomImg,normalImg,dieTime)
}
function random(min,max){
	return Math.floor(min + Math.random()*(max - min));
}
//飞机移动
var selfplan = new myAirPlane(127,488);
//暂停界面
selfplan.imgNode.addEventListener('click',zanTing);//点击飞机获得暂停事件
function zanTing(){
	control.style.display = 'block';
	clearInterval(settime);
	main.removeEventListener('mousemove',planMove,false);
}
jixu.onclick = function(){
	control.style.display = 'none';
	settime = setInterval(begin,20);
	main.addEventListener('mousemove',planMove);
}
chongxin.onclick = function(){
	control.style.display = 'none';
	gameAgain();
	bgstart.style.display = 'none';
}
fanhui.onclick = function(){
	gameAgain();
}
var planMove = function (e){
	var ourplan = document.getElementById('ourplan');
	var selfplanX=e.clientX-400;
 	var selfplanY=e.clientY-30;
 	ourplan.style.left=selfplanX-selfplan.sizeW/2+"px";
	ourplan.style.top=selfplanY-selfplan.sizeH/2+"px";
	if(parseInt(ourplan.style.left)<=-28){
		ourplan.style.left=-28+'px';
	}
	if(parseInt(ourplan.style.left)>=282){
		ourplan.style.left=282+'px';
	}
	if(parseInt(ourplan.style.top)>=505){
		ourplan.style.top=505+'px';
	}
	if(parseInt(ourplan.style.top)<=0){
		ourplan.style.top=0+'px';
	}
}
//子弹类
function bullet(x,y,sizeW,sizeH,bulletImgSrc){
	this.bulletX = x;
	this.bulletY = y;
	this.bulletSizeW = sizeW;
	this.bulletSizeH = sizeH;
	this.bulletImgSrc = bulletImgSrc;
	this.damage = 1;
	this.bulletNode = null;
	this.bulletMove = function(){
		this.bulletNode.style.top=this.bulletNode.offsetTop-20+"px";
	}
	this.bulletInit = function(){
		this.bulletNode = document.createElement('img');
		this.bulletNode.src = bulletImgSrc;
		this.bulletNode.zIndex = 1;
		this.bulletNode.style.left = this.bulletX + "px";
		this.bulletNode.style.top = this.bulletY + "px";
		main.appendChild(this.bulletNode);
	}
	this.bulletInit()
}
function setBullet(X,Y){
	bullet.call(this,X,Y,28,25,'img/便便子弹.png');
}
//背景移动
var num=0,n=0,scoll=0;
var begin = function(){
	num++;
	scoll++;
	main.style.backgroundPosition='0'+ ' ' + scoll + 'px';
	//子弹发射
	if(scoll%5 ==0){
		bullets.push(new setBullet(parseInt(selfplan.imgNode.style.left)+20,parseInt(selfplan.imgNode.style.top)))
	}
	for(var i=0;i<bullets.length;i++){
		bullets[i].bulletMove();
		if(parseInt(bullets[i].bulletNode.style.top)<0){
			main.removeChild(bullets[i].bulletNode);
			bullets.splice(i,1);
		}
	}
	//敌机出现
	if(num == 20){
		n++;
		if(n % 5 == 0){//中型敌机
			enemys.push(new enemyAirPlane(5,25,274,46,60,500,random(1,3),'img/中飞机爆炸.gif','img/enemy3_fly_1.png',360));
		}
		if(n == 20){//大型敌机
			enemys.push(new enemyAirPlane(10,57,210,110,170,2000,0.5,'img/大飞机爆炸.gif','img/enemy2_fly_1.png',540));
			n=0;
		}
		else{//小型敌机
			enemys.push(new enemyAirPlane(1,19,286,34,24,100,random(1,4),'img/小飞机爆炸.gif','img/enemy1_fly_1.png',360));
		}
		num = 0;
	}
	for(var i=0;i<enemys.length;i++){
		if(enemys[i].survive == true){
			enemys[i].enemyMove();
		}
		if(parseInt(enemys[i].imgNode.offsetTop) >= 568){
			main.removeChild(enemys[i].imgNode);
			enemys.splice(i,1);
		}
		if(enemys[i].survive == false){
			enemys[i].dieTimes += 20;
			if(enemys[i].dieTimes == enemys[i].dieTime){
				main.removeChild(enemys[i].imgNode);
				enemys.splice(i,1);
			}
		}
	}
	for(var i = 0;i<bullets.length;i++){
		for(var j = 0;j<enemys.length;j++){
			if(enemys[j].survive == true){
				//友机与敌机碰撞检测
				if((enemys[j].imgNode.offsetLeft + enemys[j].sizeW >= selfplan.imgNode.offsetLeft) && (enemys[j].imgNode.offsetLeft <= selfplan.imgNode.offsetLeft + selfplan.sizeW)){
              		if((enemys[j].imgNode.offsetTop + enemys[j].sizeH >= selfplan.imgNode.offsetTop) && (enemys[j].imgNode.offsetTop <= selfplan.imgNode.offsetTop + selfplan.sizeH)){
              			selfplan.survive = false;
              			total_score.innerHTML = scores;
              			gameover.style.display="block";
              		}
             	}
				//子弹与敌机碰撞检测
				if((bullets[i].bulletNode.offsetLeft + bullets[i].bulletSizeW >= enemys[j].imgNode.offsetLeft) && (bullets[i].bulletNode.offsetLeft <= enemys[j].imgNode.offsetLeft + enemys[j].sizeW)){
					if((bullets[i].bulletNode.offsetTop + bullets[i].bulletSizeH >= enemys[j].imgNode.offsetTop)&&(bullets[i].bulletNode.offsetTop <= enemys[j].imgNode.offsetTop + enemys[j].sizeH)){
						enemys[j].life = enemys[j].life - bullets[i].damage;
						main.removeChild(bullets[i].bulletNode);
						bullets.splice(i,1);
						if( enemys[j].life == 0){
							scores += enemys[j].score;
							showScore.innerHTML = scores;
							enemys[j].survive = false;
							enemys[j].imgNode.src=enemys[j].boomImg;
						}
					}
				}
			}
		}
	}
	if(selfplan.survive == false){
		console.log('飞机死亡')
		selfplan.imgNode.src = selfplan.boomImg;
		clearInterval(settime);
		main.removeEventListener('mousemove',planMove,false);
	}
}








