* 001_HelloWorld 源码

```js
// Hello world 程序实例
  
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
  
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率
 
// 获取资源
var res = game.getResource(); // 获取资源对象
var texture = res.getTexture("img/logo.png"); // 获取纹理数据对象
//var texture = game.getResource().getTexture("img/logo.png"); // 另一种获取纹理数据对象
 
// 主窗口设置
var window = game.getWindow(); //获取游戏窗口
window.setIcon(texture); // 设置窗口图标
window.setTitle("开维游戏引擎"); // 设置窗口标题
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
var labW = 200;
var labH = 120;
lab.setSize(labW, labH);   // 标签宽，高
lab.setPosition((w-labW)/2, (h-labH)/2); // 动态计算位置：(w-labW)/2是横向正中心；(h-labH)/2是纵向正中心
lab.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
lab.setText("Hello world！\n\n你好，世界！"); // 标签文字
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
```
* 002_Login 游戏登录 源码

```js
// 基础控件实例
 
// AI模型应用：此实例包含几乎所有基本控件函数，可以给AI模型，例如：DeepSeek，Gemini，豆包等
// AI游戏生成：以实例为基础自动生成AI游戏代码，例如贪吃蛇，飞机大战等小游戏
// AI提示文本："下面是开维游戏引擎的代码演示，根据这个代码，写一个sinx的函数演示代码。 代码如下：(拷贝以下代码)"
 
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
  
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率
 
// 游戏场景设置
var scene = new Scene(); // 新建场景1，登录界面
var scene2 = new Scene(); // 新建场景2
var scene3 = new Scene(); // 新建场景3
game.pushScene(scene); // 将登录场景设置到游戏中
 
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面new
var audio = new Audio(); // 定义全局音乐类
 
// ----------------------------------------------------------------------------------------------
// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("img/logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎"); // 设置主游戏窗口标题
 
// ----------------------------------------------------------------------------------------------
// Scence场景设置
// ----------------------------------------------------------------------------------------------
// 第1个场景，登录
 if (screenType == "Landscape") // 横屏
    texture = game.getResource().getTexture("img/bg.jpg");  // 获取背景图资源
else
    texture = game.getResource().getTexture("img/bgs.jpg");  // 获取背景图资源
scene.setBg(texture); // 设置场景背景图
// 第2个场景设置背景，点击登录时调用
texture = game.getResource().getTexture("img/scene2.png");  // 获取背景图资源
scene2.setBg(texture);
// 第3个场景设置背景
texture = game.getResource().getTexture("img/scene3.png");  // 获取背景图资源
scene3.setBg(texture);
  
// 场景回调，定时器实现在场景中根据帧率实现，游戏中不能用Sleep()或者 setTimeout(function() {}, 500);会阻塞进程
var secondTimeout = 0;
var second = 0;
var messageTimeout = 0;
var messageLabel = null; // 消息框
scene.upDate((time)=>{ // 界面刷新回调函数，根据fps帧率的值回调，fps设置60就是一秒60次回调
     // log("fps callback"); // 编写游戏地图、子弹移动等
     var nodes = scene.getChilds(); // 读取所有场景节点，返回数组
     var labDebug = nodes[0];  // 读取数据第一个对象
     const timeStr = new Date().toTimeString().split(' ')[0]; // 返回当前时间
     var str = "调试信息\n"+"时间："+timeStr;
     labDebug.setText(str); // 设置对象时间，每帧刷新一下时间
     secondTimeout += time;
     messageTimeout += time;
     
     // 延时1秒刷新
     if (secondTimeout > 1) 
     {
        secondTimeout = 0;
        second++;
        str += "\n延时："+second+"秒";
        labDebug.setText(str); // 延时多少秒显示
     }
     
     // 延时3秒，消息框消失
     if(messageTimeout > 3) 
     {
         messageTimeout = 0;
         if (messageLabel)
            messageLabel.setHide(true); // 隐藏消息框
     }
});
 
// ----------------------------------------------------------------------------------------------
// Audio音乐类，设置背景音乐
// ----------------------------------------------------------------------------------------------
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
// ----------------------------------------------------------------------------------------------
// Label标签设置，调试窗口信息
// ----------------------------------------------------------------------------------------------
var labDebug = new Label(); // 新建标签类
labDebug.setPosition(20, 50); // 标签位置横坐标，纵坐标。
labDebug.setSize(130, 150); // 标签宽，高
labDebug.setColor(0,0,0,0.1);  // 标签背景颜色为黑色并透明
labDebug.setTextColor(0,1,0,0.5);  // 标签字体颜色
labDebug.setFont("font/st.ttf",15); // 标签汉字字库，字体大小，必须指定
scene.addNode(labDebug);  // 把标签增加到场景中
  
// ----------------------------------------------------------------------------------------------
// Label标签设置，显示游戏名称
// ----------------------------------------------------------------------------------------------
var resName = game.getResource().getTexture("img/name.png");  // 获取背景图资源
var labLog = new Label(); // 新建标签类
var labLogW = 350;
var labLogH = 150;
labLog.setSize(labLogW, labLogH); // 标签宽，高
labLog.setPosition((w-labLogW)/2, 20); // 标签位置横坐标，纵坐标。
labLog.setTexture(resName); 
labLog.setFont("font/st.ttf",15); // 标签汉字字库，字体大小，必须指定
//labLog.setText("标签上的测试文字\n换行123");
//lab.setColor(0,0,0,1);  // 标签背景颜色为黑色并透明
//labLog.setRotate(180); // 标签旋转180度
labLog.upDate((time)=>{ // 设置帧率回调，如果不需要可以注释
 //log("Lab callback");
});
scene.addNode(labLog);  // 把标签增加到场景中
 
// ----------------------------------------------------------------------------------------------
// Label标签设置，创建屏幕中间的消息标签
// ----------------------------------------------------------------------------------------------
// 函数功能：创建消息显示框
function createMessage() 
{
    // 假定引擎支持 Label 类（如果不存在可改为 Text 或自定义）
    messageLabel = new Label(); 
    var labW = 100;
    var labH = 120;
    messageLabel.setSize(labW, labH);   // 标签宽，高
    messageLabel.setPosition((w-labW)/2, (h-labH)/2); // 动态计算位置：(w-labW)/2是横向正中心；(h-labH)/2是纵向正中心
    messageLabel.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
    //messageLabel.setText("提示"); // 标签文字
    messageLabel.setTextColor(0,255,0,1);  // 标签字体颜色
    messageLabel.setFont("font/st.ttf",20); // 标签汉字字库，字体大小
    scene.addNode(messageLabel); // 把标签增加到场景中
}
// 函数功能：在屏幕中间显示信息后，延时消失
function showMessage(msg) 
{
    if (messageLabel)
    {
        messageTimeout = 0;// 重新开始计时
        messageLabel.setText(msg); // 设置消息
        messageLabel.setHide(false); // 显示消息框
    }
}
  
// ----------------------------------------------------------------------------------------------
// Node节点控件，这个是很多控件的基类。左上角显示一个绿色小方块，中间有个蓝色小方块
// ----------------------------------------------------------------------------------------------
log("\nNode节点控件 -------------------------------------------------------------------------");
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
var pos = node.getPosition(); // 获取节点坐标
log("节点横坐标x：" + pos.x + "节点纵坐标y：" + pos.y);
node.setSize(20,50);    // 设置节点宽，高
var size = node.getSize(); // 获取节点大小
log("节点宽度：" + size.x + "节点宽度：" + size.y);
node.setName("Hello world"); // 设置节点文字
var name = node.getName(); // 获取节点文字
log("节点文字："+name);
node.setColor(1,2,3,0.5);  // 设置节点颜色
var color = node.getColor(); // 获取节点颜色
log("获取节点颜色值为：r：" + color.x + "  g：" + color.y + "  b：" + color.z+ "  a：" + color.w);
node.setRotate(90); // 设置节点选择角度0~360
var routate = node.getRotate(); // 获取节点选择角度
log("旋转角度为："+routate);
node.setHide(false); // 设置节点是否隐藏
var hide = node.isHide(); // 获取节点是否隐藏
log("node节点是否隐藏：" + hide);
scene.addNode(node); // 把节点增加到场景中
node.upDate((time)=>{ // 设置帧率回调，如果不需要可以注释
 //log("Node callback");
});
// 增加节点：在绿色小方块上，添加子节点，红色小方块，然后改为蓝色小方块
var node1 = new Node(); // 新建子节点
node1.setPosition(2, 20);  // 节点位置横坐标，纵坐标
node1.setSize(10,10);    // 设置节点宽，高
node1.setColor(255,0,0,1);  // 设置节点颜色，红色
node.addNode(node1); // 把子节点添加到父节点中
node.removeNode(node1); // 把子节点删除
node.addNode(node1); // 再次把子节点添加到父节点中
var nodeArray = node.getNodes(); // 获取node节点数组对象数据，从0开始 
var nodeTemp = nodeArray[0]; // 获取第一个node对象
nodeTemp.setColor(0,0,255,1);  // 设置子节点颜色，蓝色
  
// ----------------------------------------------------------------------------------------------
// Edit编辑框设置，输入用户名称
// ----------------------------------------------------------------------------------------------
var resEditBg = game.getResource().getTexture("img/edit.png"); // 获取纹理数据对象
var editName = new Edit(); // 新建编辑框
editName.setTexture(resEditBg); // 设置底图
var editNameW = 180;
var editNameH = 60;
editName.setSize(editNameW, editNameH); // 编辑框的大小，宽度和高度
editName.setPosition((w-editNameW)/2, 340); // 编辑框的位置，横坐标和纵坐标
editName.setPadding(10); // 编辑框中开始输入的地方
editName.setFont("font/st.ttf", 20); // 编辑框的汉字字库，字体大小，必不可少
//editName.setColor(255, 255, 255, 0.1);  // 编辑框背景颜色为白色并透明
//editName.setPubText("编辑框内容"); // 编辑框字体颜色为黑色不透明
scene.addNode(editName);  // 加入到场景中
 
// ----------------------------------------------------------------------------------------------
// Sprite精灵设置，登录按钮，点击登录后替换背景音乐
// ----------------------------------------------------------------------------------------------
var resBtnBg = game.getResource().getTexture("img/button.png"); // 获取纹理数据对象
var sprLogin = new Sprite(); // 新建精灵
sprLogin.setTexture(resBtnBg); // 设置精灵背景
var sprLoginW = 200;
var sprLoginH = 60;
sprLogin.setSize(sprLoginW,sprLoginH); // 设置精灵大小
sprLogin.setPosition((w-sprLoginW)/2, 420); // 标签位置横坐标，纵坐标。
sprLogin.click((type,x,y)=>{ // 标签鼠标长按回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    var edittext = editName.getText(); // 点击时，读取edit框内容
    log("Edit框内容："+edittext);
    audio.stopMusic(); // 停止当前背景音乐
    audio.playMusic("sound/Normal2.mp3"); // 循环播放音乐
    audio.playSound("sound/1.wav"); // 播放音效
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    
    // 点击登录后，显示登陆信息
    showMessage("登录成功！");

    // 把欢迎页面设置到游戏场景中    
    game.pushScene(scene2); 
});
sprLogin.longClick((type,x,y)=>{ // 标签鼠标长按回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("长按: "+type+"\tx:"+x+"\ty:"+y);
});
// 第2个场景，点击进入第3个场景
scene2.onPress((x,y)=>{
    game.pushScene(scene3); 
});
// 第3个场景，第一次点击后返回第2个场景，之后的点击返回主页面
var scene3num = 0;
scene3.onPress((x,y)=>{
    if (scene3num++==0)
        game.popScene(); // 返回上一个场景
    else
        game.replaceScene(scene); // 把游戏主窗口中的场景替换成scene
});
  
scene.addNode(sprLogin); // 加入到场景中
//var nodes = scene.getChilds();
 
// ----------------------------------------------------------------------------------------------
// Sprite精灵设置，飞机节点，点击飞机后可以随时拖动，演示鼠标点击，拖动，抬起用法
// ----------------------------------------------------------------------------------------------
var resBtnAir = game.getResource().getTexture("img/airplane.png"); // 获取纹理数据对象
var sprAir = new Sprite(); // 新建精灵
sprAir.setTexture(resBtnAir); // 设置精灵背景
sprAir.setSize(30,30); // 设置精灵大小
sprAir.setPosition(30, 420); // 标签位置横坐标，纵坐标。
sprAir.click(()=>{ // 点击回调函数，更换图片
});
sprAir.longClick(()=>{ // 长按回调函数，更换图片
});
scene.addNode(sprAir); // 加入到场景中
// 根据场景中鼠标位置拖动精灵，按住、移动、释放的回调
var offsetx = 0; // 精灵横坐标
var offsety = 0; // 精灵纵左边
var isPressPlane = false; // 释放按住飞机
// 场景中鼠标点击回调
scene.onPress((x,y)=>{
    if(sprAir.isContainPostion(x,y)) // 判断鼠标位置释放在精灵范围之内
    {
        // 点击精灵并计算位置，保留位置
        isPressPlane = true; // 按住精灵了
        offsetx = sprAir.getSprite().x-x; // 重新计算精灵横坐标
        offsety = sprAir.getPosition().y-y; // 重新计算精灵纵
    }
    else
    {
        // 没有命中精灵
        isPressPlane = false;
    }
});
// 场景中鼠标移动回调
scene.onMove((x,y)=>{
    if(isPressPlane)
        sprAir.setPosition(x+offsetx, y+offsety);
});
// 场景中鼠标抬起回调
scene.onRelease((x,y)=>{
});
 
 
// ----------------------------------------------------------------------------------------------
// ProgressBar进度条设置
// ----------------------------------------------------------------------------------------------
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setBgTexture(resLoad); // 设置进度条图片
progLoad.setTexture(resLoad); // 设置进度条图片
var progLoadW = 380;
var progLoadH = 20;
progLoad.setSize(progLoadW, progLoadH); // 进度条区域大小，宽和高
progLoad.setPosition((w-progLoadW)/2, 550); // 进度条显示位置
progLoad.setBgColor(1.0,0.5,0.2,1); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    //log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
 
// ----------------------------------------------------------------------------------------------
// Slide滑动控件，音量调节
// ----------------------------------------------------------------------------------------------
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
var slideLoadW = 150;
var slideLoadH = 15;
slideLoad.setSize(slideLoadW, slideLoadH); // 滑块区域大小，宽和高
slideLoad.setPosition((w-slideLoadW)/2, 500); // 滑块显示位置，横坐标，纵坐标
//slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(audio.getMusicVolume()*100); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值

    audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小
    audio.setSoundVolume(0.5); // 设置音效音量大小
    var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小
    var SoundVal = audio.getSoundVolume();// 获取音效音量大小

    //log("滑块最大值："+max+"进度条当前值："+val +"背景音乐音量大小："+MusicVal +"音效音量大小："+SoundVal );
});
scene.addNode(slideLoad);  // 加入到场景中
  
// ----------------------------------------------------------------------------------------------
// ScrollView滚动视图
// ----------------------------------------------------------------------------------------------
log("\nScrollView滚动视图 --------------------------------------------------------------------");
// 设置滚动视图大小，位置，背景等。半透明背景图中有白色的底图
var resScrollViewBg = game.getResource().getTexture("img/ScrollViewBg.png"); // 获取纹理数据对象
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setTexture(resScrollViewBg); //设置滚动视图背景图
scrollview.setColor(0.2, 0.5, 0.8, 0.5); // 设置滚动视图颜色
scrollview.setPosition(20,200);// 滚动视图的位置，横坐标和纵坐标
scrollview.setSize(100,100);// 滚动视图的大小，宽度和高度
scrollview.setContentSize(400,400); // 设置滚动视图中内容大小
 
// 是否隐藏滚动试图中，水平和垂直滑块
//scrollview.setShowHBar(false); // flase隐藏；ture显示；默认显示水平滚动条
//scrollview.setShowVBar(false); // flase隐藏；ture显示；默认显示垂直滚动条
 
// 获取滚动视图位置
scrollview.setScrollOffsetX(10); //  水平滚动滑块的初始位置，横坐标从10开始
scrollview.setScrollOffsetY(20); //  垂直滚动滑块的初始位置，纵坐标从20开始
var sx = scrollview.getOffsetX(); // 获取水平滚动滑块的位置
var sy = scrollview.getOffsetY(); // 获取垂直滚动滑块的位置
log("scrollview滚动窗口水平滑块初始位置："+sx);
log("scrollview滚动窗口垂直滑块初始位置："+sy);
 
// 设置滚动试图中，水平和垂直滑道的宽窄，如果不调用此函数，默认为20
scrollview.setHBarHeight(10); // 设置水平滚动条滑道的高度
scrollview.setVBarWidth(10);  // 设置垂直滚动条滑道的宽度
 
// 滚动视图中加入一张图片
var resSpr1 = game.getResource().getTexture("img/Spr1.png"); // 获取纹理数据对象
var spr1 = new Sprite(); // 新建精灵
spr1.setTexture(resSpr1); // 设置精灵为白色背景图
spr1.setSize(160,160); // 设置精灵大小
spr1.setPosition(10, 50); // 标签位置横坐标，纵坐标。
scrollview.addNode(spr1); // 向滚动动窗口中增加精灵，效果为：黑色的滚动窗口中有一个白色的图
 
// 设置滚动视图垂直滚动条
var vscrollBar =scrollview.getVScrollBar(); // 获取滚动窗口中的垂直滚动条
var resVScrollBarBg = game.getResource().getTexture("img/resVScrollBarBg.png"); // 获取纹理数据对象，灰色背景图
vscrollBar.setColor(0,255,0,1); // 设置垂直滚动条背景颜色为绿色
vscrollBar.setTexture(resVScrollBarBg); // 设置滚动条里面滑块背景图为灰色
vscrollBar.setBarColor(0,0,255,1);  // 设置滚动条中滑块颜色为蓝色
vscrollBar.setBarTexture(resVScrollBarBg);// 设置滚动条中滑块背景图
 
// 设置滚动视图水平滚动条
var hscrollBar =scrollview.getHScrollBar(); // 获取滚动窗口中的水平滚动条
var resHScrollBarBg = game.getResource().getTexture("img/resVScrollBarBg.png"); // 获取纹理数据对象，灰色背景图
hscrollBar.setColor(0,255,255,1); // 设置水平滚动条背景颜色为青色
hscrollBar.setTexture(resHScrollBarBg); // 设置水平滚动条里面滑块背景图为灰色
hscrollBar.setBarColor(255,0,255,1);  // 设置水平滚动条中滑块颜色为红色
hscrollBar.setBarTexture(resHScrollBarBg);// 设置水平滚动条中滑块背景图
 
scene.addNode(scrollview); // // 加入到场景中 
 
// ----------------------------------------------------------------------------------------------
// Http网络类
// ----------------------------------------------------------------------------------------------
log("\nHttp网络类 -----------------------------------------------------------------------------");
 var http = new Http();
 http.get("https://ctrljs.ikaiwei.com/api/test/request_logs.do?sf=sf",(str)=>{
 log(str);
 });
 http.post("https://ctrljs.ikaiwei.com/api/test/request_logs.do?","sff=sf111&se=1",(str)=>{
 });
  
// ----------------------------------------------------------------------------------------------
// websocket类
// ----------------------------------------------------------------------------------------------
log("\nwebsocket长链接类 --------------------------------------------------------------------");
var aWebSocket = new SocketIO(); // 创建长连接类
var appid= "h11do3gq";
aWebSocket.initIO(appid);  // 初始化长链接中的appid，区分项目用，也可以为空
  
// 设置长连接
aWebSocket.connectIO("https://imtest.linchixuan.com/"+appid,"appId="+appid+"&uid=68661f92a88ebd78856482bc&deviceId=132441241244"); // 建立长链接
 aWebSocket.on("SIO_INFO",function(str){ // 监听长链接数据，设置回调函数
   log(JSON.stringify(str));
});
aWebSocket.on("connect",function(){
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    //aWebSocket.disConnect(); // 关闭长链接
});
 
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
 
// 创建显示框
createMessage();
 
// 运行游戏
game.run();
```
* 108_ai_angrybirds 愤怒的小鸟 源码

