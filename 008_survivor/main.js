// 生存者小游戏 [横屏]

// 微信导出选择横屏导出

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
game.setFPS(10);           // 设置帧率

GlobalVariable.w = w; // 屏幕宽度全局变量
GlobalVariable.h = h; // 屏幕高度全局变量

// ----------------------------------------------------------------------------------------------
res = game.getResource();
var texture = res.getTexture("img/logo.png"); // 另一种获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎-生存者小游戏"); // 设置主游戏窗口标题

// Audio音乐类，设置背景音乐
var audio = new Audio();
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效


new Survivor();

game.run();


