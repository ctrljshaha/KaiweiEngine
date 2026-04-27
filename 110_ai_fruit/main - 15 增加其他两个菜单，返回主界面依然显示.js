// ----------------------------------------------------------------------------------------------
// 1. 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
game.init();
var window = game.getWindow();
var w = window.getWidth();
var h = window.getHeight();
game.setFPS(60);

var scene = new Scene();
var resBg = game.getResource().getTexture("img/background.jpg"); 
scene.setBg(resBg);

// 加载关键 UI 资源
var resGameOver = game.getResource().getTexture("img/game-over.png");
var resScoreBg = game.getResource().getTexture("img/score.png");
var resNewGame = game.getResource().getTexture("img/new-game.png");
var resX = [game.getResource().getTexture("img/x.png"), game.getResource().getTexture("img/xx.png"), game.getResource().getTexture("img/xxx.png")];
var resXF = [game.getResource().getTexture("img/xf.png"), game.getResource().getTexture("img/xxf.png"), game.getResource().getTexture("img/xxxf.png")];

// 游戏状态
var score = 0;
var missCount = 0; // 记录掉落的水果数量
var fruits = []; 
var GRAVITY = 0.5; 
var isGameOver = false; 

// --- 音频全局句柄 ---
var audioMenu = new Audio(); // 定义全局菜单背景音乐句柄

// --- 配置表：地雷现在和水果一样定义在数组中 ---
var FRUIT_TYPES = [
    { name: "apple", color: [128, 255, 0],  img: "img/fruit/apple.png",  cut1: "img/fruit/apple-1.png",  cut2: "img/fruit/apple-2.png", size: 70 },
    { name: "banana", color: [255, 255, 0], img: "img/fruit/banana.png", cut1: "img/fruit/banana-1.png", cut2: "img/fruit/banana-2.png", size: 120 },
    { name: "peach", color: [255, 255, 0],img: "img/fruit/peach.png",  cut1: "img/fruit/peach-1.png",  cut2: "img/fruit/peach-2.png", size: 70 },
    { name: "basaha", color: [204, 0, 0],img: "img/fruit/basaha.png",  cut1: "img/fruit/basaha-1.png",  cut2: "img/fruit/basaha-2.png", size: 80 },
    { name: "sandia", color: [204, 0, 0],img: "img/fruit/sandia.png",  cut1: "img/fruit/sandia-1.png",  cut2: "img/fruit/sandia-2.png", size: 100 },
    // 地雷配置：指定 boom.png 和灰色爆炸粒子
    { name: "bomb",   color: [80, 80, 80],   img: "img/fruit/boom.png", size: 70, isBomb: true }
];

// ----------------------------------------------------------------------------------------------
// 2. 贝塞尔轨迹系统——对象池与插值优化
// ----------------------------------------------------------------------------------------------
var linePool = []; 
var poolSize = 150; 
var poolIndex = 0;
var isPressing = false;
var trailPoints = []; 

for (var i = 0; i < poolSize; i++) {
    var l = new Node();
    l.setColor(255, 255, 255, 0);
    l.setHide(true);
    scene.addNode(l);
    linePool.push(l);
}

// --- 粒子对象池预申请 ---
var particlePool = [];
var partPoolSize = 20; 
var partIndex = 0;
var circleTexture = game.getResource().getTexture("img/circle.png");

for (var i = 0; i < partPoolSize; i++) {
    var p = new Sprite();
    p.setTexture(circleTexture);
    p.setHide(true);
    scene.addNode(p);
    particlePool.push(p);
}

function drawSegment(x1, y1, x2, y2, thickness) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 0.5) return;
    var line = linePool[poolIndex];
    line.setHide(false);
    line.setSize(distance + 2.5, thickness); 
    line.setPosition(x1, y1);
    line.setRotate(Math.atan2(dy, dx) * 180 / Math.PI);
    var alpha = 1.0;
    line.setColor(255, 255, 255, alpha);
    line.upDate((time) => {
        alpha -= 0.15;
        if (alpha <= 0) { line.setHide(true); } 
        else {
            line.setColor(255, 255, 255, alpha);
            line.setSize(distance + 2.5, thickness * (alpha * alpha)); 
        }
    });
    poolIndex = (poolIndex + 1) % poolSize;
}

