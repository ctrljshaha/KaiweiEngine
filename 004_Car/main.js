// 赛车小游戏 [竖屏]

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
    game.initSize(400,800);                    // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.initSize(400,800);                // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}

// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(40);           // 设置帧率

// 设置窗口log和标题
// ----------------------------------------------------------------------------------------------
res = game.getResource();
var texture = res.getTexture("logo.png"); // 另一种获取纹理数据对象
window.setIcon(texture); // 设置窗口图标
window.setTitle("赛车小游戏");

// 创建游戏类
new Car();

// 设置键盘回调函数
game.setKeyCallBack((key,action)=>{
    if (key == Car.KEY_W || key == Car.KEY_UP){
        Car.type = "up";
    }
    else if (key == Car.KEY_S || key == Car.KEY_BOTTOM){
        Car.type =  "down";
    }
    else if (key == Car.KEY_A || key == Car.KEY_LEFT){
        Car.type =  "left";
    }
    else if (key == Car.KEY_D || key == Car.KEY_RIGHT){
        Car.type =  "right";
    }
    //log("key "+key+" action "+action+" type "+Car.type);
});

// 运行游戏
game.run();


