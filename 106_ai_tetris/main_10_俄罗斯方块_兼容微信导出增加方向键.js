/*好的，这是为你优化后的**终极音效版**。

我在代码中做了两个关键动作：

1. **消除行音效**：在 `clearLines` 逻辑中触发。
2. **方块旋转音效**：在 `setKeyCallBack` 监听空格键旋转成功时触发。

### 俄罗斯方块：双重音效+全功能版

*/

/**
 * 开维游戏引擎 - 俄罗斯方块 (双重音效版)
 * 1. 消除行时播放 sound/1.wav
 * 2. 空格旋转方块时也播放 sound/1.wav (或你可以换成别的音效文件)
 */
 
 
// AI生成代码后，加手柄和变化按钮
// 微信竖屏导出 


// 初始化游戏引擎，根据平台设置屏幕分辨率
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName(); // 获取系统名称
var w, h; // 屏幕宽高
var window;
var screenType; // 横屏还是竖屏

if (system =="WINDOWS" || system =="WEB")
{
    //game.init() // windows默认窗口大小为800*600;web网页默认全屏
    game.initSize(420, 750); 
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

// 设置窗口log和标题
// ----------------------------------------------------------------------------------------------
var res = game.getResource();
var texture = res.getTexture("img/logo.png"); // 另一种获取纹理数据对象
window.setIcon(texture); // 设置窗口图标
window.setTitle("开维游戏引擎 - 俄罗斯方块");


var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 20; 
var startY = 120;

// --- 1. 音效类初始化 ---
var audio = new Audio();
audio.setSoundVolume(1.0); 

// --- 游戏状态变量 ---
var score = 0;
var level = 1;
var totalLinesCleared = 0;
var isGameOver = false;
var grid = [];

function initGridData() {
    grid = [];
    for (var r = 0; r < gridRows; r++) {
        grid[r] = new Array(gridCols).fill(null);
    }
}
initGridData();

// --- UI 节点渲染 (网格、预览窗、标签) ---
var gridNodes = []; 
for (var r = 0; r < gridRows; r++) {
    gridNodes[r] = [];
    for (var c = 0; c < gridCols; c++) {
        var n = new Node();
        n.setSize(blockSize - 1, blockSize - 1);
        n.setPosition(startX + c * blockSize, startY + r * blockSize);
        scene.addNode(n);
        gridNodes[r][c] = n;
    }
}

var previewX = startX + (gridCols * blockSize) + 20;
var previewY = startY + 50;
var previewNodes = [];
for (var r = 0; r < 4; r++) {
    previewNodes[r] = [];
    for (var c = 0; c < 4; c++) {
        var n = new Node();
        n.setSize(18, 18);
        n.setPosition(previewX + c * 20, previewY + r * 20);
        scene.addNode(n);
        previewNodes[r][c] = n;
    }
}

var labUI = new Label();
labUI.setPosition(previewX, startY);
labUI.setSize(200, 40);
labUI.setFont("font/st.ttf", 22);
labUI.setText("得分: 0");
scene.addNode(labUI);

var labGameOver = new Label();
labGameOver.setPosition(startX, startY + 200);
labGameOver.setSize(250, 60);
labGameOver.setFont("font/st.ttf", 40);
labGameOver.setTextColor(1, 0, 0, 1);
labGameOver.setText("GAME OVER");
labGameOver.setHide(true);
scene.addNode(labGameOver);

var btnRestart = new Sprite();
var resBtn = game.getResource().getTexture("img/button.png"); 
btnRestart.setTexture(resBtn);
btnRestart.setPosition(startX + 50, startY + 280);
btnRestart.setSize(150, 50);
btnRestart.setHide(true);
btnRestart.click(() => { restartGame(); });
scene.addNode(btnRestart);

// --- 核心逻辑 ---
var shapes = {
    'I': [[1,1,1,1]], 'L': [[1,0,0], [1,1,1]], 'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]], 'Z': [[1,1,0], [0,1,1]], 'S': [[0,1,1], [1,1,0]], 'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0.2, 0.2, 1], 'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.7, 0, 1]
};

var curPiece = { shape: null, color: [1, 1, 1], x: 0, y: 0 };
var nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];

