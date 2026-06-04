/**
 * 开维游戏引擎 - 实时重力模拟器
 * 功能：模拟受重力影响的自由落体、反弹及用户交互
 */


// ----------------------------------------------------------------------------------------------
// 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName();         // 获取系统名称：WINDOWS、WEB、WEIXIN
var webOS = game.getOS();                  // web页面所在的操作系统：Windows、macOS、Linux、Android、iOS、Unknown OS
var webDeviceType = game.getDeviceType();  // web页面所在的设备类型：PC、Phone、Pad
var webDpr = game.getDpr();                // web页面dpr值
var w, h;       // 屏幕宽高
var window;     // 窗口变量
var screenType; // 横屏还是竖屏

// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.initSize(420, 750);                   // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.initSize(420, 750);               // windows默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}

// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率

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