function drawBezierTrail(p0, p1, p2) {
    var steps = 6; 
    var prevX = p0.x; var prevY = p0.y;
    for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        var tx = Math.pow(1 - t, 2) * p0.x + 2 * t * (1 - t) * p1.x + Math.pow(t, 2) * p2.x;
        var ty = Math.pow(1 - t, 2) * p0.y + 2 * t * (1 - t) * p1.y + Math.pow(t, 2) * p2.y;
        drawSegment(prevX, prevY, tx, ty, 12);
        prevX = tx; prevY = ty;
    }
}

function spawnFireworkParticles(x, y, rgb) {
    var count = 45; 
    var r = rgb[0], g = rgb[1], b = rgb[2];
    for (var i = 0; i < count; i++) {
        var p = particlePool[partIndex];
        p.setHide(false);
        var size = Math.random() * 5 + 3; 
        p.setSize(size, size);
        p.setPosition(x, y);
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 15 + 5; 
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        var life = 1.0;
        (function(particle, pr, pg, pb) {
            particle.upDate((time) => {
                life -= 0.0016; 
                if (life <= 0) { particle.setHide(true); } 
                else {
                    var pos = particle.getPosition();
                    particle.vy += 0.12; particle.vx *= 0.975; particle.vy *= 0.975; 
                    particle.setPosition(pos.x + particle.vx, pos.y + particle.vy);
                    particle.setColor(pr, pg, pb, life);
                }
            });
        })(p, r, g, b);
        partIndex = (partIndex + 1) % partPoolSize;
    }
}

// ----------------------------------------------------------------------------------------------
// 3. 标签显示
// ----------------------------------------------------------------------------------------------
// 左上角 Score 背景图
var sprScoreBg = new Sprite();
sprScoreBg.setTexture(resScoreBg);
sprScoreBg.setPosition(10, 10);
sprScoreBg.setSize(30, 30);
scene.addNode(sprScoreBg);

var labScore = new Label();
labScore.setPosition(45, 12); // 调整位置使其位于图片中心偏右
labScore.setSize(30, 30);
labScore.setFont("font/st.ttf", 25);
labScore.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
labScore.setTextColor(255, 255, 0, 1);
labScore.setText("0");
scene.addNode(labScore);

// 右上角图标显示
var lifeIcons = [];
var lifeSizes = [25, 30, 33]; // 定义三个图标的大小，由小到大
for(var i = 0; i < 3; i++) {
    var icon = new Sprite();
    icon.setTexture(resX[i]);
    var s = lifeSizes[i];
    icon.setSize(s, s);
    // 动态计算位置，确保它们靠右排列且中心对齐或底对齐
    icon.setPosition(w - 130 + i * lifeSizes[i], 25 - (s / 2)); 
    scene.addNode(icon);
    lifeIcons.push(icon);
}

// ----------------------------------------------------------------------------------------------
// 4. 物体生成逻辑
// ----------------------------------------------------------------------------------------------
function createFruit() {
    if (isGameOver) return;
    var f = new Sprite();
    var type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
    var resTex = game.getResource().getTexture(type.img); 
    
    f.setTexture(resTex);
    f.setSize(type.size, type.size); 
    f.fruitType = type;
    
    var startX = Math.random() * (w - 100) + 50;
    var startY = h + 50;
    f.setPosition(startX, startY);
    f.vx = (w / 2 - startX) * 0.02 + (Math.random() - 0.5) * 5; 
    f.vy = -(Math.random() * 5 + 15); 
    f.isCut = false;
    f.tag = type.isBomb ? "bomb" : "whole"; 

    // 每个水果弹出时播放 throw.mp3
    var audioThrow = new Audio();
    audioThrow.playSound("sound/throw.mp3");

    f.upDate((time) => {
        if (f.isCut || isGameOver) return;
        var pos = f.getPosition();
        f.vy += GRAVITY;
        f.setPosition(pos.x + f.vx, pos.y + f.vy);
        f.setRotate(f.getRotate() + 5);
        
        // 掉落检测逻辑
        if (pos.y > h + 50) {
            if (f.tag == "whole") {
                handleMiss();
            }
            f.setHide(true);
        }
    });

    scene.addNode(f);
    fruits.push(f);
}

