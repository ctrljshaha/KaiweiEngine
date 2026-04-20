// ============================================================
// 飞机大战 —— 基于开维游戏引擎
// ============================================================

// 初始化游戏引擎
game.init(); // 默认窗口 800*600
game.setFPS(60);

// 主窗口设置
var window = game.getWindow();
window.setTitle("飞机大战");

// ─── 游戏常量 ─────────────────────────────────────────────────
var SCREEN_W    = 800;
var SCREEN_H    = 600;
var PLAYER_W    = 48;
var PLAYER_H    = 48;
var BULLET_W    = 6;
var BULLET_H    = 16;
var ENEMY_W     = 40;
var ENEMY_H     = 40;
var BOMB_W      = 36;
var BOMB_H      = 36;

var PLAYER_SPEED   = 6;    // 玩家移动速度（像素/帧）
var BULLET_SPEED   = 12;   // 子弹速度
var ENEMY_SPEED    = 2;    // 敌机基础速度
var SHOOT_INTERVAL = 15;   // 玩家射击间隔（帧）
var ENEMY_INTERVAL = 60;   // 敌机生成间隔（帧）
var MAX_BULLETS    = 30;   // 子弹池大小
var MAX_ENEMIES    = 20;   // 敌机池大小
var MAX_BOMBS      = 15;   // 爆炸池大小

// ─── 游戏状态 ─────────────────────────────────────────────────
var score        = 0;
var bestScore    = 0;
var life         = 3;       // 玩家生命值
var level        = 1;       // 当前关卡
var frameCount   = 0;
var gameOver     = false;
var gamePause    = false;
var shootTimer   = 0;
var enemyTimer   = 0;
var invincible   = 0;       // 无敌帧数（被击中后短暂无敌）

// 玩家状态
var player = { x: 376, y: 500, w: PLAYER_W, h: PLAYER_H, alive: true };

// 按键状态
var keys = { up:false, down:false, left:false, right:false, space:false };

// ─── 场景 ─────────────────────────────────────────────────────
var resBg = game.getResource().getTexture("img/bg.png");
var scene = new Scene();
scene.setBg(resBg);
game.pushScene(scene);

// ─── 音效 ─────────────────────────────────────────────────────
var audio = new Audio();
audio.playMusic("sound/bg.ogg");
audio.setMusicVolume(0.5);

// ─── 背景滚动层（两张背景上下拼接，循环滚动） ─────────────────
var nodeBg1 = new Node();
nodeBg1.setPosition(0, 0);
nodeBg1.setSize(SCREEN_W, SCREEN_H);
nodeBg1.setColor(0.05, 0.05, 0.15, 1);
scene.addNode(nodeBg1);

var nodeBg2 = new Node();
nodeBg2.setPosition(0, -SCREEN_H);
nodeBg2.setSize(SCREEN_W, SCREEN_H);
nodeBg2.setColor(0.03, 0.03, 0.12, 1);
scene.addNode(nodeBg2);

var bgY1 = 0;
var bgY2 = -SCREEN_H;

// 星星装饰（静态小点，模拟星空）
for (var s = 0; s < 60; s++) {
    var star = new Node();
    var sx = Math.floor(Math.random() * SCREEN_W);
    var sy = Math.floor(Math.random() * SCREEN_H);
    var ss = Math.random() > 0.7 ? 3 : 2;
    star.setPosition(sx, sy);
    star.setSize(ss, ss);
    var brightness = 0.5 + Math.random() * 0.5;
    star.setColor(brightness, brightness, brightness, 0.8);
    scene.addNode(star);
}

// ─── 玩家飞机节点 ─────────────────────────────────────────────
var resPlayer = game.getResource().getTexture("img/button.png"); // 用现有资源替代
var nodePlayer = new Node();
nodePlayer.setPosition(player.x, player.y);
nodePlayer.setSize(PLAYER_W, PLAYER_H);
nodePlayer.setColor(0.3, 0.7, 1.0, 1);
scene.addNode(nodePlayer);

// 玩家飞机机头装饰
var nodePlayerHead = new Node();
nodePlayerHead.setPosition(player.x + 16, player.y - 12);
nodePlayerHead.setSize(16, 16);
nodePlayerHead.setColor(0.6, 0.9, 1.0, 1);
scene.addNode(nodePlayerHead);

