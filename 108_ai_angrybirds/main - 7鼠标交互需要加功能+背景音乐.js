// --- 初始化游戏引擎 ---
game.init(); 
game.setFPS(60);

// 获取资源
var resBg = game.getResource().getTexture("img/bg.png");
var resBird = game.getResource().getTexture("img/bird.png");
var resWood = game.getResource().getTexture("img/wood.png");

var audio = new Audio();

var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);

// --- 游戏变量 ---
var gravity = 0.5;
var isFlying = false;
var inCooldown = false; 

var birdStartX = 150, birdStartY = 350;
var vx = 0, vy = 0;
var angle = -45;  
var power = 18;   

// --- 鼠标交互变量 (新增) ---
var isDragging = false;
var mouseStartX = 0;
var mouseStartY = 0;

// 动画变量
var woodAngle = 0;       
var targetWoodAngle = 0; 
var fallSpeed = 8;       

// 1秒倒计时变量 (60帧)
var cooldownFrames = 0;
var totalCooldownFrames = 60; 
var resultMessage = "";
var resultColor = {r: 0, g: 0, b: 0};

// --- 1. 预判虚线池 (灰色) ---
var dotCount = 15;
var dots = [];
for (var i = 0; i < dotCount; i++) {
    var dot = new Node();
    dot.setSize(4, 4);
    dot.setColor(0.5, 0.5, 0.5, 0.6); 
    dot.setHide(true);
    scene.addNode(dot);
    dots.push(dot);
}

// --- 2. 烟雾尾迹池 ---
var trailCount = 20;
var trails = [];
var trailIndex = 0;
for (var i = 0; i < trailCount; i++) {
    var trail = new Node();
    trail.setSize(8, 8);
    trail.setColor(1, 1, 1, 0.4); 
    trail.setHide(true);
    scene.addNode(trail);
    trails.push(trail);
}

// --- 3. 目标木块 ---
var wood = new Sprite();
wood.setTexture(resWood);
wood.setSize(50, 100);
wood.setPosition(650, 300);
scene.addNode(wood);

// --- 4. 小鸡精灵 ---
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(45, 45);
bird.setPosition(birdStartX, birdStartY);
scene.addNode(bird);

// --- 5. UI 标签 ---
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(240, 120);
labDebug.setColor(1, 0, 0, 0.4); 
labDebug.setTextColor(1, 1, 1, 1);
labDebug.setFont("font/st.ttf", 16); 
scene.addNode(labDebug); 

var labResult = new Label();
labResult.setPosition(300, 180); 
labResult.setSize(220, 80);     
labResult.setTextColor(1, 1, 1, 1);
labResult.setFont("font/st.ttf", 18); 
labResult.setHide(true); 
scene.addNode(labResult);

// --- 功能函数 ---

function triggerResult(msg, color) {
    if (inCooldown) return;
    isFlying = false;
    inCooldown = true;
    cooldownFrames = totalCooldownFrames; 
    resultMessage = msg;
    resultColor = color;
}

function resetGame() {
    isFlying = false;
    isDragging = false; // 重置拖拽状态
    inCooldown = false;
    cooldownFrames = 0;
    vx = 0; vy = 0;
    bird.setPosition(birdStartX, birdStartY);
    woodAngle = 0;
    targetWoodAngle = 0;
    wood.setRotate(0);
    wood.setPosition(650, 300);
    wood.setHide(false);
    labResult.setHide(true);
    for (var i = 0; i < trailCount; i++) trails[i].setHide(true);
}

function updateTrajectoryPreview() {
    var rad = angle * Math.PI / 180;
    var tVx = Math.cos(rad) * power;
    var tVy = Math.sin(rad) * power;
    for (var j = 0; j < dotCount; j++) {
        var t = j * 2.5; 
        dots[j].setPosition(birdStartX + tVx * t, birdStartY + tVy * t + 0.5 * gravity * t * t);
        dots[j].setHide(false);
    }
}

