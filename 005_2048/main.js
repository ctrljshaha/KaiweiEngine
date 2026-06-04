
// 2048小游戏 [竖屏]

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

GlobalVariable.w = w; // 屏幕宽度全局变量
GlobalVariable.h = h; // 屏幕高度全局变量

// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎 - 2048小游戏"); // 设置主游戏窗口标题


// 设置声音类
var audio = new Audio();
audio.setMusicVolume(1); // 设置背景音乐音量大小
audio.setSoundVolume(0.5); // 设置音效音量大小
audio.playSound("dj.wav"); // 播放音效
 
// 创建游戏类，初始化在其构造函数中
new Game2048();
 
// 设置键盘回调函数，定义上下左右健
game.setKeyCallBack((key,action)=>{
    let type = "";
    if (key == GlobalVariable.KEY_W || key == GlobalVariable.KEY_UP){
        type = "up";
    }
    else if (key == GlobalVariable.KEY_S || key == GlobalVariable.KEY_BOTTOM){
        type =  "down";
    }
    else if (key == GlobalVariable.KEY_A || key == GlobalVariable.KEY_LEFT){
        type =  "left";
    }
   else if (key == GlobalVariable.KEY_D || key == GlobalVariable.KEY_RIGHT){
        type =  "right";
    }
    
    //log("key "+key+" action "+action+" type "+type);

    Game2048.logic(type)
});


// =======================================================================
// 封装左右上下滑动
// =======================================================================
// --- 滑动控制器封装 ---
var SwipeControls = {
    startX: 0,
    startY: 0,
    threshold: 40, // 触发滑动的最小距离（像素）

    // 初始化监听
    init: function(targetScene, onSwipeCallback) {
        targetScene.onPress((x, y) => {
            this.startX = x;
            this.startY = y;
        });

        targetScene.onRelease((x, y) => {
            var dx = x - this.startX;
            var dy = y - this.startY;

            // 如果滑动距离太小，视为普通点击，不触发滑动
            if (Math.abs(dx) < this.threshold && Math.abs(dy) < this.threshold) return;

            // 判断滑动方向
            if (Math.abs(dx) > Math.abs(dy)) {
                // 左右滑动
                if (dx > 0) type = "RIGHT";
                else type =  "LEFT";
            } else {
                // 上下滑动
                if (dy > 0) type = "DOWN";
                else type = "UP";
            }
        });
    }
};


// 运行游戏
game.run();

