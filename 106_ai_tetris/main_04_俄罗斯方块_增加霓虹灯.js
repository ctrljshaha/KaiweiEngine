/*这就是我们要的“终极赛博朋克”版本！我们将引入**动态速度衰减算法**（关卡系统）和**霓虹发光视觉效果**。

### 核心升级：

1. **霓虹灯效**：通过在 `upDate` 渲染时引入 `Math.sin(frameCount)` 随时间波动的 Alpha 值，让方块边缘产生一种“呼吸闪烁”的霓虹感。
2. **关卡系统**：新增 `level` 变量。每消除 10 行，等级提升，下落间隔 `dropInterval` 就会缩短，游戏变得越来越快。

### 终极霓虹版：俄罗斯方块完整代码
*/


/**
 * 开维游戏引擎 - 俄罗斯方块 (霓虹关卡版)
 * 特性：
 * 1. 关卡递增：速度随消除行数加快
 * 2. 霓虹呼吸灯：方块带有发光闪烁效果
 * 3. 一键触底 & 消除音效
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200; 
var startY = 50;

// 1. 资源与音效
var audio = new Audio();
audio.setSoundVolume(1.0);

var grid = [];
var score = 0;
var level = 1;
var totalLinesCleared = 0;
var dropInterval = 30; // 初始速度：30帧/格

for (var r = 0; r < gridRows; r++) grid[r] = new Array(gridCols).fill(null);

// 2. UI 渲染节点
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

// 侧边栏 UI
var previewX = startX + (gridCols * blockSize) + 40;
var labScore = new Label();
labScore.setPosition(previewX, startY);
labScore.setSize(180, 80);
labScore.setFont("font/st.ttf", 22);
labScore.setTextColor(0, 1, 1, 1); // 青色霓虹字
scene.addNode(labScore);

// 3. 游戏逻辑
var shapes = {
    'I': [[1,1,1,1]], 'L': [[1,0,0], [1,1,1]], 'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]], 'Z': [[1,1,0], [0,1,1]], 'S': [[0,1,1], [1,1,0]], 'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0.2, 0.2, 1], 'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.7, 0, 1]
};

var curPiece = { shape: null, color: [1, 1, 1], x: 0, y: 0 };
var nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];
var frameCount = 0;

function spawnPiece() {
    var type = nextType;
    nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];
    curPiece.shape = shapes[type];
    curPiece.color = shapeColors[type];
    curPiece.x = Math.floor(gridCols / 2) - Math.floor(curPiece.shape[0].length / 2);
    curPiece.y = 0;

    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        score = 0; level = 1; totalLinesCleared = 0; dropInterval = 30;
        for (var r = 0; r < gridRows; r++) grid[r].fill(null);
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
    var lines = 0;
    for (var r = gridRows - 1; r >= 0; r--) {
        if (grid[r].every(cell => cell !== null)) {
            grid.splice(r, 1);
            grid.unshift(new Array(gridCols).fill(null));
            lines++; r++; 
        }
    }
    if (lines > 0) {
        audio.playSound("sound/1.wav"); 
        score += [0, 100, 300, 500, 800][lines] * level;
        totalLinesCleared += lines;
        
        // --- 关卡升级逻辑 ---
        level = Math.floor(totalLinesCleared / 10) + 1;
        dropInterval = Math.max(5, 30 - (level - 1) * 3); // 每升一级快3帧，最快5帧一格
    }
}

// 4. 输入控制
game.setKeyCallBack((key, action) => {
    if (action !== 1) return;
    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    if (key === 40 && !checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
    if (key === 32) { // 空格一键触底
        while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        lockAndSpawn();
    }
    if (key === 38) { // 旋转
        var ns = [];
        for (var c = 0; c < curPiece.shape[0].length; c++) {
            ns[c] = [];
            for (var r = curPiece.shape.length - 1; r >= 0; r--) ns[c].push(curPiece.shape[r][c]);
        }
        if (!checkCollision(curPiece.x, curPiece.y, ns)) curPiece.shape = ns;
    }
});

function lockAndSpawn() {
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) grid[curPiece.y + r][curPiece.x + c] = curPiece.color;
        }
    }
    clearLines(); spawnPiece();
}

// 5. 循环与霓虹渲染
var dropTimer = 0;
scene.upDate((time) => {
    frameCount++;
    if (++dropTimer >= dropInterval) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        else lockAndSpawn();
        dropTimer = 0;
    }

    labScore.setText("等级: " + level + "\n得分: " + score);

    // --- 霓虹呼吸灯算法 ---
    // 计算一个随时间正弦波动的透明度 (0.6 到 1.0 之间)
    var neonAlpha = 0.8 + Math.sin(frameCount * 0.15) * 0.2;

    // 绘制主网格
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var col = grid[r][c];
            if (col) {
                gridNodes[r][c].setColor(col[0], col[1], col[2], neonAlpha);
            } else {
                gridNodes[r][c].setColor(0.05, 0.05, 0.1, 0.4); // 暗蓝色背景感
            }
        }
    }

    // 绘制活跃方块 (颜色稍亮，不参与呼吸，方便辨认)
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                var col = curPiece.color;
                gridNodes[curPiece.y + r][curPiece.x + c].setColor(col[0], col[1], col[2], 1.0);
            }
        }
    }
});

spawnPiece();
game.pushScene(scene);
game.run();

/*

### 霓虹版亮点：

1. **呼吸灯渲染**：我们没有直接修改节点颜色，而是在 `upDate` 里根据 `Math.sin` 实时计算 `neonAlpha`。这会让场地上已经落下的方块产生一种“能量律动”的视觉感。
2. **动态难度调节**：`dropInterval = Math.max(5, 30 - (level - 1) * 3)`。
* **Level 1**: 每 30 帧下落一格（约 0.5 秒）。
* **Level 5**: 每 18 帧下落一格。
* **Level 10**: 每 5 帧下落一格（极速挑战模式）。


3. **计分加成**：得分不仅取决于消除行数，还乘以了当前的 `level`，鼓励玩家向高难度挑战。

这套代码现在已经是一个功能完备、带有视觉特效和数值深度的成熟作品了！如果你还想继续折腾，可以考虑加入**“影子预览”**（在方块正下方显示它落点后的虚影），或者**“按住下方向键极速下落”**。想试试哪一个？
*/