// ─── 子弹对象池 ───────────────────────────────────────────────
var bullets = [];
for (var i = 0; i < MAX_BULLETS; i++) {
    var b = new Node();
    b.setSize(BULLET_W, BULLET_H);
    b.setColor(1.0, 1.0, 0.3, 1);
    b.setHide(true);
    scene.addNode(b);
    bullets.push({ node: b, active: false, x: 0, y: 0 });
}

// ─── 敌机对象池 ───────────────────────────────────────────────
var enemies = [];
for (var i = 0; i < MAX_ENEMIES; i++) {
    var e = new Node();
    e.setSize(ENEMY_W, ENEMY_H);
    e.setColor(1.0, 0.3, 0.2, 1);
    e.setHide(true);
    scene.addNode(e);

    // 敌机装饰（机翼）
    var ew = new Node();
    ew.setSize(ENEMY_W + 16, 10);
    ew.setColor(0.8, 0.2, 0.1, 0.8);
    ew.setHide(true);
    scene.addNode(ew);

    enemies.push({
        node: e, wing: ew,
        active: false, x: 0, y: 0,
        hp: 1, speedY: ENEMY_SPEED, speedX: 0
    });
}

// ─── 爆炸效果对象池 ───────────────────────────────────────────
var bombs = [];
for (var i = 0; i < MAX_BOMBS; i++) {
    var bm = new Node();
    bm.setSize(BOMB_W, BOMB_H);
    bm.setColor(1.0, 0.6, 0.1, 1);
    bm.setHide(true);
    scene.addNode(bm);

    var bm2 = new Node(); // 爆炸内圈
    bm2.setSize(BOMB_W / 2, BOMB_H / 2);
    bm2.setColor(1.0, 1.0, 0.5, 1);
    bm2.setHide(true);
    scene.addNode(bm2);

    bombs.push({ node: bm, inner: bm2, active: false, x: 0, y: 0, life: 0 });
}

// ─── UI：顶部信息栏 ───────────────────────────────────────────
var labScore = new Label();
labScore.setPosition(10, 10);
labScore.setSize(250, 35);
labScore.setFont("font/st.ttf", 18);
labScore.setColor(0, 0, 0, 0);
labScore.setTextColor(0, 1, 0, 1);
labScore.setText("分数：0");
scene.addNode(labScore);

var labBest = new Label();
labBest.setPosition(10, 40);
labBest.setSize(250, 30);
labBest.setFont("font/st.ttf", 14);
labBest.setColor(0, 0, 0, 0);
labBest.setTextColor(0, 1, 0, 1);
labBest.setText("最高：0");
scene.addNode(labBest);

var labLevel = new Label();
labLevel.setPosition(340, 10);
labLevel.setSize(120, 35);
labLevel.setFont("font/st.ttf", 18);
labLevel.setColor(0, 0, 0, 0);
labLevel.setTextColor(0, 1, 0, 1);
labLevel.setText("关卡：1");
scene.addNode(labLevel);

// 生命值显示（进度条）
var resLoad = game.getResource().getTexture("img/load.png");
var progLife = new ProgressBar();
progLife.setBgTexture(resLoad);
progLife.setTexture(resLoad);
progLife.setPosition(600, 15);
progLife.setSize(180, 18);
progLife.setBgColor(0.6, 0.1, 0.1, 0.8);
progLife.setMax(3);
progLife.setValue(3);
scene.addNode(progLife);

var labLife = new Label();
labLife.setPosition(600, 36);
labLife.setSize(180, 20);
labLife.setFont("font/st.ttf", 13);
labLife.setColor(0, 0, 0, 0);
labLife.setTextColor(0, 1, 0, 1);
labLife.setText("生命值  * * *");
scene.addNode(labLife);

// ─── UI：游戏结束 ─────────────────────────────────────────────
var labGameOver = new Label();
labGameOver.setPosition(200, 200);
labGameOver.setSize(400, 160);
labGameOver.setColor(0, 0, 0, 0);
labGameOver.setFont("font/st.ttf", 30);
labGameOver.setTextColor(0, 1, 0, 1);
labGameOver.setText("游戏结束！\n按 R 重新开始");
labGameOver.setHide(true);
scene.addNode(labGameOver);

var labFinalScore = new Label();
labFinalScore.setPosition(240, 380);
labFinalScore.setSize(320, 40);
labFinalScore.setFont("font/st.ttf", 20);
labFinalScore.setColor(0, 0, 0, 0);
labFinalScore.setTextColor(0, 1, 0, 1);
labFinalScore.setText("");
labFinalScore.setHide(true);
scene.addNode(labFinalScore);

