/*没问题，这次我们重点解决两个核心需求：**增加振翅动画**，以及确保**游戏结束时画面完全静止**（背景、管道、动画全部冻结）。

### 修改要点：

1. **振翅逻辑**：加载 `bird0_0`, `bird0_1`, `bird0_2` 三张纹理，通过计数器循环切换。
2. **静止逻辑**：在 `scene.upDate` 中，将背景位移、管道移动、金币逻辑和翅膀动画全部放入 `if (gameState != STATE_OVER)` 的判断中。一旦死亡，所有 `Sprite` 的位置和贴图将不再更新。
3. **UI 优化**：所有 `Label` 均已确认使用 `setColor(0,0,0,0)`。

```javascript
/**
 * 开维游戏引擎 - Flappy Bird 振翅动画与静止优化版
 * 1. 动画：bird0_0, bird0_1, bird0_2 循环切换实现振翅。
 * 2. 状态：STATE_OVER 状态下强制停止所有运动逻辑（静止画面）。
 * 3. 视觉：管道图片化，文字背景透明。
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
var pipeWidth = 50; 
var pipeGap = 200;       

// --- 3. 小鸟振翅动画配置 ---
var birdTextures = [
    game.getResource().getTexture("img/bird0_0.png"),
    game.getResource().getTexture("img/bird0_1.png"),
    game.getResource().getTexture("img/bird0_2.png")
];
var birdFrame = 0;
var animTimer = 0;

var bird = new Sprite();
bird.setTexture(birdTextures[0]);
bird.setSize(38, 38);
bird.setPosition(80, 350);
scene.addNode(bird);

// --- 4. 管道初始化 ---
var topPipe = new Sprite();
topPipe.setTexture(game.getResource().getTexture("img/pipe_down.png"));
topPipe.setSize(pipeWidth, 300);
topPipe.setPosition(500, 0);
scene.addNode(topPipe);

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

// --- 5. UI 调整 (透明底色) ---
var labScore = new Label();
labScore.setPosition(180, 80);
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
labMenu.setPosition(130, 330); 
labMenu.setSize(260, 100);
labMenu.setFont("font/st.ttf", 25); 
labMenu.setColor(0, 0, 0, 0); 
labMenu.setTextColor(1, 0, 0, 1);
labMenu.setText("点击屏幕开始");
scene.addNode(labMenu);

var clickLayer = new Sprite();
clickLayer.setSize(420, 750);
clickLayer.setPosition(0, 0);
clickLayer.setColor(0, 0, 0, 0); 
scene.addNode(clickLayer);

// --- 6. 逻辑处理 ---

function checkHit(n1, n2) {
    var p1 = n1.getPosition(), s1 = n1.getSize();
    var p2 = n2.getPosition(), s2 = n2.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x && p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

function onJumpAction() {
    audio.playSound("sound/1.wav"); 
    if (gameState == STATE_OVER) {
        // 重置游戏状态
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
        coinActive = false;
        coin.setPosition(-100, -100);
        return;
    }
    
    if (gameState == STATE_MENU) {
        gameState = STATE_PLAY;
        labMenu.setText("");
        labScore.setText("0");
    }
    birdV = jumpForce;
}

clickLayer.click(() => { onJumpAction(); });
game.setKeyCallBack((key, action) => { if (key == 32 && action == 1) onJumpAction(); });

// --- 7. 主循环 ---
scene.upDate((time) => {
    
    // 【核心修改】如果游戏结束，跳过所有更新逻辑，画面即刻静止
    if (gameState == STATE_OVER) return;

    // A. 背景滚动
    bgX -= bgScrollSpeed;
    if (bgX <= -bgWidth) bgX = 0;
    var currentX = Math.floor(bgX);
    bg1.setPosition(currentX, 0);
    bg2.setPosition(currentX + bgWidth, 0);

    // B. 小鸟动画循环
    animTimer++;
    if (animTimer >= 6) { // 每6帧换一次图
        birdFrame = (birdFrame + 1) % 3;
        bird.setTexture(birdTextures[birdFrame]);
        animTimer = 0;
    }

    if (gameState == STATE_MENU) {
        var h = 350 + Math.sin(new Date().getTime() * 0.005) * 15;
        bird.setPosition(80, h);
        return;
    }

    // C. 小鸟物理
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    bird.setRotate(Math.max(-25, Math.min(25, birdV * 5)));

    // D. 动态障碍物逻辑
    pipeSpeed = baseSpeed + (score * 0.05); 
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - pipeSpeed;

    if (nX < -pipeWidth) {
        nX = 430;
        var randH = 120 + Math.random() * 280;
        topPipe.setSize(pipeWidth, randH);
        bottomPipe.setPosition(nX, randH + pipeGap);
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

    // E. 金币逻辑
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
            }
        }
    }

    labHigh.setText("最高: " + highScore + " | 航速: " + pipeSpeed.toFixed(1));

    // F. 死亡判定
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

这样修改后，一旦触发死亡判定，程序会直接从 `upDate` 的最顶端跳出，所有的位置计算和贴图切换都会停留在碰撞那一帧。

既然现在画面已经能完美静止了，需要我帮你把“游戏结束”文字做大一点，并放在屏幕正中央显眼的位置吗？*/