function spawnPiece() {
    if (isGameOver) return;
    var type = nextType;
    nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];
    curPiece.shape = shapes[type];
    curPiece.color = shapeColors[type];
    curPiece.x = Math.floor(gridCols / 2) - Math.floor(curPiece.shape[0].length / 2);
    curPiece.y = 0;

    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        isGameOver = true;
        labGameOver.setHide(false);
        btnRestart.setHide(false);
    }
}

function checkCollision(nx, ny, shape) {
    for (var r = 0; r < shape.length; r++) {
        for (var c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                var tx = nx + c, ty = ny + r;
                if (tx < 0 || tx >= gridCols || ty >= gridRows) return true;
                if (ty >= 0 && grid[ty][tx]) return true;
            }
        }
    }
    return false;
}

function clearLines() {
    var linesThisTurn = 0;
    for (var r = gridRows - 1; r >= 0; r--) {
        if (grid[r].every(cell => cell !== null)) {
            grid.splice(r, 1);
            grid.unshift(new Array(gridCols).fill(null));
            linesThisTurn++;
            r++; 
        }
    }
    
    if (linesThisTurn > 0) {
        // --- 【音效1：消除音效】 ---
        audio.playSound("sound/1.wav"); 
        
        var basePoints = [0, 100, 300, 500, 800];
        score += basePoints[linesThisTurn] * level;
        totalLinesCleared += linesThisTurn;
        level = Math.floor(totalLinesCleared / 10) + 1;
        labUI.setText("得分: " + score);
    }
}

function restartGame() {
    score = 0; level = 1; totalLinesCleared = 0; isGameOver = false;
    initGridData();
    labUI.setText("得分: 0");
    labGameOver.setHide(true);
    btnRestart.setHide(true);
    spawnPiece();
}

// --- 控制交互 ---
game.setKeyCallBack((key, action) => {
    if (isGameOver || action !== 1) return;
    
    // 左右移动
    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    
    // 向下键：一键触底
    if (key === 40) { 
        while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        lockAndSpawn();
    }
    
    // 【空格键：旋转 + 音效】
    if (key === 32) { 
        var ns = [];
        for (var c = 0; c < curPiece.shape[0].length; c++) {
            ns[c] = [];
            for (var r = curPiece.shape.length - 1; r >= 0; r--) ns[c].push(curPiece.shape[r][c]);
        }
        if (!checkCollision(curPiece.x, curPiece.y, ns)) {
            curPiece.shape = ns;
            // --- 【音效2：旋转音效】 ---
            audio.playSound("sound/1.wav"); 
        }
    }
});

function lockAndSpawn() {
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) grid[curPiece.y + r][curPiece.x + c] = curPiece.color;
        }
    }
    clearLines(); 
    spawnPiece();
}

// --- 渲染循环 ---
var dropTimer = 0;
scene.upDate((time) => {
    if (isGameOver) return;

    var currentInterval = Math.max(5, 30 - (level - 1) * 3);
    if (++dropTimer >= currentInterval) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        else lockAndSpawn();
        dropTimer = 0;
    }

    // 渲染主网格与方块
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var col = grid[r][c];
            gridNodes[r][c].setColor(col ? col[0] : 0.1, col ? col[1] : 0.1, col ? col[2] : 0.1, col ? 1.0 : 0.5);
        }
    }

    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                gridNodes[curPiece.y + r][curPiece.x + c].setColor(curPiece.color[0], curPiece.color[1], curPiece.color[2], 1.0);
            }
        }
    }

    var sNext = shapes[nextType], colNext = shapeColors[nextType];
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            var active = (r < sNext.length && c < sNext[r].length && sNext[r][c]);
            previewNodes[r][c].setColor(active ? colNext[0] : 0.1, active ? colNext[1] : 0.1, active ? colNext[2] : 0.1, active ? 1.0 : 0.2);
        }
    }
});


//========================================================================================
// 增加手柄
//========================================================================================
var texUp    = res.getTexture("img/up.png");
var texDown  = res.getTexture("img/down.png");
var texLeft  = res.getTexture("img/left.png");
var texRight = res.getTexture("img/right.png");
var texChange = res.getTexture("img/change.png");

