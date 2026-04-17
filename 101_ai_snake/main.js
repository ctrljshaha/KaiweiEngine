// 贪吃蛇小游戏 - 基于开维游戏引擎

// AI生成代码，合并了AI手柄代码

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏

if (system =="WINDOWS" || system =="WEB")
{
    game.init() // windows默认窗口大小为800*600;web网页默认全屏
    window = game.getWindow(); // 获取资源对象
    w = window.getWidth();  // 屏幕宽带
    h = window.getHeight(); // 屏幕高度
}
else if(system =="WEIXIN")
{
    game.initSize(canvas.width,canvas.height); // 微信窗口
    window = game.getWindow(); // 获取资源对象
    w = canvas.width; // 微信窗口宽度
    h = canvas.height;// 微信窗口高度
}

// 判断横屏还是竖屏
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(30); // 设置帧率
 
// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("img/logo.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎 - 贪吃蛇"); // 设置主游戏窗口标题

// 创建游戏场景
var scene = new Scene();
game.pushScene(scene);

// 可选：设置背景色（深灰色）
var bg = new Node();
bg.setSize(w, h);
bg.setPosition(0, 0);
bg.setColor(0.2, 0.2, 0.2, 1.0);
scene.addNode(bg);

// ==================== 游戏全局变量 ====================
var snake = [];              // 蛇身节点数组
var food;                    // 食物节点
var direction = "right";     // 当前移动方向
var nextDirection = "right"; // 下一次移动方向（用于防止一帧内多次改变）
var gameOver = false;        // 游戏结束标志
var score = 0;               // 得分
var scoreLabel;              // 得分标签
var gameOverLabel;           // 游戏结束标签

// 移动参数
var gridSize = 20;           // 格子大小（像素）
var cols = w/20;               // 列数 (800/20)
var rows = h/20;               // 行数 (600/20)
var moveInterval = 200;      // 移动间隔（毫秒）
var lastMoveTime = 0;        // 上次移动时间戳

// ==================== 初始化游戏 ====================
function initGame() {
    // 清空现有蛇节点（如果有）
    for (var i = 0; i < snake.length; i++) {
        scene.removeNode(snake[i]); // 假设有removeNode，若无可用setHide(true)
    }
    snake = [];
    if (food) scene.removeNode(food);

    // 创建初始蛇（长度为3）
    var startX = 10 * gridSize; // 10列
    var startY = 15 * gridSize; // 15行
    for (var i = 0; i < 3; i++) {
        var segment = new Node();
        segment.setSize(gridSize, gridSize);
        segment.setColor(0, 1, 0, 1); // 绿色
        segment.setPosition(startX - i * gridSize, startY);
        scene.addNode(segment);
        snake.push(segment);
    }
    // 头部颜色稍亮
    snake[0].setColor(0.5, 1, 0.5, 1);

    // 创建食物
    food = new Node();
    food.setSize(gridSize, gridSize);
    food.setColor(1, 0, 0, 1); // 红色
    generateFood();
    scene.addNode(food);

    // 得分标签
    if (!scoreLabel) {
        scoreLabel = new Label();
        scoreLabel.setPosition(20, 40);
        scoreLabel.setSize(100, 30);
        scoreLabel.setFont("font/st.ttf", 20);
        scoreLabel.setTextColor(1, 1, 1, 1);
        scoreLabel.setColor(0, 0, 0, 0.5);
        scene.addNode(scoreLabel);
    }
    score = 0;
    scoreLabel.setText("得分: 0");

    // 游戏结束标签
    if (!gameOverLabel) {
        gameOverLabel = new Label();
        gameOverLabel.setPosition(w/2-70, h/2);
        gameOverLabel.setSize(170, 50);
        gameOverLabel.setFont("font/st.ttf", 30);
        gameOverLabel.setTextColor(1, 0, 0, 1);
        gameOverLabel.setColor(0, 0, 0, 0.8);
        gameOverLabel.setText("GAME OVER");
        gameOverLabel.setHide(true);
        scene.addNode(gameOverLabel);
    } else {
        gameOverLabel.setHide(true);
    }

    direction = "right";
    nextDirection = "right";
    gameOver = false;
    lastMoveTime = new Date().getTime();
}

// 生成食物（确保不在蛇身上）
function generateFood() {
    var valid = false;
    var maxAttempts = 1000;
    while (!valid && maxAttempts-- > 0) {
        var fx = Math.floor(Math.random() * cols) * gridSize;
        var fy = Math.floor(Math.random() * rows) * gridSize;
        valid = true;
        for (var i = 0; i < snake.length; i++) {
            var pos = snake[i].getPosition();
            if (pos.x === fx && pos.y === fy) {
                valid = false;
                break;
            }
        }
        if (valid) {
            food.setPosition(fx, fy);
            return;
        }
    }
    // 如果找不到合适位置，游戏胜利（简单处理：直接随机）
    food.setPosition(
        Math.floor(Math.random() * cols) * gridSize,
        Math.floor(Math.random() * rows) * gridSize
    );
}

