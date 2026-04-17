
// 2048小游戏

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏

if (system =="WINDOWS" || system =="WEB")
{
    game.init() // windows默认窗口大小为800*600;web网页默认全屏
    window = game.getWindow(); // 获取资源对象
    w = window.getWidth();  // 屏幕宽带
    h = window.getHeight(); // 屏幕高度
}
else if(system =="WEIXIN")
{
    game.initSize(canvas.width,canvas.height); // 微信窗口
    window = game.getWindow(); // 获取资源对象
    w = canvas.width; // 微信窗口宽度
    h = canvas.height;// 微信窗口高度
}

// 判断横屏还是竖屏
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
GlobalVariable.w = w; // 屏幕宽度全局变量
GlobalVariable.h = h; // 屏幕高度全局变量
game.setFPS(20); // 设置帧率
 
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

