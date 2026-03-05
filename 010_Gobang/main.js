// 五子棋实例

// AI模型应用：此实例包含几乎所有基本控件函数，可以给AI模型，例如：DeepSeek，Gemini，豆包等
// AI游戏生成：以实例为基础自动生成AI游戏代码，例如贪吃蛇，飞机大战，俄罗斯方块等小游戏
// AI提示文本："下面是开维游戏引擎的代码演示，根据这个代码，写一个sinx的函数演示代码。 代码如下：(实例代码，可以002游戏登录的代码)"

game.init()
game.setFPS(10);

var window = game.getWindow(); // 获取资源对象
var texture = game.getResource().getTexture("logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎-五子棋");// 设置主游戏窗口标题

new Gobang();

game.run();