// --- 6. 游戏主循环 ---
scene.upDate((time) => {
    // 增加鼠标操作提示
    labDebug.setText("状态: " + (isFlying ? "飞行" : (isDragging ? "瞄准中" : "待机")) + 
                     "\n角度: " + angle.toFixed(1) + "°" +
                     "\n力度: " + power.toFixed(1) + 
                     "\n拖拽小鸟进行弹射, R重置");

    if (woodAngle < targetWoodAngle) {
        woodAngle += fallSpeed;
        if (woodAngle > targetWoodAngle) woodAngle = targetWoodAngle;
        wood.setRotate(woodAngle);
        var offset = (woodAngle / 90) * 50; 
        wood.setPosition(650 + (woodAngle / 90) * 20, 300 + offset);
    }

    if (inCooldown) {
        if (cooldownFrames > 0) {
            cooldownFrames--;
            var seconds = Math.ceil(cooldownFrames / 60); 
            labResult.setText(resultMessage + "\n" + seconds + " 秒后重置...");
            labResult.setColor(resultColor.r, resultColor.g, resultColor.b, 0.7);
            labResult.setHide(false);
            for (var d = 0; d < dotCount; d++) dots[d].setHide(true);
        } else {
            resetGame();
        }
        return; 
    }

    if (isFlying) {
        for (var d = 0; d < dotCount; d++) dots[d].setHide(true);
        var pos = bird.getPosition();
        vy += gravity;
        bird.setPosition(pos.x + vx, pos.y + vy);

        var currentTrail = trails[trailIndex];
        currentTrail.setPosition(pos.x + 15, pos.y + 15);
        currentTrail.setColor(1, 1, 1, 0.4);
        currentTrail.setHide(false);
        trailIndex = (trailIndex + 1) % trailCount;

        for (var i = 0; i < trailCount; i++) {
            if (!trails[i].isHide()) {
                var c = trails[i].getColor();
                var newAlpha = c.w - 0.02; 
                if (newAlpha <= 0) trails[i].setHide(true);
                else trails[i].setColor(c.x, c.y, c.z, newAlpha);
            }
        }

        var bPos = bird.getPosition();
        var wPos = wood.getPosition();
        var wSize = wood.getSize();
        if (bPos.x < wPos.x + wSize.x && bPos.x + 45 > wPos.x &&
            bPos.y < wPos.y + wSize.y && bPos.y + 45 > wPos.y) {
            audio.playSound("sound/1.wav");
            targetWoodAngle = 90; 
            triggerResult("击中目标！", {r: 0, g: 0.6, b: 0}); 
        }

        if (bPos.y > 600 || bPos.x > 800 || bPos.x < 0) {
            triggerResult("没打中！", {r: 0, g: 0, b: 0.7});
        }
    } else {
        updateTrajectoryPreview();
    }
});

// --- 7. 键盘交互 (保留) ---
game.setKeyCallBack((key, action) => {
    if (action == 1) {
        if (inCooldown && key != 82) return; 
        if (key == 38 && !isFlying) angle = Math.max(-90, angle - 5); 
        if (key == 40 && !isFlying) angle = Math.min(0, angle + 5);  
        if (key == 37 && !isFlying) power = Math.max(5, power - 1); 
        if (key == 39 && !isFlying) power = Math.min(40, power + 1); 

        if (key == 32 && !isFlying) { 
            audio.playSound("sound/1.wav"); 
            var rad = angle * Math.PI / 180;
            vx = Math.cos(rad) * power;
            vy = Math.sin(rad) * power;
            isFlying = true;
        }
        if (key == 82) resetGame(); 
    }
});

// --- 8. 鼠标交互 (新增) ---
game.setMouseCallBack((x, y, action) => {
    if (inCooldown || isFlying) return;

    if (action == 1) { // 按下：开始记录
        var bPos = bird.getPosition();
        // 简单判断点击位置是否在小鸟附近
        if (Math.abs(x - (bPos.x + 22)) < 50 && Math.abs(y - (bPos.y + 22)) < 50) {
            isDragging = true;
            mouseStartX = x;
            mouseStartY = y;
        }
    } else if (action == 3) { // 移动：计算角度和力度
        if (isDragging) {
            var dx = mouseStartX - x; // 反向拉动
            var dy = mouseStartY - y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            // 力度上限限制在 40
            power = Math.min(40, distance / 5); 
            // 计算角度 (弧度转角度)
            angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // 小鸟随手稍微偏移，增加拉伸感
            bird.setPosition(birdStartX - dx * 0.2, birdStartY - dy * 0.2);
        }
    } else if (action == 2) { // 松开：发射
        if (isDragging) {
            if (power > 5) {
                audio.playSound("sound/1.wav"); 
                var rad = angle * Math.PI / 180;
                vx = Math.cos(rad) * power;
                vy = Math.sin(rad) * power;
                isFlying = true;
            } else {
                bird.setPosition(birdStartX, birdStartY);
            }
            isDragging = false;
        }
    }
});

game.run();