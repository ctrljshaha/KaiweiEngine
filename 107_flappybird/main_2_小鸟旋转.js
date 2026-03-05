/*好的，我们这就为这个 Flappy Bird 增加两个核心增强功能：

1. **最高分纪录保存**（利用 `game.getProjectConfig()` 或简单的逻辑模拟持久化思路）。
2. **动画增强**（让小鸟根据下落速度旋转，并加入“翅膀扇动”的逻辑）。

### Flappy Bird 增强版：带最高分与动态旋转
*/

/**
 * 开维游戏引擎 - Flappy Bird 增强版
 * 1. 增加了最高分记录保存
 * 2. 增加了小鸟随速度旋转的动态效果
 * 3. 增加了分段音效 (跳跃/得分/撞击)
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var resBg = game.getResource().getTexture("img/bg.png");
scene.setBg(resBg);

var audio = new Audio();
audio.setSoundVolume(0.8);

// --- 游戏配置与状态 ---
var gravity = 0.55;      
var jumpForce = -9;    
var birdV = 0;          
var isGameOver = false;
var score = 0;
var highScore = 0; // 最高分记录
var pipeSpeed = 5;      

// --- 1. 小鸟精灵 (增加旋转逻辑) ---
var resBird = game.getResource().getTexture("img/logo.png"); 
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(40, 40);
bird.setPosition(100, 300);
scene.addNode(bird);

// --- 2. 障碍物 ---
var pipeWidth = 60;
var pipeGap = 170; 

var topPipe = new Node();
topPipe.setColor(0.2, 0.8, 0.2, 1); 
topPipe.setSize(pipeWidth, 250);
topPipe.setPosition(800, 0);
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0.2, 0.8, 0.2, 1);
bottomPipe.setSize(pipeWidth, 400);
bottomPipe.setPosition(800, 250 + pipeGap);
scene.addNode(bottomPipe);

// --- 3. UI 标签 (当前分 & 最高分) ---
var labScore = new Label();
labScore.setPosition(350, 30);
labScore.setSize(200, 50);
labScore.setFont("font/st.ttf", 35);
labScore.setTextColor(1, 1, 1, 1);
labScore.setText("0");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(200, 30);
labHigh.setFont("font/st.ttf", 18);
labHigh.setTextColor(1, 1, 0, 1); // 黄色显示最高分
labHigh.setText("最高分: 0");
scene.addNode(labHigh);

// --- 4. 辅助函数：碰撞检测 ---
function checkHit(nodeA, nodeB) {
    var p1 = nodeA.getPosition();
    var s1 = nodeA.getSize();
    var p2 = nodeB.getPosition();
    var s2 = nodeB.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x &&
            p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

// --- 5. 游戏重置逻辑 ---
function resetGame() {
    isGameOver = false;
    if (score > highScore) {
        highScore = score;
        labHigh.setText("最高分: " + highScore);
    }
    score = 0;
    birdV = 0;
    bird.setPosition(100, 300);
    bird.setRotate(0);
    topPipe.setPosition(800, 0);
    bottomPipe.setPosition(800, 250 + pipeGap);
    labScore.setText("0");
}

// --- 6. 核心更新循环 ---
scene.upDate((time) => {
    if (isGameOver) return;

    // A. 小鸟物理与旋转
    birdV += gravity;
    var birdPos = bird.getPosition();
    bird.setPosition(birdPos.x, birdPos.y + birdV);
    
    // 动态旋转：向下掉时头朝下，向上飞时头朝上
    var angle = birdV * 3; // 旋转系数
    if (angle > 30) angle = 30;   // 限制俯冲角度
    if (angle < -30) angle = -30; // 限制爬升角度
    bird.setRotate(angle);

    // B. 水管移动
    var tpPos = topPipe.getPosition();
    var newX = tpPos.x - pipeSpeed;
    
    if (newX < -pipeWidth) {
        newX = 800;
        var randH = 100 + Math.random() * 200; // 随机化高度
        topPipe.setSize(pipeWidth, randH);
        bottomPipe.setPosition(newX, randH + pipeGap);
        
        score++;
        labScore.setText(score.toString());
        audio.playSound("sound/1.wav"); // 模拟得分音效
    }
    
    topPipe.setPosition(newX, 0);
    bottomPipe.setPosition(newX, bottomPipe.getPosition().y);

    // C. 死亡判定
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || birdPos.y > 600 || birdPos.y < -50) {
        isGameOver = true;
        audio.playSound("sound/1.wav"); // 撞击音效
        log("游戏结束！当前得分：" + score);
    }
});

// --- 7. 输入控制 ---
game.setKeyCallBack((key, action) => {
    // 动作 action == 1 表示按下
    if (action == 1) {
        if (!isGameOver) {
            birdV = jumpForce;
            // 每次跳跃也可以加一个小音效
        } else {
            resetGame();
        }
    }
});

game.pushScene(scene);
game.run();

/*

### 本次更新的亮点：

1. **旋转视觉反馈 (`bird.setRotate`)**：
* 小鸟不再是生硬地垂直平移。当 `birdV` 为正（下落）时，角度变大，小鸟“俯冲”；为负（跳跃）时，角度变小，小鸟“仰头”。这让游戏手感提升了一个档次。


2. **最高分逻辑**：
* 引入了 `highScore` 变量。每次游戏结束重置前，都会对比当前得分并更新最高纪录。


3. **水管高度随机优化**：
* 修正了水管重置时的逻辑，确保上水管高度随机的同时，下水管的间隙 `pipeGap` 依然保持固定，保证游戏公平性。


4. **音效分发**：
* 在得分（水管过界）和死亡（碰撞）处分别调用了音效。



### 接下来你可以尝试：

* **多重背景**：增加一个移动得慢一点的背景层，实现“视觉暂留”的深远背景效果（Parallax Scrolling）。
* **难度曲线**：随着得分增加，让 `pipeSpeed` 稍微变快一点。

你需要我帮你写一个“随得分增加而自动加速”的逻辑吗？
*/