// 贪吃蛇游戏

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
game.setFPS(10); // 设置帧率

// 设置窗口log和标题
// ----------------------------------------------------------------------------------------------
var res = game.getResource();
var texture = res.getTexture("logo.png"); // 另一种获取纹理数据对象
window.setIcon(texture); // 设置窗口图标
window.setTitle("贪吃蛇小游戏");

let scene = new Scene();

// 申请游戏类
new Snake();

// 设置键盘回调函数
game.setKeyCallBack((key,action)=>{
    if ((key == Snake.KEY_W || key == Snake.KEY_UP) && Snake.type != "down"){
        Snake.type = "up";
    }
    else if ((key == Snake.KEY_S || key == Snake.KEY_BOTTOM) && Snake.type != "up"){
        Snake.type =  "down";
    }
    else if ((key == Snake.KEY_A || key == Snake.KEY_LEFT) && Snake.type != "right"){
        Snake.type =  "left";
    }
    else if ((key == Snake.KEY_D || key == Snake.KEY_RIGHT) && Snake.type != "left"){
        Snake.type =  "right";
    }
    //log("key "+key+" action "+action+" type "+Snake.type);
});


//  游戏运行
game.run();


