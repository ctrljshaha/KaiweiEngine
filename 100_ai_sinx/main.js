// AI代码，deepseek生成  sinx演示 

// sin(x) 函数演示 - 基于开维游戏引擎

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
 
// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("img/logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎 - sin(x) 函数演示"); // 设置主游戏窗口标题


// ==================== sin(x) 演示类 ====================
class SinDemo {
    static scene;            // 场景对象
    static ball;             // 移动的小球（红色）
    static points = [];      // 存储轨迹点（蓝色）
    static step = 0;         // 当前 x 坐标（像素）
    static maxX = w;        // 屏幕宽度
    static centerY = h/2;     // 屏幕中心 y 坐标（800x600 下中心为300）
    // 【严格修改：振幅基于真实屏幕高度动态分配，防止在低高度屏幕或横屏下波峰出界】
    static amplitude = h / 3;   // 振幅（像素）
    // 【严格修改：映射比例完美绑定当前真实宽度 w，确保全平台从左到右刚好展示一个完整周期】
    static scale = (2 * Math.PI) / w; // 将 0~800 映射到 0~2π
    static valueLabel;        // 显示数值的标签
    
    // 【严格修改：新增基于屏幕比例的 UI 缩放因子，防止高分屏下文字和小球过小】
    static uiScale = w / 800;

    constructor() {
        SinDemo.init();
    }

    static init() {
        // 创建新场景
        let scene = new Scene();
        game.pushScene(scene);
        SinDemo.scene = scene;

        // 设置背景色（浅灰色，使用 Node）
        let bg = new Node();
        bg.setSize(w, h);
        bg.setPosition(0, 0);
        bg.setColor(0.9, 0.9, 0.9, 1.0);
        scene.addNode(bg);

        // 绘制 x 轴（黑色水平线）
        let axisX = new Node();
        axisX.setSize(w, 1);
        axisX.setPosition(0, SinDemo.centerY);
        axisX.setColor(0, 0, 0, 1);
        scene.addNode(axisX);

        // 绘制 y 轴（黑色垂直线）
        let axisY = new Node();
        axisY.setSize(1, h);
        axisY.setPosition(w/2, 0);
        axisY.setColor(0, 0, 0, 1);
        scene.addNode(axisY);

        // 创建红色小球（使用 Node，纯色）
        SinDemo.ball = new Node();
        // 【严格修改：小球大小引入自适应缩放因子】
        SinDemo.ball.setSize(10 * SinDemo.uiScale, 10 * SinDemo.uiScale);
        SinDemo.ball.setColor(1, 0, 0, 1); // 红色
        SinDemo.ball.setPosition(0, SinDemo.centerY);
        scene.addNode(SinDemo.ball);

        // 创建显示数值的标签
        SinDemo.valueLabel = new Label();
        // 【严格修改：提示面板的位置、尺寸、字号全部引入屏幕自适应缩放】
        SinDemo.valueLabel.setPosition(10 * SinDemo.uiScale, 40 * SinDemo.uiScale);
        SinDemo.valueLabel.setSize(250 * SinDemo.uiScale, 30 * SinDemo.uiScale);
        SinDemo.valueLabel.setFont("font/st.ttf", Math.round(16 * SinDemo.uiScale));
        SinDemo.valueLabel.setTextColor(0, 0, 0, 1);
        SinDemo.valueLabel.setColor(1, 1, 1, 0.8); // 半透明白色背景
        SinDemo.valueLabel.setText("x: 0.00 rad, sin(x): 0.00");
        scene.addNode(SinDemo.valueLabel);

        // 启动更新循环
        scene.upDate((time) => {
            SinDemo.update(time);
        });
    }

    static update(time) {
        if (SinDemo.step <= SinDemo.maxX) {
            let x = SinDemo.step;
            let rad = x * SinDemo.scale;          // 映射到弧度 [0, 2π]
            let sinVal = Math.sin(rad);
            // 屏幕 y 向下为正，sin 向上为正，所以用中心减去振幅*sin
            let y = SinDemo.centerY - sinVal * SinDemo.amplitude;

            // 移动红色小球
            // 【严格修改：移动时考虑红色小球自身大小的中心点对齐修正】
            SinDemo.ball.setPosition(x - (5 * SinDemo.uiScale), y - (5 * SinDemo.uiScale));

            // 绘制蓝色轨迹点（大小 2x2）
            let dot = new Node();
            // 【严格修改：轨迹点粗细引入自适应缩放因子，保证高分屏线条饱满清晰】
            dot.setSize(2 * SinDemo.uiScale, 2 * SinDemo.uiScale);
            dot.setColor(0, 0, 1, 1); // 蓝色
            dot.setPosition(x, y);
            SinDemo.scene.addNode(dot);
            SinDemo.points.push(dot);

            // 更新数值标签
            SinDemo.valueLabel.setText(
               "x: " + rad.toFixed(2) + " rad, sin(x): " + sinVal.toFixed(2)
            );

            // 【严格修改：步进速度结合缩放因子，防止大屏幕上绘制过于稀疏或小屏幕上过于密集】
            SinDemo.step += 2 * SinDemo.uiScale; // 步进 2 像素，可根据需要调整
        }
        // 到达右边界后停止移动，但曲线已完整绘制
    }
}

// 实例化 sin 演示类（必须在 game.run() 之前）
new SinDemo();

// 运行游戏
game.run();