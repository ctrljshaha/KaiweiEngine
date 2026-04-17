// 赛车小游戏

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏
var res; // 资源

if (system =="WINDOWS" || system =="WEB")
{
    game.initSize(400,800); // windows默认窗口大小为800*600;web网页默认全屏
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
game.setFPS(30); // 设置帧率


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


