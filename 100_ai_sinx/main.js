// AI代码，deepseek生成  sinx演示 

// sin(x) 函数演示 - 基于开维游戏引擎

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏

if (system =="WINDOWS" || system =="WEB")
{
    game.init() // windows默认窗口大小为800*600;web网页默认全屏
    window = game.getWindow(); // 获取资源对象
    w = window.getWidth();  // 屏幕宽带
    h = window.getHeight(); // 屏幕高度
}
else if(system =="WEIXIN")
{
    game.initSize(canvas.width,canvas.height); // 微信窗口
    window = game.getWindow(); // 获取资源对象
    w = canvas.width; // 微信窗口宽度
    h = canvas.height;// 微信窗口高度
}

// 判断横屏还是竖屏
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(30); // 设置帧率
 
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
    static amplitude = 200;   // 振幅（像素）
    static scale = (2 * Math.PI) / w; // 将 0~800 映射到 0~2π
    static valueLabel;        // 显示数值的标签

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
        SinDemo.ball.setSize(10, 10);
        SinDemo.ball.setColor(1, 0, 0, 1); // 红色
        SinDemo.ball.setPosition(0, SinDemo.centerY);
        scene.addNode(SinDemo.ball);

        // 创建显示数值的标签
        SinDemo.valueLabel = new Label();
        SinDemo.valueLabel.setPosition(10, 40);
        SinDemo.valueLabel.setSize(250, 30);
        SinDemo.valueLabel.setFont("font/st.ttf", 16);
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
            SinDemo.ball.setPosition(x, y);

            // 绘制蓝色轨迹点（大小 2x2）
            let dot = new Node();
            dot.setSize(2, 2);
            dot.setColor(0, 0, 1, 1); // 蓝色
            dot.setPosition(x, y);
            SinDemo.scene.addNode(dot);
            SinDemo.points.push(dot);

            // 更新数值标签
            SinDemo.valueLabel.setText(
               "x: " + rad.toFixed(2) + " rad, sin(x): " + sinVal.toFixed(2)
            );

            SinDemo.step += 2; // 步进 2 像素，可根据需要调整
        }
        // 到达右边界后停止移动，但曲线已完整绘制
    }
}

// 实例化 sin 演示类（必须在 game.run() 之前）
new SinDemo();

// 运行游戏
game.run();