function handleMiss() {
    if (isGameOver) return;
    missCount++;
    if (missCount <= 3) {
        lifeIcons[missCount-1].setTexture(resXF[missCount-1]);
    }
    if (missCount >= 3) {
        triggerGameOver();
    }
}

// ----------------------------------------------------------------------------------------------
// 5. 切割逻辑与交互
// ----------------------------------------------------------------------------------------------
// 封装重置函数
function resetGame() {
    score = 0;
    missCount = 0;
    isGameOver = false;
    spawnTimer = 0; // 关键修正：确保生成计时器归零
    labScore.setText("0");
    for (var i = 0; i < fruits.length; i++) {
        fruits[i].setHide(true);
        scene.removeNode(fruits[i]); // 彻底移除
    }
    fruits = [];
    for (var i = 0; i < 3; i++) {
        lifeIcons[i].setTexture(resX[i]);
    }
    if (maskNode) maskNode.setHide(true);
    if (gameOverNode) gameOverNode.setHide(true);

    // 返回菜单时，确保所有三个菜单都重新显示
    if(menuSandia) menuSandia.setHide(false);
    if(menuCircle) menuCircle.setHide(false);
    if(menuPeach) menuPeach.setHide(false);
    if(menuCircleLeft) menuCircleLeft.setHide(false);
    if(menuBomb) menuBomb.setHide(false);
    if(menuCircleRight) menuCircleRight.setHide(false);
}

scene.onPress((x, y) => {
    // 关键修正：检测如果是结束状态，立刻重置并跳转
    if (isGameOver) {
        resetGame(); // 先彻底重置
        
        // 特效播放后开始循环播放菜单背景音乐
        audioStart.playSound("sound/start.mp3");
        audioMenu.playMusic("sound/menu.mp3");

        game.pushScene(menuScene); 
        return;
    }
    isPressing = true;
    trailPoints = [{x: x, y: y}]; 
});

scene.onMove((x, y) => {
    // 如果结束了，禁止绘制轨迹和切水果
    if (isGameOver) return; 
    
    if (!isPressing) return;
    
    trailPoints.push({x: x, y: y});
    if (trailPoints.length >= 3) {
        var p0 = trailPoints[trailPoints.length - 3];
        var p1 = trailPoints[trailPoints.length - 2];
        var p2 = trailPoints[trailPoints.length - 1];
        drawBezierTrail(p0, p1, p2);
        if (trailPoints.length > 5) trailPoints.shift();
    }
    for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i];
        if (!f.isCut && f.isContainPostion(x, y)) {
            if (f.tag == "whole") sliceFruit(f);
            else if (f.tag == "bomb") triggerBomb(f);
        }
    }
});

scene.onRelease((x, y) => {
    isPressing = false;
    trailPoints = [];
});

// --- 修复：地雷爆炸与 GameOver 显示 ---
function triggerBomb(bombNode) {
    if (isGameOver) return;
    // 地雷爆炸直接结束
    spawnFireworkParticles(bombNode.getPosition().x, bombNode.getPosition().y, [80,80,80]);
    bombNode.setHide(true);
    var audio = new Audio();
    audio.playSound("sound/boom.mp3"); 
    triggerGameOver();
}

