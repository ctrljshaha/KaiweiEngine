// Hello world 程序实例
 
// 初始化游戏引擎
game.init(); // 默认窗口大小为800*600
//game.initSize(1024, 768); // 设置游戏主窗口大小，1024*768
game.setFPS(10); // 设置帧率
 
// 获取资源
var res = game.getResource(); // 获取资源对象
var texture = res.getTexture("img/logo.png"); // 获取纹理数据对象
//var texture = game.getResource().getTexture("img/logo.png"); // 另一种获取纹理数据对象
 
// 主窗口设置
var window = game.getWindow(); //获取游戏窗口
window.setIcon(texture); // 设置窗口图标
window.setTitle("开维游戏引擎（Game.js）"); // 设置窗口标题
var w = window.getWidth(); // 屏幕宽带
var h = window.getHeight(); // 屏幕高度
 
// 场景设置
var scene = new Scene(); // 新建场景
//scene.setBg(texture); // 设置背景图
scene.setColor(0,0,0,1); // 设置背景（r,g,b,a），填充黑色不透明
game.pushScene(scene);  //  把场景设置到主游戏窗口
scene.upDate((time)=>{ // 界面刷新回调函数，根据fps帧率的值回调，fps设置60就是一秒60次回调
     //log("fps callback"); // 编写游戏地图、子弹移动等
});
 
// 标签设置
var lab = new Label(); 
lab.setPosition(w/4, h/2.5);  // 标签位置横坐标，纵坐标。居中 或坐标lab.setPosition(160,240);
lab.setSize(500,50);    // 标签宽，高
lab.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
lab.setText("Hello world！你好，世界！"); // 标签文字
lab.setTextColor(0,255,0,1);  // 标签字体颜色
lab.setFont("font/st.ttf",30); // 标签汉字字库，字体大小
scene.addNode(lab); // 把标签增加到场景中
 
// 获取场景里面对象数据，从0开始 
var nodeArray = scene.getChilds();
var labTest = nodeArray[0]; // 获取第一个场景对象
//labTest.setText("世界，你好！"); // lab对象重写设置内容
 
// ----------------------------------------------------------------------------------
// 键盘回调方法，键值参考帮助文档中的键值表
// ----------------------------------------------------------------------------------
 
// 全局类，全局变量和参数
class GlobalVariable
{
  // 键盘键值
  static KEY_W = 87;
  static KEY_S = 83;
  static KEY_A = 65;
  static KEY_D = 68;
  static KEY_BOTTOM = 40;
  static KEY_UP = 38;
  static KEY_LEFT = 37;
  static KEY_RIGHT = 39;
}
 
// 函数功能：键盘回调函数，定义wasd或上下左右健
// 函数参数：key-键值；action-动作；
game.setKeyCallBack((key,action)=>{
  let type = "";
  if (key == GlobalVariable.KEY_W || key == GlobalVariable.KEY_UP)
      type = "up";
  else if (key == GlobalVariable.KEY_S || key == GlobalVariable.KEY_BOTTOM)
      type =  "down";
  else if (key == GlobalVariable.KEY_A || key == GlobalVariable.KEY_LEFT)
      type =  "left";
  else if (key == GlobalVariable.KEY_D || key == GlobalVariable.KEY_RIGHT)
      type =  "right";
   
  // 控制台中显示调试信息
  log("key "+key+" action "+action+" type "+type);
  logic(type) // 调用操控函数
});
 
// 函数功能：游戏中的键盘操作
// 函数参数：direction，方向 up down left right
function logic(direction)
{
  // 处理玩家输入的方向，移动所有格子并合并相同数字
  if(direction == "up") 
      log("上");
  else if (direction == "down") 
      log("下");
  else if (direction == "left") 
      log("左");
  else if (direction == "right") 
      log("右");
}
 
// 运行游戏
game.run();
