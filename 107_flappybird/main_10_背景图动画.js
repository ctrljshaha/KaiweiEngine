/*为了彻底解决背景衔接出现的缝隙问题，我们需要改变思路。

**缝隙产生的原因：** 在 60 FPS 的高频刷新下，如果背景坐标是浮点数（如 `1.8`），每一帧移动后，两张图的相对距离会产生微小的舍入误差，导致肉眼可见的白线。

**解决方案：**

1. **坐标取整 (`Math.floor`)**：强制背景坐标以像素对齐，不使用小数点。
2. **相对锁定**：不要让两张图各自独立移动，而是让 `bg2` 的位置始终等于 `bg1.x + 宽度`。
3. **取消 `initSize` 的冲突**：确保整个环境只由一个逻辑尺寸控制。

### 修正后的无缝衔接代码

```javascript
/**
 * 开维游戏引擎 - Flappy Bird 竖屏完美无缝版
 * 核心修复：背景坐标像素级对齐，彻底消除缝隙
 */

game.initSize(420, 750); 
game.setFPS(60);

var scene = new Scene();
var audio = new Audio();
audio.setSoundVolume(0.8);

// --- 1. 背景无缝滚动逻辑 (核心修复) ---
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

var bgX = 0; // 用一个统一的变量记录背景位移
var bgScrollSpeed = 2; // 使用整数速度更不容易出缝隙

// --- 2. 游戏参数 ---
var STATE_MENU = 0, STATE_PLAY = 1, STATE_OVER = 2;
var gameState = STATE_MENU;

var gravity = 0.52;
var jumpForce = -8.5;
var birdV = 0;
var score = 0;
var highScore = 0;
var baseSpeed = 4.5;
var pipeSpeed = 4.5;
var pipeWidth = 65;
var pipeGap = 195;

// --- 3. 节点初始化 ---

// 障碍物
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

// 金币 (使用 coin.png)
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

// 小鸟
var bird = new Sprite();
bird.setTexture(game.getResource().getTexture("img/logo.png"));
bird.setSize(38, 38);
bird.setPosition(80, 350);
scene.addNode(bird);

// 全屏交互层
var clickLayer = new Sprite();
clickLayer.setSize(420, 750);
clickLayer.setPosition(0, 0);
clickLayer.setColor(0, 0, 0, 0); 
scene.addNode(clickLayer);

// UI 标签
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
labMenu.setPosition(60, 320);
labMenu.setSize(300, 150);
labMenu.setFont("font/st.ttf", 35);
labMenu.setColor(0, 0, 0, 0);
labMenu.setTextColor(1, 0, 0, 1);
labMenu.setText("点击屏幕开始");
scene.addNode(labMenu);

// --- 4. 逻辑处理 ---

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

// --- 5. 主循环 ---
scene.upDate((time) => {
    // A. 背景滚动 (采用锁定对齐算法)
    bgX -= bgScrollSpeed;
    if (bgX <= -bgWidth) {
        bgX = 0; // 重置
    }
    
    // 强制取整，确保像素对齐，杜绝白缝
    var currentX = Math.floor(bgX);
    bg1.setPosition(currentX, 0);
    bg2.setPosition(currentX + bgWidth, 0); // bg2 永远死死地贴在 bg1 的屁股后面

    if (gameState != STATE_PLAY) {
        var h = 350 + Math.sin(new Date().getTime() * 0.005) * 15;
        bird.setPosition(80, h);
        return;
    }

    // B. 小鸟物理
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    bird.setRotate(Math.max(-30, Math.min(30, birdV * 4)));

    // C. 动态障碍物
    pipeSpeed = baseSpeed + (score * 0.08);
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

    // D. 金币逻辑与旋转动画
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

### 修改要点详解：

1. **绝对锁定同步**：
* 之前两张图是独立运行 `setPosition(x - speed)`，哪怕只差 0.0001 像素，经过几百帧后也会裂开缝隙。
* 现在使用一个统一的 `bgX` 变量。`bg1` 永远在 `bgX`，`bg2` 永远在 `bgX + 420`。它们在代码逻辑上被“焊”在了一起，速度绝对一致。


2. **像素对齐 (`Math.floor`)**：
* 显卡在渲染非整数坐标时会尝试进行“平滑处理”（采样），这会导致图片边缘变虚，看起来像白缝。
* 通过 `Math.floor` 取整，确保图片的每一个像素都精准地对准屏幕像素点。


3. **金币旋转动画优化**：
* 保持了你要求的旋转效果：吃到后金币会一边向上飘一边快速旋转，直到消失，给玩家极强的反馈感。



**现在背景应该是严丝合缝的。如果依然有极细微的闪烁，那通常是图片资源本身左右边缘没有做“循环贴图”处理（即左边缘和右边缘不能拼合）。需要我帮你把背景移动速度也设置成随得分略微加快吗？***/