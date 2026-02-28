// 贪吃蛇游戏
 
// 初始化游戏
game.initSize(800,800) // 设置分辨率
game.setFPS(10); // 设置帧率

// 设置窗口log和标题
var texture = game.getResource().getTexture("logo.png"); // 另一种获取纹理数据对象
var window = game.getWindow(); //获取游戏窗口
window.setIcon(texture); // 设置窗口图标
window.setTitle("贪吃蛇小游戏");

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


