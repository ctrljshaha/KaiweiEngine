// ==============================================================================================
// 开维游戏引擎：独立精灵贴图手柄 (Logic 统一驱动版)
// ==============================================================================================

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
game.setFPS(30);           // 设置帧率

// 2. 场景与资源准备
// ----------------------------------------------------------------------------------------------
var scene = new Scene();
scene.setColor(0, 0, 0, 1); 
game.pushScene(scene);

var res = game.getResource();
var texUp    = res.getTexture("img/up.png");
var texDown  = res.getTexture("img/down.png");
var texLeft  = res.getTexture("img/left.png");
var texRight = res.getTexture("img/right.png");

// 3. 手柄布局参数
// ----------------------------------------------------------------------------------------------
var sprW = 50;  
var sprH = 50;  
var gap  = 5;   
var startX = (w > h) ? 60 : (w - sprW * 3 - gap * 2) / 2;
var startY = h - (sprH * 3 + gap * 2) - 80;

// --- 提前声明中心提示标签，方便 logic 函数调用 ---
var labCenter = new Label();
labCenter.setSize(sprW, sprH);
labCenter.setPosition(startX + sprW + gap, startY + sprH + gap); 
labCenter.setText(" OK"); 
labCenter.setFont("font/st.ttf", 16);
labCenter.setTextColor(255, 255, 255, 1); 
labCenter.setColor(255, 255, 255, 0.2); // 给中间加个淡淡的方块底色
scene.addNode(labCenter);

// 4. 核心事件逻辑（在此处统一处理显示和业务）
// ----------------------------------------------------------------------------------------------
function logic(dir) {
    log("逻辑触发 -> " + dir);

    // 根据传入的方向参数，统一更新中间 Label 的文字
    if (dir == "up") {
        labCenter.setText("  上");
    } else if (dir == "down") {
        labCenter.setText("  下");
    } else if (dir == "left") {
        labCenter.setText("  左");
    } else if (dir == "right") {
        labCenter.setText("  右");
    }
    
    // 你可以在这里继续编写角色的实际移动逻辑
}

// ----------------------------------------------------------------------------------------------
// 【四个独立精灵按钮】
// ----------------------------------------------------------------------------------------------
var sprUp = new Sprite();
sprUp.setTexture(texUp);
sprUp.setSize(sprW, sprH);
sprUp.setPosition(startX + sprW + gap, startY);
sprUp.click(() => { logic("up"); });
scene.addNode(sprUp);

var sprDown = new Sprite();
sprDown.setTexture(texDown);
sprDown.setSize(sprW, sprH);
sprDown.setPosition(startX + sprW + gap, startY + (sprH + gap) * 2);
sprDown.click(() => { logic("down"); });
scene.addNode(sprDown);

var sprLeft = new Sprite();
sprLeft.setTexture(texLeft);
sprLeft.setSize(sprW, sprH);
sprLeft.setPosition(startX, startY + sprH + gap);
sprLeft.click(() => { logic("left"); });
scene.addNode(sprLeft);

var sprRight = new Sprite();
sprRight.setTexture(texRight);
sprRight.setSize(sprW, sprH);
sprRight.setPosition(startX + (sprW + gap) * 2, startY + sprH + gap);
sprRight.click(() => { logic("right"); });
scene.addNode(sprRight);

// 5. 键盘兼容
// ----------------------------------------------------------------------------------------------
game.setKeyCallBack((key, action) => {
    if (action == 1) { 
        if (key == 87 || key == 38) logic("up");
        if (key == 83 || key == 40) logic("down");
        if (key == 65 || key == 37) logic("left");
        if (key == 68 || key == 39) logic("right");
    }
});

game.run();