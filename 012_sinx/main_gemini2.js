// AI代码，gemini生成选项B  sinx演示 

// 初始化游戏引擎
game.init(); 
game.setFPS(60); 

var scene = new Scene(); 

// 1. 创建一组节点来表示正弦曲线上的点
var dots = [];
var dotCount = 50; // 点的数量
var spacing = 15;  // 点与点之间的横向间距

for (var i = 0; i < dotCount; i++) {
    var dot = new Node();
    dot.setSize(8, 8); // 小方块大小
    dot.setColor(0, 1, 1, 1); // 青色
    scene.addNode(dot);
    dots.push(dot);
}

// 2. 在场景刷新回调中计算 sin 函数逻辑
var offset = 0; // 用于产生动画效果的偏移量

scene.upDate((time) => {
    offset += 0.1; // 每一帧增加偏移，使曲线“流动”起来

    for (var i = 0; i < dots.length; i++) {
        var x = i * spacing + 50; // 横坐标偏移，避开边缘
        
        /**
         * 计算 y 坐标:
         * Math.sin(i * 0.3 + offset) -> 计算正弦值
         * * 50 -> 振幅（Amplitude），控制波动的高低
         * + 300 -> 垂直偏移（Vertical Shift），将曲线移到屏幕中部
         */
        var y = Math.sin(i * 0.3 + offset) * 50 + 300;
        
        dots[i].setPosition(x, y);
        
        // 可选：根据高度动态改变颜色，增加视觉效果
        dots[i].setColor(0.5, y / 600, 1, 1); 
    }
});

// 3. 运行游戏
game.pushScene(scene);
game.run();