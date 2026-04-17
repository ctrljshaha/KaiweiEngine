// --- 初始化游戏引擎 ---
game.init(); 
game.setFPS(60);

// 获取资源
var resBg = game.getResource().getTexture("img/bg.png");
var resBird = game.getResource().getTexture("img/bird.png");
var resWood = game.getResource().getTexture("img/wood.png");

// 音效实例
var audio = new Audio();

var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);

// --- 游戏变量 ---
var gravity = 0.5;
var isFlying = false;
var inCooldown = false; 

var birdStartX = 150, birdStartY = 350; // 位置已调高
var vx = 0, vy = 0;
var angle = -45, power = 18;

// 动画变量
var woodAngle = 0;       
var targetWoodAngle = 0; 
var fallSpeed = 8;       

// 倒计时变量 (修改：从180帧改为60帧，即1秒)
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
wood.setPosition(650, 300); // 位置已调高
scene.addNode(wood);

// --- 4. 小鸟精灵 ---
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(45, 45);
bird.setPosition(birdStartX, birdStartY);
scene.addNode(bird);

// --- 5. UI 标签 (红色透明底) ---
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(220, 100);
labDebug.setColor(1, 0, 0, 0.4); 
labDebug.setTextColor(1, 1, 1, 1);
labDebug.setFont("font/st.ttf", 16); 
scene.addNode(labDebug); 

var labResult = new Label();
labResult.setPosition(250, 150);
labResult.setSize(300, 120);
labResult.setTextColor(1, 1, 1, 1);
labResult.setFont("font/st.ttf", 26);
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
    labDebug.setText("状态: " + (isFlying ? "飞行" : (inCooldown ? "结算" : "准备")) + 
                     "\n角度: " + angle + "°\n上下键调角, 空格发射");

    // 倒地动画算法
    if (woodAngle < targetWoodAngle) {
        woodAngle += fallSpeed;
        if (woodAngle > targetWoodAngle) woodAngle = targetWoodAngle;
        wood.setRotate(woodAngle);
        var offset = (woodAngle / 90) * 50; 
        wood.setPosition(650 + (woodAngle / 90) * 20, 300 + offset);
    }

    // 1秒冷却计时逻辑
    if (inCooldown) {
        if (cooldownFrames > 0) {
            cooldownFrames--;
            var seconds = Math.ceil(cooldownFrames / 60); 
            labResult.setText(resultMessage + "\n" + seconds + " 秒后重置...");
            labResult.setColor(resultColor.r, resultColor.g, resultColor.b, 0.8);
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

        // 烟雾尾迹
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

        // 碰撞检测
        var bPos = bird.getPosition();
        var wPos = wood.getPosition();
        var wSize = wood.getSize();

        if (bPos.x < wPos.x + wSize.x && bPos.x + 45 > wPos.x &&
            bPos.y < wPos.y + wSize.y && bPos.y + 45 > wPos.y) {
            
            audio.playSound("sound/1.wav"); // 撞击音效
            targetWoodAngle = 90; 
            triggerResult("击中目标！", {r: 0, g: 0.6, b: 0}); 
        }

        // 边界检测
        if (bPos.y > 600 || bPos.x > 800 || bPos.x < 0) {
            triggerResult("没打中！", {r: 0, g: 0, b: 0.7});
        }
    } else {
        updateTrajectoryPreview();
        for (var t = 0; t < trailCount; t++) trails[t].setHide(true);
    }
});

// --- 7. 键盘交互 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) {
        if (inCooldown && key != 82) return; 
        if (key == 38 && !isFlying) angle = Math.max(-90, angle - 5); 
        if (key == 40 && !isFlying) angle = Math.min(0, angle + 5);  
        if (key == 32 && !isFlying) { 
            audio.playSound("sound/1.wav"); // 发射音效
            var rad = angle * Math.PI / 180;
            vx = Math.cos(rad) * power;
            vy = Math.sin(rad) * power;
            isFlying = true;
        }
        if (key == 82) resetGame(); 
    }
});

game.run();