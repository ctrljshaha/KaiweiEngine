
// 扫雷小游戏 [竖屏]

// 玩儿法：
// 左键单击：翻开格子
// 右键单击或左键长按：标记地雷，网页版无法右键控制，用长按标记雷
// 左键双击：在已翻开的数字格上，如果周围已标记的红旗数等于数字，则自动翻开周围未翻开的格子

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
let isWeixin = false; // 是否是微信

// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.initSize(900,900);                    // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN") {                 // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
    isWeixin = true;
}
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.initSize(900,900);                // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}

// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(20);           // 设置帧率

// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎 - 扫雷小游戏"); // 设置主游戏窗口标题


// 设置声音类
var audio = new Audio();
audio.setMusicVolume(1); // 设置背景音乐音量大小
audio.setSoundVolume(0.5); // 设置音效音量大小
//audio.playSound("dj.mp3"); // 播放音效
//audio.playSound("baoza.mp3"); // 播放音效

new LevelScene(isWeixin);
game.setKeyCallBack((key,action)=>{
    if(action==0){
    }
});

// 游戏运行
game.run();


