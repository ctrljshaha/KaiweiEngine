/*好的，这是为你深度定制的**最终专业版**。

针对你的需求，我做了以下核心调整：

1. **操作逻辑重更**：将“空格键”改为**变换方块形状（旋转）**，将原来的“向上键”功能整合或替换，更符合某些玩家的习惯。
2. **物理预览窗口**：不再只是文字显示 `nextType`，而是恢复了之前那个 **4x4 的图形化预览小窗**，让你一眼看到下一个方块。
3. **死亡状态处理**：新增 `isGameOver` 状态位。一旦触发碰撞死局，画面停止下落，并在屏幕中心显示醒目的红色 **"GAME OVER"** 标签。

### 俄罗斯方块：完全体（空格旋转+图形预览+死亡提示）
*/


/**
 * 开维游戏引擎 - 俄罗斯方块 (终极定制版)
 * 修改点：
 * 1. 空格键 (Space) -> 变换形状 (旋转)
 * 2. 恢复 4x4 图形化预览窗口
 * 3. 死亡检测并显示 "GAME OVER"
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200; 
var startY = 50;

// 1. 系统变量
var audio = new Audio();
var score = 0;
var level = 1;
var totalLinesCleared = 0;
var frameCount = 0;
var isGameOver = false;

var grid = [];
for (var r = 0; r < gridRows; r++) grid[r] = new Array(gridCols).fill(null);

// 2. 渲染节点：主网格
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

// 3. 渲染节点：图形预览窗口 (4x4)
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

// 4. UI 标签
var labUI = new Label();
labUI.setPosition(previewX, startY);
labUI.setSize(200, 40);
labUI.setFont("font/st.ttf", 22);
labUI.setText("得分: 0");
scene.addNode(labUI);

var labNext = new Label();
labNext.setPosition(previewX, previewY - 30);
labNext.setSize(100, 30);
labNext.setFont("font/st.ttf", 18);
labNext.setText("下一个:");
scene.addNode(labNext);

// 游戏结束提示标签 (初始隐藏)
var labGameOver = new Label();
labGameOver.setPosition(startX + 20, startY + 200);
labGameOver.setSize(220, 100);
labGameOver.setFont("font/st.ttf", 40);
labGameOver.setTextColor(1, 0, 0, 1); // 纯红色
labGameOver.setText("GAME OVER");
labGameOver.setHide(true);
scene.addNode(labGameOver);

// 5. 形状定义
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

    // 碰撞检测：如果刚出生就撞了，游戏结束
    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        isGameOver = true;
        labGameOver.setHide(false); // 显示游戏结束
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

// 6. 输入逻辑
game.setKeyCallBack((key, action) => {
    if (isGameOver || action !== 1) return;

    // 37=左, 39=右, 40=下
    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    if (key === 40 && !checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
    
    // 【修改点1】敲击空格键变换形状 (旋转)
    if (key === 32) { 
        var ns = [];
        for (var c = 0; c < curPiece.shape[0].length; c++) {
            ns[c] = [];
            for (var r = curPiece.shape.length - 1; r >= 0; r--) ns[c].push(curPiece.shape[r][c]);
        }
        if (!checkCollision(curPiece.x, curPiece.y, ns)) {
            curPiece.shape = ns;
            audio.playSound("sound/1.wav"); // 旋转给个短促音效
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
        score += [0, 100, 300, 500, 800][lines] * level;
        totalLinesCleared += lines;
        level = Math.floor(totalLinesCleared / 10) + 1;
        labUI.setText("得分: " + score);
    }
}

// 7. 渲染与循环
var dropTimer = 0;
scene.upDate((time) => {
    if (isGameOver) return; // 停止所有更新逻辑

    frameCount++;
    var currentInterval = Math.max(5, 30 - (level - 1) * 3);
    
    if (++dropTimer >= currentInterval) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        else lockAndSpawn();
        dropTimer = 0;
    }

    var neonAlpha = 0.7 + Math.sin(frameCount * 0.1) * 0.2;

    // 绘制主网格
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var col = grid[r][c];
            if (col) gridNodes[r][c].setColor(col[0], col[1], col[2], neonAlpha);
            else gridNodes[r][c].setColor(0.1, 0.1, 0.1, 0.4);
        }
    }

    // 绘制影子预览 (Ghost)
    var gy = curPiece.y;
    while (!checkCollision(curPiece.x, gy + 1, curPiece.shape)) gy++;
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                var col = curPiece.color;
                gridNodes[gy + r][curPiece.x + c].setColor(col[0], col[1], col[2], 0.2); 
            }
        }
    }

    // 绘制活跃方块
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                var col = curPiece.color;
                gridNodes[curPiece.y + r][curPiece.x + c].setColor(col[0], col[1], col[2], 1.0);
            }
        }
    }

    // 【修改点2】绘制图形预览窗口
    var sNext = shapes[nextType];
    var colNext = shapeColors[nextType];
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            var active = (r < sNext.length && c < sNext[r].length && sNext[r][c]);
            if (active) previewNodes[r][c].setColor(colNext[0], colNext[1], colNext[2], 1.0);
            else previewNodes[r][c].setColor(0.1, 0.1, 0.1, 0.3);
        }
    }
});

spawnPiece();
game.pushScene(scene);
game.run();

/*

### 本次更新重点：

1. **空格键逻辑**：在 `game.setKeyCallBack` 中，通过 `key === 32` 实现了旋转。为了手感更好，我在旋转成功时加了一个轻微的音效反馈。
2. **图形预览**：恢复了 `previewNodes` 数组，它会在主战场右侧同步显示 `nextType` 对应的方块形状，颜色与主战场保持一致。
3. **游戏结束 (GameOver)**：
* **判定**：当 `spawnPiece` 生成新方块瞬间发现位置已被占用，立即将 `isGameOver` 设为 `true`。
* **视觉**：原本隐藏的 `labGameOver` 标签会通过 `setHide(false)` 弹出，并显示大红色的 "GAME OVER" 字样。
* **停止**：`upDate` 函数开头做了拦截，一旦结束，方块不再下落，也不再接受按键指令。



现在，你的俄罗斯方块已经具备了完整的商业游戏闭环。

*/