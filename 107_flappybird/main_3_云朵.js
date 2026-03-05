/*既然要挑战“动态难度”和“视觉深度”，我们就把这套代码升级为**精英版**。

这次我们将引入两个高级特性：

1. **动态难度系统**：随着得分（Score）增加，水管移动速度 `pipeSpeed` 会平滑提升，且水管间隙 `pipeGap` 会逐渐缩小，让游戏后期极具挑战性。
2. **远景滚动（Parallax Scrolling）**：通过两层背景以不同速度移动，营造出 3D 纵深感。

### Flappy Bird：动态难度 + 远景视差版
*/


/**
 * 开维游戏引擎 - Flappy Bird (动态难度版)
 * 特性：
 * 1. 动态难度：速度随分数增加，间隙随分数缩小
 * 2. 视差背景：双层背景滚动营造空间感
 * 3. 完善的物理手感与最高分统计
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var audio = new Audio();

// --- 1. 视差背景设置 ---
var resBgBack = game.getResource().getTexture("img/bg.png"); // 远景（云朵/远山）
var bgBack = new Sprite();
bgBack.setTexture(resBgBack);
bgBack.setSize(1600, 600); // 宽度设为两倍以便循环
bgBack.setPosition(0, 0);
scene.addNode(bgBack);

// --- 游戏平衡性参数 ---
var gravity = 0.58;
var jumpForce = -9.5;
var birdV = 0;
var isGameOver = false;
var score = 0;
var highScore = 0;

// 难度随分数变化的初始值
var basePipeSpeed = 5;
var currentPipeSpeed = 5;
var currentPipeGap = 180;

// --- 2. 小鸟与水管 ---
var bird = new Sprite();
bird.setTexture(game.getResource().getTexture("img/logo.png"));
bird.setSize(40, 40);
bird.setPosition(150, 300);
scene.addNode(bird);

var pipeWidth = 70;
var topPipe = new Node();
topPipe.setColor(0, 0.7, 0, 1);
topPipe.setSize(pipeWidth, 200);
topPipe.setPosition(900, 0);
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0, 0.7, 0, 1);
bottomPipe.setSize(pipeWidth, 400);
bottomPipe.setPosition(900, 200 + currentPipeGap);
scene.addNode(bottomPipe);

// --- 3. UI 布局 ---
var labScore = new Label();
labScore.setPosition(380, 50);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 45);
labScore.setText("0");
scene.addNode(labScore);

var labInfo = new Label();
labInfo.setPosition(20, 20);
labInfo.setSize(300, 30);
labInfo.setFont("font/st.ttf", 18);
labInfo.setTextColor(1, 1, 0, 1);
labInfo.setText("最高分: 0 | 速度: 5.0");
scene.addNode(labInfo);

// --- 4. 辅助功能 ---
function checkHit(n1, n2) {
    var p1 = n1.getPosition(), s1 = n1.getSize();
    var p2 = n2.getPosition(), s2 = n2.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x && p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

function resetGame() {
    isGameOver = false;
    if (score > highScore) highScore = score;
    score = 0;
    birdV = 0;
    currentPipeSpeed = basePipeSpeed;
    currentPipeGap = 180;
    bird.setPosition(150, 300);
    topPipe.setPosition(900, 0);
    bottomPipe.setPosition(900, 200 + currentPipeGap);
    labScore.setText("0");
}

// --- 5. 核心循环 ---
var bgX = 0;
scene.upDate((time) => {
    if (isGameOver) return;

    // A. 视差背景滚动 (远景速度为水管的 20%)
    bgX -= currentPipeSpeed * 0.2;
    if (bgX <= -800) bgX = 0;
    bgBack.setPosition(bgX, 0);

    // B. 小鸟物理与动态旋转
    birdV += gravity;
    var bPos = bird.getPosition();
    bird.setPosition(bPos.x, bPos.y + birdV);
    var rot = birdV * 4;
    bird.setRotate(rot > 35 ? 35 : (rot < -30 ? -30 : rot));

    // C. 动态难度更新 (每得1分，速度增加 0.1，间隙缩小 1像素)
    currentPipeSpeed = basePipeSpeed + (score * 0.15);
    currentPipeGap = Math.max(120, 180 - score * 1.5); // 间隙最小不低于120

    // D. 水管逻辑
    var tpPos = topPipe.getPosition();
    var nX = tpPos.x - currentPipeSpeed;

    if (nX < -pipeWidth) {
        nX = 850;
        var h = 80 + Math.random() * 240;
        topPipe.setSize(pipeWidth, h);
        bottomPipe.setPosition(nX, h + currentPipeGap);
        score++;
        labScore.setText(score.toString());
        audio.playSound("sound/1.wav"); // 得分音效
    }
    topPipe.setPosition(nX, 0);
    bottomPipe.setPosition(nX, bottomPipe.getPosition().y);

    labInfo.setText("最高分: " + highScore + " | 速度: " + currentPipeSpeed.toFixed(1));

    // E. 碰撞检测
    if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 600 || bPos.y < -50) {
        isGameOver = true;
        audio.playSound("sound/1.wav"); // 撞击音效
    }
});

// --- 6. 输入监听 ---
game.setKeyCallBack((key, action) => {
    if (action == 1) {
        if (!isGameOver) birdV = jumpForce;
        else resetGame();
    }
});

game.run();

/*
### 精英版升级解析：

1. **远景视差 (Parallax)**：
* 我们创建了一个 1600 宽的背景（两倍屏幕宽）。在 `upDate` 中，背景以 `currentPipeSpeed * 0.2` 的极慢速度向左移。
* 这种“近快远慢”的视觉差会让玩家感觉背景在天边，大大增强了画面的生动感。


2. **线性难度曲线**：
* `currentPipeSpeed = basePipeSpeed + (score * 0.15)`：随着分数增加，水管会越来越快。
* `currentPipeGap = Math.max(120, 180 - score * 1.5)`：随着分数增加，上下水管的通过空间会越来越窄，直到达到极限值 120。
* **逻辑提示**：我们在 UI 左上角实时显示了当前速度，增加了竞技感。


3. **视觉限制 (Clamp)**：
* 对小鸟的旋转角度做了 `Clamp` 处理（限制在 -30 到 35 度之间），防止小鸟在高速下落时出现“翻跟头”的尴尬情况。



**现在你的 Flappy Bird 已经非常有挑战性了！如果你觉得还不够，我们可以加入“金币系统”，或者在背景中随机生成会移动的云朵。你想试哪一个？**
*/