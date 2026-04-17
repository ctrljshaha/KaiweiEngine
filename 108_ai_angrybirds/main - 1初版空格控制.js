// 初始化愤怒的小鸟简易版
game.init(); 
game.setFPS(60);

var resBg = game.getResource().getTexture("img/bg.png");
var resBird = game.getResource().getTexture("img/bird.png");
var resWood = game.getResource().getTexture("img/wood.png");

var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);

// --- 游戏状态变量 ---
var isDragging = false;
var isFlying = false;
var birdStartX = 150;
var birdStartY = 400;
var gravity = 0.5; // 重力加速度
var vx = 0; // 水平速度
var vy = 0; // 垂直速度

// --- 创建小鸟 ---
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(40, 40);
bird.setPosition(birdStartX, birdStartY);
scene.addNode(bird);

// --- 创建目标（木块）---
var wood = new Sprite();
wood.setTexture(resWood);
wood.setSize(50, 80);
wood.setPosition(600, 420);
scene.addNode(wood);

// --- 弹弓拉伸与发射逻辑 ---
// 注意：引擎通过click回调处理交互。为了模拟拖拽，我们结合游戏逻辑判断。
bird.click(() => {
    if (!isFlying) {
        isDragging = true;
        log("准备发射：请使用键盘或拖动（逻辑模拟）");
    }
});

// --- 游戏主循环逻辑 ---
scene.upDate((time) => {
    if (isFlying) {
        // 1. 物理模拟：更新位置
        var pos = bird.getPosition();
        vy += gravity; // 增加重力影响
        bird.setPosition(pos.x + vx, pos.y + vy);

        // 2. 碰撞检测：小鸟与木块
        var birdPos = bird.getPosition();
        var woodPos = wood.getPosition();
        var woodSize = wood.getSize();

        if (birdPos.x < woodPos.x + woodSize.x &&
            birdPos.x + 40 > woodPos.x &&
            birdPos.y < woodPos.y + woodSize.y &&
            birdPos.y + 40 > woodPos.y) {
            
            log("击中目标！");
            wood.setHide(true); // 击中后隐藏木块
            resetBird();
        }

        // 3. 边界处理：掉出屏幕
        if (birdPos.y > 600 || birdPos.x > 800) {
            log("没打中...");
            resetBird();
        }
    }
});

// 重置小鸟位置
function resetBird() {
    isFlying = false;
    vx = 0;
    vy = 0;
    bird.setPosition(birdStartX, birdStartY);
}

// --- 键盘发射控制 ---
game.setKeyCallBack((key, action) => {
    // 假设按下空格键（键值32）发射
    if (key == 32 && action == 1 && !isFlying) {
        // 模拟弹弓拉力：固定力度发射
        // 在实际开发中，你可以根据鼠标拖动的偏移量计算 vx 和 vy
        vx = 12;  // 向右的速度
        vy = -15; // 向上冲的初速度
        isFlying = true;
        log("小鸟出击！");
    }
    
    // 调试辅助：R键重置
    if (key == 82) resetBird(); 
});

// 添加调试信息标签
var labInfo = new Label();
labInfo.setPosition(10, 10);
labInfo.setSize(300, 50);
labInfo.setFont("font/st.ttf", 18);
labInfo.setTextColor(1, 1, 1, 1);
labInfo.setText("空格键：发射小鸟\nR键：重置");
scene.addNode(labInfo);

// 运行游戏
game.run();