// 生存者小游戏

game.init()
game.setFPS(10);


var window = game.getWindow(); // 获取资源对象
var texture = game.getResource().getTexture("img/logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎-生存者小游戏"); // 设置主游戏窗口标题

// Audio音乐类，设置背景音乐
var audio = new Audio();
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效


new Survivor();

game.run();


