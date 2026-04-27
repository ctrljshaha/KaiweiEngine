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

// 游戏状态
var score = 0;
var fruits = []; 
var GRAVITY = 0.5; 

// --- 水果配置表：定义不同水果的外观、切开后的外观、汁液颜色及显示尺寸 ---
var FRUIT_TYPES = [
    { name: "apple", color: [128, 255, 0],  img: "img/fruit/apple.png",  cut1: "img/fruit/apple-1.png",  cut2: "img/fruit/apple-2.png", size: 70 },
    { name: "banana", color: [255, 255, 0], img: "img/fruit/banana.png", cut1: "img/fruit/banana-1.png", cut2: "img/fruit/banana-2.png", size: 120 },
    { name: "peach", color: [255, 255, 0],img: "img/fruit/peach.png",  cut1: "img/fruit/peach-1.png",  cut2: "img/fruit/peach-2.png", size: 70 },
    { name: "basaha", color: [204, 0, 0],img: "img/fruit/basaha.png",  cut1: "img/fruit/basaha-1.png",  cut2: "img/fruit/basaha-2.png", size: 80 },
    { name: "sandia", color: [204, 0, 0],img: "img/fruit/sandia.png",  cut1: "img/fruit/sandia-1.png",  cut2: "img/fruit/sandia-2.png", size: 100 }
];

// ----------------------------------------------------------------------------------------------
// 2. 贝塞尔轨迹系统——对象池与插值优化
// ----------------------------------------------------------------------------------------------
var linePool = []; 
var poolSize = 150; 
var poolIndex = 0;
var isPressing = false;

// 用于存储最近的轨迹点实现插值
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
var partPoolSize = 20; // 已恢复大容量：停留10秒会导致大量粒子堆积，大幅增加池上限
var partIndex = 0;
// 预先获取圆形纹理以提高性能
var circleTexture = game.getResource().getTexture("img/circle.png");

for (var i = 0; i < partPoolSize; i++) {
    // 将 Node 改为 Sprite 以便支持纹理显示圆形
    var p = new Sprite();
    p.setTexture(circleTexture);
    p.setHide(true);
    scene.addNode(p);
    particlePool.push(p);
}

// 基础绘图函数：绘制两点之间的短线段
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
        if (alpha <= 0) {
            line.setHide(true);
        } else {
            line.setColor(255, 255, 255, alpha);
            line.setSize(distance + 2.5, thickness * (alpha * alpha)); 
        }
    });
    poolIndex = (poolIndex + 1) % poolSize;
}

// 核心：贝塞尔插值逻辑
function drawBezierTrail(p0, p1, p2) {
    var steps = 6; 
    var prevX = p0.x;
    var prevY = p0.y;

    for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        var tx = Math.pow(1 - t, 2) * p0.x + 2 * t * (1 - t) * p1.x + Math.pow(t, 2) * p2.x;
        var ty = Math.pow(1 - t, 2) * p0.y + 2 * t * (1 - t) * p1.y + Math.pow(t, 2) * p2.y;
        
        drawSegment(prevX, prevY, tx, ty, 12);
        prevX = tx;
        prevY = ty;
    }
}

// --- 礼花式粒子散开函数 (已修复颜色闭包 BUG) ---
function spawnFireworkParticles(x, y, rgb) {
    var count = 45; 
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];

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

        // --- 重点修改部分 ---
        // 使用立即执行函数 (IIFE) 捕捉当前的 p, r, g, b 值，锁住作用域
        (function(particle, pr, pg, pb) {
            particle.upDate((time) => {
                life -= 0.0016; // 维持 10 秒停留
                if (life <= 0) {
                    particle.setHide(true);
                } else {
                    var pos = particle.getPosition();
                    // 烟雾飘落物理
                    particle.vy += 0.12; 
                    particle.vx *= 0.975; 
                    particle.vy *= 0.975; 
                    particle.setPosition(pos.x + particle.vx, pos.y + particle.vy);
                    // 使用捕捉到的特定颜色值
                    particle.setColor(pr, pg, pb, life);
                }
            });
        })(p, r, g, b); // 将当前循环的变量传进去
        // ------------------

        partIndex = (partIndex + 1) % partPoolSize;
    }
}

// ----------------------------------------------------------------------------------------------
// 3. 标签显示
// ----------------------------------------------------------------------------------------------
var labScore = new Label();
labScore.setPosition(20, 20);
labScore.setSize(200, 50);
labScore.setFont("font/st.ttf", 30);
labScore.setTextColor(255, 255, 0, 1);
labScore.setText("Score: 0");
scene.addNode(labScore);

