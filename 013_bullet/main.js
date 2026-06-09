
// 物理引擎实例，演示函数调用方法 [横屏]

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