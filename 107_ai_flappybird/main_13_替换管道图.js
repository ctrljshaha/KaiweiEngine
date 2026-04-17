/*明白，我已经为你重写了代码。

### 主要修改内容：

1. **管道贴图化**：将 `topPipe` 和 `bottomPipe` 从 `Node`（色块）升级为 `Sprite`（精灵），并分别加载了 `img/pipe_down.png`（开口向下的上管）和 `img/pipe_up.png`（开口向上的下管）。
2. **UI 底色全透明**：确保所有的 `Label` 标签（计分、最高分、菜单提示）都显式调用了 `setColor(0, 0, 0, 0)`。
3. **视觉显示优化**：将管道宽度缩窄至 `50`，并调整了动态高度逻辑，确保长条形的管道图片能够完整显示而不产生难看的拉伸。

```javascript*/
/**
 * 开维游戏引擎 - Flappy Bird 素材与视觉优化版
 * 1. 管道：替换为 "pipe_up.png" 和 "pipe_down.png" 图片素材。
 * 2. UI：所有提示文字背景设为全透明底色。
 * 3. 物理：保持轻盈手感与背景无缝滚动。
 */

game.initSize(420, 750); 
game.setFPS(60);

var scene = new Scene();
var audio = new Audio();

// --- 音频配置 ---
audio.setMusicVolume(0.2); 
audio.setSoundVolume(0.8); 
audio.playMusic("sound/bg.mp3"); 

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

// --- 2. 游戏参数 ---
var STATE_MENU = 0, STATE_PLAY = 1, STATE_OVER = 2;
var gameState = STATE_MENU;

var gravity = 0.38;      
var jumpForce = -6.2;    
var birdV = 0;
var score = 0;
var highScore = 0;
var baseSpeed = 4.0;      
var pipeSpeed = 4.0;
var pipeWidth = 50;  // 管道变细，更美观
var pipeGap = 200;       

// --- 3. 节点初始化 ---

// 上管道：开口向下
var topPipe = new Sprite();
topPipe.setTexture(game.getResource().getTexture("img/pipe_down.png"));
topPipe.setSize(pipeWidth, 300);
topPipe.setPosition(500, 0);
scene.addNode(topPipe);

// 下管道：开口向上
var bottomPipe = new Sprite();
bottomPipe.setTexture(game.getResource().getTexture("img/pipe_up.png"));
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

// --- 4. UI 调整 (背景全透明) ---
var labScore = new Label();
labScore.setPosition(180, 80);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 55);
labScore.setColor(0, 0, 0, 0); // 透明底色
labScore.setTextColor(1, 0, 0, 1);
labScore.setText("");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(380, 30);
labHigh.setFont("font/st.ttf", 18);
labHigh.setColor(0, 0, 0, 0); // 透明底色
labHigh.setTextColor(1, 0, 0, 1);
labHigh.setText("最高纪录: 0");
scene.addNode(labHigh);

var labMenu = new Label();
labMenu.setPosition(130, 330); 
labMenu.setSize(260, 100);
labMenu.setFont("font/st.ttf", 25); 
labMenu.setColor(0, 0, 0, 0); // 透明底色
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
    // A. 背景滚动
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

    // B. 小鸟物理
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    bird.setRotate(Math.max(-25, Math.min(25, birdV * 5)));

    // C. 动态障碍物逻辑
    pipeSpeed = baseSpeed + (score * 0.05); 
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - pipeSpeed;

    if (nX < -pipeWidth) {
        nX = 430;
        var randH = 120 + Math.random() * 280;
        topPipe.setSize(pipeWidth, randH); // 动态高度
        bottomPipe.setPosition(nX, randH + pipeGap);
        // 确保下管道长度足以覆盖屏幕底部
        bottomPipe.setSize(pipeWidth, 750 - (randH + pipeGap) + 200); 
        
        if (Math.random() > 0.5) {
            coinActive = true;
            coin.setPosition(nX + (pipeWidth/2 - 15), randH + (pipeGap / 2) - 15);
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
            coin.setPosition(nX + (pipeWidth/2 - 15), coin.getPosition().y);
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

如果你发现文字显示还是有背景，可能是因为缓存问题，可以尝试刷新一下预览。接下来的下一步，你想给小鸟换成那张能扇动翅膀的动画图吗？我们可以设置每几帧切换一次贴图来实现。*/