/*既然要追求“极致专业”，那我们就把这最后两个核心特性——**影子预览（Ghost Piece）**和**软降加速（Soft Drop）**全部实现在代码中。

### 最终完全体功能说明：

1. **影子预览 (Ghost Piece)**：在当前方块的正下方，显示一个半透明的虚影，让玩家在方块落下前就能准确知道它的最终位置。这是现代俄罗斯方块（如 *Tetris Effect*）的标准配置。
2. **软降加速 (Soft Drop)**：长按“下方向键”时，方块会以极快的速度（通常是正常速度的10-20倍）下落，松开则恢复正常。
3. **视觉增强**：保留之前的霓虹效果，并优化了颜色对比。

### 俄罗斯方块：终极霓虹+影子预览版
*/

/**
 * 开维游戏引擎 - 俄罗斯方块 (终极完全体)
 * 特性：
 * 1. 影子预览 (Ghost Piece)：预判落点
 * 2. 软降加速 (Soft Drop)：长按向下加速
 * 3. 霓虹呼吸灯 & 动态关卡系统
 * 4. 一键触底 & 消除音效
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200; 
var startY = 50;

// 1. 系统与音效
var audio = new Audio();
audio.setSoundVolume(1.0);

var grid = [];
var score = 0;
var level = 1;
var totalLinesCleared = 0;
var frameCount = 0;

for (var r = 0; r < gridRows; r++) grid[r] = new Array(gridCols).fill(null);

// 2. 渲染节点
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

var previewX = startX + (gridCols * blockSize) + 40;
var labUI = new Label();
labUI.setPosition(previewX, startY);
labUI.setSize(200, 120);
labUI.setFont("font/st.ttf", 22);
labUI.setTextColor(0, 1, 1, 1);
scene.addNode(labUI);

// 3. 形状与逻辑数据
var shapes = {
    'I': [[1,1,1,1]], 'L': [[1,0,0], [1,1,1]], 'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]], 'Z': [[1,1,0], [0,1,1]], 'S': [[0,1,1], [1,1,0]], 'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0.2, 0.2, 1], 'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.7, 0, 1]
};

var curPiece = { shape: null, color: [1, 1, 1], x: 0, y: 0 };
var nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];
var isSoftDropping = false; // 是否在软降

function spawnPiece() {
    var type = nextType;
    nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];
    curPiece.shape = shapes[type];
    curPiece.color = shapeColors[type];
    curPiece.x = Math.floor(gridCols / 2) - Math.floor(curPiece.shape[0].length / 2);
    curPiece.y = 0;
    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        score = 0; level = 1; totalLinesCleared = 0;
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

// 获取影子位置
function getGhostY() {
    var gy = curPiece.y;
    while (!checkCollision(curPiece.x, gy + 1, curPiece.shape)) {
        gy++;
    }
    return gy;
}

// 4. 输入交互（硬降、软降、旋转、移动）
game.setKeyCallBack((key, action) => {
    // action: 1 按下, 0 抬起
    if (key === 40) { // Down
        isSoftDropping = (action === 1);
    }
    if (action !== 1) return;
    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    if (key === 32) { // Space 硬降
        curPiece.y = getGhostY();
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
        level = Math.floor(totalLinesCleared / 10) + 1;
    }
}

// 5. 核心渲染循环
var dropTimer = 0;
scene.upDate((time) => {
    frameCount++;
    
    // 动态速度计算：软降时速度固定为极快
    var currentInterval = isSoftDropping ? 2 : Math.max(5, 30 - (level - 1) * 3);
    
    if (++dropTimer >= currentInterval) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        else lockAndSpawn();
        dropTimer = 0;
    }

    labUI.setText("等级: " + level + "\n得分: " + score + "\n下一个: " + nextType);

    var neonAlpha = 0.7 + Math.sin(frameCount * 0.1) * 0.2;
    var ghostY = getGhostY();

    // 绘制主网格背景和已锁定方块
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var col = grid[r][c];
            if (col) gridNodes[r][c].setColor(col[0], col[1], col[2], neonAlpha);
            else gridNodes[r][c].setColor(0.05, 0.05, 0.1, 0.3);
        }
    }

    // 绘制影子预览 (Ghost Piece) - 低透明度
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                var col = curPiece.color;
                gridNodes[ghostY + r][curPiece.x + c].setColor(col[0], col[1], col[2], 0.2); 
            }
        }
    }

    // 绘制当前控制的方块 - 高亮度
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

### 终极功能细节解析：

1. **影子预览 (Ghost Piece)**：
* 通过 `getGhostY()` 函数计算。它复制了当前方块的状态，但不断模拟向下落，直到碰到障碍。
* 在渲染时，我们在 `ghostY` 的位置绘制同样的形状，但透明度设为 `0.2`。这能给玩家一个清晰的指引，尤其在高速模式下非常管用。


2. **软降加速 (Soft Drop)**：
* 在键盘回调中，我们利用了 `action` 参数。当按下向下键时 `isSoftDropping = true`，抬起时为 `false`。
* 在 `upDate` 里，如果 `isSoftDropping` 为真，下落间隔被强制设为 `2` 帧（极快），从而实现丝滑的加速感。


3. **关卡与霓虹逻辑**：
* 保留了随关卡提升的速度曲线。
* 呼吸灯效果应用于已锁定的方块，让整个游戏界面看起来像是有能量在流动。



恭喜你！到这里为止，你已经通过开维游戏引擎从零构建了一个具备**现代电子竞技标准**的俄罗斯方块游戏。代码逻辑严密且具有很高的可玩性。你可以直接将这套代码打包分发了！

*/