// ─── UI：暂停 ─────────────────────────────────────────────────
var labPause = new Label();
labPause.setPosition(250, 260);
labPause.setSize(300, 60);
labPause.setColor(0, 0, 0, 0);
labPause.setFont("font/st.ttf", 26);
labPause.setTextColor(0, 1, 0, 1);
labPause.setText("⏸ 已暂停\n按 P 继续");
labPause.setHide(true);
scene.addNode(labPause);

// ─── UI：操作提示 ─────────────────────────────────────────────
var labTip = new Label();
labTip.setPosition(10, 575);
labTip.setSize(780, 20);
labTip.setFont("font/st.ttf", 13);
labTip.setColor(0, 0, 0, 0);
labTip.setTextColor(0, 1, 0, 1);
labTip.setText("方向键/WASD 移动    空格 射击    P 暂停    R 重新开始");
scene.addNode(labTip);

// ─── 工具函数 ─────────────────────────────────────────────────

// AABB 碰撞检测
function isCollide(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx &&
           ay < by + bh && ay + ah > by;
}

// 生成爆炸效果
function spawnBomb(x, y) {
    for (var i = 0; i < bombs.length; i++) {
        if (!bombs[i].active) {
            bombs[i].active = true;
            bombs[i].x = x;
            bombs[i].y = y;
            bombs[i].life = 20; // 持续 20 帧
            bombs[i].node.setPosition(x - BOMB_W / 2, y - BOMB_H / 2);
            bombs[i].node.setHide(false);
            bombs[i].inner.setPosition(x - BOMB_W / 4, y - BOMB_H / 4);
            bombs[i].inner.setHide(false);
            break;
        }
    }
}

// 发射子弹
function shootBullet() {
    for (var i = 0; i < bullets.length; i++) {
        if (!bullets[i].active) {
            bullets[i].active = true;
            bullets[i].x = player.x + PLAYER_W / 2 - BULLET_W / 2;
            bullets[i].y = player.y - BULLET_H;
            bullets[i].node.setPosition(bullets[i].x, bullets[i].y);
            bullets[i].node.setHide(false);
            break;
        }
    }
}

// 生成敌机
function spawnEnemy() {
    for (var i = 0; i < enemies.length; i++) {
        if (!enemies[i].active) {
            enemies[i].active = true;
            var ex = Math.floor(Math.random() * (SCREEN_W - ENEMY_W));
            enemies[i].x = ex;
            enemies[i].y = -ENEMY_H;
            // 高关卡敌机有水平漂移
            enemies[i].speedY = ENEMY_SPEED + (level - 1) * 0.5;
            enemies[i].speedX = level >= 3 ? (Math.random() * 2 - 1) * 1.5 : 0;
            enemies[i].hp = level >= 5 ? 2 : 1; // 5关后出现精英敌机
            var color = enemies[i].hp > 1 ? [0.8, 0.1, 0.8] : [1.0, 0.3, 0.2];
            enemies[i].node.setColor(color[0], color[1], color[2], 1);
            enemies[i].node.setPosition(ex, -ENEMY_H);
            enemies[i].node.setHide(false);
            enemies[i].wing.setPosition(ex - 8, -ENEMY_H + 15);
            enemies[i].wing.setHide(false);
            break;
        }
    }
}

// 更新分数和关卡
function updateScore(add) {
    score += add;
    if (score > bestScore) bestScore = score;
    // 每 200 分升一关
    var newLevel = Math.floor(score / 200) + 1;
    if (newLevel !== level) {
        level = newLevel;
        labLevel.setText("关卡：" + level);
        // 关卡越高，敌机生成越快
        ENEMY_INTERVAL = Math.max(20, 60 - (level - 1) * 8);
        log("升级！当前关卡：" + level);
    }
    labScore.setText("分数：" + score);
    labBest.setText("最高：" + bestScore);
}

