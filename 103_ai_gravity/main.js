/**
 * 开维游戏引擎 - 实时重力模拟器
 * 功能：模拟受重力影响的自由落体、反弹及用户交互
 */

// 1. 初始化引擎
game.initSize(420, 750); 
game.setFPS(60); // 提高帧率使物理模拟更平滑
const WINDOW_HEIGHT = 750;
const WINDOW_WIDTH = 420;

// 2. 场景与资源设置
var scene = new Scene();
var resBall = game.getResource().getTexture("img/logo.png"); // 使用logo作为物理球
//var resBg = game.getResource().getTexture("img/bg.png");
//scene.setBg(resBg);

// 3. 物理常数设置
const GRAVITY = 0.8;      // 重力加速度 (g)
const BOUNCE = -0.7;       // 碰撞反弹系数 (能量损耗)
const FRICTION = 0.98;     // 空气阻力/摩擦力
const JUMP_FORCE = -15;    // 点击时的向上冲力

// 4. 物理对象状态
let ballState = {
    x: 190,
    y: 100,
    vx: 0,
    vy: 0,
    radius: 25
};

// 5. 创建小球 (使用 Sprite 方便点击交互)
var ball = new Sprite();
ball.setTexture(resBall);
ball.setSize(ballState.radius * 2, ballState.radius * 2);
ball.setPosition(ballState.x, ballState.y);

// 点击小球施加向上作用力
ball.click(() => {
    ballState.vy = JUMP_FORCE; 
    log("Jump!");
});
scene.addNode(ball);

// 6. 调试信息面板
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(200, 100);
labDebug.setColor(0, 0, 0, 0.5);
labDebug.setTextColor(0, 1, 0, 1);
labDebug.setFont("font/st.ttf", 14);
scene.addNode(labDebug);

// 7. 物理核心循环 (在场景更新回调中实现)
scene.upDate((time) => {
    // --- 物理计算 ---
    
    // 应用重力
    ballState.vy += GRAVITY;
    
    // 应用速度
    ballState.y += ballState.vy;
    ballState.x += ballState.vx;

    // 地面碰撞检测 (Window Height = 600)
    if (ballState.y + (ballState.radius * 2) > WINDOW_HEIGHT) {
        ballState.y = WINDOW_HEIGHT - (ballState.radius * 2);
        ballState.vy *= BOUNCE; // 反弹并损耗能量
        
        // 停止微小抖动
        if (Math.abs(ballState.vy) < 1) ballState.vy = 0;
    }

    // 左右边界检测
    if (ballState.x < 0 || ballState.x + (ballState.radius * 2) > WINDOW_WIDTH) {
        ballState.vx *= -1;
    }

    // --- 更新UI位置 ---
    ball.setPosition(ballState.x, ballState.y);

    // --- 更新调试信息 ---
    var info = "物理引擎调试:\n" +
               "坐标: Y=" + Math.floor(ballState.y) + "\n" +
               "速度: VY=" + ballState.vy.toFixed(2) + "\n" +
               "状态: " + (ballState.y >= WINDOW_HEIGHT - 55 ? "着地" : "空中");
    labDebug.setText(info);
});

// 8. 键盘控制 (额外增加左右移动)
game.setKeyCallBack((key, action) => {
    if (action === 1) { // 按下动作
        if (key === 65 || key === 37) ballState.vx = -5; // A 或 左
        if (key === 68 || key === 39) ballState.vx = 5;  // D 或 右
    } else if (action === 0) { // 抬起动作
        ballState.vx = 0;
    }
});

// 推送场景并运行
game.pushScene(scene);
game.run();