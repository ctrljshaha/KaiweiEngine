
// 2048小游戏

// 初始化游戏引擎
game.init(); // 默认窗口大小为800*600
//game.initSize(1024, 768); // 设置游戏主窗口大小，1024*768
game.setFPS(10);
 
//  获取游戏主窗口，设置图标和标题
let window = game.getWindow();
let texture = game.getResource().getTexture("logo.png");
window.setIcon(texture);
window.setTitle("2048小游戏");

// 设置声音类
var audio = new Audio();
audio.setMusicVolume(1); // 设置背景音乐音量大小
audio.setSoundVolume(0.5); // 设置音效音量大小
audio.playSound("dj.mp3"); // 播放音效
 
// 创建游戏类，初始化在其构造函数中
new Game2048();
 
// 设置键盘回调函数，定义上下左右健
game.setKeyCallBack((key,action)=>{
    let type = "";
    if (key == GlobalVariable.KEY_W || key == GlobalVariable.KEY_UP){
        type = "up";
    }
    else if (key == GlobalVariable.KEY_S || key == GlobalVariable.KEY_BOTTOM){
        type =  "down";
    }
    else if (key == GlobalVariable.KEY_A || key == GlobalVariable.KEY_LEFT){
        type =  "left";
    }
   else if (key == GlobalVariable.KEY_D || key == GlobalVariable.KEY_RIGHT){
        type =  "right";
    }
    
    //log("key "+key+" action "+action+" type "+type);

    Game2048.logic(type)
});

// 运行游戏
game.run();

