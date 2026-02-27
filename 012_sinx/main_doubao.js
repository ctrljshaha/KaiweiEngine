// AI代码，豆包生成  sinx演示 

// 初始化游戏引擎
game.init(); // 默认窗口大小为800*600
game.setFPS(60); // 设置帧率

// 游戏主窗口设置
// ----------------------------------------------------------------------------------------------
var window = game.getWindow(); 
window.setTitle("开维游戏引擎 - sin(x)函数演示"); // 设置窗口标题

// Scene场景设置
// ----------------------------------------------------------------------------------------------
var scene = new Scene(); 

//scene.setBgColor(1, 1, 1, 1); // 设置白色背景（替代背景图）豆包有点问题，修改为加载节点
// 设置背景色（浅灰色，使用 Node）
let bg = new Node();
bg.setSize(800, 600);
bg.setPosition(0, 0);
bg.setColor(0.9, 0.9, 0.9, 1.0);
scene.addNode(bg);

game.pushScene(scene);

// 全局变量定义
const WIDTH = 800;    // 窗口宽度
const HEIGHT = 600;   // 窗口高度
const CENTER_Y = HEIGHT / 2; // Y轴中心点
const SCALE = 100;    // 函数图像缩放比例
const POINT_COUNT = 200; // 绘制的点数
const POINT_SIZE = 3;  // 点的大小

// 绘制坐标轴
// ----------------------------------------------------------------------------------------------
function drawAxis() {
    // X轴
    var xAxis = new Node();
    xAxis.setPosition(0, CENTER_Y);
    xAxis.setSize(WIDTH, 2);
    xAxis.setColor(0, 0, 0, 1); // 黑色
    scene.addNode(xAxis);

    // Y轴
    var yAxis = new Node();
    yAxis.setPosition(WIDTH/2, 0);
    yAxis.setSize(2, HEIGHT);
    yAxis.setColor(0, 0, 0, 1); // 黑色
    scene.addNode(yAxis);

    // 添加坐标轴标签
    var xLabel = new Label();
    xLabel.setPosition(WIDTH-50, CENTER_Y+10);
    xLabel.setFont("font/st.ttf", 12);
    xLabel.setText("X");
    xLabel.setTextColor(0,0,0,1);
    scene.addNode(xLabel);

    var yLabel = new Label();
    yLabel.setPosition(WIDTH/2+10, 20);
    yLabel.setFont("font/st.ttf", 12);
    yLabel.setText("Y");
    yLabel.setTextColor(0,0,0,1);
    scene.addNode(yLabel);
}

// 绘制sin(x)曲线
// ----------------------------------------------------------------------------------------------
function drawSinCurve() {
    // 清空之前的曲线节点
    let curveNodes = scene.getChilds().filter(node => node.getName() === "sin_point");
    curveNodes.forEach(node => scene.removeNode(node));

    // 计算并绘制每个点
    for(let i = 0; i < POINT_COUNT; i++) {
        // 计算x值（范围：-2π 到 2π）
        let x = (i / POINT_COUNT) * 4 * Math.PI - 2 * Math.PI;
        // 计算sin(x)值
        let y = Math.sin(x);
        
        // 转换为屏幕坐标
        let screenX = (x / (4 * Math.PI)) * WIDTH + WIDTH/2;
        let screenY = CENTER_Y - y * SCALE;

        // 创建点节点
        var point = new Node();
        point.setName("sin_point"); // 标记为sin曲线的点
        point.setPosition(screenX, screenY);
        point.setSize(POINT_SIZE, POINT_SIZE);
        point.setColor(1, 0, 0, 1); // 红色
        scene.addNode(point);
    }
}

// 添加函数公式标签
// ----------------------------------------------------------------------------------------------
function addFormulaLabel() {
    var formula = new Label();
    formula.setPosition(20, 20);
    formula.setSize(200, 50);
    formula.setFont("font/st.ttf", 18);
    formula.setText("y = sin(x)");
    formula.setTextColor(0, 0, 1, 1); // 蓝色字体
    formula.setColor(1, 1, 1, 0.8); // 半透明白色背景
    scene.addNode(formula);
}

// 初始化绘制
drawAxis();
addFormulaLabel();

// 场景刷新回调 - 实时绘制曲线
scene.upDate((time)=>{
    drawSinCurve();
    
    // 添加实时角度信息显示
    var angle = (time / 1000) % (2 * Math.PI);
    var sinValue = Math.sin(angle);
    
    var infoLabel = scene.getChilds().find(node => node.getName() === "sin_info");
    if(!infoLabel) {
        infoLabel = new Label();
        infoLabel.setName("sin_info");
        infoLabel.setPosition(20, 60);
        infoLabel.setSize(300, 50);
        infoLabel.setFont("font/st.ttf", 14);
        infoLabel.setColor(1, 1, 1, 0.8);
        scene.addNode(infoLabel);
    }
    
    // 格式化显示角度和sin值
    let angleDeg = (angle * 180 / Math.PI).toFixed(1);
    infoLabel.setText(`角度：${angleDeg}° | sin(${angleDeg}°) = ${sinValue.toFixed(4)}`);
    infoLabel.setTextColor(0, 0.5, 0, 1); // 绿色字体
});

// 运行游戏
game.run();

