// 飞机大战小游戏

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏
var res; // 资源

if (system =="WINDOWS" || system =="WEB")
{
    game.init(); // windows默认窗口大小为800*600;web网页默认全屏
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

game.setFPS(40); // 设置帧率

// ----------------------------------------------------------------------------------------------
res = game.getResource();
var texture = res.getTexture("img/logo.png"); // 另一种获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎-飞机大战小游戏"); // 设置主游戏窗口标题

// Audio音乐类，设置背景音乐
var audio = new Audio();
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放

new AirplaneBattle();

game.run();
