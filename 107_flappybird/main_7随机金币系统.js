/*好的，这就是为你整合后的 **Flappy Bird：全功能精英版**。

我加入了**动态加速系统**、**随机金币奖励**以及你要求的**全红色透明 UI**。

### Flappy Bird：全功能精英版 (金币 + 自动加速 + 红色透明 UI)
*/
/**
 * 开维游戏引擎 - Flappy Bird 精英版
 * 1. 红色透明 UI：分数与最高分均改为红色且背景透明
 * 2. 随机金币：水管间隙随机出现金币，吃掉额外加分
 * 3. 动态加速：随得分增加，水管移动速度会平滑提升
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var resBg = game.getResource().getTexture("img/bg.png");
scene.setBg(resBg);

var audio = new Audio();
audio.setSoundVolume(0.8);

// --- 游戏参数 ---
var gravity = 0.55;      
var jumpForce = -9;    
var birdV = 0;          
var isGameOver = false;
var score = 0;          // 当前总得分
var highScore = 0; 
var baseSpeed = 5;      // 基础速度
var pipeSpeed = 5;      
var pipeWidth = 70;
var pipeGap = 175;      // 通道间隙

// --- 1. 小鸟 ---
var bird = new Sprite();
bird.setTexture(game.getResource().getTexture("img/logo.png"));
bird.setSize(40, 40);
bird.setPosition(150, 300);
scene.addNode(bird);

// --- 2. 障碍物 ---
var topPipe = new Node();
topPipe.setColor(0.1, 0.6, 0.1, 1); 
topPipe.setSize(pipeWidth, 200);
topPipe.setPosition(900, 0); 
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0.1, 0.6, 0.1, 1);
bottomPipe.setSize(pipeWidth, 600); 
bottomPipe.setPosition(900, 200 + pipeGap);
scene.addNode(bottomPipe);

// --- 3. 金币物品 ---
var coin = new Sprite();
coin.setColor(1, 0.9, 0, 1); // 金黄色
coin.setSize(25, 25);
coin.setPosition(-100, -100); 
scene.addNode(coin);
var coinActive = false;

// --- 4. UI 标签 (全红色 + 透明背景) ---
var labScore = new Label();
labScore.setPosition(380, 50);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 50);
labScore.setColor(0, 0, 0, 0);       // 背景完全透明
labScore.setTextColor(1, 0, 0, 1);    // 【红色文字】
labScore.setText("0");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(400, 30);
labHigh.setFont("font/st.ttf", 20);
labHigh.setColor(0, 0, 0, 0);       // 背景完全透明
labHigh.setTextColor(1, 0, 0, 1);    // 【红色文字】
labHigh.setText("最高纪录: 0 | 速度: 5.0");
scene.addNode(labHigh);

// --- 5. 碰撞检测函数 ---
function checkHit(nodeA, nodeB) {
    var p1 = nodeA.getPosition();
    var s1 = nodeA.getSize();
    var p2 = nodeB.getPosition();
    var s2 = nodeB.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x &&
            p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

// --- 6. 游戏更新循环 ---
scene.upDate((time) => {
    if (isGameOver) return;

    // A. 小鸟物理
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    bird.setRotate(Math.max(-30, Math.min(30, birdV * 4)));

    // B. 动态难度：随分数增加速度
    pipeSpeed = baseSpeed + (score * 0.1);

    // C. 水管移动与随机生成
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - pipeSpeed;
    
    if (nX < -pipeWidth) {
        nX = 850; 
        var randH = 80 + Math.random() * 250; 
        
        topPipe.setSize(pipeWidth, randH);
        bottomPipe.setPosition(nX, randH + pipeGap);
        
        // 随机生成金币 (50% 概率)
        if (Math.random() > 0.5) {
            coinActive = true;
            coin.setPosition(nX + 22, randH + (pipeGap / 2) - 12);
        } else {
            coinActive = false;
            coin.setPosition(-100, -100);
        }
        
        score++; // 越过水管计分
        labScore.setText(score.toString());
        audio.playSound("sound/1.wav");
    }
    
    topPipe.setPosition(nX, 0);
    bottomPipe.setPosition(nX, bottomPipe.getPosition().y);

    // D. 金币逻辑
    if (coinActive) {
        coin.setPosition(nX + 22, coin.getPosition().y);
        if (checkHit(bird, coin)) {
            score += 3; // 吃金币额外加3分
            coinActive = false;
            coin.setPosition(-100, -100);
            labScore.setText(score.toString());
            audio.playSound("sound/1.wav");
        }
    }

    labHigh.setText("最高纪录: " + highScore + " | 速度: " + pipeSpeed.toFixed(1));

    // E. 死亡检测
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 600 || bPos.y < -50) {
        isGameOver = true;
        audio.playSound("sound/1.wav");
    }
});

// --- 7. 控制与重置 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) { 
        if (!isGameOver) {
            birdV = jumpForce;
        } else {
            // 重置
            isGameOver = false;
            if (score > highScore) highScore = score;
            score = 0;
            pipeSpeed = baseSpeed;
            birdV = 0;
            bird.setPosition(150, 300);
            topPipe.setPosition(900, 0);
            bottomPipe.setPosition(900, 200 + pipeGap);
            coin.setPosition(-100, -100);
            labScore.setText("0");
        }
    }
});

game.pushScene(scene);
game.run();

/*
### 本次更新详情：

1. **UI 颜色与透明度**：
* `labScore.setTextColor(1, 0, 0, 1)`：将分数颜色设为纯红（RGBA 中的 R=1）。
* `labScore.setColor(0, 0, 0, 0)`：将标签背景的 Alpha 值设为 0，彻底透明。


2. **随机金币系统**：
* 在水管刷新时，有 50% 的几率在通道中心生成一枚金币。吃掉金币会额外获得 **3 分**。


3. **动态加速逻辑**：
* `pipeSpeed = baseSpeed + (score * 0.1)`：每得 1 分，游戏速度就会永久提升 0.1。这意味着随着分数变高，反应时间会越来越短，极具挑战性。


4. **随机高度修复**：
* 每次管子重置时，上管高度会在 `80` 到 `330` 之间随机跳动，下管位置会自动根据 `pipeGap`（175像素）进行对齐。



**现在你的游戏已经是一个完整的挑战模式了！红色 UI 在背景中非常醒目。你觉得这个加速速度合适吗？还是需要我把金币改为吃掉后可以短时间减速的“道具”？**
*/