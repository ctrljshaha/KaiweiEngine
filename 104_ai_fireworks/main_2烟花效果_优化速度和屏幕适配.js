/**
 * 开维游戏引擎 - 华丽烟花演示程序
 * 特性：手动点击发射 + 随机自动发射 + 二次爆炸 + 拖尾效果 + 动态闪烁UI
 */

// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏

if (system =="WINDOWS")
{
    game.init() // windows默认窗口大小为800*600;web网页默认全屏
}
else if(system =="WEIXIN" || system =="WEB")
{
    game.initSize(canvas.width,canvas.height); // 微信窗口
}
window = game.getWindow(); // 获取资源对象
w = window.getWidth();  // 屏幕宽带
h = window.getHeight(); // 屏幕高度

// 判断横屏还是竖屏
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60); // 设置帧率

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

// 【严格自适应修改：基于真实屏幕宽度计算 UI 缩放因子】
var UI_SCALE = w / 800;

// ==========================================================================
// 【深度性能优化：对象池 + 全局数量硬上限控制（彻底解决运行变慢、速度变黏）】
// ==========================================================================
var nodePool = []; // 节点回收池
var MAX_PARTICLES = 300; // 【核心改动】同屏爆炸火花最大硬上限，防止数组过大导致遍历卡顿
var MAX_TAILS = 150;     // 【核心改动】同屏拖尾粒子最大硬上限

function getOrCreateNode() {
    if (nodePool.length > 0) {
        var node = nodePool.pop();
        node.setHide(false); // 重新激活
        return node;
    } else {
        return new Node(); // 池子空了才创建新的
    }
}

function recycleNode(node) {
    node.setHide(true);
    scene.removeNode(node); // 从场景中移除
    nodePool.push(node);    // 送入回收池，等待下次复用
}

// 【核心改动】音频单例化，严禁在爆炸时重复 new Audio() 阻塞主线程
var globalAudio = new Audio(); 
// ==========================================================================

// 2. UI 提示标签：绿色字体，黑底儿
var labHint = new Label();
labHint.setPosition(30 * UI_SCALE, 20 * UI_SCALE);
labHint.setSize(200 * UI_SCALE, 40 * UI_SCALE);
labHint.setColor(0, 0, 0, 1);       // 纯黑背景
labHint.setTextColor(0, 1, 0, 1);   // 纯绿文字
labHint.setFont("font/st.ttf", Math.round(18 * UI_SCALE));
labHint.setText("点击发射烟花");
scene.addNode(labHint);

// 3. 函数：爆炸效果 (Explosion)
function explode(x, y, color) {
    var count = 40; // 适当平滑单次爆炸粒子数，配合硬上限
    for (var i = 0; i < count; i++) {
        // 【效率优化】如果当前存活的火花超过了硬上限，最老的火花强制回收，死守渲染性能红线
        if (particles.length >= MAX_PARTICLES) {
            var oldP = particles.shift();
            recycleNode(oldP);
        }

        var p = getOrCreateNode(); 
        p.setSize(4 * UI_SCALE, 4 * UI_SCALE);
        p.setPosition(x, y);
        
        var angle = Math.random() * Math.PI * 2;
        var speed = (Math.random() * 8 + 2) * UI_SCALE;
        
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.alpha = 1.0;
        p.pColor = color; // 继承火箭颜色
        
        scene.addNode(p);
        particles.push(p);
    }
    // 【效率优化】使用单例音频播放，拒绝高频重复创建对象
    globalAudio.playSound("sound/1.wav"); 
}

// 4. 函数：发射火箭 (Launch)
function launchRocket(targetX, targetY) {
    var r = getOrCreateNode(); 
    r.setSize(6 * UI_SCALE, 10 * UI_SCALE);
    r.setPosition(targetX, h); // 从屏幕底部发射
    
    r.targetY = targetY; // 爆炸高度目标
    r.speedY = -15 * UI_SCALE;      // 初始上升速度
    // 随机生成一个鲜艳的颜色
    r.pColor = { r: Math.random(), g: Math.random(), b: Math.random() };
    r.setColor(r.pColor.r, r.pColor.g, r.pColor.b, 1.0);
    
    scene.addNode(r);
    rockets.push(r);
}

// 5. 交互层：全屏透明 Sprite 捕捉手动点击
var clickLayer = new Sprite();
clickLayer.setPosition(0, 0);
clickLayer.setSize(w, h); 
clickLayer.setColor(0, 0, 0, 0.01); // 极低透明度保证可点
clickLayer.click(() => {
    // 点击时在点击横坐标附近随机高度发射
    var tx = Math.random() * (w * 0.75) + (w * 0.125);
    var ty = Math.random() * (h * 0.33) + (h * 0.16);
    launchRocket(tx, ty);
});
scene.addNode(clickLayer);

// 6. 核心游戏循环 (upDate)
scene.upDate((time) => {
    frameCount++;

    // --- [新增] 随机自动发射逻辑 ---
    if (frameCount >= nextAutoLaunchFrame) {
        var autoX = Math.random() * (w * 0.75) + (w * 0.125);
        var autoY = Math.random() * (h * 0.33) + (h * 0.16);
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
            // 【效率优化】强制控制拖尾总数，防止极速点击时拖尾把数组撑爆
            if (tails.length >= MAX_TAILS) {
                var oldT = tails.shift();
                recycleNode(oldT);
            }

            var tr = getOrCreateNode(); 
            tr.setSize(2 * UI_SCALE, 2 * UI_SCALE);
            tr.setPosition(rPos.x + 2 * UI_SCALE, rPos.y + 8 * UI_SCALE);
            tr.alpha = 1.0;
            tr.setColor(1, 1, 1, 1); // 拖尾用白色增加燃烧感
            scene.addNode(tr);
            tails.push(tr);
        }

        r.speedY += 0.18 * UI_SCALE; // 重力模拟
        r.setPosition(rPos.x, rPos.y + r.speedY);
        
        // 到达顶点或速度耗尽则爆炸
        if (r.speedY >= 0 || rPos.y <= r.targetY) {
            explode(rPos.x, rPos.y, r.pColor);
            recycleNode(r); // 彻底放回回收池复用
            rockets.splice(i, 1);
        }
    }

    // --- [逻辑] 处理拖尾粒子的淡出 ---
    for (var k = tails.length - 1; k >= 0; k--) {
        var t = tails[k];
        t.alpha -= 0.08; 
        t.setColor(1, 1, 0.8, t.alpha); // 淡淡的黄白色
        if (t.alpha <= 0) {
            recycleNode(t); // 彻底放回回收池复用
            tails.splice(k, 1);
        }
    }

    // --- [逻辑] 处理爆炸后的火花粒子 ---
    var gravity = 0.12 * UI_SCALE;
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
            recycleNode(p); // 彻底放回回收池复用
            particles.splice(j, 1);
        }
    }
});

// 7. 运行游戏
game.pushScene(scene);
game.run();