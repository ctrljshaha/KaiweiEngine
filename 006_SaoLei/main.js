
// 扫雷小游戏

// 玩儿法：
// 左键单击：翻开格子
// 右键单击或左键长按：标记地雷，网页版无法右键控制，用长按标记雷
// 左键双击：在已翻开的数字格上，如果周围已标记的红旗数等于数字，则自动翻开周围未翻开的格子

// 初始化游戏
game.initSize(900,900)
game.setFPS(10); // 设置帧率

// 设置窗口log和标题
var texture = game.getResource().getTexture("logo.png"); // 另一种获取纹理数据对象
var window = game.getWindow(); //获取游戏窗口
window.setIcon(texture); // 设置窗口图标
window.setTitle("扫雷小游戏");

// 设置声音类
var audio = new Audio();
audio.setMusicVolume(1); // 设置背景音乐音量大小
audio.setSoundVolume(0.5); // 设置音效音量大小
//audio.playSound("dj.mp3"); // 播放音效
//audio.playSound("baoza.mp3"); // 播放音效

new LevelScene();
game.setKeyCallBack((key,action)=>{
    if(action==0){
    }
});

// 游戏运行
game.run();


