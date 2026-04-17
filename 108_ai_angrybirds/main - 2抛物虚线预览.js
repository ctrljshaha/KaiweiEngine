// --- 初始化游戏引擎 ---
game.init(); 
game.setFPS(60);

// 获取资源
var resBg = game.getResource().getTexture("img/bg.png");
var resBird = game.getResource().getTexture("img/bird.png");
var resWood = game.getResource().getTexture("img/wood.png");

// 初始化场景
var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);

// --- 游戏逻辑变量 ---
var gravity = 0.5;
var isFlying = false;
var birdStartX = 150;
var birdStartY = 450;
var vx = 0;
var vy = 0;

// --- 1. 预判虚线 (对象池) ---
var dotCount = 15;
var dots = [];
for (var i = 0; i < dotCount; i++) {
    var dot = new Node();
    dot.setSize(5, 5);
    dot.setColor(1, 1, 1, 0.6); // 白色半透明点
    dot.setHide(true);
    scene.addNode(dot);
    dots.push(dot);
}

// --- 2. 目标木块 ---
var wood = new Sprite();
wood.setTexture(resWood);
wood.setSize(50, 100);
wood.setPosition(600, 400);
scene.addNode(wood);

// --- 3. 小鸟精灵 ---
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(45, 45);
bird.setPosition(birdStartX, birdStartY);
scene.addNode(bird);

// --- 4. 调试信息标签 (红色透明底) ---
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(200, 80);
labDebug.setColor(1, 0, 0, 0.3); // 红色半透明背景
labDebug.setTextColor(1, 1, 1, 1); // 白色文字
labDebug.setFont("font/st.ttf", 16); // 请确保此路径下有字体文件
scene.addNode(labDebug); 

// --- 辅助函数：更新虚线 ---
function showTrajectory(vX, vY) {
    for (var j = 0; j < dotCount; j++) {
        var t = j * 2.5; // 时间步长
        var tx = birdStartX + vX * t;
        var ty = birdStartY + vY * t + 0.5 * gravity * t * t;
        dots[j].setPosition(tx, ty);
        dots[j].setHide(false);
    }
}

function hideTrajectory() {
    for (var j = 0; j < dotCount; j++) dots[j].setHide(true);
}

// --- 5. 游戏主循环 ---
scene.upDate((time) => {
    // 更新调试文字
    var state = isFlying ? "飞行中" : "待准备";
    labDebug.setText("游戏状态: " + state + "\n操作: 空格键发射\n重置: R键");

    if (isFlying) {
        hideTrajectory();
        // 物理位移
        var pos = bird.getPosition();
        vy += gravity;
        bird.setPosition(pos.x + vx, pos.y + vy);

        // 碰撞检测
        var bPos = bird.getPosition();
        var wPos = wood.getPosition();
        var wSize = wood.getSize();

        if (bPos.x < wPos.x + wSize.x && bPos.x + 45 > wPos.x &&
            bPos.y < wPos.y + wSize.y && bPos.y + 45 > wPos.y) {
            log("击中！");
            wood.setHide(true);
            resetGame();
        }

        // 边界重置
        if (bPos.y > 600 || bPos.x > 800) resetGame();
    } else {
        // 准备阶段显示预判线 (固定力度预览)
        showTrajectory(13, -16); 
    }
});

function resetGame() {
    isFlying = false;
    vx = 0;
    vy = 0;
    bird.setPosition(birdStartX, birdStartY);
    wood.setHide(false);
}

// --- 6. 键盘交互 ---
game.setKeyCallBack((key, action) => {
    // 空格键发射 (Key 32)
    if (key == 32 && action == 1 && !isFlying) {
        vx = 13;
        vy = -16;
        isFlying = true;
    }
    // R键重置 (Key 82)
    if (key == 82 && action == 1) {
        resetGame();
    }
});

// 运行游戏
game.run();