var maskNode, gameOverNode; 
function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;

    // 游戏结束后播放 over.mp3
    var audioGameOver = new Audio();
    audioGameOver.playSound("sound/over.mp3");

    // 屏幕抖动
    var shakeTimer = 0;
    scene.upDate((time) => {
        shakeTimer += time;
        if(shakeTimer < 0.5) {
            scene.setPosition(Math.random()*10-5, Math.random()*10-5);
        } else { scene.setPosition(0,0); }
    });

    // 延时显示 GameOver
    if (!maskNode) {
        maskNode = new Node();
        maskNode.setSize(w, h);
        maskNode.setColor(0, 0, 0, 0.6); 
        maskNode.setPosition(0, 0);
        scene.addNode(maskNode, 998); 
    }
   
    maskNode.setHide(false);

    if (!gameOverNode) {
        gameOverNode = new Sprite();
        gameOverNode.setTexture(resGameOver);
        var imgW = 500; var imgH = 100; 
        gameOverNode.setSize(imgW, imgH);
        gameOverNode.setPosition((w - imgW) / 2, (h - imgH) / 2);
        scene.addNode(gameOverNode, 999); 
    }
    
    gameOverNode.setHide(false);
}

function sliceFruit(f) {
    if (isGameOver) return;
    f.isCut = true; f.tag = "half"; 
    var audio = new Audio(); audio.playSound("sound/splatter.mp3");
    var oldPos = f.getPosition();
    var oldVx = f.vx; var oldVy = f.vy; 
    var type = f.fruitType;
    spawnFireworkParticles(oldPos.x, oldPos.y, type.color);

    var resCut1 = game.getResource().getTexture(type.cut1);
    f.setTexture(resCut1);
    f.vx = oldVx - 2; f.vy = oldVy; 
    f.upDate((time) => {
        var pos = f.getPosition();
        f.vy += GRAVITY;
        f.setPosition(pos.x + f.vx, pos.y + f.vy);
        f.setRotate(f.getRotate() + 2);
    });

    var f2 = new Sprite();
    f2.setTexture(game.getResource().getTexture(type.cut2));
    f2.setSize(type.size, type.size); 
    f2.setPosition(oldPos.x, oldPos.y);
    f2.vx = oldVx + 2; f2.vy = oldVy; f2.isCut = true;
    f2.upDate((time) => {
        var pos = f2.getPosition();
        f2.vy += GRAVITY;
        f2.setPosition(pos.x + f2.vx, pos.y + f2.vy);
        f2.setRotate(f2.getRotate() - 2);
        if (pos.y > h + 100) f2.setHide(true);
    });
    scene.addNode(f2);
    fruits.push(f2); 
    score += 1;
    labScore.setText("" + score);
}

// ----------------------------------------------------------------------------------------------
// 6. 游戏主循环
// ----------------------------------------------------------------------------------------------
var spawnTimer = 0;
scene.upDate((time) => {
    if (isGameOver) return;
    spawnTimer += time;
    if (spawnTimer > 1.2) {
        var count = Math.floor(Math.random() * 2) + 1;
        for (var i = 0; i < count; i++) { createFruit(); }
        spawnTimer = 0;
    }
    for (var i = fruits.length - 1; i >= 0; i--) {
        if (fruits[i].isHide()) {
            scene.removeNode(fruits[i]);
            fruits.splice(i, 1);
        }
    }
});

// ----------------------------------------------------------------------------------------------
// 7. 启动页面逻辑
// ----------------------------------------------------------------------------------------------
var menuScene = new Scene();
menuScene.setBg(resBg);

// 启动页增加音乐逻辑
var audioStart = new Audio();
audioStart.playSound("sound/start.mp3");

// 特效播放后开始循环播放菜单背景音乐
audioMenu.playMusic("sound/menu.mp3");


for (var i = 0; i < poolSize; i++) { menuScene.addNode(linePool[i]); }
for (var i = 0; i < partPoolSize; i++) { menuScene.addNode(particlePool[i]); }

// --- 启动页新增 UI 动画组件 ---

// 1. home-mask 和 logo 显示（从上到下）
var sprHomeMask = new Sprite();
sprHomeMask.setTexture(game.getResource().getTexture("img/home-mask.png"));
sprHomeMask.setSize(w, 180);
sprHomeMask.setPosition(0, -180); // 初始在屏幕上方
menuScene.addNode(sprHomeMask);

