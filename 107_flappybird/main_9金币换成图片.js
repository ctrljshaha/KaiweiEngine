/**
 * 开维游戏引擎 - Flappy Bird 精英终极版
 * 修改：将金币从色块改为使用 img/coin.png 图片
 */

game.init();
game.setFPS(60);

var scene = new Scene();
// 背景图
var resBg = game.getResource().getTexture("img/bg.png");
scene.setBg(resBg);

var audio = new Audio();
audio.setSoundVolume(0.8);

// 游戏状态
var STATE_MENU = 0;
var STATE_PLAY = 1;
var STATE_OVER = 2;
var gameState = STATE_MENU;

// 物理参数
var gravity = 0.55;
var jumpForce = -9;
var birdV = 0;
var score = 0;
var highScore = 0;
var pipeSpeed = 5;
var pipeGap = 175;

// --- 1. 初始化节点 ---

// A. 障碍物
var topPipe = new Node();
topPipe.setColor(0.1, 0.6, 0.1, 1);
topPipe.setSize(70, 200);
topPipe.setPosition(900, 0);
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0.1, 0.6, 0.1, 1);
bottomPipe.setSize(70, 600);
bottomPipe.setPosition(900, 400);
scene.addNode(bottomPipe);

// B. 【核心修改：金币图片化】 ---
// 1. 获取金币纹理资源
var resCoin = game.getResource().getTexture("img/coin.png"); 
var coin = new Sprite();
// 2. 将纹理应用到精灵上
if (resCoin) {
    coin.setTexture(resCoin); 
} else {
    // 如果图片加载失败，备选方案：设为金黄色块防止崩溃
    coin.setColor(1, 0.9, 0, 1); 
    log("警告: 未找到 img/coin.png，已使用备选色块");
}
// 3. 设置金币大小（通常图片金币比色块稍微大一点点视觉效果更好，这里设为30x30）
coin.setSize(30, 30); 
coin.setPosition(-100, -100);
scene.addNode(coin);
var coinActive = false;

// C. 小鸟
var resBird = game.getResource().getTexture("img/logo.png");
var bird = new Sprite();
if (resBird) bird.setTexture(resBird);
bird.setSize(40, 40);
bird.setPosition(150, 300);
scene.addNode(bird);

// D. 【核心交互层】全屏透明精灵，负责接收所有点击
var clickLayer = new Sprite();
clickLayer.setSize(800, 600);
clickLayer.setPosition(0, 0);
clickLayer.setColor(0, 0, 0, 0); // 完全透明
scene.addNode(clickLayer);

// E. UI 标签
var labScore = new Label();
labScore.setPosition(380, 50);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 50);
labScore.setColor(0, 0, 0, 0); // 背景透明
labScore.setTextColor(1, 0, 0, 1); // 红色数字
labScore.setText("");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(400, 30);
labHigh.setFont("font/st.ttf", 20);
labHigh.setColor(0, 0, 0, 0); // 背景透明
labHigh.setTextColor(1, 0, 0, 1); // 红色文字
labHigh.setText("最高纪录: 0");
scene.addNode(labHigh);

// F. 【开始/重玩文字】
var labMenu = new Label();
labMenu.setPosition(250, 250);
labMenu.setSize(300, 150);
labMenu.setFont("font/st.ttf", 40);
labMenu.setColor(0, 0, 0, 0); // 背景透明，消除白色方框
labMenu.setTextColor(1, 0, 0, 1); // 红色文字
labMenu.setText("点击屏幕开始");
scene.addNode(labMenu);

// --- 2. 逻辑函数 ---

function checkHit(n1, n2) {
    var p1 = n1.getPosition(), s1 = n1.getSize();
    var p2 = n2.getPosition(), s2 = n2.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x && p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

function onJumpAction() {
    // 播放点击/跳跃音效
    audio.playSound("sound/1.wav");

    if (gameState == STATE_MENU || gameState == STATE_OVER) {
        gameState = STATE_PLAY;
        score = 0;
        pipeSpeed = 5;
        birdV = 0;
        bird.setPosition(150, 300);
        topPipe.setPosition(900, 0);
        bottomPipe.setPosition(900, 200 + pipeGap);
        labMenu.setText(""); // 隐藏文字
        labScore.setText("0");
    } else if (gameState == STATE_PLAY) {
        birdV = jumpForce;
    }
}

// --- 3. 交互绑定 ---

// 鼠标点击透明层触发
clickLayer.click(() => {
    onJumpAction();
});

// 键盘空格触发 (键值 32)
game.setKeyCallBack((key, action) => {
    if (key == 32 && action == 1) { 
        onJumpAction();
    }
});

// --- 4. 主循环 ---
scene.upDate((time) => {
    if (gameState != STATE_PLAY) {
        // 菜单时小鸟闲置浮动
        var h = 300 + Math.sin(new Date().getTime() * 0.005) * 15;
        bird.setPosition(150, h);
        return;
    }

    // 物理
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    bird.setRotate(Math.max(-30, Math.min(30, birdV * 4)));

    // 动态速度
    pipeSpeed = 5 + (score * 0.1);
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - pipeSpeed;

    if (nX < -70) {
        nX = 850;
        var randH = 80 + Math.random() * 250;
        topPipe.setSize(70, randH);
        bottomPipe.setPosition(nX, randH + pipeGap);
        
        if (Math.random() > 0.5) {
            coinActive = true;
            // 重新设置金币位置，x轴稍微偏移使其居中在管道间隙
            coin.setPosition(nX + 20, randH + (pipeGap / 2) - 15);
        } else {
            coinActive = false;
            coin.setPosition(-100, -100);
        }
        score++;
        labScore.setText(score.toString());
    }
    topPipe.setPosition(nX, 0);
    bottomPipe.setPosition(nX, bottomPipe.getPosition().y);

    // 金币逻辑
    if (coinActive) {
        // 金币随水管移动
        coin.setPosition(nX + 20, coin.getPosition().y);
        if (checkHit(bird, coin)) {
            score += 3;
            coinActive = false;
            coin.setPosition(-100, -100);
            labScore.setText(score.toString());
            audio.playSound("sound/1.wav"); // 吃到金币音效
        }
    }

    labHigh.setText("最高: " + highScore + " | 航速: " + pipeSpeed.toFixed(1));

    // 死亡
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 600 || bPos.y < -50) {
        gameState = STATE_OVER;
        if (score > highScore) highScore = score;
        labMenu.setText("游戏结束\n点击重玩");
        audio.playSound("sound/1.wav");
    }
});

game.pushScene(scene);
game.run();
