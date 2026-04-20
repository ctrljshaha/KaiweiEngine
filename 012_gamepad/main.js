// ==============================================================================================
// 开维游戏引擎：独立精灵贴图手柄 (Logic 统一驱动版)
// ==============================================================================================

// 1. 初始化引擎与屏幕自适应
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName();
var w, h;
if (system == "WEIXIN") {
    game.initSize(canvas.width, canvas.height);
    w = canvas.width; h = canvas.height;
} else {
    game.init(); 
    var window = game.getWindow();
    w = window.getWidth(); h = window.getHeight();
}
game.setFPS(30);

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