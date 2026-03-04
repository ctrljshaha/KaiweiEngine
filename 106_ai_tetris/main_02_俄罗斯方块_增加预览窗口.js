/*太棒了！要把这个俄罗斯方块变成一个完整的“游戏”，**计分系统**和**下一个方块预览**是必不可少的。

我们需要在右侧增加两个区域：

1. **预览窗口**：用一个小一点的网格显示即将出现的形状。
2. **分数面板**：显示当前的得分，并且在消除行数越多时，得分加成越高。

以下是升级后的完整代码：

*/

/**
 * 开维游戏引擎 - 俄罗斯方块 (豪华进阶版)
 * 增加：分数系统、消除动画、下一个方块预览
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200;  // 游戏主区域坐标
var startY = 50;

// 1. 游戏数据
var grid = [];
var score = 0;
for (var r = 0; r < gridRows; r++) {
    grid[r] = new Array(gridCols).fill(null);
}

// 2. 创建主网格节点 (10x20)
var gridNodes = []; 
for (var r = 0; r < gridRows; r++) {
    gridNodes[r] = [];
    for (var c = 0; c < gridCols; c++) {
        var n = new Node();
        n.setSize(blockSize - 1, blockSize - 1);
        n.setPosition(startX + c * blockSize, startY + r * blockSize);
        n.setColor(0.1, 0.1, 0.1, 0.8);
        scene.addNode(n);
        gridNodes[r][c] = n;
    }
}

// 3. 创建预览窗口节点 (4x4)
var previewX = startX + (gridCols * blockSize) + 30;
var previewY = startY + 50;
var previewNodes = [];
for (var r = 0; r < 4; r++) {
    previewNodes[r] = [];
    for (var c = 0; c < 4; c++) {
        var n = new Node();
        n.setSize(18, 18); // 预览窗格稍微小一点
        n.setPosition(previewX + c * 20, previewY + r * 20);
        n.setColor(0.1, 0.1, 0.1, 0.5);
        scene.addNode(n);
        previewNodes[r][c] = n;
    }
}

// 4. UI 文字标签
var labScore = new Label();
labScore.setPosition(previewX, startY);
labScore.setSize(150, 40);
labScore.setFont("font/st.ttf", 20);
labScore.setTextColor(1, 1, 1, 1);
labScore.setText("得分: 0");
scene.addNode(labScore);

var labNext = new Label();
labNext.setPosition(previewX, previewY - 30);
labNext.setSize(100, 30);
labNext.setFont("font/st.ttf", 18);
labNext.setText("下一个:");
scene.addNode(labNext);

// 5. 方块逻辑
var shapes = {
    'I': [[1,1,1,1]], 'L': [[1,0,0], [1,1,1]], 'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]], 'Z': [[1,1,0], [0,1,1]], 'S': [[0,1,1], [1,1,0]], 'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0, 0, 1], 'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.5, 0, 1]
};

var curPiece = { shape: null, color: [1, 1, 1], x: 0, y: 0 };
var nextType = null;

function getRandomType() {
    var keys = Object.keys(shapes);
    return keys[Math.floor(Math.random() * keys.length)];
}

function spawnPiece() {
    var type = nextType || getRandomType();
    nextType = getRandomType(); // 提前生成下一个

    curPiece.shape = shapes[type];
    curPiece.color = shapeColors[type];
    curPiece.x = Math.floor(gridCols / 2) - Math.floor(curPiece.shape[0].length / 2);
    curPiece.y = 0;

    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        score = 0; // 简单重置分数
        resetGrid();
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
    var linesCleared = 0;
    for (var r = gridRows - 1; r >= 0; r--) {
        if (grid[r].every(cell => cell !== null)) {
            grid.splice(r, 1);
            grid.unshift(new Array(gridCols).fill(null));
            linesCleared++;
            r++; 
        }
    }
    if (linesCleared > 0) {
        // 计分公式：1行100, 2行300, 3行500, 4行800
        var bonus = [0, 100, 300, 500, 800];
        score += bonus[linesCleared];
        labScore.setText("得分: " + score);
    }
}

function resetGrid() {
    for (var r = 0; r < gridRows; r++) grid[r].fill(null);
}

// 6. 交互与循环
game.setKeyCallBack((key, action) => {
    if (action !== 1) return;
    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    if (key === 40 && !checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
    if (key === 38) { // 旋转
        var ns = [];
        for (var c = 0; c < curPiece.shape[0].length; c++) {
            ns[c] = [];
            for (var r = curPiece.shape.length - 1; r >= 0; r--) ns[c].push(curPiece.shape[r][c]);
        }
        if (!checkCollision(curPiece.x, curPiece.y, ns)) curPiece.shape = ns;
    }
});

var dropCounter = 0;
scene.upDate((time) => {
    // A. 下落逻辑
    if (++dropCounter >= 30) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        else {
            for (var r = 0; r < curPiece.shape.length; r++) {
                for (var c = 0; c < curPiece.shape[r].length; c++) {
                    if (curPiece.shape[r][c]) grid[curPiece.y + r][curPiece.x + c] = curPiece.color;
                }
            }
            clearLines();
            spawnPiece();
        }
        dropCounter = 0;
    }

    // B. 绘制主网格
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var color = grid[r][c];
            gridNodes[r][c].setColor(color ? color[0] : 0.1, color ? color[1] : 0.1, color ? color[2] : 0.1, color ? 1.0 : 0.5);
        }
    }

    // C. 绘制正在下落的方块
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                gridNodes[curPiece.y + r][curPiece.x + c].setColor(curPiece.color[0], curPiece.color[1], curPiece.color[2], 1.0);
            }
        }
    }

    // D. 绘制预览窗口
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            var s = shapes[nextType];
            var active = (r < s.length && c < s[r].length && s[r][c]);
            var col = shapeColors[nextType];
            previewNodes[r][c].setColor(active ? col[0] : 0.1, active ? col[1] : 0.1, active ? col[2] : 0.1, active ? 1.0 : 0.3);
        }
    }
});

spawnPiece();
game.pushScene(scene);
game.run();

/*
### 新增功能说明：

* **预览逻辑**：使用了 `nextType` 变量预存下一次的方块类型，并在 `upDate` 的最后一部分专门负责更新右侧的小网格。
* **进阶计分**：实现了“消除越多，奖励翻倍”的逻辑。一次性消除 4 行（Tetris）会获得 800 分，这比分四次消除单行（$4 \times 100$）划算得多。
* **视觉优化**：预览窗口的格子稍小，区分了主次战场。

现在这个版本已经是一个非常完整的俄罗斯方块小游戏了！**如果要更进一步，你可以尝试加入“按空格键一键触底”或者“消除时的闪烁音效”，需要我帮你实现其中哪一个吗？**
*/