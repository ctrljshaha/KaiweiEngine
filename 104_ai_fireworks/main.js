/**
 * 开维游戏引擎 - 华丽烟花演示程序
 * 特性：手动点击发射 + 随机自动发射 + 二次爆炸 + 拖尾效果 + 动态闪烁UI
 */

// 1. 初始化引擎
game.init();
game.setFPS(60); 

var scene = new Scene();
// 设置背景图（建议使用一张深色背景图）
var resBg = game.getResource().getTexture("img/bg.png"); 
scene.setBg(resBg);

// 全局容器
var rockets = [];    // 升空中的火箭
var particles = [];  // 爆炸后的火花
var tails = [];      // 升空轨迹的拖尾
var frameCount = 0;  // 帧计数器
var nextAutoLaunchFrame = 60; // 下一次随机发射的目标帧

// 2. UI 提示标签：绿色字体，黑底儿
var labHint = new Label();
labHint.setPosition(30, 20);
labHint.setSize(200, 40);
labHint.setColor(0, 0, 0, 1);       // 纯黑背景
labHint.setTextColor(0, 1, 0, 1);   // 纯绿文字
labHint.setFont("font/st.ttf", 18);
labHint.setText("点击发射烟花");
scene.addNode(labHint);

// 3. 函数：爆炸效果 (Explosion)
function explode(x, y, color) {
    var count = 50; // 粒子数量
    for (var i = 0; i < count; i++) {
        var p = new Node();
        p.setSize(4, 4);
        p.setPosition(x, y);
        
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 8 + 2;
        
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.alpha = 1.0;
        p.pColor = color; // 继承火箭颜色
        
        scene.addNode(p);
        particles.push(p);
    }
    // 播放爆炸音效
    var audio = new Audio();
    audio.playSound("sound/1.wav"); 
}

// 4. 函数：发射火箭 (Launch)
function launchRocket(targetX, targetY) {
    var r = new Node();
    r.setSize(6, 10);
    r.setPosition(targetX, 600); // 从屏幕底部发射
    
    r.targetY = targetY; // 爆炸高度目标
    r.speedY = -15;      // 初始上升速度
    // 随机生成一个鲜艳的颜色
    r.pColor = { r: Math.random(), g: Math.random(), b: Math.random() };
    r.setColor(r.pColor.r, r.pColor.g, r.pColor.b, 1.0);
    
    scene.addNode(r);
    rockets.push(r);
}

// 5. 交互层：全屏透明 Sprite 捕捉手动点击
var clickLayer = new Sprite();
clickLayer.setPosition(0, 0);
clickLayer.setSize(800, 600); 
clickLayer.setColor(0, 0, 0, 0.01); // 极低透明度保证可点
clickLayer.click(() => {
    // 点击时在点击横坐标附近随机高度发射
    var tx = Math.random() * 600 + 100;
    var ty = Math.random() * 200 + 100;
    launchRocket(tx, ty);
});
scene.addNode(clickLayer);

// 6. 核心游戏循环 (upDate)
scene.upDate((time) => {
    frameCount++;

    // --- [新增] 随机自动发射逻辑 ---
    if (frameCount >= nextAutoLaunchFrame) {
        var autoX = Math.random() * 600 + 100;
        var autoY = Math.random() * 200 + 100;
        launchRocket(autoX, autoY);
        // 设定下一次随机发射间隔 (1.5秒到4秒之间)
        nextAutoLaunchFrame = frameCount + Math.floor(Math.random() * 150 + 90);
    }

    // --- [UI] 绿色字体随机闪烁逻辑 ---
    if (frameCount % 6 == 0) {
        var brightness = 0.4 + Math.random() * 0.6; 
        labHint.setTextColor(0, brightness, 0, 1); 
    }

    // --- [逻辑] 处理升空中的火箭及拖尾 ---
    for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        var rPos = r.getPosition();
        
        // 生成拖尾粒子
        if (frameCount % 2 == 0) {
            var tr = new Node();
            tr.setSize(2, 2);
            tr.setPosition(rPos.x + 2, rPos.y + 8);
            tr.alpha = 1.0;
            tr.setColor(1, 1, 1, 1); // 拖尾用白色增加燃烧感
            scene.addNode(tr);
            tails.push(tr);
        }

        r.speedY += 0.18; // 重力模拟
        r.setPosition(rPos.x, rPos.y + r.speedY);
        
        // 到达顶点或速度耗尽则爆炸
        if (r.speedY >= 0 || rPos.y <= r.targetY) {
            explode(rPos.x, rPos.y, r.pColor);
            r.setHide(true);
            rockets.splice(i, 1);
        }
    }

    // --- [逻辑] 处理拖尾粒子的淡出 ---
    for (var k = tails.length - 1; k >= 0; k--) {
        var t = tails[k];
        t.alpha -= 0.08; 
        t.setColor(1, 1, 0.8, t.alpha); // 淡淡的黄白色
        if (t.alpha <= 0) {
            t.setHide(true);
            tails.splice(k, 1);
        }
    }

    // --- [逻辑] 处理爆炸后的火花粒子 ---
    var gravity = 0.12;
    var friction = 0.96;
    for (var j = particles.length - 1; j >= 0; j--) {
        var p = particles[j];
        var pPos = p.getPosition();
        
        p.vx *= friction;
        p.vy *= friction;
        p.vy += gravity;
        
        p.setPosition(pPos.x + p.vx, pPos.y + p.vy);
        p.alpha -= 0.015; // 缓慢淡出
        p.setColor(p.pColor.r, p.pColor.g, p.pColor.b, p.alpha);
        
        if (p.alpha <= 0) {
            p.setHide(true);
            particles.splice(j, 1);
        }
    }
});

// 7. 运行游戏
game.pushScene(scene);
game.run();

