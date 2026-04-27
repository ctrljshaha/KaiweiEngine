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
scene.onPress((x, y) => {
    if (isGameOver) return;
    isPressing = true;
    trailPoints = [{x: x, y: y}]; 
});

scene.onMove((x, y) => {
    if (isGameOver || !isPressing) return;
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
    audio.playSound("sound/boom.wav"); 
    triggerGameOver();
}

function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;

    // 屏幕抖动
    var shakeTimer = 0;
    scene.upDate((time) => {
        shakeTimer += time;
        if(shakeTimer < 0.5) {
            scene.setPosition(Math.random()*10-5, Math.random()*10-5);
        } else { scene.setPosition(0,0); }
    });

    // 延时显示 GameOver
    var mask = new Node();
    mask.setSize(w, h);
    mask.setColor(0, 0, 0, 0.6); 
    mask.setPosition(0, 0);
    scene.addNode(mask, 998); 

    var gameOverSpr = new Sprite();
    gameOverSpr.setTexture(resGameOver);
    var imgW = 500; var imgH = 150; 
    gameOverSpr.setSize(imgW, imgH);
    gameOverSpr.setPosition((w - imgW) / 2, (h - imgH) / 2);
    scene.addNode(gameOverSpr, 999); 
}

function sliceFruit(f) {
    if (isGameOver) return;
    f.isCut = true; f.tag = "half"; 
    var audio = new Audio(); audio.playSound("sound/splatter.wav");
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
// 7. 启动页面逻辑 (严格根据你的要求修正)
// ----------------------------------------------------------------------------------------------
var menuScene = new Scene();
menuScene.setBg(resBg);

// 将对象池节点同时加入启动场景以防止报错
for (var i = 0; i < poolSize; i++) { menuScene.addNode(linePool[i]); }
for (var i = 0; i < partPoolSize; i++) { menuScene.addNode(particlePool[i]); }

// 启动页中心资源
var menuSandia = new Sprite();
menuSandia.setTexture(game.getResource().getTexture("img/fruit/sandia.png"));
menuSandia.setSize(100, 100);
menuSandia.setPosition((w - 100) / 2, (h - 100) / 2);
menuScene.addNode(menuSandia);

var menuCircle = new Sprite();
menuCircle.setTexture(resNewGame);
menuCircle.setSize(200, 200);
menuCircle.setPosition((w - 200) / 2, (h - 200) / 2);
menuScene.addNode(menuCircle);

// 动画：逆时针旋转
menuScene.upDate((time) => {
    menuSandia.setRotate(menuSandia.getRotate() - 3);
    menuCircle.setRotate(menuCircle.getRotate() - 1);
});

// 启动页交互逻辑：严格对齐主场景功能
var mPress = false;
var mPoints = [];
menuScene.onPress((x, y) => { mPress = true; mPoints = [{x: x, y: y}]; });
menuScene.onMove((x, y) => {
    if (!mPress) return;
    mPoints.push({x: x, y: y});
    if (mPoints.length >= 3) {
        var p0 = mPoints[mPoints.length - 3];
        var p1 = mPoints[mPoints.length - 2];
        var p2 = mPoints[mPoints.length - 1];
        // 轨迹绘制逻辑
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
    // 切西瓜检测
    if (!menuSandia.isHide() && menuSandia.isContainPostion(x, y)) {
        var audio = new Audio(); audio.playSound("sound/splatter.wav");
        spawnFireworkParticles(w/2, h/2, [204, 0, 0]); // 使用原始定义的粒子函数
        menuSandia.setHide(true);
        menuCircle.setHide(true);
        var t = 0;
        menuScene.upDate((dt)=>{
            t+=dt; if(t>0.3) game.pushScene(scene); // 稍微延迟进入，保留切西瓜手感
        });
    }
});
menuScene.onRelease(() => { mPress = false; mPoints = []; });

// ----------------------------------------------------------------------------------------------
// 8. 运行
// ----------------------------------------------------------------------------------------------
game.pushScene(menuScene);
game.run();