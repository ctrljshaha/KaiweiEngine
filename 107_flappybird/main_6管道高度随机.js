/*太好了！既然画面已经正常显示，我们现在集中解决**水管随机化**和**UI透明化**这两个问题。

### 关键修改说明：

1. **水管随机高度**：在 `scene.upDate` 中，当水管移动到左边界重置到右侧时，使用 `Math.random()` 重新计算 `topPipe` 的高度，并同步更新 `bottomPipe` 的位置，确保间隙（Gap）恒定。
2. **UI背景透明**：在开维引擎中，`Label` 默认会有底色。通过 `label.setColor(0, 0, 0, 0)`（四个参数分别为 R, G, B, Alpha）将 Alpha（透明度）设为 **0**，即可实现完全透明，只显示文字。

### 优化后的代码：
*/

/**
 * 开维游戏引擎 - Flappy Bird 随机高度+透明UI版
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
var score = 0;
var highScore = 0; 
var pipeSpeed = 5;      
var pipeWidth = 70;
var pipeGap = 170; // 上下管子之间的固定空隙

// --- 1. 小鸟 ---
var bird = new Sprite();
bird.setTexture(game.getResource().getTexture("img/logo.png"));
bird.setSize(40, 40);
bird.setPosition(150, 300);
scene.addNode(bird);

// --- 2. 障碍物 ---
var topPipe = new Node();
topPipe.setColor(0.2, 0.7, 0.2, 1); 
topPipe.setSize(pipeWidth, 200); // 初始高度
topPipe.setPosition(900, 0); 
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0.2, 0.7, 0.2, 1);
bottomPipe.setSize(pipeWidth, 600); 
bottomPipe.setPosition(900, 200 + pipeGap); // 初始位置
scene.addNode(bottomPipe);

// --- 3. UI 标签 (设置透明背景) ---
var labScore = new Label();
labScore.setPosition(380, 50);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 45);
labScore.setColor(0, 0, 0, 0); // 【修改】Alpha设为0，背景完全透明
labScore.setTextColor(1, 1, 1, 1); // 白色文字
labScore.setText("0");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(300, 30);
labHigh.setFont("font/st.ttf", 18);
labHigh.setColor(0, 0, 0, 0); // 【修改】背景透明
labHigh.setTextColor(1, 1, 0, 1); // 黄色最高分
labHigh.setText("最高分: 0");
scene.addNode(labHigh);

// --- 4. 碰撞检测 ---
function checkHit(nodeA, nodeB) {
    var p1 = nodeA.getPosition();
    var s1 = nodeA.getSize();
    var p2 = nodeB.getPosition();
    var s2 = nodeB.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x &&
            p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

// --- 5. 游戏更新循环 ---
scene.upDate((time) => {
    if (isGameOver) return;

    // A. 小鸟下落
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    bird.setRotate(Math.max(-30, Math.min(30, birdV * 4)));

    // B. 水管移动与【随机高度逻辑】
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - pipeSpeed;
    
    if (nX < -pipeWidth) {
        nX = 850; // 重置到右边
        
        // ---【核心修改：随机计算高度】---
        // 确保上管高度在 80 到 350 之间，留出空间给下管
        var randomTopHeight = 80 + Math.random() * 270; 
        
        topPipe.setSize(pipeWidth, randomTopHeight);
        // 下管位置 = 上管高度 + 间隙
        bottomPipe.setPosition(nX, randomTopHeight + pipeGap);
        // 下管高度设大一点确保遮住底部
        bottomPipe.setSize(pipeWidth, 600); 
        
        score++;
        labScore.setText(score.toString());
        audio.playSound("sound/1.wav");
    }
    
    topPipe.setPosition(nX, 0);
    bottomPipe.setPosition(nX, bottomPipe.getPosition().y);

    // C. 死亡检测
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 600 || bPos.y < -50) {
        isGameOver = true;
        audio.playSound("sound/1.wav");
        log("GameOver! Score: " + score);
    }
});

// --- 6. 控制 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) { 
        if (!isGameOver) {
            birdV = jumpForce;
        } else {
            // 重置游戏
            isGameOver = false;
            if (score > highScore) {
                highScore = score;
                labHigh.setText("最高分: " + highScore);
            }
            score = 0;
            birdV = 0;
            bird.setPosition(150, 300);
            topPipe.setPosition(900, 0);
            bottomPipe.setPosition(900, 200 + pipeGap);
            labScore.setText("0");
        }
    }
});

game.pushScene(scene);
game.run();

/*

### 代码改进点解析：

1. **高度同步**：在 `if (nX < -pipeWidth)` 内部，我们首先计算出一个 `randomTopHeight`。关键在于 `bottomPipe.setPosition` 的 Y 轴坐标必须依赖这个随机高度再加上 `pipeGap`。这样，无论管子多高，中间的通道宽度始终是一样的。
2. **UI 纯净化**：`labScore.setColor(0, 0, 0, 0)` 彻底去掉了文字背后的灰色/黑色背景框，让分数看起来直接漂浮在画面上方，更专业。
3. **随机范围控制**：`80 + Math.random() * 270` 保证了管子不会太短（没难度）也不会太长（堵死路）。

**现在水管的高度会随着每一根的刷新而变化了。你还想加上之前的金币系统或者背景自动加速吗？**
*/