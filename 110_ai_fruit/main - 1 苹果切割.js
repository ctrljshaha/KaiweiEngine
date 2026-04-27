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
    // 随机选择水果类型（这里简化为一种，实际可根据数组索引切换 texture）
    var resFruit = game.getResource().getTexture("img/fruit/apple.png"); 
    f.setTexture(resFruit);
    
    var size = 60;
    f.setSize(size, size);
    
    // 初始位置：屏幕底部随机位置
    var startX = Math.random() * (w - 100) + 50;
    var startY = h + 50;
    f.setPosition(startX, startY);
    
    // 物理属性：向上抛出的初速度
    f.vx = (w / 2 - startX) * 0.02 + (Math.random() - 0.5) * 5; // 往中间汇聚的横向速度
    f.vy = -(Math.random() * 5 + 15); // 随机向上纵向速度
    f.isCut = false;

    // 每一帧的物理运动逻辑
    f.upDate((time) => {
        if (f.isCut) return; // 被切开后的逻辑可另写（如分裂掉落）

        var pos = f.getPosition();
        var newX = pos.x + f.vx;
        var newY = pos.y + f.vy;
        
        // 应用重力
        f.vy += GRAVITY;
        
        f.setPosition(newX, newY);
        
        // 旋转水果
        f.setRotate(f.getRotate() + 5);

        // 超出屏幕底部则销毁
        if (newY > h + 100) {
            f.setHide(true);
            // 实际开发中应从数组中移除并销毁 node
        }
    });

    scene.addNode(f);
    fruits.push(f);
}

// ----------------------------------------------------------------------------------------------
// 4. 切割逻辑（鼠标/触摸交互）
// ----------------------------------------------------------------------------------------------
// 模拟刀光线（可选实现：记录鼠标轨迹并绘图，这里简化为位置碰撞）
scene.onMove((x, y) => {
    for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i];
        if (!f.isCut && f.isContainPostion(x, y)) {
            sliceFruit(f);
        }
    }
});

function sliceFruit(f) {
    f.isCut = true;
    
    // 播放切开音效
    var audio = new Audio();
    audio.playSound("sound/splatter.wav");

    // 变换切开的纹理（实际应分裂成两个 Sprite）
    var resCut = game.getResource().getTexture("img/fruit/apple-1.png");
    f.setTexture(resCut);
    
    // 掉落动画逻辑
    f.vy = 2; // 被切开后受力改变
    
    // 更新分数
    score += 10;
    labScore.setText("Score: " + score);
    
    // 延时消失（通过在 update 里计时实现）
}

// ----------------------------------------------------------------------------------------------
// 5. 游戏主循环逻辑
// ----------------------------------------------------------------------------------------------
var spawnTimer = 0;
scene.upDate((time) => {
    spawnTimer += time;
    
    // 每隔 1.5 秒生成一批水果
    if (spawnTimer > 1.5) {
        var count = Math.floor(Math.random() * 3) + 1;
        for (var i = 0; i < count; i++) {
            createFruit();
        }
        spawnTimer = 0;
    }
    
    // 清理已销毁的水果节点
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