```js
// 愤怒的小鸟实例
// 微信小游戏导出，选择横屏导出
// gemini生成的代码,后期添加了手势的操控。
// AI提示文本："下面是开维游戏引擎的代码演示，根据这个代码，写一个愤怒的小鸟游戏。 代码如下：(拷贝002实例代码)"
// 如果需要适配屏幕大小，需要继续优化，可以参考002实例继续优化
  
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
 
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone")         // 手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率
 
// 获取资源
var resBg = game.getResource().getTexture("img/bg.png");
var resBird = game.getResource().getTexture("img/bird.png");
var resWood = game.getResource().getTexture("img/wood.png");
 
// --- 音频处理 ---
var audio = new Audio();
audio.playMusic("sound/25. Main Theme.mp3");
audio.setMusicVolume(0.2); 
audio.setSoundVolume(0.8);
 
var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);
 
// --- 动态屏幕适配比例 ---
var scaleX = w / 800;
var scaleY = h / 600;
 
// --- 游戏变量 ---
var gravity = 0.5 * scaleY;
var isFlying = false;
var inCooldown = false; 
var score = 0; // 总得分
 
var birdStartX = 150 * scaleX, birdStartY = 350 * scaleY;
var vx = 0, vy = 0;
var angle = -45;  
var power = 18 * scaleX;   
 
// --- 鼠标交互变量 ---
var isDragging = false;
var mouseStartX = 0;
var mouseStartY = 0;
 
// 动画变量
var woodAngle = 0;       
var targetWoodAngle = 0; 
var fallSpeed = 8;       
 
// 修改：倒计时变量改为 120 帧（对应 60FPS 下的 2秒）
var cooldownFrames = 0;
var totalCooldownFrames = 120; 
var resultMessage = "";
var resultColor = {r: 0, g: 0, b: 0};
 
// --- 1. 预判虚线池 ---
var dotCount = 15;
var dots = [];
for (var i = 0; i < dotCount; i++) {
    var dot = new Node();
    dot.setSize(4 * scaleX, 4 * scaleY);
    dot.setColor(0.5, 0.5, 0.5, 0.6); 
    dot.setHide(true);
    scene.addNode(dot);
    dots.push(dot);
}
 
// --- 2. 烟雾尾迹池 ---
var trailCount = 20;
var trails = [];
var trailIndex = 0;
for (var i = 0; i < trailCount; i++) {
    var trail = new Node();
    trail.setSize(8 * scaleX, 8 * scaleY);
    trail.setColor(1, 1, 1, 0.4); 
    trail.setHide(true);
    scene.addNode(trail);
    trails.push(trail);
}
 
// --- 3. 目标木块 ---
var wood = new Sprite();
wood.setTexture(resWood);
wood.setSize(50 * scaleX, 100 * scaleY);
wood.setPosition(650 * scaleX, 350 * scaleY); 
scene.addNode(wood);
 
// --- 4. 小鸟精灵 ---
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(45 * scaleX, 45 * scaleY);
bird.setPosition(birdStartX, birdStartY);
scene.addNode(bird);
 
// --- 5. UI 标签 ---
var labDebug = new Label();
labDebug.setPosition(20 * scaleX, 20 * scaleY);
labDebug.setSize(240 * scaleX, 120 * scaleY);
labDebug.setColor(1, 0, 0, 0.4); 
labDebug.setTextColor(1, 1, 1, 1);
labDebug.setFont("font/st.ttf", Math.round(16 * scaleY)); 
scene.addNode(labDebug); 
 
// 得分标签：红色、背景透明
var labScore = new Label();
labScore.setPosition(350 * scaleX, 20 * scaleY);
labScore.setSize(150 * scaleX, 50 * scaleY);
labScore.setColor(0, 0, 0, 0); 
labScore.setTextColor(1, 0, 0, 1); 
labScore.setFont("font/st.ttf", Math.round(24 * scaleY));
labScore.setText("得分: 0");
scene.addNode(labScore);
 
// 击中特效文字：红色
var labPlus = new Label();
labPlus.setSize(100 * scaleX, 50 * scaleY);
labPlus.setColor(0, 0, 0, 0);
labPlus.setTextColor(1, 0, 0, 1); 
labPlus.setFont("font/st.ttf", Math.round(30 * scaleY));
labPlus.setText("+1");
labPlus.setHide(true);
scene.addNode(labPlus);
 
// 结果标签：红色、背景透明
var labResult = new Label();
labResult.setPosition(300 * scaleX, 180 * scaleY); 
labResult.setSize(220 * scaleX, 80 * scaleY);      
labResult.setColor(0, 0, 0, 0); 
labResult.setTextColor(1, 0, 0, 1); 
labResult.setFont("font/st.ttf", Math.round(18 * scaleY)); 
labResult.setHide(true); 
scene.addNode(labResult);
 
// --- 功能函数 ---
 
function triggerResult(msg, color, isHit) {
    if (inCooldown) return;
    isFlying = false;
    inCooldown = true;
    cooldownFrames = totalCooldownFrames; 
    resultMessage = msg;
    resultColor = {r: 1, g: 0, b: 0}; 
     
    if (isHit) {
        score += 1;
        labScore.setText("得分: " + score);
        labPlus.setPosition(650 * scaleX, 300 * scaleY);
        labPlus.setHide(false);
    }
}
 
function resetGame() {
    isFlying = false;
    isDragging = false; 
    inCooldown = false;
    cooldownFrames = 0;
    vx = 0; vy = 0;
    bird.setPosition(birdStartX, birdStartY);
    woodAngle = 0;
    targetWoodAngle = 0;
    wood.setRotate(0);
    wood.setPosition(650 * scaleX, 350 * scaleY);
    wood.setHide(false);
    labResult.setHide(true);
    labPlus.setHide(true);
    for (var i = 0; i < trailCount; i++) trails[i].setHide(true);
}
 
function updateTrajectoryPreview() {
    var rad = angle * Math.PI / 180;
    var tVx = Math.cos(rad) * power;
    var tVy = Math.sin(rad) * power;
    for (var j = 0; j < dotCount; j++) {
        var t = j * 2.5; 
        dots[j].setPosition(birdStartX + tVx * t, birdStartY + tVy * t + 0.5 * gravity * t * t);
        dots[j].setHide(false);
    }
}
 
// --- 6. 游戏主循环 ---
scene.upDate((time) => {
    labDebug.setText("状态: " + (isFlying ? "飞行" : (isDragging ? "瞄准中" : "待机")) + 
                     "\n角度: " + angle.toFixed(1) + "° (上下键)" +
                     "\n力度: " + (power / scaleX).toFixed(1) +  " (左右键)" + 
                     "\n拖拽小鸟进行弹射, R重置");

    if (!labPlus.isHide()) {
        var pPos = labPlus.getPosition();
        labPlus.setPosition(pPos.x, pPos.y - 2 * scaleY); 
    }
 
    if (woodAngle < targetWoodAngle) {
        woodAngle += fallSpeed;
        if (woodAngle > targetWoodAngle) woodAngle = targetWoodAngle;
        wood.setRotate(woodAngle);
        var offset = (woodAngle / 90) * 50 * scaleY; 
        wood.setPosition((650 + (woodAngle / 90) * 20) * scaleX, (350 * scaleY) + offset);
    }
 
    if (inCooldown) {
        if (cooldownFrames > 0) {
            cooldownFrames--;
            var seconds = Math.ceil(cooldownFrames / 60); 
            labResult.setText(resultMessage + "\n" + seconds + " 秒后重置...");
            labResult.setTextColor(1, 0, 0, 1);
            labResult.setHide(false);
            for (var d = 0; d < dotCount; d++) dots[d].setHide(true);
        } else {
            resetGame();
        }
        return; 
    }
 
    if (isFlying) {
        for (var d = 0; d < dotCount; d++) dots[d].setHide(true);
        var pos = bird.getPosition();
        vy += gravity;
        bird.setPosition(pos.x + vx, pos.y + vy);

        var currentTrail = trails[trailIndex];
        currentTrail.setPosition(pos.x + 15 * scaleX, pos.y + 15 * scaleY);
        currentTrail.setColor(1, 1, 1, 0.4);
        currentTrail.setHide(false);
        trailIndex = (trailIndex + 1) % trailCount;

        for (var i = 0; i < trailCount; i++) {
            if (!trails[i].isHide()) {
                var c = trails[i].getColor();
                var newAlpha = c.w - 0.02; 
                if (newAlpha <= 0) trails[i].setHide(true);
                else trails[i].setColor(c.x, c.y, c.z, newAlpha);
            }
        }

        var bPos = bird.getPosition();
        var wPos = wood.getPosition();
        var wSize = wood.getSize();
        if (bPos.x < wPos.x + wSize.x && bPos.x + 45 * scaleX > wPos.x &&
            bPos.y < wPos.y + wSize.y && bPos.y + 45 * scaleY > wPos.y) {
             
            audio.playSound("sound/83. Sfx - Bird Destroyed.mp3");
            targetWoodAngle = 90; 
            triggerResult("击中目标！", {r: 1, g: 0, b: 0}, true); 
        }

        if (bPos.y > h || bPos.x > w || bPos.x < 0) {
            triggerResult("没打中！", {r: 1, g: 0, b: 0}, false);
        }
    } else {
        updateTrajectoryPreview();
    }
});
 
// 函数功能：鼠标点击长按
scene.onPress((x,y)=>{
    isDragging = true;
    mouseStartX = x;
    mouseStartY = y;
});
 
// 函数功能：鼠标拖拽
scene.onMove((x,y)=>{
    if (isDragging) {
            var dx = mouseStartX - x; 
            var dy = mouseStartY - y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            power = Math.min(40 * scaleX, distance / 5) * scaleX; 
            angle = Math.atan2(dy, dx) * 180 / Math.PI;
            bird.setPosition(birdStartX - dx * 0.2, birdStartY - dy * 0.2);
        }
});
 
// 函数功能：鼠标抬起
scene.onRelease((x,y)=>{
     if (isDragging) {
            if (power > 5 * scaleX) {
                audio.playSound("sound/81. Sfx - Bird 05 Flying.mp3"); 
                var rad = angle * Math.PI / 180;
                vx = Math.cos(rad) * power;
                vy = Math.sin(rad) * power;
                isFlying = true;
            } else {
                bird.setPosition(birdStartX, birdStartY);
            }
            isDragging = false;
        }
});
 
// --- 7. 键盘交互 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) {
        if (inCooldown && key != 82) return; 
        if (key == 38 && !isFlying) angle = Math.max(-90, angle - 5); 
        if (key == 40 && !isFlying) angle = Math.min(0, angle + 5);  
        if (key == 37 && !isFlying) power = Math.max(5 * scaleX, power - 1 * scaleX); 
        if (key == 39 && !isFlying) power = Math.min(40 * scaleX, power + 1 * scaleX); 

        if (key == 32 && !isFlying) { 
            audio.playSound("sound/81. Sfx - Bird 05 Flying.mp3"); 
            var rad = angle * Math.PI / 180;
            vx = Math.cos(rad) * power;
            vy = Math.sin(rad) * power;
            isFlying = true;
        }
        if (key == 82) {
            score = 0; 
            labScore.setText("得分: 0");
            resetGame();
        }
    }
});
  
game.run();
```

