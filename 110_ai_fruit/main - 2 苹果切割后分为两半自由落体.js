// ----------------------------------------------------------------------------------------------
// 1. 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
game.init();
var window = game.getWindow();
var w = window.getWidth();
var h = window.getHeight();
game.setFPS(60);

var scene = new Scene();
var resBg = game.getResource().getTexture("img/background.jpg"); // 需准备背景图
scene.setBg(resBg);

// 游戏状态
var score = 0;
var fruits = []; // 存储当前屏幕上的水果对象
var GRAVITY = 0.5; // 重力加速度

// ----------------------------------------------------------------------------------------------
// 2. 标签显示（分数与调试）
// ----------------------------------------------------------------------------------------------
var labScore = new Label();
labScore.setPosition(20, 20);
labScore.setSize(200, 50);
labScore.setFont("font/st.ttf", 30);
labScore.setTextColor(255, 255, 0, 1);
labScore.setText("Score: 0");
scene.addNode(labScore);

// ----------------------------------------------------------------------------------------------
// 3. 水果类定义
// ----------------------------------------------------------------------------------------------
function createFruit() {
    var f = new Sprite();
    // 随机选择水果类型
    var resFruit = game.getResource().getTexture("img/fruit/apple.png"); 
    f.setTexture(resFruit);
    
    var size = 60;
    f.setSize(size, size);
    
    // 初始位置：屏幕底部随机位置
    var startX = Math.random() * (w - 100) + 50;
    var startY = h + 50;
    f.setPosition(startX, startY);
    
    // 物理属性
    f.vx = (w / 2 - startX) * 0.02 + (Math.random() - 0.5) * 5; 
    f.vy = -(Math.random() * 5 + 15); 
    f.isCut = false;
    f.tag = "whole"; // 关键修改：标记为完整水果

    // 每一帧的物理运动逻辑
    f.upDate((time) => {
        var pos = f.getPosition();
        var newX = pos.x + f.vx;
        var newY = pos.y + f.vy;
        
        // 应用重力
        f.vy += GRAVITY;
        f.setPosition(newX, newY);
        
        // 旋转水果
        f.setRotate(f.getRotate() + (f.isCut ? 2 : 5));

        // 超出屏幕底部则销毁
        if (newY > h + 100) {
            f.setHide(true);
        }
    });

    scene.addNode(f);
    fruits.push(f);
}

// ----------------------------------------------------------------------------------------------
// 4. 切割逻辑（鼠标/触摸交互）
// ----------------------------------------------------------------------------------------------
scene.onMove((x, y) => {
    for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i];
        // 仅切割带有 whole 标签且未被切割的水果
        if (f.tag == "whole" && !f.isCut && f.isContainPostion(x, y)) {
            sliceFruit(f);
        }
    }
});

function sliceFruit(f) {
    f.isCut = true;
    f.tag = "half"; // 改变标签，防止重复切割导致死机
    
    // 播放切开音效
    var audio = new Audio();
    audio.playSound("sound/splatter.wav");

    // --- 处理第一半苹果 ---
    var resCut1 = game.getResource().getTexture("img/fruit/apple-1.png");
    f.setTexture(resCut1);
    var oldPos = f.getPosition();
    var oldVx = f.vx;
    
    f.vx = oldVx - 2; // 向左弹开
    f.vy = 2; // 被切开后受力向下

    // --- 创建并处理第二半苹果 ---
    var f2 = new Sprite();
    var resCut2 = game.getResource().getTexture("img/fruit/apple-2.png");
    f2.setTexture(resCut2);
    f2.setSize(60, 60);
    f2.setPosition(oldPos.x, oldPos.y);
    f2.vx = oldVx + 2; // 向右弹开
    f2.vy = 2;
    f2.isCut = true;
    f2.tag = "half"; // 标记为半块

    f2.upDate((time) => {
        var pos = f2.getPosition();
        f2.vy += GRAVITY;
        f2.setPosition(pos.x + f2.vx, pos.y + f2.vy);
        f2.setRotate(f2.getRotate() - 2);
        if (pos.y > h + 100) f2.setHide(true);
    });

    scene.addNode(f2);
    fruits.push(f2); // 加入数组统一管理清理
    
    // 更新分数
    score += 10;
    labScore.setText("Score: " + score);
}

// ----------------------------------------------------------------------------------------------
// 5. 游戏主循环逻辑
// ----------------------------------------------------------------------------------------------
var spawnTimer = 0;
scene.upDate((time) => {
    spawnTimer += time;
    
    if (spawnTimer > 1.5) {
        var count = Math.floor(Math.random() * 3) + 1;
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
// 6. 运行
// ----------------------------------------------------------------------------------------------
game.pushScene(scene);
game.run();