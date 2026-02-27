// AI代码，gemini生成选项A  sinx演示 

// 1. 初始化引擎
game.init(); 

var scene = new Scene();
game.pushScene(scene);

// 2. 创建一个作为波形点的节点（小球）
var point = new Node();
point.setSize(20, 20);           // 设置大小
point.setColor(0, 0, 255, 1);    // 蓝色小球
scene.addNode(point);

// 3. 定义数学参数
var frameCount = 0;   // 计时器，用于驱动正弦函数的x值
var centerX = 400;    // 屏幕中心X
var centerY = 300;    // 屏幕中心Y
var amplitude = 100;  // 振幅（波的高度）
var frequency = 0.1;  // 频率（波的密度）

// 4. 在刷新回调中实现 sin(x) 动画
scene.upDate((time) => {
    frameCount++; 
    
    // 计算当前的 X 轴位置：让小球从左向右移动
    var x = (frameCount * 5) % 800; 
    
    // 计算 Y 轴位置：核心公式 y = A * sin(ω * x) + offset
    // 注意：这里的 frameCount * frequency 相当于 x 参数
    var y = centerY + amplitude * Math.sin(frameCount * frequency);
    
    // 更新小球位置
    point.setPosition(x, y);
    
    // 逻辑：如果小球走到屏幕右侧，重置计时器
    if (x >= 790) {
        frameCount = 0;
    }
});

game.run();