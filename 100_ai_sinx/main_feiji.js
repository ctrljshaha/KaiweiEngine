// 打飞机小游戏 - 基于开维游戏引擎

// 初始化游戏引擎
game.init(); // 默认窗口大小800*600
game.setFPS(30); // 设置帧率

// 游戏主窗口设置图标和标题
var window = game.getWindow();
var texture = game.getResource().getTexture("img/logo.png");
window.setIcon(texture);
window.setTitle("打飞机小游戏 - 开维游戏引擎");

// 创建游戏场景
var scene = new Scene();
game.pushScene(scene);

// 背景音乐（可选，确保文件存在）
var audio = new Audio();
audio.playMusic("sound/bg.ogg"); // 播放背景音乐
audio.setMusicVolume(0.5);       // 设置音量

// ==================== 游戏全局变量 ====================
var player;                // 玩家飞机
var enemies = [];          // 敌机数组
var bullets = [];          // 子弹数组
var score = 0;             // 得分
var scoreLabel;            // 得分显示标签
var gameOver = false;      // 游戏结束标志
var gameOverLabel;         // 游戏结束标签

// 按键状态记录
var keyState = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
};

// 子弹冷却时间（帧数）
var bulletCooldown = 0;
const BULLET_COOLDOWN_MAX = 10; // 每10帧可发射一颗子弹

// 敌机生成计时器
var enemySpawnTimer = 0;
const ENEMY_SPAWN_INTERVAL = 30; // 每30帧生成一个敌机

// ==================== 初始化游戏 ====================
function initGame() {
    // 设置背景色（深蓝色，模拟夜空）
    var bg = new Node();
    bg.setSize(800, 600);
    bg.setPosition(0, 0);
    bg.setColor(0.1, 0.1, 0.3, 1.0);
    scene.addNode(bg);

    // 创建玩家飞机（使用绿色方块代替，可用纹理替换）
    player = new Node();
    player.setSize(30, 30);
    player.setColor(0, 1, 0, 1); // 绿色
    player.setPosition(400, 500); // 底部居中
    scene.addNode(player);

    // 创建得分标签
    scoreLabel = new Label();
    scoreLabel.setPosition(20, 20);
    scoreLabel.setSize(150, 30);
    scoreLabel.setFont("font/st.ttf", 20);
    scoreLabel.setTextColor(1, 1, 1, 1);
    scoreLabel.setColor(0, 0, 0, 0.5);
    scoreLabel.setText("得分: 0");
    scene.addNode(scoreLabel);

    // 创建游戏结束标签（初始隐藏）
    gameOverLabel = new Label();
    gameOverLabel.setPosition(250, 250);
    gameOverLabel.setSize(300, 100);
    gameOverLabel.setFont("font/st.ttf", 40);
    gameOverLabel.setTextColor(1, 0, 0, 1);
    gameOverLabel.setColor(0, 0, 0, 0.8);
    gameOverLabel.setText("GAME OVER");
    gameOverLabel.setHide(true);
    scene.addNode(gameOverLabel);
}

