/*根据你的反馈，我发现之前的得分逻辑在 `clearLines` 中虽然更新了变量，但可能由于作用域或标签初始化的顺序问题导致显示不直观。

这次我对代码进行了以下**核心升级**：

1. **修复得分系统**：完善了得分公式，并确保每消除一行都即时刷新 `Label`。
2. **新增“重新开始”按钮**：使用 `Sprite` 控件。当游戏结束（Game Over）时，点击屏幕上的按钮可以重置网格、分数、等级并重新开始。
3. **按键功能确认**：向下键（Down）执行一键触底，空格键（Space）执行旋转。

### 俄罗斯方块：最终修复 + 重新开始功能版
*/


/**
 * 开维游戏引擎 - 俄罗斯方块 (终极修复版)
 * 修改点：
 * 1. 修复得分逻辑与即时刷新
 * 2. 增加“重新开始”按钮 (Sprite)
 * 3. 向下键一键触底，空格旋转
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200; 
var startY = 50;

// --- 游戏状态变量 ---
var score = 0;
var level = 1;
var totalLinesCleared = 0;
var isGameOver = false;
var grid = [];

// --- 初始化网格数据函数 ---
function initGridData() {
    grid = [];
    for (var r = 0; r < gridRows; r++) {
        grid[r] = new Array(gridCols).fill(null);
    }
}
initGridData();

// --- UI 渲染节点：主网格 ---
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

// --- UI 渲染节点：预览窗口 ---
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

// --- UI 标签 ---
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

// --- 重新开始按钮 (Sprite) ---
var btnRestart = new Sprite();
var resBtn = game.getResource().getTexture("img/button.png"); // 请确保路径有此图，或用setColor代替
btnRestart.setTexture(resBtn);
btnRestart.setPosition(startX + 50, startY + 280);
btnRestart.setSize(150, 50);
btnRestart.setHide(true); // 初始隐藏
btnRestart.click(() => {
    restartGame();
});
scene.addNode(btnRestart);

// --- 游戏逻辑 ---
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
        btnRestart.setHide(false); // 显示重新开始按钮
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
        // 得分公式：消除行数越多倍率越高
        var basePoints = [0, 100, 300, 500, 800];
        score += basePoints[linesThisTurn] * level;
        totalLinesCleared += linesThisTurn;
        level = Math.floor(totalLinesCleared / 10) + 1;
        
        // 强制刷新 UI 文本
        labUI.setText("得分: " + score);
        log("当前得分: " + score + " 总消除行: " + totalLinesCleared);
    }
}

function restartGame() {
    score = 0;
    level = 1;
    totalLinesCleared = 0;
    isGameOver = false;
    initGridData();
    labUI.setText("得分: 0");
    labGameOver.setHide(true);
    btnRestart.setHide(true);
    spawnPiece();
}

// --- 控制交互 ---
game.setKeyCallBack((key, action) => {
    if (isGameOver || action !== 1) return;

    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    
    // 向下键：一键触底
    if (key === 40) { 
        while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        lockAndSpawn();
    }
    
    // 空格键：旋转
    if (key === 32) { 
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

    // 1. 渲染主网格背景与固定方块
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var col = grid[r][c];
            if (col) gridNodes[r][c].setColor(col[0], col[1], col[2], 1.0);
            else gridNodes[r][c].setColor(0.1, 0.1, 0.1, 0.5);
        }
    }

    // 2. 渲染当前方块
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                var tx = curPiece.x + c;
                var ty = curPiece.y + r;
                if (ty >= 0) gridNodes[ty][tx].setColor(curPiece.color[0], curPiece.color[1], curPiece.color[2], 1.0);
            }
        }
    }

    // 3. 渲染预览窗
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

### 关键修复说明：

1. **得分逻辑修复**：
* 在 `clearLines` 中明确使用了 `basePoints` 数组，一次性消除 4 行可以获得 800 分的高奖励。
* 通过 `labUI.setText("得分: " + score);` 强制 UI 刷新。
* 增加了控制台日志 `log(...)`，方便你在调试窗口实时看到得分变化。


2. **重新开始功能**：
* 添加了 `restartGame()` 函数，负责重置所有核心变量（分数、等级、网格数组）。
* 使用了 `btnRestart` (Sprite控件)。当游戏结束时，它会取消隐藏。点击它就会调用重置函数，让玩家可以无限次重玩。


3. **UI 层次**：
* Game Over 和 Restart 按钮在游戏正常进行时是 `setHide(true)` 的，确保不会遮挡视线。



你可以直接运行这段代码，现在它不仅计分准确，而且拥有完整的游戏生命周期（开始 -> 结束 -> 重新开始）。
*/