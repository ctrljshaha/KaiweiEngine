// 水果忍者小游戏，gemini生成，手工略微润色
// 微信导出小游戏时，旋转横屏
// AI提问：“参考开维游戏引擎实例，把这个网址https://github.com/ChineseDron/fruit-ninja/tree/master的游戏转为开维游戏引擎js代码。参考代码如下：（拷贝002实例代码）”

// ----------------------------------------------------------------------------------------------
// 1. 初始化引擎与环境
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
game.setFPS(60); // 设置帧率
 
// 游戏主窗口设置图标和标题
// ----------------------------------------------------------------------------------------------
var texture = game.getResource().getTexture("img/logo1.png"); // 获取纹理数据对象
window.setIcon(texture); // 设置主游戏窗口图标
window.setTitle("开维游戏引擎 - 水果忍者"); // 设置主游戏窗口标题



var scene = new Scene();
var resBg = game.getResource().getTexture("img/background.jpg"); 
scene.setBg(resBg);

// 加载关键 UI 资源
var resGameOver = game.getResource().getTexture("img/game-over.png");
var resScoreBg = game.getResource().getTexture("img/score.png");
var resNewGame = game.getResource().getTexture("img/new-game.png");
var resX = [game.getResource().getTexture("img/x.png"), game.getResource().getTexture("img/xx.png"), game.getResource().getTexture("img/xxx.png")];
var resXF = [game.getResource().getTexture("img/xf.png"), game.getResource().getTexture("img/xxf.png"), game.getResource().getTexture("img/xxxf.png")];
// 新增：加载lose图片资源
var resLose = game.getResource().getTexture("img/lose.png");

// 游戏状态
var score = 0;
var missCount = 0; // 记录掉落的水果数量
var fruits = []; 
var GRAVITY = 0.5; 
var isGameOver = false; 
var canReturnToMenu = false; // 新增：控制是否可以点击返回主页面

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

// 右上角图标显示 - 修改点：增加绽放和缩小消失效果
var lifeIcons = [];
var lifeSizes = [25, 30, 33]; // 定义三个图标的原始大小
for(var i = 0; i < 3; i++) {
    var icon = new Sprite();
    icon.setTexture(resX[i]);
    var s = lifeSizes[i];
    icon.setSize(0, 0); // 初始大小为0，实现“绽放”前置状态
    icon.originSize = s; // 记录原始尺寸
    icon.setPosition(w - 130 + i * lifeSizes[i], 25 - (s / 2)); 
    scene.addNode(icon);
    lifeIcons.push(icon);

    // 初始绽放动画
    (function(target, targetSize){
        var growScale = 0;
        target.upDate((dt) => {
            if (growScale < 1.0) {
                growScale += 0.05; // 控制绽放速度
                if (growScale > 1.0) growScale = 1.0;
                // 模拟花朵绽放：从小到大，可以稍微超过1.0再回到1.0（弹性效果）
                var elasticScale = growScale == 1.0 ? 1.0 : growScale * 1.1; 
                target.setSize(targetSize * elasticScale, targetSize * elasticScale);
            }
        });
    })(icon, s);
}

