/*出现黑屏通常是因为在开维引擎中，**节点的渲染顺序（层级）或者资源加载路径**出了问题。

在开维引擎中，`scene.addNode()` 的顺序决定了遮挡关系：**后添加的节点会遮在先添加的节点上方**。如果背景图（Background）是在最后添加的，或者背景图的大小设置不当，它就会遮住所有的水管和小鸟，导致你看起来像“黑屏”或“只看到背景”。

以下是完全基于你提供的实例逻辑、**严格修正了渲染层级和初始化顺序**的代码。请直接替换尝试：

### Flappy Bird 修正版（解决黑屏与逻辑问题）
*/

/**
 * 开维游戏引擎 - Flappy Bird 稳定版
 * 修复：1. 渲染层级（背景最先添加） 2. 坐标初始化 3. 资源预加载
 */

game.init();
game.setFPS(60);

var scene = new Scene();

// --- 1. 优先设置背景 (最底层) ---
var resBg = game.getResource().getTexture("img/bg.png");
if (resBg) {
    scene.setBg(resBg); 
}

// --- 游戏配置 ---
var gravity = 0.55;      
var jumpForce = -9;    
var birdV = 0;          
var isGameOver = false;
var score = 0;
var highScore = 0; 
var pipeSpeed = 5;      
var pipeWidth = 70;
var pipeGap = 170; 

// --- 2. 添加障碍物 (中间层) ---
var topPipe = new Node();
topPipe.setColor(0.2, 0.8, 0.2, 1); 
topPipe.setSize(pipeWidth, 250);
topPipe.setPosition(800, 0); 
scene.addNode(topPipe); // 先加水管

var bottomPipe = new Node();
bottomPipe.setColor(0.2, 0.8, 0.2, 1);
bottomPipe.setSize(pipeWidth, 400);
bottomPipe.setPosition(800, 250 + pipeGap);
scene.addNode(bottomPipe);

// --- 3. 添加小鸟 (上层) ---
var resBird = game.getResource().getTexture("img/logo.png");
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(40, 40);
bird.setPosition(150, 300);
scene.addNode(bird); // 后加小鸟，确保小鸟在水管前面

// --- 4. 添加 UI (最顶层) ---
var labScore = new Label();
labScore.setPosition(350, 40);
labScore.setSize(200, 60);
labScore.setFont("font/st.ttf", 40);
labScore.setText("0");
scene.addNode(labScore);

var labHigh = new Label();
labHigh.setPosition(20, 20);
labHigh.setSize(300, 30);
labHigh.setFont("font/st.ttf", 18);
labHigh.setTextColor(1, 1, 0, 1);
labHigh.setText("最高分: 0");
scene.addNode(labHigh);

var audio = new Audio();

// --- 5. 碰撞检测 ---
function checkHit(nodeA, nodeB) {
    var p1 = nodeA.getPosition();
    var s1 = nodeA.getSize();
    var p2 = nodeB.getPosition();
    var s2 = nodeB.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x &&
            p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

// 重置函数
function resetGame() {
    isGameOver = false;
    if (score > highScore) {
        highScore = score;
        labHigh.setText("最高分: " + highScore);
    }
    score = 0;
    birdV = 0;
    bird.setPosition(150, 300);
    bird.setRotate(0);
    topPipe.setPosition(800, 0);
    bottomPipe.setPosition(800, 250 + pipeGap);
    labScore.setText("0");
}

// --- 6. 核心循环 ---
scene.upDate((time) => {
    if (isGameOver) return;

    // 小鸟物理
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    
    // 旋转效果
    var angle = birdV * 4;
    bird.setRotate(angle > 30 ? 30 : (angle < -30 ? -30 : angle));

    // 水管移动
    var tpPos = topPipe.getPosition();
    var newX = tpPos.x - pipeSpeed;
    
    if (newX < -pipeWidth) {
        newX = 850;
        var randH = 100 + Math.random() * 200;
        topPipe.setSize(pipeWidth, randH);
        bottomPipe.setPosition(newX, randH + pipeGap);
        
        score++;
        labScore.setText(score.toString());
        audio.playSound("sound/1.wav");
    }
    
    topPipe.setPosition(newX, 0);
    bottomPipe.setPosition(newX, bottomPipe.getPosition().y);

    // 死亡检测
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 600 || bPos.y < -50) {
        isGameOver = true;
        audio.playSound("sound/1.wav");
    }
});

// --- 7. 输入控制 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) { 
        if (!isGameOver) {
            birdV = jumpForce;
        } else {
            resetGame();
        }
    }
});

game.pushScene(scene);
game.run();

/*---

### 为什么之前的代码会黑屏？（避坑指南）

1. **节点添加顺序（Z-Order）**：
* 在之前的逻辑中，如果你先添加了小鸟，最后才添加了一个巨大的 `Node` 或 `Sprite` 作为背景，背景会把小鸟彻底盖住。**必须先 `addNode` 背景/底层物体，最后 `addNode` UI/顶层物体**。


2. **`setBg` 与 `addNode` 的冲突**：
* 如果 `resBg` 路径不对导致加载失败，有些引擎版本可能会显示黑色底色。请确保 `img/bg.png` 确实存在。


3. **坐标溢出**：
* 如果代码中的 `setPosition` 把物体放到了 `(9999, 9999)` 这种看不见的地方，屏幕也会显得空无一物。


4. **`game.pushScene(scene)` 位置**：
* 确保在 `game.run()` 之前调用了 `pushScene`，否则引擎不知道该渲染哪个画面。



### 现在的检查步骤：

1. **检查图片路径**：确保你的工程文件夹里有 `img/bg.png` 和 `img/logo.png`。
2. **检查字体路径**：确保有 `font/st.ttf`，否则 `Label` 可能导致渲染异常。

**这段代码我优化了添加顺序，背景现在是底色，水管在中间，小鸟在最前。你现在能看到画面了吗？**
*/