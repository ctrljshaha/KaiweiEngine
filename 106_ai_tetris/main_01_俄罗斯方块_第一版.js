/*编写俄罗斯方块需要处理**网格逻辑、方块旋转、消除检测以及自动下落**。

根据你提供的开维游戏引擎 SDK 示例，我为你编写了一个结构清晰、注释完整的俄罗斯方块游戏代码。为了方便运行，我默认使用了简单的 `Node` 变色来代表方块。

### 核心逻辑：

1. **网格系统**：10x20 的二维数组，记录哪些格子已经有方块。
2. **方块数据**：定义 7 种经典形状（I, J, L, O, S, T, Z）。
3. **碰撞检测**：移动或旋转前，先判断目标位置是否越界或已被占用。

---

### 完整代码
*/

/**
 * 开维游戏引擎 - 俄罗斯方块 (Tetris)
 */

// 1. 初始化引擎
game.init();
game.setFPS(60); // 高帧率保证输入灵敏度，下落速度通过逻辑控制

var scene = new Scene();
var blockSize = 25; // 每个小方格的大小
var gridCols = 10;
var gridRows = 20;
var startX = 250;   // 游戏区域在屏幕上的偏移位置
var startY = 50;

// 2. 游戏数据与网格
var grid = []; // 存储已经固定的方块颜色
for (var r = 0; r < gridRows; r++) {
    grid[r] = [];
    for (var c = 0; c < gridCols; c++) {
        grid[r][c] = null;
    }
}

// 渲染网格的物理节点
var gridNodes = []; 
for (var r = 0; r < gridRows; r++) {
    gridNodes[r] = [];
    for (var c = 0; c < gridCols; c++) {
        var n = new Node();
        n.setSize(blockSize - 1, blockSize - 1); // 减1留出空隙感
        n.setPosition(startX + c * blockSize, startY + r * blockSize);
        n.setColor(0.2, 0.2, 0.2, 0.5); // 默认背景底色
        scene.addNode(n);
        gridNodes[r][c] = n;
    }
}

// 3. 方块形状定义 (7种)
var shapes = {
    'I': [[1,1,1,1]],
    'L': [[1,0,0], [1,1,1]],
    'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]],
    'Z': [[1,1,0], [0,1,1]],
    'S': [[0,1,1], [1,1,0]],
    'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0, 0, 1],
    'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.5, 0, 1]
};

// 当前活跃方块
var curPiece = {
    shape: null,
    color: [1, 1, 1],
    x: 0,
    y: 0
};

// 4. 核心逻辑函数
function spawnPiece() {
    var keys = Object.keys(shapes);
    var type = keys[Math.floor(Math.random() * keys.length)];
    curPiece.shape = shapes[type];
    curPiece.color = shapeColors[type];
    curPiece.x = Math.floor(gridCols / 2) - Math.floor(curPiece.shape[0].length / 2);
    curPiece.y = 0;

    // 检查是否一出生就碰撞 -> 游戏结束
    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        log("GAME OVER");
        resetGame();
    }
}

function checkCollision(nx, ny, shape) {
    for (var r = 0; r < shape.length; r++) {
        for (var c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                var targetX = nx + c;
                var targetY = ny + r;
                // 边界检测
                if (targetX < 0 || targetX >= gridCols || targetY >= gridRows) return true;
                // 碰撞检测
                if (targetY >= 0 && grid[targetY][targetX]) return true;
            }
        }
    }
    return false;
}

function rotatePiece() {
    var s = curPiece.shape;
    var newShape = [];
    for (var c = 0; c < s[0].length; c++) {
        newShape[c] = [];
        for (var r = s.length - 1; r >= 0; r--) {
            newShape[c].push(s[r][c]);
        }
    }
    if (!checkCollision(curPiece.x, curPiece.y, newShape)) {
        curPiece.shape = newShape;
    }
}

function lockPiece() {
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                grid[curPiece.y + r][curPiece.x + c] = curPiece.color;
            }
        }
    }
    clearLines();
    spawnPiece();
}

function clearLines() {
    for (var r = gridRows - 1; r >= 0; r--) {
        if (grid[r].every(cell => cell !== null)) {
            grid.splice(r, 1);
            grid.unshift(new Array(gridCols).fill(null));
            r++; // 消除后检查同一行
        }
    }
}

function resetGame() {
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) grid[r][c] = null;
    }
    spawnPiece();
}

// 5. 键盘交互
game.setKeyCallBack((key, action) => {
    if (action !== 1) return; // 仅处理按下，不处理抬起
    if (key === 37) { // Left
        if (!checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    } else if (key === 39) { // Right
        if (!checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    } else if (key === 40) { // Down
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
    } else if (key === 38 || key === 32) { // Up or Space to Rotate
        rotatePiece();
    }
});

// 6. 游戏循环 (自动下落)
var dropCounter = 0;
var dropInterval = 30; // 30帧下落一格
scene.upDate((time) => {
    dropCounter++;
    if (dropCounter >= dropInterval) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) {
            curPiece.y++;
        } else {
            lockPiece();
        }
        dropCounter = 0;
    }

    // 渲染：清空并重绘网格
    for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
            var color = grid[r][c];
            if (color) {
                gridNodes[r][c].setColor(color[0], color[1], color[2], 1.0);
            } else {
                gridNodes[r][c].setColor(0.1, 0.1, 0.1, 0.5);
            }
        }
    }
    // 渲染：绘制当前移动的方块
    for (var r = 0; r < curPiece.shape.length; r++) {
        for (var c = 0; c < curPiece.shape[r].length; c++) {
            if (curPiece.shape[r][c]) {
                var drawX = curPiece.x + c;
                var drawY = curPiece.y + r;
                if (drawY >= 0 && drawY < gridRows) {
                    gridNodes[drawY][drawX].setColor(curPiece.color[0], curPiece.color[1], curPiece.color[2], 1.0);
                }
            }
        }
    }
});

// 7. 启动
spawnPiece();
game.pushScene(scene);
game.run();

/*
---

### 实现要点解析：

1. **节点池复用**：我在初始化时预先创建了 $10 \times 20$ 个 `Node` 对象存入 `gridNodes`。在 `upDate` 每一帧中，我只是修改这些节点的颜色，而不是频繁增删节点，这符合游戏开发的高性能原则。
2. **碰撞检测算法**：`checkCollision` 是游戏的核心。它通过遍历方块形状的矩阵，计算出相对于网格的绝对坐标，判断该坐标是否超出了网格范围或是否已经有非空颜色值。
3. **消除逻辑**：使用 `grid.splice(r, 1)` 移除满行，再用 `grid.unshift` 在顶部补上一行空数据。这种数组操作简单且高效。
4. **下落计时器**：通过 `dropCounter` 累加，当达到 `dropInterval` 时执行位移逻辑。你可以通过减小 `dropInterval` 的值（如随着分数提高）来实现难度递增。

**你想在这个基础上增加“消除分数显示”或者“下一个方块预览”功能吗？**

*/