* 013_bullet 物理引擎 源码

```js
// 物理引擎实例，演示函数调用方法 [横屏]
 
// 物理引擎，碰撞演示

class Collision
{
     test()
    {
        // 创建场景
        this.scene = new Scene();
        this.scene.setColor(0.2,0.2,0.2,1);
        game.pushScene(this.scene);
        
        // 添加地面
        this.ground = new Sprite();
        this.ground.setPosition(0,300);
        this.ground.setSize(800,10);
        this.ground.setColor(0,1,0,1);
        this.ground.useBoxBody();
        this.scene.addNode(this.ground);
        
        // 添加方块1 蓝色
        this.sp1 = new Sprite();
        this.sp1.setSize(50,50);
        this.sp1.setColor(0, 0, 1, 1);
        this.sp1.setPosition(200,250);
        this.sp1.setMass(1);
        this.sp1.useBoxBody();
        this.scene.addNode(this.sp1);
        
        // 添加方块2 绿色
        this.sp2 = new Sprite();
        this.sp2.setSize(50,50);
        this.sp2.setColor(0, 1, 0, 1);
        this.sp2.setPosition(175,200);
        this.sp2.setMass(1);
        this.sp2.useBoxBody();
        this.scene.addNode(this.sp2);
        
        // 添加方块3 黄色
        this.sp3 = new Sprite();
        this.sp3.setSize(50,50);
        this.sp3.setColor(1, 1, 0, 1);
        this.sp3.setPosition(225,200);
        this.sp3.setMass(1);
        this.sp3.useBoxBody();
        this.scene.addNode(this.sp3);
        
        // 添加方块4 最上面的方块 红色
        this.sp4 = new Sprite();
        this.sp4.setSize(50,50);
        this.sp4.setColor(1, 0, 0, 1);
        this.sp4.setPosition(160,0);
        this.sp4.setMass(1);
        this.sp4.useBoxBody();
        this.scene.addNode(this.sp4);
         
        // 返回按钮         
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
            game.popScene();
        });
        this.scene.addNode(lab);
    }
}
 
 
// 物理引擎，圆锥扭曲约束演示
 
/*
创建了一个静态红色底座 base 和一个绿色动态臂 arm。
使用 coneTwist.set2Data(base, 0, 20, arm, 0, -60) 将臂的底部连接到底座的顶部中心。
setLimit(30, 45) 限制扭转角度 ±30°，摆动圆锥半角 45°。
启用了马达并设置最大冲量，使关节能主动运动（配合外部力或速度更明显）。
添加了阻尼和调试绘制尺寸。
*/
 
class TestConeTwist {
    
    constructor() {
        this.scene = new Scene();               // 创建场景
        game.pushScene(this.scene);
        
        // 返回按钮
        var lab = new Label();
        lab.setPosition(0, 0);
        lab.setSize(80, 30);
        lab.setFont("font/st.ttf", 20);
        lab.setText("返回");
        lab.click((type, x, y) => {
            game.popScene();
        });
        this.scene.addNode(lab);
        
        // 静态底座（红色方块，作为固定端）
        var base = new Node();
        base.setPosition(300, 250);
        base.setSize(100, 40);
        base.setColor(1, 0, 0, 1);   // 红色
        base.useBoxBody();            // 不设置质量，默认为静态刚体
        this.scene.addNode(base);
        
        // 摆动臂（绿色方块，动态刚体）
        var arm = new Node();
        arm.setPosition(300, 200);
        arm.setSize(40, 120);
        arm.setColor(0, 1, 0, 1);     // 绿色
        arm.setMass(1);               // 质量1
        arm.useBoxBody();
        this.scene.addNode(arm);
        
        // 创建圆锥扭曲约束
        var coneTwist = new BulletConeTwist();
        // 连接 base 和 arm，锚点分别位于 base 顶部中心 (0,20) 和 arm 底部中心 (0,-60)
        coneTwist.set2Data(base, 0, 20, arm, 0, -180);
        
        // 设置摆动范围（圆锥半角）和扭转范围
        // 参数：swing1（绕局部X轴摆动半角），swing2（绕局部Y轴摆动半角），twist（绕Z轴扭转全角）
        // 以下设置：两个摆动轴限制为45°圆锥半角，扭转限制为±30°（全角60°）
        coneTwist.setLimit(45, 45, 60);    // 摆动45°圆锥，扭转±30°
        
        // 可选：启用马达并设置最大冲量，使关节有主动旋转能力
        coneTwist.enableMotor(true);
        coneTwist.setMaxMotorImpulse(5.0);
        
        // 设置阻尼，使运动更平缓
        coneTwist.setDamping(0.2);
        
        // 设置调试绘制大小（可视化辅助）
        coneTwist.setDbgDrawSize(20);
        
        // 将约束添加到场景
        this.scene.addConTwistConstraint(coneTwist);
        
        // 添加一个辅助点，显示锚点位置
        var anchorPoint = new Node();
        anchorPoint.setPosition(300, 220);   // base (300,350) + (0,20) 偏移 -> 350? 实际计算：base.y=350 + 20 = 370，但 arm 锚点在 arm.y=300-60=240，此处仅为视觉参考
        anchorPoint.setSize(5, 5);
        anchorPoint.setColor(1, 1, 0, 1);    // 黄色
        this.scene.addNode(anchorPoint);
        
        // 可选：给臂一个初始速度，展示摆动效果
        arm.setSpeed(10, 0);          // 初速度0
        // 或者施加一个瞬时力
        //arm.setCentralImpulse(100, 0);
    }
}


// 物理引擎，角色

class TestController
{
   
    constructor() {
        this.scene = new Scene();
        game.pushScene(this.scene);
        
        // 返回按钮
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
            game.popScene();
        });
        this.scene.addNode(lab);
     
        // 创建地面
        var gound = new Sprite();
        gound.setPosition(0,300); // 地面高度500
        gound.setSize(800,35);
        gound.setColor(0,1,1,1);
        gound.useBoxBody();
        this.scene.addNode(gound);
        
        // 大方块
        this.user = new Sprite();
        this.user.setPosition(400,200);
        this.user.setSize(50,100);
        this.user.setColor(0.5,1,0,1);
        this.user.useCapsuleShape();// 使用胶囊模型
        
        this.user.setJumpSpeed(120);// 跳跃速度
        var jumpSpeed = this.user.getJumpSpeed(); // 获取跳跃速度值
        log("JumpSpeed = " + jumpSpeed);
        
        this.user.setFallSpeed(120);// 下落速度
        var fallSpeed = this.user.getFallSpeed(); // 获取下落速度值
        log("FallSpeed = " + fallSpeed);
        
        this.user.setStepHeight(100);// 设置取角色可跨越的最大台阶高度，小于这个高度无法跨越
        var stepHeight = this.user.getStepHeight(); // 获取角色可跨越的最大台阶高度
        log("StepHeight = " + stepHeight);
        
        this.scene.addNode(this.user);
        
        // 小方块，看看是否可以跨越过去
        var taijie = new Sprite();
        taijie.setPosition(600,295); // 地面高度是500，台阶高度是10，此时高出地面5
        taijie.setSize(10,10); // 方框大小，这个高度角色可以跨过去，前面设置是100，如果小于5就跨不过去
        taijie.setColor(0.5,1,0.5,1);
        taijie.useBoxBody();
        this.scene.addNode(taijie);
        
        var tiaoyue = new Label();
        tiaoyue.setPosition(700,0);
        tiaoyue.setSize(80,30);
        tiaoyue.setFont("font/st.ttf",20);
        tiaoyue.setText("跳跃");
        tiaoyue.click((type,x,y)=>{
            this.user.jump(); // 角色向上跳跃
        });
        this.scene.addNode(tiaoyue);
        
        // 前进按钮
        var qianjin = new Label();
        qianjin.setPosition(700,50);
        qianjin.setSize(80,30);
        qianjin.setFont("font/st.ttf",20);
        qianjin.setText("前进");
        qianjin.click((type,x,y)=>{
            this.user.setMaxSlope(30);              // 设置角色最大爬坡角度（度数）
            var maxSlope = this.user.getMaxSlope(); // 获取角色最大爬坡角度（度数）
            log("MaxSlope = " + maxSlope);
            
            this.user.setMoveSpeed(5,5); // 水平向右前进
            var move = this.user.getMoveSpeed(); // 获取角色移动速度
            log("MoveSpeed x = " + move.x + " MoveSpeed y = " + move.y);
            
            var isGrounded = this.user.onGround(); // 检测角色是否站在地面上，当跳跃时false
            log("isGrounded = " + isGrounded);
            
            var pressed = this.user.isPress(); // 检测按键是否被按下
            log("pressed = " + pressed);
        });
    
        qianjin.upDate((time)=>{ // 前进按钮的回调
             // 点击时，如果在地面则跳跃
            if (this.user.isPress() && this.user.onGround()) {
                log("isPress-----------------------------------------------");
                this.user.jump();
            }
        });
        
        this.scene.addNode(qianjin);
        
        // 后退按钮
        var houtui = new Label();
        houtui.setPosition(700,100);
        houtui.setSize(80,30);
        houtui.setFont("font/st.ttf",20);
        houtui.setText("后退");
        houtui.click((type,x,y)=>{
            this.user.setMoveSpeed(-5,0); // 水平向左后退
        });
        this.scene.addNode(houtui);

        // 停止按钮            
        var tingzhi = new Label();
        tingzhi.setPosition(700,150);
        tingzhi.setSize(80,30);
        tingzhi.setFont("font/st.ttf",20);
        tingzhi.setText("停止");
        tingzhi.click((type,x,y)=>{
            this.user.setMoveSpeed(0,0);
        });
        this.scene.addNode(tingzhi);
        
    }   
    
}


// 物理引擎，铰链约束演示

class TestHinge{
     
     constructor() {
        this.scene = new Scene();
        game.pushScene(this.scene);

        // 返回按钮        
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
            game.popScene();
        });
        this.scene.addNode(lab);
        
        // 刚体1，红色方块
        var n1 = new Node();
        n1.setPosition(200,300);
        n1.setSize(50,50);
        n1.setColor(1,0,0,1);
        n1.setMass(1);
        n1.useBoxBody();
        this.scene.addNode(n1);

        // 刚体2：绿色方框        
        var n2 = new Node();
        n2.setPosition(200,150);
        n2.setSize(100,5);
        n2.setColor(0,1,0,1);
        //n2.setMass(1);
        n2.useBoxBody();
        this.scene.addNode(n2);
        
        var hinge = new BulletHinge();        // 创建铰链约束类
        hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
        hinge.setLimit(30, 120);              // 设置铰链角度限制
        var min = hinge.getMin();             // 获取当前最小角度限制         
        var max = hinge.getMax();             // 获取当前最大角度限制      
        log("Min = " + min + " Max = " + max);
        this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
    }
}



// 物理引擎，点对点约束演示

class TestPoint {
    
    constructor() {
        this.scene = new Scene(); // 创建场景
        game.pushScene(this.scene);
        
        var line = new Node();
        line.setPosition(400,0);
        line.setSize(1,600);
        line.setColor(0,0,0,1);
        this.scene.addNode(line);
        
        // 返回按钮
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
            game.popScene();
        });
        this.scene.addNode(lab);
        
        this.onePoint();   
        this.twoPoint();
    }

    // 一个点   
    onePoint(){
        var ballBg = game.getResource().getTexture("yuan.png");
        
        var sp1 = new Sprite();
        sp1.setPosition(185,185);
        sp1.setSize(30,30);
        sp1.setTexture(ballBg);
        sp1.setMass(1);      // 刚体质量
        sp1.useSphereBody(); // 圆形刚体
        sp1.setSpeed(20,0);  // 初始速度     
        this.scene.addNode(sp1);
        
        // 钟摆
        var pointConstraint = new  BulletPoint2Point();       // 新建约束点
        pointConstraint.setData(sp1,0,60);              // 设置一个约束点
        this.scene.addPointConstraint(pointConstraint); // 场景添加约束点
        
        // 红色中间点
        this.s1 = new Node();
        this.s1.setPosition(197,257);
        this.s1.setSize(6,6);
        this.s1.setColor(1,0,0,1);
        this.scene.addNode(this.s1);
        
        //this.scene.addNode(lab2);
    }
    
    // 两个点
    twoPoint()
    {
        var ballBg = game.getResource().getTexture("yuan.png");
        
        // 刚体1
        var sp1 = new Sprite();
        sp1.setPosition(585,185);
        sp1.setSize(30,30);
        sp1.setTexture(ballBg);
        sp1.setMass(1);      // 刚体质量
        sp1.useSphereBody(); // 圆形刚体
        sp1.setSpeed(20,0);  // 初始速度       
        this.scene.addNode(sp1);
        sp1.setCentralForce(0,-9.7);
        
        // 刚体2
        var sp2 = new Sprite();
        sp2.setPosition(585,215);
        sp2.setSize(30,30);
        sp2.setTexture(ballBg);
        sp2.setMass(1);
        sp2.useSphereBody();
        sp2.setCentralForce(0,-9.8);
        //sp2.setSpeed(20,0);      
        this.scene.addNode(sp2);
        
        var pointConstraint = new  BulletPoint2Point();       // 新建约束点
        pointConstraint.set2Data(sp1,0,60,sp2,10,0);    // 设置两个约束点
        this.scene.addPointConstraint(pointConstraint); // 场景添加约束点
    }
}


// 物理引擎，滑动约束演示

class TestSlider{

    constructor() {

        this.scene = new Scene(); // 创建新场景
        game.pushScene(this.scene);

        // 返回标签        
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
        game.popScene();
        });
        this.scene.addNode(lab);
        
        // 约束节点1 红色方框
        this.n1 = new Node();
        this.n1.setPosition(10,300);
        this.n1.setSize(400,50);
        this.n1.setColor(1,0,0,1);
        this.n1.useBoxBody();
        this.scene.addNode( this.n1);
        
        // 约束节点2 绿色方块
        this.n2 = new Node();
        this.n2.setPosition(10,60);
        this.n2.setSize(30,30);
        this.n2.setColor(0,1,0,1);
        this. n2.setMass(1);
        this.n2.useBoxBody();
        this.scene.addNode( this.n2);
        
        this.testSlider =new BulletSlider();            // 滑动约束类
        this.testSlider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
        this.testSlider.setLowerLinLimit(-200);         // 设置线性滑动下限
        this.testSlider.setUpperLinLimit(200);          // 设置线性滑动上限
        this.testSlider.setTargetLinMotorVelocity(30.0); // 设置线性马达目标速度，给它一个向右运动的速度
        this.testSlider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
        this.testSlider.setPoweredLinMotor(true);       // 开启线性马达
        this.scene.addSliderConstraint(this.testSlider);// 场景增加滑动约束类
    }
}

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
  
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone" || webDeviceType == "Pad") // 手机pad上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率

// 增加场景
var scene = new Scene();

// 添加地面
var ground = new Sprite();
ground.setPosition(0,350);
ground.setSize(800,10);
ground.setColor(0,1,0,1);
scene.addNode(ground);
game.pushScene(scene);

// ----------------------------------------------------------------------------
// 演示：自由落体
// ----------------------------------------------------------------------------
var ballBg = game.getResource().getTexture("yuan.png");
var ball = new Sprite(); // 添加小球
ball.setPosition(0,0);
ball.setSize(50,50);
ball.setTexture(ballBg);

//设置质量(无质量的物体是静止的)
ball.setMass(1);

//使用类型圆形
ball.useSphereBody();

//地面使用方形
ground.useBoxBody();

//添加弹性系数0-1（0软泥不回弹）
ground.setRestitution(1); // 地面的弹性系数
ball.setRestitution(1);   // 小球的弹性系数
var res = ball.getRestitution(); // 读取小球的弹性系数
log("Restitution = " + res);

//设置物体初速度
ball.setSpeed(1,2);          // 设置小球初始速度，x方向速度，y方向速度
var speed = ball.getSpeed(); // 读取小球初始速度，xy两个方向的速度
log("vx = " + speed.x + " vy = " + speed.y);

//给物体持久力
ball.setCentralForce(2, 0);
var force = ball.getCentralForce(); // 读取小球持久力，xy两个方向
log("fx = " + force.x + " fy = " + force.y);

//给物体默认瞬时力
ball.setCentralImpulse(20,0);
var impulse = ball.getCentralImpulse(); // 获取小球默认瞬时力
log("ix = " + impulse.x + " iy = " + impulse.y);

//添加摩擦因数
ground.setFriction(1);
ball.setFriction(1);
var fri = ball.getFriction(); // 读取小球的摩擦系数
log("Friction = " + fri);

// 增加小球
scene.addNode(ball);


// ----------------------------------------------------------------------------
// 演示：刚体碰撞
// ----------------------------------------------------------------------------
var lab = new Label();
lab.setPosition(650,0);
lab.setSize(160,30);
lab.setFont("font/st.ttf",20);
lab.setText("刚体碰撞 Collis");
lab.click((type,x,y)=>{
   
    var collision = new Collision();
    collision.test();
    //game.pushScene(collision.scene1);
});
scene.addNode(lab);


// ----------------------------------------------------------------------------
// 演示：钟摆约束
// ----------------------------------------------------------------------------
var lab1 = new Label();
lab1.setPosition(650,50);
lab1.setSize(160,30);
lab1.setFont("font/st.ttf",20);
lab1.setText("点对点约束 Point");
lab1.click((type,x,y)=>{
  
    new TestPoint();
});
scene.addNode(lab1);


// ----------------------------------------------------------------------------
// 演示：滑动约束
// ----------------------------------------------------------------------------
var lab2 = new Label();
lab2.setPosition(650,100);
lab2.setSize(160,30);
lab2.setFont("font/st.ttf",20);
lab2.setText("滑动约束 Slider");
lab2.click((type,x,y)=>{
  
    new TestSlider();
});
scene.addNode(lab2);

// ----------------------------------------------------------------------------
// 演示：铰链约束
// ----------------------------------------------------------------------------
var lab3 = new Label();
lab3.setPosition(650,150);
lab3.setSize(160,30);
lab3.setFont("font/st.ttf",20);
lab3.setText("铰链约束 Hinge");
lab3.click((type,x,y)=>{
  
    new TestHinge();
});
scene.addNode(lab3);


// ----------------------------------------------------------------------------
// 演示：圆锥扭曲约束
// ----------------------------------------------------------------------------
var lab4 = new Label();
lab4.setPosition(650,200);
lab4.setSize(160,30);
lab4.setFont("font/st.ttf",20);
lab4.setText("圆锥扭曲约束 Cone");
lab4.click((type,x,y)=>{
  
    new TestConeTwist();
});
scene.addNode(lab4);

// ----------------------------------------------------------------------------
// 演示：角色
// ----------------------------------------------------------------------------
var lab5 = new Label();
lab5.setPosition(650,250);
lab5.setSize(160,30);
lab5.setFont("font/st.ttf",20);
lab5.setText("角色 Controller");
lab5.click((type,x,y)=>{
  
    new TestController();
});
scene.addNode(lab5);

// 运行游戏
game.run();
```
