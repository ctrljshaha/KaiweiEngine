
// ==============================================================================================
// 飞机大战：音效增强版 (纯黑背景 + 星空拉伸 + 音效)
// ==============================================================================================

game.init(); 
game.setFPS(60); 

// 获取资源纹理
var resPlayer = game.getResource().getTexture("img/logo.png"); 
var resEnemy  = game.getResource().getTexture("img/resSpr1.png"); 
var resBullet = game.getResource().getTexture("img/button.png"); 

var scene = new Scene();
scene.setColor(0, 0, 0, 1); // 纯黑背景

// --- [新增] 背景音乐初始化 ---
var audio = new Audio();
audio.playMusic("sound/bg.ogg");

// --- 1. 星空系统 ---
var stars = [];
const STAR_COUNT = 100;    
var isWarpSpeed = false;   

function initStarfield() {
    for (let i = 0; i < STAR_COUNT; i++) {
        let star = new Node();
        let size = 1 + Math.random() * 2; 
        star.setSize(size, size);
        star.setPosition(Math.random() * 800, Math.random() * 600);
        star.setColor(1, 1, 1, 0.5);
        star.setName((0.5 + Math.random() * 3.5).toString()); 
        scene.addNode(star);
        stars.push(star);
    }
}

function updateStarfield() {
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        let pos = star.getPosition();
        let baseSpeed = parseFloat(star.getName());
        let currentSpeed = isWarpSpeed ? baseSpeed * 15 : baseSpeed;
        pos.y += currentSpeed;
        if (isWarpSpeed) {
            star.setSize(1, currentSpeed * 1.5); 
            star.setColor(0.6, 0.8, 1.0, 0.7); 
        } else {
            star.setSize(baseSpeed, baseSpeed);
            star.setColor(1, 1, 1, 0.5);
        }
        if (pos.y > 600) {
            pos.y = -50;
            pos.x = Math.random() * 800;
        }
        star.setPosition(pos.x, pos.y);
    }
}

// --- 2. 游戏逻辑变量 ---
var bullets = []; 
var enemies = []; 
var score = 0;
var isGameOver = false;

// 创建玩家
var player = new Sprite();
player.setTexture(resPlayer);
player.setSize(50, 50);
player.setPosition(375, 500); 
scene.addNode(player);

// 得分显示 (修正白色区域问题)
var labScore = new Label();
labScore.setPosition(20, 20);
labScore.setSize(400, 100); 
labScore.setColor(0, 0, 0, 0); // 彻底透明背景，防止白色方块
labScore.setTextColor(0, 1, 0, 1); // 鲜绿色字体
labScore.setFont("font/st.ttf", 20); 
labScore.setText("SCORE: 0\n[WASD]移动 [SPACE]射击\n[SHIFT]光速跳跃");
scene.addNode(labScore);

// --- 3. 交互系统 ---
game.setKeyCallBack((key, action) => {
    if (key === 16) { isWarpSpeed = (action === 1); }
    if (action !== 1) return; 
    
    var pos = player.getPosition();
    var step = 30;
    if (key === 87 || key === 38) player.setPosition(pos.x, pos.y - step); 
    if (key === 83 || key === 40) player.setPosition(pos.x, pos.y + step); 
    if (key === 65 || key === 37) player.setPosition(pos.x - step, pos.y); 
    if (key === 68 || key === 39) player.setPosition(pos.x + step, pos.y); 
    if (key === 32) shoot();
});

function shoot() {
    if (isGameOver) return;
    var b = new Sprite();
    b.setTexture(resBullet);
    b.setSize(6, 18);
    b.setColor(0, 1, 1, 1); 
    var pPos = player.getPosition();
    b.setPosition(pPos.x + 22, pPos.y - 10);
    scene.addNode(b);
    bullets.push(b);
}

function spawnEnemy() {
    if (isGameOver || isWarpSpeed) return; 
    var e = new Sprite();
    e.setTexture(resEnemy);
    e.setSize(40, 40);
    e.setColor(1, 0.4, 0.4, 1); 
    e.setPosition(Math.random() * 760, -50);
    scene.addNode(e);
    enemies.push(e);
}

// --- 4. 核心刷新循环 ---
var frameCount = 0;
initStarfield();

scene.upDate((time) => {
    updateStarfield();
    if (isGameOver) return;
    frameCount++;
    if (frameCount % 30 === 0) spawnEnemy();

    for (var i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i];
        var bPos = b.getPosition();
        b.setPosition(bPos.x, bPos.y - 15);
        if (bPos.y < -20) {
            b.setHide(true);
            bullets.splice(i, 1);
        }
    }

    var pPos = player.getPosition();
    for (var j = enemies.length - 1; j >= 0; j--) {
        var e = enemies[j];
        var ePos = e.getPosition();
        var eSpeed = isWarpSpeed ? 25 : 5;
        e.setPosition(ePos.x, ePos.y + eSpeed);

        // --- 判定逻辑：子弹碰撞 ---
        for (var k = bullets.length - 1; k >= 0; k--) {
            var b = bullets[k];
            var bPos = b.getPosition();
            var dist = Math.sqrt(Math.pow(ePos.x - bPos.x, 2) + Math.pow(ePos.y - bPos.y, 2));
            if (dist < 30) {
                score += 100;
                labScore.setText("SCORE: " + score + "\n[WASD]移动 [SPACE]射击\n[SHIFT]光速跳跃");
                
                // [新增] 碰撞音效
                audio.playSound("sound/1.wav");

                e.setHide(true);
                b.setHide(true);
                enemies.splice(j, 1);
                bullets.splice(k, 1);
                break;
            }
        }

        // --- 判定逻辑：玩家碰撞 ---
        var playerDist = Math.sqrt(Math.pow(ePos.x - pPos.x, 2) + Math.pow(ePos.y - pPos.y, 2));
        if (playerDist < 35 && !isWarpSpeed) { 
            isGameOver = true;
            
            // [新增] 玩家被撞音效
            audio.playSound("sound/1.wav");
            // 停止背景音乐
            audio.stopMusic();

            labScore.setText("GAME OVER!\nFINAL SCORE: " + score);
            player.setColor(1, 0, 0, 0.5); 
        }

        if (ePos.y > 600) {
            e.setHide(true);
            enemies.splice(j, 1);
        }
    }
});

game.pushScene(scene);
game.run();