var sprLogo = new Sprite();
sprLogo.setTexture(game.getResource().getTexture("img/logo.png"));
sprLogo.setSize(270, 120);
sprLogo.setPosition(20, -150); // 初始在屏幕上方
menuScene.addNode(sprLogo);

// 2. ninja 显示（重力加速度下落）
var sprNinja = new Sprite();
sprNinja.setTexture(game.getResource().getTexture("img/ninja.png"));
sprNinja.setSize(240, 80);
sprNinja.setPosition((w - 200) / 1.8, -100); // 初始在屏幕上方
sprNinja.vY = 0; // 重力速度
menuScene.addNode(sprNinja);

// 3. home-desc 显示（左到右）
var sprHomeDesc = new Sprite();
sprHomeDesc.setTexture(game.getResource().getTexture("img/home-desc.png"));
sprHomeDesc.setSize(180, 80);
sprHomeDesc.setPosition(-200, 140); // 初始在左侧屏幕外
menuScene.addNode(sprHomeDesc);

// --- 菜单配置与生成逻辑 ---
// 中间菜单 (Sandia)
var menuSandia = new Sprite();
menuSandia.setTexture(game.getResource().getTexture("img/fruit/sandia.png"));
menuSandia.setSize(100, 100);
menuSandia.setPosition((w - 100) / 2, (h - 100) / 1.5);
menuScene.addNode(menuSandia);

var menuCircle = new Sprite();
menuCircle.setTexture(resNewGame);
menuCircle.setSize(200, 200);
menuCircle.setPosition((w - 200) / 2, (h - 200) / 1.4);
menuScene.addNode(menuCircle);

// 左侧菜单 (Peach) - 圆圈略小
var menuPeach = new Sprite();
menuPeach.setTexture(game.getResource().getTexture("img/fruit/peach.png"));
menuPeach.setSize(70, 70);
menuPeach.setPosition(w * 0.15, (h - 70) / 1.5);
menuScene.addNode(menuPeach);

var menuCircleLeft = new Sprite();
menuCircleLeft.setTexture(game.getResource().getTexture("img/dojo.png"));
menuCircleLeft.setSize(160, 160);
menuCircleLeft.setPosition(w * 0.15 - 45, (h - 160) / 1.4);
menuScene.addNode(menuCircleLeft);

// 右侧菜单 (Bomb) - 圆圈最小
var menuBomb = new Sprite();
menuBomb.setTexture(game.getResource().getTexture("img/fruit/boom.png"));
menuBomb.setSize(70, 70);
menuBomb.setPosition(w * 0.8 - 70, (h - 70) / 1.45);
menuScene.addNode(menuBomb);

var menuCircleRight = new Sprite();
menuCircleRight.setTexture(game.getResource().getTexture("img/quit.png"));
menuCircleRight.setSize(130, 130);
menuCircleRight.setPosition(w * 0.8 - 100, (h - 130) / 1.4);
menuScene.addNode(menuCircleRight);

