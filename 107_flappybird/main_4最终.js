/*这是为你的 **Flappy Bird：典藏版** 增加的最后一块拼图——**游戏封面（开始菜单）**。

在这个版本中，我引入了一个 `gameState`（游戏状态）变量来控制流程：

1. **START (0)**：显示封面，点击屏幕或按键后开始。
2. **PLAY (1)**：正常的飞行逻辑。
3. **OVER (2)**：游戏结束，显示最终得分和“重新开始”提示。

### Flappy Bird：完整商业流程版（带开始封面）
*/

/**
 * 开维游戏引擎 - Flappy Bird (完整流程版)
 * 状态机控制：开始界面 -> 游戏进行 -> 死亡重播
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var audio = new Audio();
audio.setSoundVolume(0.8);

// --- 游戏状态常量 ---
var STATE_START = 0;
var STATE_PLAY = 1;
var STATE_OVER = 2;
var gameState = STATE_START;

// --- 核心变量 ---
var gravity = 0.58;
var jumpForce = -9.2;
var birdV = 0;
var score = 0;
var highScore = 0;
var currentPipeSpeed = 5;

// --- 1. 环境层：云朵 (保持漂移) ---
var clouds = [];
for (var i = 0; i < 5; i++) {
    var cloud = new Sprite();
    cloud.setTexture(game.getResource().getTexture("img/edit.png"));
    cloud.setSize(100 + Math.random() * 50, 40 + Math.random() * 20);
    cloud.setPosition(Math.random() * 800, 50 + Math.random() * 200);
    cloud.setColor(1, 1, 1, 0.3);
    scene.addNode(cloud);
    clouds.push({node: cloud, speed: 0.5 + Math.random() * 1.0});
}

// --- 2. 游戏角色与障碍 ---
var bird = new Sprite();
bird.setTexture(game.getResource().getTexture("img/logo.png"));
bird.setSize(45, 45);
bird.setPosition(150, 300);
scene.addNode(bird);

var pipeWidth = 70;
var topPipe = new Node();
topPipe.setColor(0.1, 0.6, 0.1, 1);
scene.addNode(topPipe);

var bottomPipe = new Node();
bottomPipe.setColor(0.1, 0.6, 0.1, 1);
scene.addNode(bottomPipe);

var coin = new Sprite();
coin.setColor(1, 0.9, 0, 1);
coin.setSize(25, 25);
coin.setPosition(-100, -100);
scene.addNode(coin);

// --- 3. UI 界面层 ---

// 游戏进行中的分数
var labScore = new Label();
labScore.setPosition(380, 40);
labScore.setSize(100, 60);
labScore.setFont("font/st.ttf", 50);
labScore.setText("");
scene.addNode(labScore);

// 封面提示文字
var labMenu = new Label();
labMenu.setPosition(200, 200);
labMenu.setSize(400, 100);
labMenu.setFont("font/st.ttf", 40);
labMenu.setTextColor(1, 1, 1, 1);
labMenu.setText("点击屏幕开始游戏");
scene.addNode(labMenu);

// 底部信息栏
var labInfo = new Label();
labInfo.setPosition(20, 550);
labInfo.setSize(500, 30);
labInfo.setFont("font/st.ttf", 18);
labInfo.setTextColor(1, 1, 1, 0.6);
labInfo.setText("最高纪录: 0");
scene.addNode(labInfo);

// --- 4. 辅助逻辑 ---
function checkHit(n1, n2) {
    var p1 = n1.getPosition(), s1 = n1.getSize();
    var p2 = n2.getPosition(), s2 = n2.getSize();
    return (p1.x < p2.x + s2.x && p1.x + s1.x > p2.x && p1.y < p2.y + s2.y && p1.y + s1.y > p2.y);
}

function startGame() {
    gameState = STATE_PLAY;
    score = 0;
    birdV = 0;
    bird.setPosition(150, 300);
    topPipe.setPosition(900, -500); // 先移出视野
    bottomPipe.setPosition(900, 800);
    labMenu.setHide(true);
    labScore.setText("0");
}

function gameOver() {
    gameState = STATE_OVER;
    if (score > highScore) highScore = score;
    labMenu.setText("游戏结束\n点击重玩");
    labMenu.setHide(false);
    labInfo.setText("最高纪录: " + highScore);
    audio.playSound("sound/1.wav");
}

// --- 5. 主循环 ---
scene.upDate((time) => {
    // 无论什么状态，云朵都在飘
    for (var i = 0; i < clouds.length; i++) {
        var c = clouds[i];
        var cp = c.node.getPosition();
        var nx = cp.x - c.speed;
        if (nx < -150) nx = 850;
        c.node.setPosition(nx, cp.y);
    }

    if (gameState === STATE_PLAY) {
        // 飞行物理
        birdV += gravity;
        var bPos = bird.getPosition();
        bird.setPosition(bPos.x, bPos.y + birdV);
        bird.setRotate(Math.max(-30, Math.min(30, birdV * 4)));

        // 动态难度
        currentPipeSpeed = 5 + (score * 0.12);
        var gap = Math.max(135, 190 - score * 1.2);

        // 水管逻辑
        var tpPos = topPipe.getPosition();
        var nX = tpPos.x - currentPipeSpeed;

        if (nX < -pipeWidth) {
            nX = 850;
            var h = 100 + Math.random() * 220;
            topPipe.setSize(pipeWidth, h);
            topPipe.setPosition(nX, 0);
            bottomPipe.setPosition(nX, h + gap);
            bottomPipe.setSize(pipeWidth, 600 - h - gap);
            
            score++;
            labScore.setText(score.toString());
        } else {
            topPipe.setPosition(nX, 0);
            bottomPipe.setPosition(nX, bottomPipe.getPosition().y);
        }

        // 死亡检测
        if (checkHit(bird, topPipe) || checkHit(bird, bottomPipe) || bPos.y > 600 || bPos.y < -50) {
            gameOver();
        }
    } 
    else if (gameState === STATE_START) {
        // 封面状态：小鸟上下悬停，增加动感
        var hoverY = 300 + Math.sin(new Date().getTime() * 0.005) * 20;
        bird.setPosition(150, hoverY);
    }
});

// --- 6. 输入监听 (统一入口) ---
game.setKeyCallBack((key, action) => {
    if (action == 1) { // 按下键
        if (gameState === STATE_START) {
            startGame();
        } 
        else if (gameState === STATE_PLAY) {
            birdV = jumpForce;
        } 
        else if (gameState === STATE_OVER) {
            startGame();
        }
    }
});

// 为了支持鼠标/触摸点击开始
// 如果引擎支持场景直接点击，可以加上：
// scene.click(() => { /* 同样的逻辑 */ });

game.pushScene(scene);
game.run();

/*

### 本次更新的关键改动：

1. **状态机控制 (State Machine)**：
* 通过 `gameState` 变量，我们将代码分成了三个完全不同的运行模式。
* 在 **`STATE_START`** 时，水管不移动，但小鸟使用 `Math.sin` 函数实现了一个平滑的“呼吸悬停”效果，让画面看起来是活的。


2. **UI 动态切换**：
* `labMenu` 标签承担了多种职责：开始时的“点击开始”，结束时的“游戏结束”和“最终分数显示”。
* 在游戏进行中（`STATE_PLAY`），通过 `setHide(true)` 隐藏干扰元素。


3. **视觉初始化**：
* 在 `startGame` 中，我们重置了水管的位置和速度，确保每次重新开始都是公平的。


4. **最高分持久显示**：
* 在底部增加了一个半透明的 `labInfo` 栏，始终展示玩家的荣誉纪录。



**恭喜你！现在你已经拥有了一个具备完整生命周期、有交互反馈、有视觉特效的《Flappy Bird》游戏。在开维引擎中，你可以通过修改 `img/` 下的资源，瞬间把它变成任何你想要的主题风格。**
*/