// 3. 手柄布局参数
// ----------------------------------------------------------------------------------------------
var sprW = 35;  
var sprH = 35;  
var gap  = 0;   
var startX = (w > h) ? 20 : (w - sprW * 3 - gap * 2) / 2 + 135;
var startY = h - (sprH * 3 + gap * 2) - 220;

// --- 提前声明中心提示标签，方便 logic 函数调用 ---
var labCenter = new Label();
labCenter.setSize(sprW, sprH);
labCenter.setPosition(startX + sprW + gap, startY + sprH + gap); 
labCenter.setText(" OK"); 
labCenter.setFont("font/st.ttf", 16);
labCenter.setTextColor(255, 255, 255, 1); 
labCenter.setColor(255, 255, 255, 0.2); // 给中间加个淡淡的方块底色
scene.addNode(labCenter);

// 4. 核心事件逻辑（在此处统一处理显示和业务）
// ----------------------------------------------------------------------------------------------
function logic(dir) {
    log("逻辑触发 -> " + dir);

    // 根据传入的方向参数，统一更新中间 Label 的文字
    if (dir == "up") 
    {
        labCenter.setText("  上");
    } 
    else if (dir == "down") 
    {
        labCenter.setText("  下");
        while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        lockAndSpawn();
    } 
    else if (dir == "left") 
    {
        labCenter.setText("  左");
        if (!checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    } 
    else if (dir == "right") 
    {
        labCenter.setText("  右");
        if (!checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    }
    else if (dir == "change") 
    {
        var ns = [];
        for (var c = 0; c < curPiece.shape[0].length; c++) {
            ns[c] = [];
            for (var r = curPiece.shape.length - 1; r >= 0; r--) ns[c].push(curPiece.shape[r][c]);
        }
        if (!checkCollision(curPiece.x, curPiece.y, ns)) {
            curPiece.shape = ns;
            // --- 【音效2：旋转音效】 ---
            audio.playSound("sound/1.wav"); 
        }

    }
    
    // 你可以在这里继续编写角色的实际移动逻辑
}

// ----------------------------------------------------------------------------------------------
// 【四个独立精灵按钮】
// ----------------------------------------------------------------------------------------------
// 增加一个转换按钮
var sprChange = new Sprite();
sprChange.setTexture(texChange);
sprChange.setSize(sprW, sprH);
sprChange.setPosition(startX + sprW + gap, startY);
sprChange.click(() => { logic("change"); });
scene.addNode(sprChange);

//var sprUp = new Sprite();
//sprUp.setTexture(texUp);
//sprUp.setSize(sprW, sprH);
//sprUp.setPosition(startX + sprW + gap, startY);
//sprUp.click(() => { logic("up"); });
//scene.addNode(sprUp);

var sprDown = new Sprite();
sprDown.setTexture(texDown);
sprDown.setSize(sprW, sprH);
sprDown.setPosition(startX + sprW + gap, startY + (sprH + gap) * 2);
sprDown.click(() => { logic("down"); });
scene.addNode(sprDown);

var sprLeft = new Sprite();
sprLeft.setTexture(texLeft);
sprLeft.setSize(sprW, sprH);
sprLeft.setPosition(startX, startY + sprH + gap);
sprLeft.click(() => { logic("left"); });
scene.addNode(sprLeft);

var sprRight = new Sprite();
sprRight.setTexture(texRight);
sprRight.setSize(sprW, sprH);
sprRight.setPosition(startX + (sprW + gap) * 2, startY + sprH + gap);
sprRight.click(() => { logic("right"); });
scene.addNode(sprRight);



// ----------------------------------------------------------------------------------------------
// 运行
spawnPiece();
game.pushScene(scene);
game.run();

/*

### 更新点说明：

1. **消除反馈**：在 `clearLines` 函数中，只要有行被消除，就会调用 `audio.playSound("sound/1.wav")`。
2. **操作反馈**：在 `game.setKeyCallBack` 监听空格键的分支里，如果旋转动作成功（即不发生碰撞），会同样播放音效。这样玩家在变换形状时能感到明显的“打击感”。
3. **重新开始按钮**：依然保留，且确保重置后音效依然生效。

**现在游戏的操作反馈已经非常丰富了。你还需要给不同形状的方块设置不同的旋转音效，还是想尝试给消除 4 行的情况加一个更震撼的长音效？**
*/