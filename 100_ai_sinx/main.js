// AI代码，deepseek生成  sinx演示 

// sin(x) 函数演示 - 基于开维游戏引擎

// 初始化游戏引擎
game.init(); // 默认窗口大小800*600
game.setFPS(30); // 设置帧率

// 游戏主窗口设置图标和标题
var window = game.getWindow();
var texture = game.getResource().getTexture("img/logo.png");
window.setIcon(texture);
window.setTitle("sin(x) 函数演示 - 开维游戏引擎");

// ==================== sin(x) 演示类 ====================
class SinDemo {
    static scene;            // 场景对象
    static ball;             // 移动的小球（红色）
    static points = [];      // 存储轨迹点（蓝色）
    static step = 0;         // 当前 x 坐标（像素）
    static maxX = 800;        // 屏幕宽度
    static centerY = 300;     // 屏幕中心 y 坐标（800x600 下中心为300）
    static amplitude = 200;   // 振幅（像素）
    static scale = (2 * Math.PI) / 800; // 将 0~800 映射到 0~2π
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
        bg.setSize(800, 600);
        bg.setPosition(0, 0);
        bg.setColor(0.9, 0.9, 0.9, 1.0);
        scene.addNode(bg);

        // 绘制 x 轴（黑色水平线）
        let axisX = new Node();
        axisX.setSize(800, 1);
        axisX.setPosition(0, SinDemo.centerY);
        axisX.setColor(0, 0, 0, 1);
        scene.addNode(axisX);

        // 绘制 y 轴（黑色垂直线）
        let axisY = new Node();
        axisY.setSize(1, 800);
        axisY.setPosition(400, 0);
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
        SinDemo.valueLabel.setPosition(10, 10);
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