// ----------------------------------------------------------------------------------------------
// 4. 水果类定义
// ----------------------------------------------------------------------------------------------
function createFruit() {
    var f = new Sprite();
    var type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
    var resFruit = game.getResource().getTexture(type.img); 
    f.setTexture(resFruit);
    f.setSize(type.size, type.size); 
    
    var startX = Math.random() * (w - 100) + 50;
    var startY = h + 50;
    f.setPosition(startX, startY);
    
    f.vx = (w / 2 - startX) * 0.02 + (Math.random() - 0.5) * 5; 
    f.vy = -(Math.random() * 5 + 15); 
    f.isCut = false;
    f.tag = "whole"; 
    f.fruitType = type; 

    f.upDate((time) => {
        if (f.isCut) return;
        var pos = f.getPosition();
        f.vy += GRAVITY;
        f.setPosition(pos.x + f.vx, pos.y + f.vy);
        f.setRotate(f.getRotate() + 5);
        if (pos.y > h + 100) f.setHide(true);
    });

    scene.addNode(f);
    fruits.push(f);
}

// ----------------------------------------------------------------------------------------------
// 5. 切割逻辑与交互 (Bezier集成)
// ----------------------------------------------------------------------------------------------
scene.onPress((x, y) => {
    isPressing = true;
    trailPoints = [{x: x, y: y}]; 
});

scene.onMove((x, y) => {
    if (isPressing) {
        trailPoints.push({x: x, y: y});

        if (trailPoints.length >= 3) {
            var p0 = trailPoints[trailPoints.length - 3];
            var p1 = trailPoints[trailPoints.length - 2];
            var p2 = trailPoints[trailPoints.length - 1];
            drawBezierTrail(p0, p1, p2);
            if (trailPoints.length > 5) trailPoints.shift();
        } else if (trailPoints.length === 2) {
            drawSegment(trailPoints[0].x, trailPoints[0].y, trailPoints[1].x, trailPoints[1].y, 14);
        }

        for (var i = 0; i < fruits.length; i++) {
            var f = fruits[i];
            if (f.tag == "whole" && !f.isCut && f.isContainPostion(x, y)) {
                sliceFruit(f);
            }
        }
    }
});

scene.onRelease((x, y) => {
    isPressing = false;
    trailPoints = [];
});

function sliceFruit(f) {
    f.isCut = true; 
    f.tag = "half"; 
    
    var audio = new Audio();
    audio.playSound("sound/splatter.wav");

    var oldPos = f.getPosition();
    var oldVx = f.vx;
    var oldVy = f.vy; 
    var type = f.fruitType;
    
    // 传入该水果配置的特定颜色数组
    spawnFireworkParticles(oldPos.x, oldPos.y, type.color);

    var resCut1 = game.getResource().getTexture(type.cut1);
    f.setTexture(resCut1);
    f.setSize(type.size, type.size); 
    f.vx = oldVx - 2; 
    f.vy = oldVy; 

    f.upDate((time) => {
        var pos = f.getPosition();
        f.vy += GRAVITY;
        f.setPosition(pos.x + f.vx, pos.y + f.vy);
        f.setRotate(f.getRotate() + 2);
        if (pos.y > h + 100) f.setHide(true);
    });

    var f2 = new Sprite();
    var resCut2 = game.getResource().getTexture(type.cut2);
    f2.setTexture(resCut2);
    f2.setSize(type.size, type.size); 
    f2.setPosition(oldPos.x, oldPos.y);
    f2.vx = oldVx + 2; 
    f2.vy = oldVy;
    f2.isCut = true;
    f2.tag = "half";

    f2.upDate((time) => {
        var pos = f2.getPosition();
        f2.vy += GRAVITY;
        f2.setPosition(pos.x + f2.vx, pos.y + f2.vy);
        f2.setRotate(f2.getRotate() - 2);
        if (pos.y > h + 100) f2.setHide(true);
    });

    scene.addNode(f2);
    fruits.push(f2); 
    
    score += 10;
    labScore.setText("Score: " + score);
}

// ----------------------------------------------------------------------------------------------
// 6. 游戏主循环
// ----------------------------------------------------------------------------------------------
var spawnTimer = 0;
scene.upDate((time) => {
    spawnTimer += time;
    if (spawnTimer > 1.2) {
        var count = Math.floor(Math.random() * 2) + 1;
        for (var i = 0; i < count; i++) {
            createFruit();
        }
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
// 7. 运行
// ----------------------------------------------------------------------------------------------
game.pushScene(scene);
game.run();