/*好的，我完全明白你的意思了。我们要保留你提供的这版代码中所有的功能（包括**金币逻辑**、**金币旋转动画**、**动态航速计算**等），并在此基础上精准地加入“**死亡 1s 冷却**”以及“**死后保持小鸟振翅**”的逻辑。

为了让小鸟在背景静止时依然能扇动翅膀，我将小鸟的 `animTimer` 逻辑移到了 `if (gameState == STATE_OVER)` 判断的前面。

### 修改后的完整代码：

```javascript
/**
 * 开维游戏引擎 - Flappy Bird 增强版
 * 1. 死亡冷却：增加 1s 冷却时间，防止连续误触导致瞬间重开。
 * 2. 动态静止：死亡后背景、管道、金币位移冻结，但小鸟保持振翅动画。
 * 3. 完整保留：保留金币系统、旋转动画、动态航速显示。
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
var deathTime = 0; // 新增：记录死亡时刻的时间戳

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

// --- 4. 管道与金币初始化 ---
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
    var now = new Date().getTime();

    if (gameState == STATE_OVER) {
        // 【新增逻辑】判断是否过了一秒钟（1000毫秒）
        if (now - deathTime < 1000) return; 

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
    
    audio.playSound("sound/1.wav"); 
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
    
    // 【核心改动 A】小鸟动画逻辑放在最前面
    // 这样即便游戏处于 STATE_OVER 状态，翅膀也会继续扇动
    animTimer++;
    if (animTimer >= 6) { 
        birdFrame = (birdFrame + 1) % 3;
        bird.setTexture(birdTextures[birdFrame]);
        animTimer = 0;
    }

    // 【核心改动 B】游戏结束时的静止逻辑
    if (gameState == STATE_OVER) {
        var now = new Date().getTime();
        // 如果还在 1s 冷却期内，显示“游戏结束”，过后才提示“点击重玩”
        if (now - deathTime >= 1000) {
            labMenu.setText("游戏结束\n点击重玩");
        } else {
            labMenu.setText("游戏结束");
        }
        return; 
    }

    // A. 背景滚动
    bgX -= bgScrollSpeed;
    if (bgX <= -bgWidth) bgX = 0;
    var currentX = Math.floor(bgX);
    bg1.setPosition(currentX, 0);
    bg2.setPosition(currentX + bgWidth, 0);

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
        deathTime = new Date().getTime(); // 记录死亡瞬间
        if (score > highScore) highScore = score;
        audio.playSound("sound/1.wav");
    }
});

game.pushScene(scene);
game.run();
/*
```

### 修改亮点：

1. **功能无损**：航速、金币、随机管道逻辑全部保留，一个都没少。
2. **输入保护**：`onJumpAction` 会检查 `now - deathTime`。如果玩家死后 0.5 秒就点击，程序会静默拦截，有效防止手滑误触导致游戏瞬间重开。
3. **死后动态**：小鸟在死后的那一秒钟里，背景是锁死的，但翅膀还在拍动。这种“垂死挣扎”的动画细节会让游戏显得更精致。
4. **UI 反馈**：文字会根据时间自动更新（“游戏结束” $\rightarrow$ “点击重玩”），引导玩家重启游戏。

你可以试试现在的操作感，那一秒钟的停顿能给玩家很好的心理缓冲。需要我帮你给小鸟加一个**死亡时翻转下坠**的动画吗？*/