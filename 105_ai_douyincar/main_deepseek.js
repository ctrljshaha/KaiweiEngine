// 抖音送跑车实例 - 点击屏幕送跑车

// 初始化游戏引擎
game.init(); // 默认窗口大小800*600
game.setFPS(30); // 设置帧率

// 游戏主窗口设置图标和标题
var window = game.getWindow();
var texture = game.getResource().getTexture("img/logo.png");
window.setIcon(texture);
window.setTitle("抖音送跑车 - 点击屏幕送跑车");

// 创建场景
var scene = new Scene();
game.pushScene(scene);

// 背景音乐和音效
var audio = new Audio();
audio.playMusic("sound/bg.ogg"); // 播放背景音乐
audio.setMusicVolume(0.5);

// ==================== 调试标签 ====================
var labDebug = new Label();
labDebug.setPosition(20, 20);
labDebug.setSize(150, 150);
labDebug.setColor(0,0,0,0.1);
labDebug.setTextColor(0,1,0,0.5);
labDebug.setFont("font/st.ttf",15);
scene.addNode(labDebug);

// ==================== 送礼计数器 ====================
var countLabel = new Label();
countLabel.setPosition(20, 550);
countLabel.setSize(200, 30);
countLabel.setFont("font/st.ttf", 20);
countLabel.setTextColor(1, 0, 0, 1);
countLabel.setText("送礼次数: 0");
scene.addNode(countLabel);

var carCount = 0;        // 累计送礼次数
var cars = [];           // 存储当前活跃的跑车 { sprite, label, speed, x, y }

// ==================== 全屏点击层 ====================
var clickLayer = new Sprite();
clickLayer.setSize(800, 600);
clickLayer.setPosition(0, 0);
clickLayer.setColor(0, 0, 0, 0); // 完全透明
scene.addNode(clickLayer);

// 点击层点击事件
clickLayer.click(() => {
    // 播放送礼音效
    audio.playSound("sound/1.wav");

    // 创建跑车精灵
    var car = new Sprite();
    // 尝试加载跑车专用图片，若不存在则用橙色矩形代替
    var carTex = game.getResource().getTexture("img/car.png");
    if (carTex) {
        car.setTexture(carTex);
    } else {
        car.setColor(1, 0.5, 0, 1); // 橙色
    }
    car.setSize(150, 90); // 跑车尺寸
    var startY = 250 + Math.random() * 200; // 随机起始高度 250~450
    car.setPosition(-100, startY); // 从左侧屏幕外开始
    scene.addNode(car);

    // 创建随跑车移动的文字标签（显示送礼信息）
    var carLabel = new Label();
    carLabel.setPosition(100, startY - 30);
    carLabel.setSize(180, 25);
    carLabel.setFont("font/st.ttf", 18);
    carLabel.setTextColor(1, 0, 0, 1); 
    carLabel.setText("粉丝 送出资深跑车");
    scene.addNode(carLabel);

    // 存储跑车数据
    cars.push({
        sprite: car,
        label: carLabel,
        speed: 6 + Math.random() * 4, // 随机速度 6~10
        x: -100,
        y: startY
    });

    // 更新送礼次数
    carCount++;
    countLabel.setText("送礼次数: " + carCount);
});

// ==================== 每帧更新 ====================
scene.upDate((time) => {
    // 1. 更新调试信息
    var nodes = scene.getChilds();
    if (nodes.length > 0) {
        var debugNode = nodes[0]; // labDebug 是第一个添加的节点
        const timeStr = new Date().toTimeString().split(' ')[0];
        var str = "调试信息\n" + "时间：" + timeStr;
        debugNode.setText(str);
    }

    // 2. 移动所有跑车
    for (var i = cars.length - 1; i >= 0; i--) {
        var car = cars[i];
        car.x += car.speed;
        car.sprite.setPosition(car.x, car.y);
        car.label.setPosition(car.x, car.y - 30);

        // 跑车移出屏幕右侧时隐藏并从数组中移除
        if (car.x > 900) { // 屏幕宽800，右侧外
            car.sprite.setHide(true);  // 隐藏跑车
            car.label.setHide(true);   // 隐藏文字
            cars.splice(i, 1);         // 从活跃数组中删除
        }
    }
});

// ==================== 可选：保留键盘回调（但不影响）====================
class GlobalVariable {
    static KEY_W = 87; static KEY_S = 83; static KEY_A = 65; static KEY_D = 68;
    static KEY_BOTTOM = 40; static KEY_UP = 38; static KEY_LEFT = 37; static KEY_RIGHT = 39;
}
game.setKeyCallBack((key, action) => {
    // 空实现，仅保留框架
});

// 运行游戏
game.run();