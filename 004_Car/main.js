// 赛车小游戏

//  初始化游戏主屏幕
game.initSize(400,800) // 设置分辨率
game.setFPS(30); // 设置帧率

// 设置窗口log和标题
var texture = game.getResource().getTexture("logo.png"); // 另一种获取纹理数据对象
var window = game.getWindow(); //获取游戏窗口
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