// 玩家被击中
function playerHit() {
    if (invincible > 0) return;
    life--;
    invincible = 90; // 无敌 1.5 秒
    progLife.setValue(life);
    // 更新生命显示
    var hearts = life >= 3 ? "* * *" : life === 2 ? "* *" : life === 1 ? "*" : "X";
    labLife.setText("生命值  " + hearts);
    spawnBomb(player.x + PLAYER_W / 2, player.y + PLAYER_H / 2);
    audio.playSound("sound/1.wav");

    if (life <= 0) {
        gameOver = true;
        labGameOver.setHide(false);
        labFinalScore.setText("最终分数：" + score + "    关卡：" + level);
        labFinalScore.setHide(false);
        audio.stopMusic();
        log("游戏结束！分数：" + score);
    }
}

// 重置游戏
function initGame() {
    score      = 0;
    life       = 3;
    level      = 1;
    frameCount = 0;
    gameOver   = false;
    gamePause  = false;
    shootTimer = 0;
    enemyTimer = 0;
    invincible = 0;
    ENEMY_INTERVAL = 60;

    player.x = 376;
    player.y = 500;
    nodePlayer.setPosition(player.x, player.y);
    nodePlayerHead.setPosition(player.x + 16, player.y - 12);

    // 清空子弹
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].active = false;
        bullets[i].node.setHide(true);
    }
    // 清空敌机
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].active = false;
        enemies[i].node.setHide(true);
        enemies[i].wing.setHide(true);
    }
    // 清空爆炸
    for (var i = 0; i < bombs.length; i++) {
        bombs[i].active = false;
        bombs[i].node.setHide(true);
        bombs[i].inner.setHide(true);
    }

    progLife.setValue(3);
    labLife.setText("生命值  * * *");
    labScore.setText("分数：0");
    labBest.setText("最高：" + bestScore);
    labLevel.setText("关卡：1");
    labGameOver.setHide(true);
    labFinalScore.setHide(true);
    labPause.setHide(true);

    audio.playMusic("sound/bg.ogg");
    audio.setMusicVolume(0.5);
    log("游戏开始！");
}

