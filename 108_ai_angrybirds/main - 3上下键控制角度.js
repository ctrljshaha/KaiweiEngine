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

// --- 动态角度控制变量 ---
var angle = -45; // 初始角度（-45度向上）
var power = 18;  // 发射力度系数

// --- 1. 预判虚线 (对象池) ---
var dotCount = 15;
var dots = [];
for (var i = 0; i < dotCount; i++) {
    var dot = new Node();
    dot.setSize(5, 5);
    dot.setColor(1, 1, 1, 0.6); 
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

// --- 4. 调试信息标签 (红色透明底) ---
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(220, 100);
labDebug.setColor(1, 0, 0, 0.4); // 红色半透明背景
labDebug.setTextColor(1, 1, 1, 1); // 白色文字
labDebug.setFont("font/st.ttf", 16); 
scene.addNode(labDebug); 

// --- 辅助函数：根据角度和力度计算预测轨迹 ---
function updateTrajectoryPreview() {
    // 将角度转为弧度
    var radians = angle * Math.PI / 180;
    var tempVx = Math.cos(radians) * power;
    var tempVy = Math.sin(radians) * power;

    for (var j = 0; j < dotCount; j++) {
        var t = j * 2.5; 
        var tx = birdStartX + tempVx * t;
        var ty = birdStartY + tempVy * t + 0.5 * gravity * t * t;
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
    var stateStr = isFlying ? "飞行中" : "调整角度中";
    labDebug.setText("状态: " + stateStr + "\n当前角度: " + angle + "°\n上下键控制角度\n空格键发射 / R重置");

    if (isFlying) {
        hideTrajectory();
        // 物理位移更新
        var pos = bird.getPosition();
        vy += gravity;
        bird.setPosition(pos.x + vx, pos.y + vy);

        // 碰撞检测
        var bPos = bird.getPosition();
        var wPos = wood.getPosition();
        var wSize = wood.getSize();

        if (bPos.x < wPos.x + wSize.x && bPos.x + 45 > wPos.x &&
            bPos.y < wPos.y + wSize.y && bPos.y + 45 > wPos.y) {
            log("击中目标！");
            wood.setHide(true);
            resetGame();
        }

        // 边界自动重置
        if (bPos.y > 600 || bPos.x > 800 || bPos.x < 0) resetGame();
    } else {
        // 待机状态：显示随角度变化的预测线
        updateTrajectoryPreview();
    }
});

function resetGame() {
    isFlying = false;
    vx = 0;
    vy = 0;
    bird.setPosition(birdStartX, birdStartY);
    wood.setHide(false);
}

// --- 6. 键盘交互控制 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) { // 按下动作
        // 上键 (38): 减小角度 (往上抬)
        if (key == 38 && !isFlying) {
            angle -= 5;
            if (angle < -90) angle = -90; // 限制垂直向上
        }
        // 下键 (40): 增大角度 (往下压)
        if (key == 40 && !isFlying) {
            angle += 5;
            if (angle > 0) angle = 0; // 限制水平
        }
        // 空格键 (32): 发射
        if (key == 32 && !isFlying) {
            var radians = angle * Math.PI / 180;
            vx = Math.cos(radians) * power;
            vy = Math.sin(radians) * power;
            isFlying = true;
            log("发射角度: " + angle);
        }
        // R键 (82): 重置
        if (key == 82) {
            resetGame();
        }
    }
});

// 运行游戏
game.run();