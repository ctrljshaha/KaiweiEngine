// --- 初始化游戏引擎 ---
game.init(); 
game.setFPS(60);

// 获取资源
var resBg = game.getResource().getTexture("img/bg.png");
var resBird = game.getResource().getTexture("img/bird.png");
var resWood = game.getResource().getTexture("img/wood.png");

var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);

// 音效对象
var audio = new Audio();

// --- 游戏逻辑变量 ---
var gravity = 0.5;
var isFlying = false;
var birdStartX = 150;
var birdStartY = 450;
var vx = 0;
var vy = 0;
var angle = -45; 
var power = 18;  

// --- 1. 预判虚线池 ---
var dotCount = 15;
var dots = [];
for (var i = 0; i < dotCount; i++) {
    var dot = new Node();
    dot.setSize(5, 5);
    dot.setColor(1, 1, 1, 0.5); 
    dot.setHide(true);
    scene.addNode(dot);
    dots.push(dot);
}

// --- 2. 目标木块 ---
var wood = new Sprite();
wood.setTexture(resWood);
wood.setSize(50, 100);
wood.setPosition(650, 400);
scene.addNode(wood);

// --- 3. 小鸟精灵 ---
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(45, 45);
bird.setPosition(birdStartX, birdStartY);
scene.addNode(bird);

// --- 4. UI 界面层 (后添加的在最上层) ---

// 调试信息 (左上角红色透明框)
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(220, 100);
labDebug.setColor(1, 0, 0, 0.4); 
labDebug.setTextColor(1, 1, 1, 1);
labDebug.setFont("font/st.ttf", 16); 
scene.addNode(labDebug); 

// 结果提示标签 (屏幕中央，默认隐藏)
var labResult = new Label();
labResult.setPosition(250, 250);
labResult.setSize(300, 100);
labResult.setTextColor(1, 1, 1, 1);
labResult.setFont("font/st.ttf", 30);
labResult.setHide(true); 
scene.addNode(labResult);

// --- 核心逻辑函数 ---

function showMessage(text, color) {
    labResult.setText(text);
    labResult.setColor(color.r, color.g, color.b, 0.8);
    labResult.setHide(false);
    
    // 2秒后自动消失并重置游戏
    setTimeout(() => {
        labResult.setHide(true);
        resetGame();
    }, 2000);
}

function updateTrajectoryPreview() {
    var radians = angle * Math.PI / 180;
    var tempVx = Math.cos(radians) * power;
    var tempVy = Math.sin(radians) * power;
    for (var j = 0; j < dotCount; j++) {
        var t = j * 2.5; 
        dots[j].setPosition(birdStartX + tempVx * t, birdStartY + tempVy * t + 0.5 * gravity * t * t);
        dots[j].setHide(false);
    }
}

function resetGame() {
    isFlying = false;
    vx = 0;
    vy = 0;
    bird.setPosition(birdStartX, birdStartY);
    wood.setHide(false);
}

// --- 5. 游戏主循环 ---
scene.upDate((time) => {
    labDebug.setText("状态: " + (isFlying ? "飞行中" : "调整中") + "\n角度: " + angle + "°\n[上下键]调角度\n[空格]发射 [R]重置");

    if (isFlying) {
        // 隐藏预测线
        for (var j = 0; j < dotCount; j++) dots[j].setHide(true);

        // 物理更新
        var pos = bird.getPosition();
        vy += gravity;
        bird.setPosition(pos.x + vx, pos.y + vy);

        // 碰撞检测
        var bPos = bird.getPosition();
        var wPos = wood.getPosition();
        var wSize = wood.getSize();

        if (bPos.x < wPos.x + wSize.x && bPos.x + 45 > wPos.x &&
            bPos.y < wPos.y + wSize.y && bPos.y + 45 > wPos.y) {
            isFlying = false; // 停止飞行逻辑
            wood.setHide(true);
            // 绿色背景提示成功
            showMessage("击中目标！漂亮！", {r: 0, g: 0.8, b: 0}); 
            audio.playSound("sound/hit.wav"); // 假设你有碰撞音效
        }

        // 边界检测 (没打中)
        if (bPos.y > 600 || bPos.x > 800 || bPos.x < 0) {
            isFlying = false;
            // 蓝色背景提示失败
            showMessage("哎呀，没打中！", {r: 0.2, g: 0.2, b: 0.8});
        }
    } else {
        if (labResult.isHide()) updateTrajectoryPreview();
    }
});

// --- 6. 交互逻辑 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) {
        if (key == 38 && !isFlying) angle = Math.max(-90, angle - 5);
        if (key == 40 && !isFlying) angle = Math.min(0, angle + 5);
        if (key == 32 && !isFlying && labResult.isHide()) {
            var rad = angle * Math.PI / 180;
            vx = Math.cos(rad) * power;
            vy = Math.sin(rad) * power;
            isFlying = true;
        }
        if (key == 82) resetGame();
    }
});

game.run();