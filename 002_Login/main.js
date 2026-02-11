// 基础控件实例
  
// 初始化游戏引擎
game.init(); // 默认窗口大小为800*600
game.setFPS(30); // 设置帧率
 
// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var window = game.getWindow(); // 获取资源对象
var texture = game.getResource().getTexture("img/logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎（game.js）"); // 设置主游戏窗口标题
 
// Scence场景设置
// ----------------------------------------------------------------------------------------------
var resBg = game.getResource().getTexture("img/bg.png");  // 获取背景图资源
var scene = new Scene(); // 新建场景
scene.setBg(resBg); // 设置场景背景图
scene.upDate((time)=>{ // 界面刷新回调函数，根据fps帧率的值回调，fps设置60就是一秒60次回调
     // log("fps callback"); // 编写游戏地图、子弹移动等
     var nodes = scene.getChilds(); // 读取所有场景节点，返回数组
     var labDebug = nodes[0];  // 读取数据第一个对象
     const timeStr = new Date().toTimeString().split(' ')[0]; // 返回当前时间
     var str = "调试信息\n"+"时间："+timeStr;
     labDebug.setText(str); // 设置对象时间，每帧刷新一下时间
});
game.pushScene(scene);
 
// Audio音乐类，设置背景音乐
var audio = new Audio();
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
// Label标签设置，调试窗口信息
// ----------------------------------------------------------------------------------------------
var labDebug = new Label(); // 新建标签类
labDebug.setPosition(20, 20); // 标签位置横坐标，纵坐标。
labDebug.setSize(150, 150); // 标签宽，高
labDebug.setColor(0,0,0,0.1);  // 标签背景颜色为黑色并透明
labDebug.setTextColor(0,1,0,0.5);  // 标签字体颜色
labDebug.setFont("font/st.ttf",15); // 标签汉字字库，字体大小，必须指定
scene.addNode(labDebug);  // 把标签增加到场景中
 
// Label标签设置，显示游戏名称
// ----------------------------------------------------------------------------------------------
var resName = game.getResource().getTexture("img/name.png");  // 获取背景图资源
var labLog = new Label(); // 新建标签类
labLog.setPosition(270, 5); // 标签位置横坐标，纵坐标。
labLog.setSize(400, 150); // 标签宽，高
labLog.setTexture(resName); 
labLog.setFont("font/st.ttf",15); // 标签汉字字库，字体大小，必须指定
//labLog.setText("标签上的测试文字\n换行123");
//lab.setColor(0,0,0,1);  // 标签背景颜色为黑色并透明
//labLog.setRotate(180); // 标签旋转180度
labLog.upDate((time)=>{ // 设置帧率回调，如果不需要可以注释
 //log("Lab callback");
});
scene.addNode(labLog);  // 把标签增加到场景中
 
// Node节点控件，这个是很多控件的基类。左上角显示一个绿色小方块，中间有个蓝色小方块
// ----------------------------------------------------------------------------------------------
log("\nNode节点控件 -------------------------------------------------------------------------");
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
var pos = node.getPosition(); // 获取节点坐标
log("节点横坐标x：" + pos.x + "节点纵坐标y：" + pos.y);
node.setSize(20,20);    // 设置节点宽，高
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
node1.setPosition(2, 2);  // 节点位置横坐标，纵坐标
node1.setSize(10,10);    // 设置节点宽，高
node1.setColor(255,0,0,1);  // 设置节点颜色，红色
node.addNode(node1); // 把子节点添加到父节点中
var nodeArray = node.getNodes(); // 获取node节点数组对象数据，从0开始 
var nodeTemp = nodeArray[0]; // 获取第一个node对象
nodeTemp.setColor(0,0,255,1);  // 设置子节点颜色，蓝色
  
// Edit编辑框设置，输入用户名称
// ----------------------------------------------------------------------------------------------
var resEditBg = game.getResource().getTexture("img/edit.png"); // 获取纹理数据对象
var editName = new Edit(); // 新建编辑框
editName.setTexture(resEditBg); // 设置底图
editName.setPosition(290, 340); // 编辑框的位置，横坐标和纵坐标
editName.setPadding(10); // 编辑框中开始输入的地方
editName.setSize(180, 60); // 编辑框的大小，宽度和高度
editName.setFont("font/st.ttf", 20); // 编辑框的汉字字库，字体大小，必不可少
//editName.setColor(255, 255, 255, 0.1);  // 编辑框背景颜色为白色并透明
//editName.setPubText("编辑框内容"); // 编辑框字体颜色为黑色不透明
scene.addNode(editName);  // 加入到场景中
 
// Sprite精灵设置，登录按钮，点击登录后替换背景音乐
// ----------------------------------------------------------------------------------------------
var resBtnBg = game.getResource().getTexture("img/button.png"); // 获取纹理数据对象
var sprLogin = new Sprite(); // 新建精灵
sprLogin.setTexture(resBtnBg); // 设置精灵背景
sprLogin.setSize(200,60); // 设置精灵大小
sprLogin.setPosition(275, 420); // 标签位置横坐标，纵坐标。
sprLogin.click(()=>{ // 点击回调函数，更换图片
    var edittext = editName.getText(); // 点击时，读取edit框内容
    log("Edit框内容："+edittext);
    audio.stopMusic(); // 停止当前背景音乐
    audio.playMusic("sound/Normal2.mp3"); // 循环播放音乐
    audio.playSound("sound/1.wav"); // 播放音效
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
});
sprLogin.longClick(()=>{ // 长按回调函数，更换图片
   log("长按");
});
scene.addNode(sprLogin); // 加入到场景中
//var nodes = scene.getChilds();
 
// ProgressBar进度条设置
// ----------------------------------------------------------------------------------------------
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setBgTexture(resLoad); // 设置进度条图片
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
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
 
 // Slide滑动控件，音量调节
// ----------------------------------------------------------------------------------------------
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
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
  
// ScrollView滚动视图
// ----------------------------------------------------------------------------------------------
log("\nScrollView滚动视图 --------------------------------------------------------------------");
// 设置滚动视图大小，位置，背景等。半透明背景图中有白色的底图
var resScrollViewBg = game.getResource().getTexture("img/ScrollViewBg.png"); // 获取纹理数据对象
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setTexture(resScrollViewBg); //设置滚动视图背景图
scrollview.setColor(0.2, 0.5, 0.8, 0.5); // 设置滚动视图颜色
scrollview.setPosition(10,400);// 滚动视图的位置，横坐标和纵坐标
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
var resSpr1 = game.getResource().getTexture("img/resSpr1.png"); // 获取纹理数据对象
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
 
// Http网络类
// ----------------------------------------------------------------------------------------------
log("\nHttp网络类 -----------------------------------------------------------------------------");
 var http = new Http();
 http.get("https://ctrljs.ikaiwei.com/api/test/request_logs.do?sf=sf",(str)=>{
 log(str);
 });
 http.post("https://ctrljs.ikaiwei.com/api/test/request_logs.do?","sff=sf111&se=1",(str)=>{
 });
  
 
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
 


 
// 运行游戏
game.run();

