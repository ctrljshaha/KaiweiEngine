/*太棒了！根据你提供的开维游戏引擎（Cavy Game Engine）代码演示，我已经为你构建了一个基础但完整的 **Flappy Bird（飞翔的小鸟）** 游戏逻辑。

这个实现包含了**重力模拟**、**点击跳跃**、**障碍物循环移动**以及**碰撞检测**。

### Flappy Bird 完整代码实现
*/

/**
 * 开维游戏引擎 - Flappy Bird 简易版
 */

game.init();
game.setFPS(60); // 提升到60帧让小鸟下落更平滑

var scene = new Scene();
var resBg = game.getResource().getTexture("img/bg.png");
scene.setBg(resBg);

// --- 游戏变量 ---
var gravity = 0.6;      // 重力加速度
var jumpForce = -10;    // 跳跃力度
var birdV = 0;          // 小鸟当前垂直速度
var isGameOver = false;
var score = 0;
var pipeSpeed = 5;      // 水管移动速度

// --- 1. 创建小鸟 (Sprite) ---
var resBird = game.getResource().getTexture("img/logo.png"); // 使用logo暂代小鸟
var bird = new Sprite();
bird.setTexture(resBird);
bird.setSize(40, 40);
bird.setPosition(100, 300);
scene.addNode(bird);

// --- 2. 创建障碍物 (水管) ---
// 为了简化，我们创建一组上下水管
var pipeWidth = 60;
var pipeGap = 160; // 上下水管之间的间隙

var topPipe = new Node();
topPipe.setColor(0, 0.8, 0, 1); // 绿色水管
topPipe.setSize(pipeWidth, 300);
topPipe.setPosition(800, 0);
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0, 0.8, 0, 1);
bottomPipe.setSize(pipeWidth, 400);
bottomPipe.setPosition(800, 300 + pipeGap);
scene.addNode(bottomPipe);

// --- 3. 得分标签 ---
var labScore = new Label();
labScore.setPosition(350, 20);
labScore.setSize(100, 50);
labScore.setFont("font/st.ttf", 30);
labScore.setText("0");
scene.addNode(labScore);

// --- 4. 碰撞检测函数 ---
function checkHit(nodeA, nodeB) {
    var p1 = nodeA.getPosition();
    var s1 = nodeA.getSize();
    var p2 = nodeB.getPosition();
    var s2 = nodeB.getSize();

    return (p1.x < p2.x + s2.x &&
            p1.x + s1.x > p2.x &&
            p1.y < p2.y + s2.y &&
            p1.y + s1.y > p2.y);
}

// --- 5. 游戏逻辑主循环 ---
scene.upDate((time) => {
    if (isGameOver) return;

    // 小鸟物理逻辑
    birdV += gravity;
    var birdPos = bird.getPosition();
    bird.setPosition(birdPos.x, birdPos.y + birdV);

    // 水管移动逻辑
    var tpPos = topPipe.getPosition();
    var bpPos = bottomPipe.getPosition();
    
    var newX = tpPos.x - pipeSpeed;
    
    // 如果水管移出屏幕，重置到右侧并随机高度
    if (newX < -pipeWidth) {
        newX = 800;
        var randomHeight = 50 + Math.random() * 200;
        topPipe.setSize(pipeWidth, randomHeight);
        bottomPipe.setPosition(newX, randomHeight + pipeGap);
        
        score++;
        labScore.setText(score.toString());
    }
    
    topPipe.setPosition(newX, tpPos.y);
    bottomPipe.setPosition(newX, bottomPipe.getPosition().y);

    // 碰撞检测
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || birdPos.y > 600 || birdPos.y < 0) {
        isGameOver = true;
        log("游戏结束！得分：" + score);
        var audio = new Audio();
        audio.playSound("sound/1.wav"); // 播放撞击音效
    }
});

// --- 6. 输入控制 (点击屏幕或按空格跳跃) ---
// 利用 Sprite 的全屏点击或键盘回调
game.setKeyCallBack((key, action) => {
    if (action == 1 && !isGameOver) { // 1 为按下动作
        birdV = jumpForce;
    } else if (isGameOver) {
        // 死亡后按任意键重启
        isGameOver = false;
        score = 0;
        labScore.setText("0");
        bird.setPosition(100, 300);
        birdV = 0;
        topPipe.setPosition(800, 0);
        bottomPipe.setPosition(800, 460);
    }
});

// 运行游戏
game.run();

/*
---

### 核心逻辑说明：

1. **重力与物理 (`birdV += gravity`)**：
* 在每一帧（`upDate`）中，我们给小鸟的垂直速度 `birdV` 增加一个重力值。
* 然后将小鸟的 Y 坐标累加这个速度。这模拟了自然下落的效果。


2. **跳跃机制**：
* 当监听到键盘按下（或你可以添加 `scene.click`）时，直接将速度 `birdV` 设为负数（`jumpForce`）。因为在屏幕坐标系中，向上移动是减小 Y 值。


3. **障碍物循环**：
* 当水管的 X 坐标小于 `-pipeWidth`（完全移出屏幕左侧）时，我们将其重新放回屏幕右侧（`800`）。
* **随机性**：每次重置时，通过 `Math.random()` 改变上水管的高度，下水管根据 `pipeGap`（间隙）自动跟随。


4. **碰撞检测 (`checkHit`)**：
* 这是一个标准的 AABB 矩形碰撞算法。它获取两个物体的坐标和尺寸，判断它们在空间上是否有重叠。



### 建议后续优化步骤：

* **动画效果**：你可以使用 `bird.setRotate(birdV * 2)` 让小鸟根据飞行速度上下俯仰，看起来更生动。
* **资源替换**：将 `img/logo.png` 换成真正的鸟儿序列图。
* **音效**：在 `birdV = jumpForce` 处添加一个“扑棱”翅膀的音效。

**你想让我继续完善这个代码，比如加入“最高分纪录保存”功能，还是加入“小鸟飞行时的翅膀扇动动画”？**

*/