// ----------------------------------------------------------------------------------------------
// 4. 物体生成逻辑
// ----------------------------------------------------------------------------------------------
// 新增：强制清理屏幕上所有水果和碎片
function clearAllActiveFruits() {
    for (var i = 0; i < fruits.length; i++) {
        fruits[i].setHide(true);
        scene.removeNode(fruits[i]); 
    }
    fruits = [];
}

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
        
        // 只有不是地雷时才旋转（地雷不旋转）
        if (f.fruitType.name !== "bomb") {
            f.setRotate(f.getRotate() + 5);
        }
        
        // 掉落检测逻辑
        if (pos.y > h + 50) {
            if (f.tag == "whole") {
                handleMiss();
                // 新功能：水果落下时，在落下位置显示 lose.png，3秒后消失
                var loseIcon = new Sprite();
                loseIcon.setTexture(resLose);
                loseIcon.setSize(50, 50); // 设置合适的大小
                loseIcon.setPosition(pos.x, h - 60); // 在屏幕底部附近显示
                scene.addNode(loseIcon);
                
                var loseTimer = 0;
                loseIcon.upDate((dt) => {
                    loseTimer += dt;
                    if (loseTimer >= 3.0) {
                        loseIcon.setHide(true);
                        scene.removeNode(loseIcon);
                    }
                });
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
        var currentIcon = lifeIcons[missCount-1];
        // 修改点：实现原叉号图片“缩小消失”，然后“绽放显示”红色叉号
        var shrinkScale = 1.0;
        currentIcon.upDate((dt) => {
            if (shrinkScale > 0) {
                shrinkScale -= 0.1; // 缩小消失
                if (shrinkScale < 0) shrinkScale = 0;
                currentIcon.setSize(currentIcon.originSize * shrinkScale, currentIcon.originSize * shrinkScale);
            } else if (shrinkScale == 0) {
                // 彻底消失后，更换纹理并重新绽放
                currentIcon.setTexture(resXF[missCount-1]);
                shrinkScale = -0.01; // 进入绽放阶段的标记
            } else if (shrinkScale < 0) {
                // 红色叉号向花朵一样绽放
                var growScale = Math.abs(shrinkScale);
                growScale += 0.1;
                if (growScale > 1.0) growScale = 1.0;
                currentIcon.setSize(currentIcon.originSize * growScale, currentIcon.originSize * growScale);
                shrinkScale = -growScale;
            }
        });
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
    canReturnToMenu = false; // 重置返回标志
    spawnTimer = 0; // 核心修改：确保计时器重置，否则进入游戏不会立刻出水果
    labScore.setText("0");
    clearAllActiveFruits(); // 使用清理函数重置水果列表
    
    // 强制重置生命图标状态
    for (var i = 0; i < 3; i++) {
        lifeIcons[i].setTexture(resX[i]);
        lifeIcons[i].setHide(false); 
        lifeIcons[i].setSize(lifeIcons[i].originSize, lifeIcons[i].originSize); 
    }
    
    if (maskNode) { maskNode.setHide(true); }
    if (gameOverNode) { gameOverNode.setHide(true); }
    if (whiteFlashNode) { whiteFlashNode.setHide(true); } 

    if(menuSandia) menuSandia.setHide(false);
    if(menuCircle) menuCircle.setHide(false);
    if(menuPeach) menuPeach.setHide(false);
    if(menuCircleLeft) menuCircleLeft.setHide(false);
    if(menuBomb) menuBomb.setHide(false);
    if(menuCircleRight) menuCircleRight.setHide(false);
    
    isGameOver = false; // 核心修改：放在最后重置状态位
}

scene.onPress((x, y) => {
    // 修改点：必须在 GameOver 状态且 3 秒延时结束（canReturnToMenu 为 true）时才处理返回
    if (isGameOver) {
        if (!canReturnToMenu) return; // 3秒没到，点击无效

        resetGame(); 
        
        audioStart.playSound("sound/start.mp3");
        audioMenu.playMusic("sound/menu.mp3");

        game.pushScene(menuScene); 
        return;
    }
    isPressing = true;
    trailPoints = [{x: x, y: y}]; 
});

scene.onMove((x, y) => {
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

// --- 修改点：地雷爆炸时序优化 ---
var whiteFlashNode; 
function triggerBomb(bombNode) {
    if (isGameOver) return;
    isGameOver = true; 

    // 修改点：触雷瞬间立即清除所有水果
    clearAllActiveFruits();

    // 隐藏生命叉号
    for (var i = 0; i < lifeIcons.length; i++) {
        lifeIcons[i].setHide(true);
    }

    var pos = bombNode.getPosition();
    bombNode.setHide(true);

    var audio = new Audio();
    audio.playSound("sound/boom.mp3"); 

    // 1. 立即喷射白条特效
    for (var i = 0; i < 10; i++) {
        var ray = new Node();
        ray.setColor(255, 255, 255, 1);
        var angle = i * 36; 
        ray.setRotate(angle);
        ray.setPosition(pos.x, pos.y);
        ray.setSize(10, 2); 
        scene.addNode(ray, 1000);

        (function(node, startAngle) {
            var rayLife = 0;
            node.upDate((dt) => {
                rayLife += dt;
                var currentLen = rayLife * 2500;
                var currentAlpha = 1.0 - (rayLife / 3.0); 
                if (currentAlpha <= 0) {
                    node.setHide(true);
                    scene.removeNode(node);
                } else {
                    node.setSize(currentLen, 45 * currentAlpha); 
                    node.setColor(255, 255, 255, currentAlpha);
                    node.setRotate(startAngle + rayLife * 50); 
                }
            });
        })(ray, angle);
    }

    // 2. 时序控制 - 闪白特效
    var sequenceTimer = 0;
    var flashStarted = false;

    // 核心修改：使用一个独立的全局计时逻辑，确保闪白后一定会触发 GameOver UI
    var bombProcessNode = new Node();
    scene.addNode(bombProcessNode);
    bombProcessNode.upDate((dt) => {
        sequenceTimer += dt;
        if (sequenceTimer > 0.2 && !flashStarted) {
            flashStarted = true;
            if (!whiteFlashNode) {
                whiteFlashNode = new Node();
                whiteFlashNode.setSize(w, h);
                whiteFlashNode.setPosition(0, 0);
                scene.addNode(whiteFlashNode, 1001);
            }
            whiteFlashNode.setHide(false);
            whiteFlashNode.setColor(255, 255, 255, 1);

            var flashAlpha = 1.0;
            var flashHoldTimer = 0;
            whiteFlashNode.upDate((fdt) => {
                flashHoldTimer += fdt;
                if (flashHoldTimer > 0.5) { 
                    flashAlpha -= 0.015; 
                    if (flashAlpha <= 0) {
                        flashAlpha = 0;
                        whiteFlashNode.setHide(true);
                        triggerGameOverUI(); // 闪白结束后进入结算停留阶段
                        scene.removeNode(bombProcessNode); // 处理完毕移除
                    }
                    whiteFlashNode.setColor(255, 255, 255, flashAlpha);
                }
            });
        }
    });

    var shakeTimer = 0;
    scene.upDate((time) => {
        shakeTimer += time;
        if(shakeTimer < 0.8) { 
            scene.setPosition(Math.random()*40-20, Math.random()*40-20);
        } else { scene.setPosition(0,0); }
    });
}

var maskNode, gameOverNode; 
// 修改点：结算 UI 显示后，增加 3 秒倒计时才允许返回
function triggerGameOverUI() {
    clearAllActiveFruits();

    // 隐藏叉号
    for (var i = 0; i < lifeIcons.length; i++) {
        lifeIcons[i].setHide(true);
    }

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

    var audioGameOver = new Audio();
    audioGameOver.playSound("sound/over.mp3");

    // 关键修改：开始停留计时
    var returnWaitTimer = 0;
    canReturnToMenu = false; // 先锁定返回功能
    gameOverNode.upDate((dt) => {
        if (!canReturnToMenu) {
            returnWaitTimer += dt;
            if (returnWaitTimer >= 3.0) {
                canReturnToMenu = true; // 3秒后解锁
            }
        }
    });
}

function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    clearAllActiveFruits();
    triggerGameOverUI(); 
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
        if (isGameOver) { f.setHide(true); return; }
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
        if (isGameOver) { f2.setHide(true); return; }
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

var audioStart = new Audio();
audioStart.playSound("sound/start.mp3");

audioMenu.playMusic("sound/menu.mp3");


for (var i = 0; i < poolSize; i++) { menuScene.addNode(linePool[i]); }
for (var i = 0; i < partPoolSize; i++) { menuScene.addNode(particlePool[i]); }

var sprHomeMask = new Sprite();
sprHomeMask.setTexture(game.getResource().getTexture("img/home-mask.png"));
sprHomeMask.setSize(w, 180);
sprHomeMask.setPosition(0, -180); 
menuScene.addNode(sprHomeMask);

var sprLogo = new Sprite();
sprLogo.setTexture(game.getResource().getTexture("img/logo.png"));
sprLogo.setSize(270, 120);
sprLogo.setPosition(20, -150); 
menuScene.addNode(sprLogo);

var sprNinja = new Sprite();
sprNinja.setTexture(game.getResource().getTexture("img/ninja.png"));
sprNinja.setSize(240, 80);
sprNinja.setPosition((w - 200) / 1.8, -100); 
sprNinja.vY = 0; 
menuScene.addNode(sprNinja);

var sprHomeDesc = new Sprite();
sprHomeDesc.setTexture(game.getResource().getTexture("img/home-desc.png"));
sprHomeDesc.setSize(180, 80);
sprHomeDesc.setPosition(-200, 140); 
menuScene.addNode(sprHomeDesc);

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

var resFlash = game.getResource().getTexture("img/circle.png");
var flashTimer = 0; 

menuScene.upDate((time) => {
    var maskPos = sprHomeMask.getPosition();
    if (maskPos.y < 0) sprHomeMask.setPosition(0, maskPos.y + 10);

    var logoPos = sprLogo.getPosition();
    if (logoPos.y < 10) sprLogo.setPosition(logoPos.x, logoPos.y + 8);

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
    
    var descPos = sprHomeDesc.getPosition();
    if (descPos.x < 20) sprHomeDesc.setPosition(descPos.x + 8, descPos.y);

    menuSandia.setRotate(menuSandia.getRotate() - 1);
    menuCircle.setRotate(menuCircle.getRotate() - 0.5);
    
    menuPeach.setRotate(menuPeach.getRotate() + 1);
    menuCircleLeft.setRotate(menuCircleLeft.getRotate() - 0.5);
    
    menuCircleRight.setRotate(menuCircleRight.getRotate() - 0.5);

    if (!menuBomb.isHide()) {
        flashTimer += time;
        if (flashTimer > 0.15) { 
            flashTimer = 0;
            
            var f = new Sprite();
            f.setTexture(resFlash); 
            var s = 5 + Math.random() * 8; 
            f.setSize(s, s);
            
            var bPos = menuBomb.getPosition();
            f.setPosition(bPos.x, bPos.y); 
            
            f.vx = -1.5 - Math.random() * 3; 
            f.vy = -2 - Math.random() * 4; 
            
            var life = 0.8; 
            var initS = s;

            var colors = [255, 0, Math.floor(Math.random() * 255)];
            colors.sort(() => Math.random() - 0.5); 
            var r = colors[0];
            var g = colors[1];
            var b = colors[2];
            
            f.upDate((time) => {
                life -= time;
                if (life <= 0) {
                    f.setHide(true);
                } else {
                    var pos = f.getPosition();
                    f.vy += GRAVITY * 0.3; 
                    f.setPosition(pos.x + f.vx, pos.y + f.vy);
                    
                    var scale = life / 0.8; 
                    f.setSize(initS * scale, initS * scale);
                    f.setColor(r, g, b, scale); 
                }
            });
            menuScene.addNode(f, 999); 
        }
    }
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
    
    if (!menuSandia.isHide() && menuSandia.isContainPostion(x, y)) {
        audioMenu.stopMusic();       
        var audioSplatter = new Audio(); 
        audioSplatter.playSound("sound/splatter.mp3");
        spawnFireworkParticles(menuSandia.getPosition().x, menuSandia.getPosition().y, [204, 0, 0]); 
        menuSandia.setHide(true);
        menuCircle.setHide(true);
        menuPeach.setHide(true);
        menuCircleLeft.setHide(true);
        menuBomb.setHide(true);
        menuCircleRight.setHide(true);

        resetGame(); 
        game.pushScene(scene); 
    }
    
    if (!menuPeach.isHide() && menuPeach.isContainPostion(x, y)) {
        var audioSplatter = new Audio(); 
        audioSplatter.playSound("sound/splatter.mp3");
        spawnFireworkParticles(menuPeach.getPosition().x, menuPeach.getPosition().y, [255, 255, 0]); 
        menuPeach.setHide(true);
        menuCircleLeft.setHide(true);
    }

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