// ==================== 游戏更新循环 ====================
scene.upDate((time) => {
    if (gameOver) {
        return; // 游戏结束，停止更新
    }

    // 1. 根据按键移动玩家
    var playerSpeed = 5;
    var pos = player.getPosition();
    if (keyState.left && pos.x > 0) {
        player.setPosition(pos.x - playerSpeed, pos.y);
    }
    if (keyState.right && pos.x < 800 - 30) {
        player.setPosition(pos.x + playerSpeed, pos.y);
    }
    if (keyState.up && pos.y > 0) {
        player.setPosition(pos.x, pos.y - playerSpeed);
    }
    if (keyState.down && pos.y < 600 - 30) {
        player.setPosition(pos.x, pos.y + playerSpeed);
    }

    // 2. 发射子弹（空格键，带冷却）
    if (keyState.space && bulletCooldown <= 0) {
        // 创建子弹（黄色小方块）
        var bullet = new Node();
        bullet.setSize(5, 10);
        bullet.setColor(1, 1, 0, 1); // 黄色
        bullet.setPosition(pos.x + 12, pos.y - 5); // 从玩家中心偏上发射
        scene.addNode(bullet);
        bullets.push(bullet);
        bulletCooldown = BULLET_COOLDOWN_MAX;
        audio.playSound("sound/1.wav"); // 发射音效
    }
    if (bulletCooldown > 0) {
        bulletCooldown--;
    }

    // 3. 移动子弹并移除超出屏幕的
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        var bulletPos = bullet.getPosition();
        bullet.setPosition(bulletPos.x, bulletPos.y - 8); // 向上移动
        if (bulletPos.y < 0) { // 超出屏幕上边界
            scene.removeNode(bullet);
            bullets.splice(i, 1);
        }
    }

    // 4. 生成敌机
    enemySpawnTimer--;
    if (enemySpawnTimer <= 0) {
        var enemyX = Math.random() * (800 - 30);
        var enemy = new Node();
        enemy.setSize(30, 30);
        enemy.setColor(1, 0, 0, 1); // 红色
        enemy.setPosition(enemyX, 0);
        scene.addNode(enemy);
        enemies.push(enemy);
        enemySpawnTimer = ENEMY_SPAWN_INTERVAL + Math.floor(Math.random() * 20); // 随机间隔
    }

    // 5. 移动敌机并移除超出屏幕的
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        var enemyPos = enemy.getPosition();
        enemy.setPosition(enemyPos.x, enemyPos.y + 3); // 向下移动
        if (enemyPos.y > 600) { // 超出屏幕下边界
            scene.removeNode(enemy);
            enemies.splice(i, 1);
        }
    }

    // 6. 碰撞检测（子弹 vs 敌机）
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        var bulletPos = bullet.getPosition();
        var bulletRect = {
            x: bulletPos.x,
            y: bulletPos.y,
            width: 5,
            height: 10
        };

        for (var j = enemies.length - 1; j >= 0; j--) {
            var enemy = enemies[j];
            var enemyPos = enemy.getPosition();
            var enemyRect = {
                x: enemyPos.x,
                y: enemyPos.y,
                width: 30,
                height: 30
            };

            // 矩形碰撞检测
            if (rectCollide(bulletRect, enemyRect)) {
                // 击中敌机
                scene.removeNode(bullet);
                bullets.splice(i, 1);
                scene.removeNode(enemy);
                enemies.splice(j, 1);
                score += 10;
                scoreLabel.setText("得分: " + score);
                audio.playSound("sound/1.wav"); // 击中音效
                break; // 子弹消失，跳出内层循环
            }
        }
    }

    // 7. 碰撞检测（玩家 vs 敌机）
    var playerPos = player.getPosition();
    var playerRect = {
        x: playerPos.x,
        y: playerPos.y,
        width: 30,
        height: 30
    };
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var enemyPos = enemy.getPosition();
        var enemyRect = {
            x: enemyPos.x,
            y: enemyPos.y,
            width: 30,
            height: 30
        };
        if (rectCollide(playerRect, enemyRect)) {
            // 游戏结束
            gameOver = true;
            gameOverLabel.setHide(false);
            audio.stopMusic(); // 停止背景音乐
            audio.playSound("sound/1.wav"); // 播放结束音效
            break;
        }
    }
});

// 矩形碰撞检测辅助函数
function rectCollide(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// ==================== 键盘回调 ====================
game.setKeyCallBack((key, action) => {
    // action: 1 按下, 0 释放
    var pressed = (action == 1);

    // 方向键和WASD
    if (key == 37 || key == 65) { // LEFT 或 A
        keyState.left = pressed;
    } else if (key == 39 || key == 68) { // RIGHT 或 D
        keyState.right = pressed;
    } else if (key == 38 || key == 87) { // UP 或 W
        keyState.up = pressed;
    } else if (key == 40 || key == 83) { // DOWN 或 S
        keyState.down = pressed;
    } else if (key == 32) { // 空格键
        keyState.space = pressed;
    }

    // 调试输出（可选）
    // log("key: " + key + " action: " + action);
});

// ==================== 启动游戏 ====================
initGame();

// 运行游戏
game.run();