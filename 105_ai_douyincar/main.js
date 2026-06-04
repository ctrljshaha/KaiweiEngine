/**
 * 氮气加速超跑特效 [横屏]
 * 新增：
 * 1. 氮气粒子（Nitro）：离场时喷射蓝色高亮火焰。
 * 2. 动态姿态：进场抬头、离场俯冲。
 * 3. 线性加速：离场时速度逐渐爆发。
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
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}

// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率

var scene = new Scene();
// 【严格修改：基于真实屏幕宽高动态重构设计尺寸与自适应缩放因子】
var screenW = w; 
var screenH = h; 
var UI_SCALE_X = w / 800;
var UI_SCALE_Y = h / 600;
var UI_SCALE = (UI_SCALE_X < UI_SCALE_Y) ? UI_SCALE_X : UI_SCALE_Y;

var resBg = game.getResource().getTexture("img/bg.png");
scene.setBg(resBg);

var audio = new Audio();
audio.setSoundVolume(1.0); 

var resCar = game.getResource().getTexture("img/car.png");      
var resGiftBg = game.getResource().getTexture("img/gift_bg.png"); 

var animState = 0; 
var timer = 0;
var exhaustParticles = []; // 普通尾气
var nitroParticles = [];   // 氮气火苗
var frameCount = 0;
var comboCount = 0;      
var comboTimer = 0;      
var comboScale = 1.0;    

// UI 控件
var giftBanner = new Label();
giftBanner.setTexture(resGiftBg);
// 【严格修改：尺寸与位置全部基于 UI_SCALE 与屏幕尺寸动态重构】
giftBanner.setSize(250 * UI_SCALE, 60 * UI_SCALE);
giftBanner.setPosition(UI_SCALE_X, 100 * UI_SCALE_Y); 
giftBanner.setFont("font/st.ttf", Math.round(20 * UI_SCALE));
giftBanner.setText("  神豪 点击送出超跑");
giftBanner.setColor(255, 0, 0, 0.2);    
giftBanner.setTextColor(255, 0, 0, 1);   
scene.addNode(giftBanner);

var car = new Sprite();
car.setTexture(resCar);
// 【严格修改：尺寸与初始横纵坐标全部基于动态屏幕比例计算】
car.setSize(400 * UI_SCALE, 180 * UI_SCALE);
car.setPosition(-500 * UI_SCALE_X, h * 350 / 600); 
scene.addNode(car);

var labCombo = new Label();
// 【严格修改：连击数字的大小和位置基于动态尺寸适配】
labCombo.setPosition(300 * UI_SCALE_X, 100 * UI_SCALE_Y); 
labCombo.setSize(120 * UI_SCALE, 60 * UI_SCALE);           
labCombo.setFont("font/st.ttf", Math.round(45 * UI_SCALE)); 
labCombo.setColor(0, 0, 0, 0);       
labCombo.setTextColor(255, 0, 0, 1);   
labCombo.setHide(true);              
scene.addNode(labCombo);

// 辅助函数：普通尾气（灰白色）
function createExhaust(x, y) {
    var p = new Node();
    // 【严格修改：粒子大小与相对于车身的偏移量进行等比例缩放】
    p.setSize(6 * UI_SCALE, 6 * UI_SCALE);
    p.setPosition(x + 50 * UI_SCALE, y + 175 * UI_SCALE);
    p.pAlpha = 0.5; 
    p.setColor(0.8, 0.8, 0.8, p.pAlpha); 
    scene.addNode(p);
    exhaustParticles.push(p);
}

// 辅助函数：氮气火焰（蓝色高亮）
function createNitro(x, y) {
    var p = new Node();
    // 氮气火焰比烟雾更长、更窄
    // 【严格修改：粒子大小与相对于车身的偏移量进行等比例缩放】
    p.setSize(15 * UI_SCALE, 4 * UI_SCALE);
    p.setPosition(x + 40 * UI_SCALE, y + 175 * UI_SCALE); 
    p.pAlpha = 1.0; 
    // 亮蓝色 (0, 0.6, 1)
    p.setColor(0, 0.6, 1, p.pAlpha); 
    scene.addNode(p);
    nitroParticles.push(p);
}

// 全屏点击
var clickLayer = new Sprite();
clickLayer.setPosition(0, 0);
clickLayer.setSize(screenW, screenH); 
clickLayer.setColor(0, 0, 0, 0.01); 
clickLayer.click(() => {
    if (animState === 0) {
        animState = 1;
        audio.playSound("sound/1.wav"); 
    }
    comboCount++;
    comboTimer = 0;       
    comboScale = 1.8;     
    labCombo.setHide(false);
    labCombo.setText(" x" + comboCount + " "); 
    if (animState === 2) timer = 0; 
});
scene.addNode(clickLayer);

// 核心循环
scene.upDate((time) => {
    frameCount++;

    // A1. 普通尾气更新
    for (var i = exhaustParticles.length - 1; i >= 0; i--) {
        var p = exhaustParticles[i];
        var pPos = p.getPosition();
        // 【严格修改：粒子漂移速度引入 X 轴动态缩放步长】
        p.setPosition(pPos.x - 4 * UI_SCALE_X, pPos.y + (Math.random() * 4 - 2) * UI_SCALE_Y);
        p.pAlpha -= 0.04;
        if (p.pAlpha <= 0) { p.setHide(true); exhaustParticles.splice(i, 1); }
    }

    // A2. 氮气粒子更新（更快消失，产生喷射感）
    for (var j = nitroParticles.length - 1; j >= 0; j--) {
        var n = nitroParticles[j];
        var nPos = n.getPosition();
        // 氮气粒子向后飞得极快
        // 【严格修改：粒子向后喷射速度引入 X 轴动态缩放步长】
        n.setPosition(nPos.x - 15 * UI_SCALE_X, nPos.y);
        n.pAlpha -= 0.15; // 消失极快
        if (n.pAlpha <= 0) { n.setHide(true); nitroParticles.splice(j, 1); }
    }

    // B. 七彩变色
    if (animState > 0) {
        var r = Math.sin(frameCount * 0.1) * 0.5 + 0.5;
        var g = Math.sin(frameCount * 0.1 + 2) * 0.5 + 0.5;
        var b = Math.sin(frameCount * 0.1 + 4) * 0.5 + 0.5;
        car.setColor(r, g, b, 1.0);
        giftBanner.setTextColor(r, g, b, 1.0);
    }

    // C. 连击数字
    if (!labCombo.isHide()) {
        comboTimer++;
        if (comboScale > 1.0) {
            comboScale -= 0.12;
            // 【严格修改：连击缩放变化基于自适应后的大小】
            labCombo.setSize(120 * UI_SCALE * comboScale, 60 * UI_SCALE * comboScale);
        }
        if (comboTimer > 80) { labCombo.setHide(true); comboCount = 0; }
    }

    // D. 状态机
    if (animState === 1) {
        var bPos = giftBanner.getPosition();
        var cPos = car.getPosition();
        // 【严格修改：进场动画边界阈值与位移步长转化为屏幕百分比计算】
        if (bPos.x < 20 * UI_SCALE_X) giftBanner.setPosition(bPos.x + 15 * UI_SCALE_X, bPos.y);
        if (cPos.x < 180 * UI_SCALE_X) {
            car.setRotate(-3); 
            car.setPosition(cPos.x + 25 * UI_SCALE_X, cPos.y - 1 * UI_SCALE_Y); 
            if (frameCount % 3 === 0) createExhaust(cPos.x, cPos.y);
        } else {
            car.setRotate(0); animState = 2; timer = 0;
        }

    } else if (animState === 2) {
        timer++;
        var cPos = car.getPosition();
        // 【严格修改：动态上下颠簸震动基准位置绑定当前屏幕高度比例】
        var shakeY = (h * 349 / 600) + (Math.random() * 4) * UI_SCALE_Y;
        car.setPosition(cPos.x, shakeY);
        if (frameCount % 5 === 0) createExhaust(cPos.x, cPos.y);
        if (timer > 140 && labCombo.isHide()) { animState = 3; }

    } else if (animState === 3) {
        // --- 离场：氮气全开 ---
        var bPos = giftBanner.getPosition();
        var cPos = car.getPosition();
        // 【严格修改：横幅退场位移步长绑定屏幕垂直缩放因子】
        giftBanner.setPosition(bPos.x, bPos.y - 10 * UI_SCALE_Y);
        
        // 速度曲线爆发
        // 【严格修改：爆发退出速度和位移绑定屏幕水平缩放因子】
        var exitSpeed = (30 + (timer * 3)) * UI_SCALE_X; 
        car.setRotate(5);
        car.setPosition(cPos.x + exitSpeed, cPos.y + 10 * UI_SCALE_Y); 
        
        // 【关键】喷射蓝色氮气火焰
        createNitro(cPos.x, cPos.y);
        if (frameCount % 2 === 0) createExhaust(cPos.x, cPos.y);

        // 【严格修改：出画隐藏阈值以及重置坐标动态绑定屏幕总宽度】
        if (cPos.x > w + 150 * UI_SCALE_X) {
            animState = 0; 
            car.setPosition(-500 * UI_SCALE_X, h * 350 / 600); 
            car.setRotate(0);
            giftBanner.setPosition(-300 * UI_SCALE_X, 100 * UI_SCALE_Y);
            car.setColor(1, 1, 1, 1);
        }
    }
});

game.pushScene(scene);
game.run();