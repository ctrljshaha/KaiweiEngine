/*要实现小鸟“慢一点、幅度小一点”的手感，核心在于调整**物理参数**。

我们需要修改两个关键数值：

1. **`gravity` (重力)**：减小这个值，小鸟下落会变慢，感觉更轻盈。
2. **`jumpForce` (跳跃力度)**：减小这个值，每次点击小鸟向上飞的高度（幅度）会变小。

以下是基于你提供的代码进行的优化版本，同时包含了之前要求的文字缩小、居中以及背景无缝逻辑：

```javascript
/**
 * 开维游戏引擎 - Flappy Bird 手感优化版
 * 1. 物理调整：降低重力和跳跃力，手感更丝滑、幅度更小。
 * 2. 文字优化：缩小字体并居中显示。
 * 3. 衔接优化：背景像素级锁定对齐。
 */

game.initSize(420, 750); 
game.setFPS(60);

var scene = new Scene();
var audio = new Audio();
audio.setSoundVolume(0.8);

// --- 1. 背景无缝滚动逻辑 ---
var resBg = game.getResource().getTexture("img/bg.png");
var bgWidth = 420; 

var bg1 = new Sprite();
bg1.setTexture(resBg);
bg1.setSize(bgWidth, 750);
bg1.setPosition(0, 0);
scene.addNode(bg1);

var bg2 = new Sprite();
bg2.setTexture(resBg);
bg2.setSize(bgWidth, 750);
bg2.setPosition(bgWidth, 0); 
scene.addNode(bg2);

var bgX = 0; 
var bgScrollSpeed = 2; 

// --- 2. 游戏参数 (重点调整手感) ---
var STATE_MENU = 0, STATE_PLAY = 1, STATE_OVER = 2;
var gameState = STATE_MENU;

// 原值: gravity 0.52, jumpForce -8.5
// 现值: 让动作变慢、幅度变小
var gravity = 0.38;      // 减小重力，下落变慢
var jumpForce = -6.2;    // 减小跳跃力，飞起的幅度变小
var birdV = 0;
var score = 0;
var highScore = 0;
var baseSpeed = 4.0;     // 稍微降低移动速度，配合慢速手感
var pipeSpeed = 4.0;
var pipeWidth = 65;
var pipeGap = 200;       // 略微增加间隙，增加容错

// --- 3. 节点初始化 ---

var topPipe = new Node();
topPipe.setColor(0.1, 0.6, 0.1, 1);
topPipe.setSize(pipeWidth, 300);
topPipe.setPosition(500, 0);
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0.1, 0.6, 0.1, 1);
bottomPipe.setSize(pipeWidth, 800);
bottomPipe.setPosition(500, 500);
scene.addNode(bottomPipe);

var resCoin = game.getResource().getTexture("img/coin.png");
var coin = new Sprite();
if (resCoin) coin.setTexture(resCoin);
else coin.setColor(1, 0.9, 0, 1);
coin.setSize(30, 30);
coin.setPosition(-100, -100);
scene.addNode(coin);

var coinActive = false;
var isCoinRotating = false; 
var coinRotateAngle = 0;   

var bird = new Sprite();
bird.setTexture(game.getResource().getTexture("img/logo.png"));
bird.setSize(38, 38);
bird.setPosition(80, 350);
scene.addNode(bird);

var clickLayer = new Sprite();
clickLayer.setSize(420, 750);
clickLayer.setPosition(0, 0);
clickLayer.setColor(0, 0, 0, 0); 
scene.addNode(clickLayer);

// --- 4. UI 调整 (缩小并居中) ---
var labScore = new Label();
labScore.setPosition(160, 80);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 55);
labScore.setColor(0, 0, 0, 0);
labScore.setTextColor(1, 0, 0, 1);
labScore.setText("");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(380, 30);
labHigh.setFont("font/st.ttf", 18);
labHigh.setColor(0, 0, 0, 0);
labHigh.setTextColor(1, 0, 0, 1);
labHigh.setText("最高纪录: 0");
scene.addNode(labHigh);

var labMenu = new Label();
// 计算水平居中: (屏幕宽420 - 组件宽260) / 2 = 80
labMenu.setPosition(80, 330); 
labMenu.setSize(260, 100);
labMenu.setFont("font/st.ttf", 25); // 字体缩小到 25
labMenu.setColor(0, 0, 0, 0);
labMenu.setTextColor(1, 0, 0, 1);
labMenu.setText("点击屏幕开始");
scene.addNode(labMenu);

// --- 5. 逻辑处理 ---