// 启动页物体更新逻辑
menuScene.upDate((time) => {
    // Mask 滑入
    var maskPos = sprHomeMask.getPosition();
    if (maskPos.y < 0) sprHomeMask.setPosition(0, maskPos.y + 10);

    // Logo 滑入
    var logoPos = sprLogo.getPosition();
    if (logoPos.y < 10) sprLogo.setPosition(logoPos.x, logoPos.y + 8);

    // Ninja 下落（带回弹效果）
    var ninjaPos = sprNinja.getPosition();
    var targetY = 50;
    var bounceLimit = 0.5; 
    
    if (Math.abs(ninjaPos.y - targetY) > 0.1 || Math.abs(sprNinja.vY) > bounceLimit) {
        sprNinja.vY += 0.4; 
        var nextY = ninjaPos.y + sprNinja.vY;
    
        if (nextY >= targetY) {
            nextY = targetY;
            if (Math.abs(sprNinja.vY) < 1.5) { 
                sprNinja.vY = 0;
            } else {
                sprNinja.vY *= -0.5; 
            }
        }
        sprNinja.setPosition(ninjaPos.x, nextY);
    } else {
        sprNinja.setPosition(ninjaPos.x, targetY);
        sprNinja.vY = 0;
    }
    
    // Desc 从左滑入
    var descPos = sprHomeDesc.getPosition();
    if (descPos.x < 20) sprHomeDesc.setPosition(descPos.x + 8, descPos.y);

    // 原有旋转逻辑
    menuSandia.setRotate(menuSandia.getRotate() - 1);
    menuCircle.setRotate(menuCircle.getRotate() - 0.5);
    
    // 新增菜单旋转
    menuPeach.setRotate(menuPeach.getRotate() + 1);
    menuCircleLeft.setRotate(menuCircleLeft.getRotate() - 0.5);
    
    menuBomb.setRotate(menuBomb.getRotate() - 1);
    menuCircleRight.setRotate(menuCircleRight.getRotate() - 0.5);
});

var mPress = false;
var mPoints = [];
menuScene.onPress((x, y) => { 
    mPress = true; 
    mPoints = [{x: x, y: y}]; 
});

menuScene.onMove((x, y) => {
    if (!mPress) return;
    mPoints.push({x: x, y: y});
    if (mPoints.length >= 3) {
        var p0 = mPoints[mPoints.length - 3];
        var p1 = mPoints[mPoints.length - 2];
        var p2 = mPoints[mPoints.length - 1];
        var steps = 6; var prevX = p0.x; var prevY = p0.y;
        for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var tx = Math.pow(1 - t, 2) * p0.x + 2 * t * (1 - t) * p1.x + Math.pow(t, 2) * p2.x;
            var ty = Math.pow(1 - t, 2) * p0.y + 2 * t * (1 - t) * p1.y + Math.pow(t, 2) * p2.y;
            drawSegment(prevX, prevY, tx, ty, 12);
            prevX = tx; prevY = ty;
        }
        if (mPoints.length > 5) mPoints.shift();
    }
    
    // 中间西瓜：进入游戏
    if (!menuSandia.isHide() && menuSandia.isContainPostion(x, y)) {
        audioMenu.stopMusic();       
        var audioSplatter = new Audio(); 
        audioSplatter.playSound("sound/splatter.mp3");
        spawnFireworkParticles(menuSandia.getPosition().x, menuSandia.getPosition().y, [204, 0, 0]); 
        menuSandia.setHide(true);
        menuCircle.setHide(true);
        // 切割中间菜单时，为了视觉整洁可以隐藏另外两个，但在 resetGame 中会全部恢复
        menuPeach.setHide(true);
        menuCircleLeft.setHide(true);
        menuBomb.setHide(true);
        menuCircleRight.setHide(true);

        resetGame(); 
        game.pushScene(scene); 
    }
    
    // 左侧桃子：切割效果，先不做跳转处理
    if (!menuPeach.isHide() && menuPeach.isContainPostion(x, y)) {
        var audioSplatter = new Audio(); 
        audioSplatter.playSound("sound/splatter.mp3");
        spawnFireworkParticles(menuPeach.getPosition().x, menuPeach.getPosition().y, [255, 255, 0]); 
        menuPeach.setHide(true);
        menuCircleLeft.setHide(true);
    }

    // 右侧地雷：切割效果，先不做跳转处理
    if (!menuBomb.isHide() && menuBomb.isContainPostion(x, y)) {
        var audioBoom = new Audio(); 
        audioBoom.playSound("sound/boom.mp3");
        spawnFireworkParticles(menuBomb.getPosition().x, menuBomb.getPosition().y, [80, 80, 80]); 
        menuBomb.setHide(true);
        menuCircleRight.setHide(true);
    }
});

menuScene.onRelease(() => { mPress = false; mPoints = [];  });

// ----------------------------------------------------------------------------------------------
// 8. 运行
// ----------------------------------------------------------------------------------------------
game.pushScene(menuScene);
game.run();