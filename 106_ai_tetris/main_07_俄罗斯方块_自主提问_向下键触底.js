/*好的，针对你的最新要求，我对代码进行了针对性修改：

1. **按键逻辑调整**：将 `向下键 (Key 40)` 改为 **“一键触底”**（原本在空格键上的功能），现在点击下方向键方块会直接掉落到最底部并锁定。
2. **得分逻辑修复**：修正了得分显示的更新机制。确保在 `clearLines` 函数中计算完分数后，立即调用 `labUI.setText` 更新界面上的文字。
3. **综合优化**：保留了之前的空格键旋转、图形预览窗口和 Game Over 显示功能。

### 俄罗斯方块：最终修正版
*/


/**
 * 开维游戏引擎 - 俄罗斯方块 (功能修正版)
 * 修改点：
 * 1. 向下键 (Down) -> 一键触底 (Hard Drop)
 * 2. 修复得分不刷新的问题
 * 3. 空格键 (Space) -> 变换形状 (旋转)
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200; 
var startY = 50;

// --- 游戏数据变量 ---
var audio = new Audio();
var score = 0;
var level = 1;
var totalLinesCleared = 0;
var frameCount = 0;
var isGameOver = false;

var grid = [];
for (var r = 0; r < gridRows; r++) grid[r] = new Array(gridCols).fill(null);

// --- 初始化 UI 节点 ---
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
labUI.setText("得分: 0"); // 初始分数
scene.addNode(labUI);

var labGameOver = new Label();
labGameOver.setPosition(startX + 20, startY + 200);
labGameOver.setSize(220, 100);
labGameOver.setFont("font/st.ttf", 40);
labGameOver.setTextColor(1, 0, 0, 1);
labGameOver.setText("GAME OVER");
labGameOver.setHide(true);
scene.addNode(labGameOver);

// --- 形状与颜色定义 ---
var shapes = {
    'I': [[1,1,1,1]], 'L': [[1,0,0], [1,1,1]], 'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]], 'Z': [[1,1,0], [0,1,1]], 'S': [[0,1,1], [1,1,0]], 'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0.2, 0.2, 1], 'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.7, 0, 1]
};

var curPiece = { shape: null, color: [1, 1, 1], x: 0, y: 0 };
var nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];

// --- 核心逻辑函数 ---
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
        // 修正得分计算：增加得分并立即刷新 Label 显示
        score += [0, 100, 300, 500, 800][lines] * level;
        totalLinesCleared += lines;
        level = Math.floor(totalLinesCleared / 10) + 1;
        labUI.setText("得分: " + score); // 关键：更新界面文字
    }
}

function lockAndSpawn() {
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) grid[curPiece.y + r][curPiece.x + c] = curPiece.color;
        }
    }
    clearLines(); 
    spawnPiece();
}

// --- 控制逻辑 ---
game.setKeyCallBack((key, action) => {
    if (isGameOver || action !== 1) return;

    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    
    // 【修改点1】向下键 (Key 40) 改为一键触底
    if (key === 40) { 
        while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) {
            curPiece.y++;
        }
        lockAndSpawn();
    }
    
    // 空格键旋转
    if (key === 32) { 
        var ns = [];
        for (var c = 0; c < curPiece.shape[0].length; c++) {
            ns[c] = [];
            for (var r = curPiece.shape.length - 1; r >= 0; r--) ns[c].push(curPiece.shape[r][c]);
        }
        if (!checkCollision(curPiece.x, curPiece.y, ns)) {
            curPiece.shape = ns;
        }
    }
});

// --- 渲染循环 ---
var dropTimer = 0;
scene.upDate((time) => {
    if (isGameOver) return;

    frameCount++;
    var currentInterval = Math.max(5, 30 - (level - 1) * 3);
    
    if (++dropTimer >= currentInterval) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) {
            curPiece.y++;
        } else {
            lockAndSpawn();
        }
        dropTimer = 0;
    }

    // 绘制影子预览 (Ghost)
    var gy = curPiece.y;
    while (!checkCollision(curPiece.x, gy + 1, curPiece.shape)) gy++;

    // 渲染网格与方块
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var col = grid[r][c];
            if (col) gridNodes[r][c].setColor(col[0], col[1], col[2], 0.8);
            else gridNodes[r][c].setColor(0.1, 0.1, 0.1, 0.4);
        }
    }

    // 渲染影子 (虚线感)
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                gridNodes[gy + r][curPiece.x + c].setColor(curPiece.color[0], curPiece.color[1], curPiece.color[2], 0.2);
                gridNodes[curPiece.y + r][curPiece.x + c].setColor(curPiece.color[0], curPiece.color[1], curPiece.color[2], 1.0);
            }
        }
    }

    // 渲染右侧预览窗
    var sNext = shapes[nextType];
    var colNext = shapeColors[nextType];
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            var active = (r < sNext.length && c < sNext[r].length && sNext[r][c]);
            if (active) previewNodes[r][c].setColor(colNext[0], colNext[1], colNext[2], 1.0);
            else previewNodes[r][c].setColor(0.1, 0.1, 0.1, 0.2);
        }
    }
});

spawnPiece();
game.pushScene(scene);
game.run();

/*

### 修改说明：

1. **Hard Drop (一键触底)**：在键盘回调函数里，检测到 `key === 40` (向下键) 时，执行了一个 `while` 循环直到检测到碰撞。这使得方块瞬间降落到底部。
2. **得分显示修复**：在 `clearLines` 函数中，计算完 `score` 后，新增了 `labUI.setText("得分: " + score);`。以前得分不变化通常是因为没有执行这行代码将逻辑上的变量值同步给 UI 组件。
3. **UI 预览修复**：预览窗口的逻辑进行了微调，确保 `nextType` 能够正确在 4x4 网格中渲染出对应的方块颜色和形状。
*/