function checkHit(n1, n2) {
    var p1 = n1.getPosition(), s1 = n1.getSize();
    var p2 = n2.getPosition(), s2 = n2.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x && p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

function onJumpAction() {
    audio.playSound("sound/1.wav"); 
    if (gameState != STATE_PLAY) {
        gameState = STATE_PLAY;
        score = 0;
        pipeSpeed = baseSpeed;
        birdV = 0;
        bird.setPosition(80, 350);
        bird.setRotate(0);
        topPipe.setPosition(450, 0);
        bottomPipe.setPosition(450, 300 + pipeGap);
        labMenu.setText("");
        labScore.setText("0");
        isCoinRotating = false; 
        coinRotateAngle = 0;
    } else {
        birdV = jumpForce;
    }
}

clickLayer.click(() => { onJumpAction(); });
game.setKeyCallBack((key, action) => { if (key == 32 && action == 1) onJumpAction(); });

// --- 6. 主循环 ---
scene.upDate((time) => {
    // A. 背景滚动 (像素级锁定)
    bgX -= bgScrollSpeed;
    if (bgX <= -bgWidth) bgX = 0;
    var currentX = Math.floor(bgX);
    bg1.setPosition(currentX, 0);
    bg2.setPosition(currentX + bgWidth, 0);

    if (gameState != STATE_PLAY) {
        var h = 350 + Math.sin(new Date().getTime() * 0.005) * 15;
        bird.setPosition(80, h);
        return;
    }

    // B. 小鸟物理 (应用新参数)
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    // 旋转也相应调柔和一点
    bird.setRotate(Math.max(-25, Math.min(25, birdV * 5)));

    // C. 动态障碍物
    pipeSpeed = baseSpeed + (score * 0.05); // 速度增长也放慢一点
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - pipeSpeed;

    if (nX < -pipeWidth) {
        nX = 430;
        var randH = 120 + Math.random() * 280;
        topPipe.setSize(pipeWidth, randH);
        bottomPipe.setPosition(nX, randH + pipeGap);
        
        if (Math.random() > 0.5) {
            coinActive = true;
            coin.setPosition(nX + 18, randH + (pipeGap / 2) - 15);
            isCoinRotating = false; 
            coinRotateAngle = 0;
            coin.setRotate(0);
        } else {
            coinActive = false;
            coin.setPosition(-100, -100);
        }
        score++;
        labScore.setText(score.toString());
    }
    topPipe.setPosition(nX, 0);
    bottomPipe.setPosition(nX, bottomPipe.getPosition().y);

    // D. 金币逻辑
    if (coinActive) {
        if (isCoinRotating) {
            coinRotateAngle += 15;
            coin.setRotate(coinRotateAngle);
            coin.setPosition(coin.getPosition().x, coin.getPosition().y - 3);
            if (coinRotateAngle >= 180) { 
                isCoinRotating = false;
                coinActive = false;
                coin.setPosition(-100, -100);
            }
        } else {
            coin.setPosition(nX + 18, coin.getPosition().y);
            if (checkHit(bird, coin)) {
                score += 3;
                labScore.setText(score.toString());
                audio.playSound("sound/1.wav"); 
                isCoinRotating = true; 
                coinRotateAngle = 0;
            }
        }
    }

    labHigh.setText("最高: " + highScore + " | 航速: " + pipeSpeed.toFixed(1));

    // E. 死亡判定
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 750 || bPos.y < -50) {
        gameState = STATE_OVER;
        if (score > highScore) highScore = score;
        labMenu.setText("游戏结束\n点击重玩");
        audio.playSound("sound/1.wav");
    }
});

game.pushScene(scene);
game.run();
/*
```

### 关键调整说明：

* **手感变“慢”**：将 `gravity` 从 `0.52` 降低到 **`0.38`**。这让小鸟看起来像是在低重力环境下飞行，下落缓冲更长。
* **幅度变“小”**：将 `jumpForce` 从 `-8.5` 降低到 **`-6.2`**。现在点击屏幕，小鸟不会猛地向上蹿一大截，而是轻微跃起，更易于精细控制。
* **文字居中与缩小**：
* `labMenu` 的字体大小设为 **`25`**。
* 通过坐标 `setPosition(80, 330)` 手动校准了居中（因为 420 宽屏中，260 宽的组件放在 80 位置正好左右对齐）。


* **移动速度同步**：为了配合慢速手感，我把初始 `baseSpeed` 也微调到了 **`4.0`**，让整体节奏更统一。

如果你觉得小鸟现在的反馈还是太灵敏或者太笨重，我可以继续帮你微调这两个数值。**你想尝试给小鸟加上刚才提到的“撞击弹开”动画效果吗？***/