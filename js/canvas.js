/* 
 * author：Qyujie
 */

$(function() {
	var canvas = document.getElementById("mycanvas"),
		ctx = canvas.getContext("2d"),
		rectArray = {},//存放方块
		rectArrayIndex = 0,//方块下标
		rectArrayNum = 0.8,//0~1之间的数，表示方块数量
		mouseRect = new rect(true),//鼠标操控的方块
		canvasRect = {//与画布相同的方块，配合碰撞检测来验证小方块是否在画布中
			X: 0,
			Y: 0,
			width: canvas.width,
			height: canvas.height
		};

	function renderFrame() {//动画
		ctx.clearRect(0, 0, canvas.width, canvas.height);//清除画布
		drawRect(mouseRect);//绘制鼠标方块
		if(Math.random() > rectArrayNum) {//随机产出方块
			new rect();
		}
		for(var i in rectArray) {
			rectArray[i].X += Math.cos(rectArray[i].direction) * rectArray[i].speed;//根据方向和速度来改变位置
			rectArray[i].Y += Math.sin(rectArray[i].direction) * rectArray[i].speed;
			if(!collision_detection(canvasRect, rectArray[i])) {//如果方块不在画布中，就删除它，不然就绘制它
				delete rectArray[i];
			} else {
				drawRect(rectArray[i]);
				if(collision_detection(mouseRect, rectArray[i])) {
					console.log("碰撞");
					rectArray[i].color = "red";
				} else
					rectArray[i].color = "rgba(161,0,230,0.7)";
			}

		}

		requestAnimationFrame(renderFrame); //动画
	}

	requestAnimationFrame(renderFrame);

	$("html").mousemove(function(e) { //获取鼠标位置
		var rect = canvas.getBoundingClientRect();
		var mouseX = mouseRect.X = e.clientX - rect.left * (canvas.width / rect.width);
		var mouseY = mouseRect.Y = e.clientY - rect.top * (canvas.height / rect.height);
		$("#div-position").html("(" + mouseX + "," + mouseY + ")");
	});

	function rect(mouse) //矩形对象构造器
	{
		this.X = 0;
		this.Y = 0;
		this.width = 20;
		this.height = 20;
		this.color = "rgba(161,0,230,0.7)";
		if(mouse != true) {
			this.direction = 0;
			this.speed = 3;
			arcArrayIndex = 0;
			while(true) {
				if(rectArray[rectArrayIndex] == undefined) {
					rectArray[rectArrayIndex] = this;
					random_position(rectArray[rectArrayIndex]);
					break;
				} else
					rectArrayIndex++;
			}
		}

	}

	function random_position(rect) { //给rect在canvas中设置一个随机的位置以及运动方向及速度，其随机位置为画布边缘
		rect.speed = getSpeed(1, 3);
		var rw = rect.width,
			rh = rect.height,
			cw = canvas.width,
			ch = canvas.height,
			randomPositon = Math.round(Math.random() * (rw + rh + cw + ch) * 2);
		if(0 <= randomPositon && randomPositon < cw + rw) {
			rect.X = randomPositon - rw;
			rect.Y = -rh;
			rect.direction = Math.random() * Math.PI;
		} else if(cw + rw <= randomPositon && randomPositon < cw + rw + ch + rh) {
			rect.X = cw;
			rect.Y = randomPositon - (cw + rw) - rh;
			rect.direction = (Math.random() + 0.5) * Math.PI;
		} else if(cw + rw + ch + rh <= randomPositon && randomPositon < 2 * (cw + rw) + ch + rh) {
			rect.X = cw - (randomPositon - (cw + rw + ch + rh));
			rect.Y = ch;
			rect.direction = (Math.random() + 1) * Math.PI;
		} else if(2 * (cw + rw) + ch + rh <= randomPositon && randomPositon < 2 * (cw + rw + ch + rh)) {
			rect.X = -rw;
			rect.Y = ch - (randomPositon - (2 * (cw + rw) + ch + rh));
			rect.direction = (Math.random() + 1.5) * Math.PI;
		}
	}

	function drawRect(rect) { //绘制矩形
		ctx.fillStyle = rect.color;
		ctx.fillRect(rect.X, rect.Y, rect.width, rect.height);
	}

	function collision_detection(rect1, rect2) { //矩形与矩形的碰撞检测
		if(rect1.X < rect2.X + rect2.width &&
			rect1.X + rect1.width > rect2.X &&
			rect1.Y < rect2.Y + rect2.height &&
			rect1.Y + rect1.height > rect2.Y)
			return true;
		else
			return false;
	}

	function getSpeed(minSpeed, maxSpeed) { //获得一个速度
		return Math.random() * (maxSpeed - minSpeed) + minSpeed;
	}

});