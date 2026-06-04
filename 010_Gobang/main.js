// 五子棋实例 [竖屏]

// AI模型应用：此实例包含几乎所有基本控件函数，可以给AI模型，例如：DeepSeek，Gemini，豆包等
// AI游戏生成：以实例为基础自动生成AI游戏代码，例如贪吃蛇，飞机大战，俄罗斯方块等小游戏
// AI提示文本："下面是开维游戏引擎的代码演示，根据这个代码，写一个sinx的函数演示代码。 代码如下：(实例代码，可以002游戏登录的代码)"

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
var res = game.getResource();
var texture = res.getTexture("logo.png"); // 另一种获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎-五子棋");// 设置主游戏窗口标题

new Gobang();

game.run();


