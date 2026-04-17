/**
 * 开维游戏引擎 - 氮气加速超跑特效
 * 新增：
 * 1. 氮气粒子（Nitro）：离场时喷射蓝色高亮火焰。
 * 2. 动态姿态：进场抬头、离场俯冲。
 * 3. 线性加速：离场时速度逐渐爆发。
 */
 
 // 微信小游戏横屏导出

game.init(); 
game.setFPS(60); 

var scene = new Scene();
var screenW = 800;
var screenH = 600;

var resBg = game.getResource().getTexture("img/bg.png");
scene.setBg(resBg);

var audio = new Audio();
audio.setSoundVolume(1.0); 

var resCar = game.getResource().getTexture("img/car.png");      
var resGiftBg = game.getResource().getTexture("img/gift_bg.png"); 

var animState = 0; 
var timer = 0;
var exhaustParticles = []; // 普通尾气
var nitroParticles = [];   // 氮气火苗
var frameCount = 0;
var comboCount = 0;      
var comboTimer = 0;      
var comboScale = 1.0;    

// UI 控件
var giftBanner = new Label();
giftBanner.setTexture(resGiftBg);
giftBanner.setSize(250, 60);
giftBanner.setPosition(50, 100); 
giftBanner.setFont("font/st.ttf", 20);
giftBanner.setText("  神豪   送出超跑");
giftBanner.setColor(255, 0, 0, 0.2);    
giftBanner.setTextColor(255, 0, 0, 1);   
scene.addNode(giftBanner);

var car = new Sprite();
car.setTexture(resCar);
car.setSize(400, 180);
car.setPosition(-500, 350); 
scene.addNode(car);

var labCombo = new Label();
labCombo.setPosition(300, 100); 
labCombo.setSize(120, 60);           
labCombo.setFont("font/st.ttf", 45); 
labCombo.setColor(0, 0, 0, 0);       
labCombo.setTextColor(255, 0, 0, 1);   
labCombo.setHide(true);              
scene.addNode(labCombo);

// 辅助函数：普通尾气（灰白色）
function createExhaust(x, y) {
    var p = new Node();
    p.setSize(6, 6);
    p.setPosition(x + 50, y + 175);
    p.pAlpha = 0.5; 
    p.setColor(0.8, 0.8, 0.8, p.pAlpha); 
    scene.addNode(p);
    exhaustParticles.push(p);
}

// 辅助函数：氮气火焰（蓝色高亮）
function createNitro(x, y) {
    var p = new Node();
    // 氮气火焰比烟雾更长、更窄
    p.setSize(15, 4);
    p.setPosition(x + 40, y + 175); 
    p.pAlpha = 1.0; 
    // 亮蓝色 (0, 0.6, 1)
    p.setColor(0, 0.6, 1, p.pAlpha); 
    scene.addNode(p);
    nitroParticles.push(p);
}

// 全屏点击
var clickLayer = new Sprite();
clickLayer.setPosition(0, 0);
clickLayer.setSize(screenW, screenH); 
clickLayer.setColor(0, 0, 0, 0.01); 
clickLayer.click(() => {
    if (animState === 0) {
        animState = 1;
        audio.playSound("sound/1.wav"); 
    }
    comboCount++;
    comboTimer = 0;       
    comboScale = 1.8;     
    labCombo.setHide(false);
    labCombo.setText(" x" + comboCount + " "); 
    if (animState === 2) timer = 0; 
});
scene.addNode(clickLayer);

// 核心循环
scene.upDate((time) => {
    frameCount++;

    // A1. 普通尾气更新
    for (var i = exhaustParticles.length - 1; i >= 0; i--) {
        var p = exhaustParticles[i];
        var pPos = p.getPosition();
        p.setPosition(pPos.x - 4, pPos.y + (Math.random() * 4 - 2));
        p.pAlpha -= 0.04;
        if (p.pAlpha <= 0) { p.setHide(true); exhaustParticles.splice(i, 1); }
    }

    // A2. 氮气粒子更新（更快消失，产生喷射感）
    for (var j = nitroParticles.length - 1; j >= 0; j--) {
        var n = nitroParticles[j];
        var nPos = n.getPosition();
        // 氮气粒子向后飞得极快
        n.setPosition(nPos.x - 15, nPos.y);
        n.pAlpha -= 0.15; // 消失极快
        if (n.pAlpha <= 0) { n.setHide(true); nitroParticles.splice(j, 1); }
    }

    // B. 七彩变色
    if (animState > 0) {
        var r = Math.sin(frameCount * 0.1) * 0.5 + 0.5;
        var g = Math.sin(frameCount * 0.1 + 2) * 0.5 + 0.5;
        var b = Math.sin(frameCount * 0.1 + 4) * 0.5 + 0.5;
        car.setColor(r, g, b, 1.0);
        giftBanner.setTextColor(r, g, b, 1.0);
    }

    // C. 连击数字
    if (!labCombo.isHide()) {
        comboTimer++;
        if (comboScale > 1.0) {
            comboScale -= 0.12;
            labCombo.setSize(120 * comboScale, 60 * comboScale);
        }
        if (comboTimer > 80) { labCombo.setHide(true); comboCount = 0; }
    }

    // D. 状态机
    if (animState === 1) {
        var bPos = giftBanner.getPosition();
        var cPos = car.getPosition();
        if (bPos.x < 20) giftBanner.setPosition(bPos.x + 15, bPos.y);
        if (cPos.x < 180) {
            car.setRotate(-3); 
            car.setPosition(cPos.x + 25, cPos.y - 1); 
            if (frameCount % 3 === 0) createExhaust(cPos.x, cPos.y);
        } else {
            car.setRotate(0); animState = 2; timer = 0;
        }

    } else if (animState === 2) {
        timer++;
        var cPos = car.getPosition();
        var shakeY = 349 + (Math.random() * 4);
        car.setPosition(cPos.x, shakeY);
        if (frameCount % 5 === 0) createExhaust(cPos.x, cPos.y);
        if (timer > 140 && labCombo.isHide()) { animState = 3; }

    } else if (animState === 3) {
        // --- 离场：氮气全开 ---
        var bPos = giftBanner.getPosition();
        var cPos = car.getPosition();
        giftBanner.setPosition(bPos.x, bPos.y - 10);
        
        // 速度曲线爆发
        var exitSpeed = 30 + (timer * 3); 
        car.setRotate(5);
        car.setPosition(cPos.x + exitSpeed, cPos.y + 10); 
        
        // 【关键】喷射蓝色氮气火焰
        createNitro(cPos.x, cPos.y);
        if (frameCount % 2 === 0) createExhaust(cPos.x, cPos.y);

        if (cPos.x > 950) {
            animState = 0; 
            car.setPosition(-500, 350); 
            car.setRotate(0);
            giftBanner.setPosition(-300, 100);
            car.setColor(1, 1, 1, 1);
        }
    }
});

game.pushScene(scene);
game.run();

