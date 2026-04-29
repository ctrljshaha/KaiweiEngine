
// 斗地主小游戏
// 网络版本，使用开维服务器进行长链接通讯
// 微信小游戏，横屏导出。微信有大小限制，模拟器正常，真机需要做资源下载处理

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏
let isWeixin = false; // 是否是微信
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
    isWeixin = true;
}

// 判断横屏还是竖屏
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(20); // 设置帧率

// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎 - 斗地主"); // 设置主游戏窗口标题

// 开始游戏
new Login();

// new DdzPage(50)

game.run();