// ==================== 游戏更新循环 ====================
scene.upDate((time) => {
    if (gameOver) return;

    // 时间控制移动
    var now = new Date().getTime();
    if (now - lastMoveTime >= moveInterval) {
        lastMoveTime = now;
        // 更新方向（不能反向）
        if ((direction === "right" && nextDirection !== "left") ||
            (direction === "left" && nextDirection !== "right") ||
            (direction === "up" && nextDirection !== "down") ||
            (direction === "down" && nextDirection !== "up")) {
            direction = nextDirection;
        }

        // 获取当前头部位置
        var head = snake[0];
        var headPos = head.getPosition();
        var newX = headPos.x;
        var newY = headPos.y;

        // 计算新头部位置
        switch (direction) {
            case "right": newX += gridSize; break;
            case "left":  newX -= gridSize; break;
            case "up":    newY -= gridSize; break;
            case "down":  newY += gridSize; break;
        }

        // 边界碰撞检测（超出屏幕即游戏结束）
        if (newX < 0 || newX >= w || newY < 0 || newY >= h) {
            gameOver = true;
            gameOverLabel.setHide(false);
            return;
        }

        // 检查是否吃到食物
        var foodPos = food.getPosition();
        var eatFood = (newX === foodPos.x && newY === foodPos.y);

        // 保存所有旧位置（用于身体移动）
        var oldPositions = [];
        for (var i = 0; i < snake.length; i++) {
            var pos = snake[i].getPosition();
            oldPositions.push({ x: pos.x, y: pos.y });
        }

        // 移动身体：从尾部开始向前一节移动到前一节的位置
        for (var i = snake.length - 1; i > 0; i--) {
            snake[i].setPosition(oldPositions[i-1].x, oldPositions[i-1].y);
        }

        // 移动头部到新位置
        head.setPosition(newX, newY);

        // 如果吃到食物
        if (eatFood) {
            score += 10;
            scoreLabel.setText("得分: " + score);

            // 在尾部添加新的一节（位置为原来尾部的旧位置）
            var newSegment = new Node();
            newSegment.setSize(gridSize, gridSize);
            newSegment.setColor(0, 1, 0, 1); // 绿色
            newSegment.setPosition(oldPositions[oldPositions.length-1].x, oldPositions[oldPositions.length-1].y);
            scene.addNode(newSegment);
            snake.push(newSegment);

            // 重新生成食物
            generateFood();

            // 可选：加快游戏速度（但这里保持间隔不变）
        }

        // 检查自身碰撞（头部是否碰到身体）
        var headPosNow = head.getPosition();
        for (var i = 1; i < snake.length; i++) {
            var bodyPos = snake[i].getPosition();
            if (headPosNow.x === bodyPos.x && headPosNow.y === bodyPos.y) {
                gameOver = true;
                gameOverLabel.setHide(false);
                break;
            }
        }
    }
});

// ==================== 键盘回调 ====================
// 复用原代码中的 GlobalVariable 类
class GlobalVariable {
    static KEY_W = 87;
    static KEY_S = 83;
    static KEY_A = 65;
    static KEY_D = 68;
    static KEY_BOTTOM = 40;
    static KEY_UP = 38;
    static KEY_LEFT = 37;
    static KEY_RIGHT = 39;
    static KEY_R = 82; // 重启键
}

game.setKeyCallBack((key, action) => {
    if (action !== 1) return; // 只处理按下事件

    // 方向控制
    if (key == GlobalVariable.KEY_UP || key == GlobalVariable.KEY_W) {
        nextDirection = "up";
    } else if (key == GlobalVariable.KEY_BOTTOM || key == GlobalVariable.KEY_S) {
        nextDirection = "down";
    } else if (key == GlobalVariable.KEY_LEFT || key == GlobalVariable.KEY_A) {
        nextDirection = "left";
    } else if (key == GlobalVariable.KEY_RIGHT || key == GlobalVariable.KEY_D) {
        nextDirection = "right";
    } else if (key == GlobalVariable.KEY_R) {
        // 重启游戏
        initGame();
    }

    logic(nextDirection);
    
    // 调试输出
    // log("key: " + key + " action: " + action);
});


// ==================== 手柄添加 ====================
var res = game.getResource();
var texUp    = res.getTexture("img/up.png");
var texDown  = res.getTexture("img/down.png");
var texLeft  = res.getTexture("img/left.png");
var texRight = res.getTexture("img/right.png");

// 手柄布局参数
// ----------------------------------------------------------------------------------------------
var sprW = 40;  
var sprH = 40;  
var gap  = 1;   
var startX = (w > h) ? 30 : (w - sprW * 3 - gap * 2) / 2;
var startY = h - (sprH * 3 + gap * 2) - 80;    

// 核心事件逻辑（在此处统一处理显示和业务）
// ----------------------------------------------------------------------------------------------
function logic(dir) {

    //log("逻辑触发 -> " + dir);
    nextDirection = dir;
}

// ----------------------------------------------------------------------------------------------
// 【四个独立精灵按钮】
// ----------------------------------------------------------------------------------------------
var sprUp = new Sprite();
sprUp.setTexture(texUp);
sprUp.setSize(sprW, sprH);
sprUp.setPosition(startX + sprW + gap, startY);
sprUp.click(() => { logic("up"); });
scene.addNode(sprUp);

var sprDown = new Sprite();
sprDown.setTexture(texDown);
sprDown.setSize(sprW, sprH);
sprDown.setPosition(startX + sprW + gap, startY + (sprH + gap) * 2);
sprDown.click(() => { logic("down"); });
scene.addNode(sprDown);

var sprLeft = new Sprite();
sprLeft.setTexture(texLeft);
sprLeft.setSize(sprW, sprH);
sprLeft.setPosition(startX, startY + sprH + gap);
sprLeft.click(() => { logic("left"); });
scene.addNode(sprLeft);

var sprRight = new Sprite();
sprRight.setTexture(texRight);
sprRight.setSize(sprW, sprH);
sprRight.setPosition(startX + (sprW + gap) * 2, startY + sprH + gap);
sprRight.click(() => { logic("right"); });
scene.addNode(sprRight);


// ==================== 启动游戏 ====================
initGame();

// 运行游戏
game.run();