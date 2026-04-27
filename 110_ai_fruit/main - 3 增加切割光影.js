// ----------------------------------------------------------------------------------------------
// 1. 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
game.init();
var window = game.getWindow();
var w = window.getWidth();
var h = window.getHeight();
game.setFPS(60);

var scene = new Scene();
var resBg = game.getResource().getTexture("img/background.jpg"); 
scene.setBg(resBg);

// 游戏状态
var score = 0;
var fruits = []; 
var GRAVITY = 0.5; 

// ----------------------------------------------------------------------------------------------
// 2. 刀光轨迹——流体动力学优化版 (High Performance Smooth Trail)
// ----------------------------------------------------------------------------------------------
var linePool = []; 
var poolSize = 100; // 进一步增加对象池，确保极速挥动时不掉帧
var poolIndex = 0;
var lastX = -1; 
var lastY = -1;
var isPressing = false;

// 预热对象池
for (var i = 0; i < poolSize; i++) {
    var l = new Node();
    l.setColor(255, 255, 255, 0);
    l.setHide(true);
    scene.addNode(l);
    linePool.push(l);
}

// 绘制丝滑线段函数
function drawContinuousLine(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    // 只要有移动就记录，确保轨迹不跳跃
    if (distance < 0.5) return;

    var line = linePool[poolIndex];
    var lineThickness = 14; // 初始厚度稍微再加粗一点，更有张力

    line.setHide(false);
    // distance + 3 是为了让线段首尾深度重叠，消除高速转弯时的断裂感
    line.setSize(distance + 3, lineThickness); 
    line.setPosition(x1, y1);
    
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    line.setRotate(angle); 

    var alpha = 1.0;
    line.setColor(255, 255, 255, alpha);
    
    line.upDate((time) => {
        alpha -= 0.16; // 消失速度
        if (alpha <= 0) {
            line.setHide(true);
        } else {
            line.setColor(255, 255, 255, alpha);
            // 关键：使用 alpha 的平方让厚度衰减得更快，形成两头尖的流体视觉
            var currentThickness = lineThickness * (alpha * alpha);
            line.setSize(distance + 3, currentThickness);
        }
    });

    poolIndex = (poolIndex + 1) % poolSize;
}

// ----------------------------------------------------------------------------------------------
// 3. 标签显示
// ----------------------------------------------------------------------------------------------
var labScore = new Label();
labScore.setPosition(20, 20);
labScore.setSize(200, 50);
labScore.setFont("font/st.ttf", 30);
labScore.setTextColor(255, 255, 0, 1);
labScore.setText("Score: 0");
scene.addNode(labScore);

// ----------------------------------------------------------------------------------------------
// 4. 水果类定义
// ----------------------------------------------------------------------------------------------
function createFruit() {
    var f = new Sprite();
    var resFruit = game.getResource().getTexture("img/fruit/apple.png"); 
    f.setTexture(resFruit);
    f.setSize(60, 60);
    
    var startX = Math.random() * (w - 100) + 50;
    var startY = h + 50;
    f.setPosition(startX, startY);
    
    f.vx = (w / 2 - startX) * 0.02 + (Math.random() - 0.5) * 5; 
    f.vy = -(Math.random() * 5 + 15); 
    f.isCut = false;
    f.tag = "whole"; 

    f.upDate((time) => {
        if (f.isCut) return;
        var pos = f.getPosition();
        f.vy += GRAVITY;
        f.setPosition(pos.x + f.vx, pos.y + f.vy);
        f.setRotate(f.getRotate() + 5);
        if (pos.y > h + 100) f.setHide(true);
    });

    scene.addNode(f);
    fruits.push(f);
}

// ----------------------------------------------------------------------------------------------
// 5. 切割逻辑与交互
// ----------------------------------------------------------------------------------------------
scene.onPress((x, y) => {
    isPressing = true;
    lastX = x;
    lastY = y;
});

scene.onMove((x, y) => {
    if (isPressing) {
        if (lastX !== -1 && lastY !== -1) {
            drawContinuousLine(lastX, lastY, x, y);
        }

        for (var i = 0; i < fruits.length; i++) {
            var f = fruits[i];
            if (f.tag == "whole" && !f.isCut && f.isContainPostion(x, y)) {
                sliceFruit(f);
            }
        }
        lastX = x;
        lastY = y;
    }
});

scene.onRelease((x, y) => {
    isPressing = false;
    lastX = -1;
    lastY = -1;
});

function sliceFruit(f) {
    f.isCut = true; 
    f.tag = "half"; 
    
    var audio = new Audio();
    audio.playSound("sound/splatter.wav");

    var oldPos = f.getPosition();
    var oldVx = f.vx;
    var oldVy = f.vy; 
    
    // 第一半
    var resCut1 = game.getResource().getTexture("img/fruit/apple-1.png");
    f.setTexture(resCut1);
    f.vx = oldVx - 2; 
    f.vy = oldVy; 

    f.upDate((time) => {
        var pos = f.getPosition();
        f.vy += GRAVITY;
        f.setPosition(pos.x + f.vx, pos.y + f.vy);
        f.setRotate(f.getRotate() + 2);
        if (pos.y > h + 100) f.setHide(true);
    });

    // 第二半
    var f2 = new Sprite();
    var resCut2 = game.getResource().getTexture("img/fruit/apple-2.png");
    f2.setTexture(resCut2);
    f2.setSize(60, 60);
    f2.setPosition(oldPos.x, oldPos.y);
    f2.vx = oldVx + 2; 
    f2.vy = oldVy;
    f2.isCut = true;
    f2.tag = "half";

    f2.upDate((time) => {
        var pos = f2.getPosition();
        f2.vy += GRAVITY;
        f2.setPosition(pos.x + f2.vx, pos.y + f2.vy);
        f2.setRotate(f2.getRotate() - 2);
        if (pos.y > h + 100) f2.setHide(true);
    });

    scene.addNode(f2);
    fruits.push(f2); 
    
    score += 10;
    labScore.setText("Score: " + score);
}

// ----------------------------------------------------------------------------------------------
// 6. 游戏主循环 (清理逻辑)
// ----------------------------------------------------------------------------------------------
var spawnTimer = 0;
scene.upDate((time) => {
    spawnTimer += time;
    if (spawnTimer > 1.2) {
        var count = Math.floor(Math.random() * 2) + 1;
        for (var i = 0; i < count; i++) {
            createFruit();
        }
        spawnTimer = 0;
    }
    
    for (var i = fruits.length - 1; i >= 0; i--) {
        if (fruits[i].isHide()) {
            scene.removeNode(fruits[i]);
            fruits.splice(i, 1);
        }
    }
});

// ----------------------------------------------------------------------------------------------
// 7. 运行
// ----------------------------------------------------------------------------------------------
game.pushScene(scene);
game.run();