// ─── 主循环 ───────────────────────────────────────────────────
scene.upDate((time) => {
    if (gameOver || gamePause) return;
    frameCount++;

    // ── 背景滚动 ──
    bgY1 += 1.5;
    bgY2 += 1.5;
    if (bgY1 >= SCREEN_H)  bgY1 = bgY2 - SCREEN_H;
    if (bgY2 >= SCREEN_H)  bgY2 = bgY1 - SCREEN_H;
    nodeBg1.setPosition(0, bgY1);
    nodeBg2.setPosition(0, bgY2);

    // ── 无敌计时 ──
    if (invincible > 0) {
        invincible--;
        // 无敌期间玩家闪烁
        var blink = Math.floor(invincible / 6) % 2 === 0;
        nodePlayer.setHide(blink);
        nodePlayerHead.setHide(blink);
    } else {
        nodePlayer.setHide(false);
        nodePlayerHead.setHide(false);
    }

    // ── 玩家移动 ──
    if (keys.up    && player.y > 0)               player.y -= PLAYER_SPEED;
    if (keys.down  && player.y < SCREEN_H - PLAYER_H) player.y += PLAYER_SPEED;
    if (keys.left  && player.x > 0)               player.x -= PLAYER_SPEED;
    if (keys.right && player.x < SCREEN_W - PLAYER_W) player.x += PLAYER_SPEED;
    nodePlayer.setPosition(player.x, player.y);
    nodePlayerHead.setPosition(player.x + 16, player.y - 12);

    // ── 自动射击（按住空格） ──
    shootTimer++;
    if (keys.space && shootTimer >= SHOOT_INTERVAL) {
        shootBullet();
        shootTimer = 0;
    }

    // ── 生成敌机 ──
    enemyTimer++;
    if (enemyTimer >= ENEMY_INTERVAL) {
        spawnEnemy();
        enemyTimer = 0;
    }

    // ── 更新子弹 ──
    for (var i = 0; i < bullets.length; i++) {
        if (!bullets[i].active) continue;
        bullets[i].y -= BULLET_SPEED;
        // 飞出屏幕则回收
        if (bullets[i].y < -BULLET_H) {
            bullets[i].active = false;
            bullets[i].node.setHide(true);
            continue;
        }
        bullets[i].node.setPosition(bullets[i].x, bullets[i].y);

        // 子弹 vs 敌机碰撞
        for (var j = 0; j < enemies.length; j++) {
            if (!enemies[j].active) continue;
            if (isCollide(
                bullets[i].x, bullets[i].y, BULLET_W, BULLET_H,
                enemies[j].x, enemies[j].y, ENEMY_W, ENEMY_H
            )) {
                // 子弹命中
                bullets[i].active = false;
                bullets[i].node.setHide(true);
                enemies[j].hp--;
                if (enemies[j].hp <= 0) {
                    spawnBomb(enemies[j].x + ENEMY_W / 2, enemies[j].y + ENEMY_H / 2);
                    enemies[j].active = false;
                    enemies[j].node.setHide(true);
                    enemies[j].wing.setHide(true);
                    audio.playSound("sound/1.wav");
                    updateScore(level >= 5 ? 20 : 10);
                }
                break;
            }
        }
    }

    // ── 更新敌机 ──
    for (var i = 0; i < enemies.length; i++) {
        if (!enemies[i].active) continue;
        enemies[i].y += enemies[i].speedY;
        enemies[i].x += enemies[i].speedX;
        // 水平边界反弹
        if (enemies[i].x < 0 || enemies[i].x > SCREEN_W - ENEMY_W) {
            enemies[i].speedX = -enemies[i].speedX;
        }
        // 飞出底部则回收
        if (enemies[i].y > SCREEN_H) {
            enemies[i].active = false;
            enemies[i].node.setHide(true);
            enemies[i].wing.setHide(true);
            continue;
        }
        enemies[i].node.setPosition(enemies[i].x, enemies[i].y);
        enemies[i].wing.setPosition(enemies[i].x - 8, enemies[i].y + 15);

        // 敌机 vs 玩家碰撞
        if (isCollide(
            enemies[i].x, enemies[i].y, ENEMY_W, ENEMY_H,
            player.x, player.y, PLAYER_W, PLAYER_H
        )) {
            spawnBomb(enemies[i].x + ENEMY_W / 2, enemies[i].y + ENEMY_H / 2);
            enemies[i].active = false;
            enemies[i].node.setHide(true);
            enemies[i].wing.setHide(true);
            playerHit();
        }
    }

    // ── 更新爆炸效果 ──
    for (var i = 0; i < bombs.length; i++) {
        if (!bombs[i].active) continue;
        bombs[i].life--;
        // 爆炸随时间扩散并淡出
        var ratio  = bombs[i].life / 20;
        var expand = (1 - ratio) * 30;
        var alpha  = ratio;
        bombs[i].node.setSize(BOMB_W + expand, BOMB_H + expand);
        bombs[i].node.setColor(1.0, 0.5 * ratio, 0.1, alpha);
        bombs[i].node.setPosition(
            bombs[i].x - (BOMB_W + expand) / 2,
            bombs[i].y - (BOMB_H + expand) / 2
        );
        bombs[i].inner.setSize(BOMB_W / 2, BOMB_H / 2);
        bombs[i].inner.setColor(1.0, 1.0, 0.6 * ratio, alpha);
        bombs[i].inner.setPosition(
            bombs[i].x - BOMB_W / 4,
            bombs[i].y - BOMB_H / 4
        );

        if (bombs[i].life <= 0) {
            bombs[i].active = false;
            bombs[i].node.setHide(true);
            bombs[i].inner.setHide(true);
        }
    }
});

// ─── 键盘输入 ─────────────────────────────────────────────────
class Keys {
    static W     = 87;
    static S     = 83;
    static A     = 65;
    static D     = 68;
    static UP    = 38;
    static DOWN  = 40;
    static LEFT  = 37;
    static RIGHT = 39;
    static SPACE = 32;
    static P     = 80;
    static R     = 82;
}

game.setKeyCallBack((key, action) => {
    var pressed = action === 1; // 1 按下，0 松开

    // 重新开始
    if (key === Keys.R && pressed) {
        initGame();
        return;
    }
    // 暂停
    if (key === Keys.P && pressed) {
        if (gameOver) return;
        gamePause = !gamePause;
        labPause.setHide(!gamePause);
        return;
    }

    // 移动方向
    if (key === Keys.UP    || key === Keys.W)     keys.up    = pressed;
    if (key === Keys.DOWN  || key === Keys.S)     keys.down  = pressed;
    if (key === Keys.LEFT  || key === Keys.A)     keys.left  = pressed;
    if (key === Keys.RIGHT || key === Keys.D)     keys.right = pressed;
    if (key === Keys.SPACE)                       keys.space = pressed;
});

// ─── 启动 ─────────────────────────────────────────────────────
initGame();
game.run();