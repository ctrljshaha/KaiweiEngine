// 开维游戏引擎 - 俄罗斯方块游戏
// 作者：根据示例代码风格编写
// 说明：使用Node控件表示每个小方块，通过键盘方向键控制

// 初始化游戏引擎
game.init(); // 默认窗口大小800*600
game.setFPS(30); // 设置帧率

// 游戏主窗口设置图标和标题
var window = game.getWindow();
var texture = game.getResource().getTexture("img/logo.png"); // 请确保图片存在
window.setIcon(texture);
window.setTitle("俄罗斯方块 - 开维游戏引擎");

// 创建场景
var scene = new Scene();
// 可以设置一个背景色或背景图，这里使用纯色背景
// scene.setBgColor(0.2, 0.2, 0.2, 1); // 如果需要背景色，可以用此方法（假设引擎支持）
// 如果没有setBgColor，可以创建一个全屏的Sprite作为背景
var bgSprite = new Sprite();
bgSprite.setSize(800, 600);
bgSprite.setColor(50, 50, 50, 1); // 深灰色背景
bgSprite.setPosition(0, 0);
scene.addNode(bgSprite);

// 游戏全局变量
var gridWidth = 10;      // 网格宽度（列数）
var gridHeight = 20;     // 网格高度（行数）
var cellSize = 30;       // 每个格子像素大小
var gridOffsetX = 50;    // 网格左上角X坐标
var gridOffsetY = 50;    // 网格左上角Y坐标

// 二维数组，存储每个格子的颜色（0表示空，其他表示颜色值）
var gridColors = [];
for (var row = 0; row < gridHeight; row++) {
    gridColors[row] = [];
    for (var col = 0; col < gridWidth; col++) {
        gridColors[row][col] = 0; // 初始为空
    }
}

// 存储所有格子Node的二维数组，用于更新颜色
var gridNodes = [];
for (var row = 0; row < gridHeight; row++) {
    gridNodes[row] = [];
    for (var col = 0; col < gridWidth; col++) {
        var cell = new Node();
        cell.setPosition(gridOffsetX + col * cellSize, gridOffsetY + row * cellSize);
        cell.setSize(cellSize, cellSize);
        cell.setColor(0, 0, 0, 1); // 默认黑色（空）
        scene.addNode(cell);
        gridNodes[row][col] = cell;
    }
}

// 绘制网格线（可选，用白色细线表示格子边界）
// 可以添加一些线条Node，但这里省略，直接用格子颜色区分

// 当前活动方块
var currentPiece = {
    shape: null,    // 形状数组
    x: 3,           // 在网格中的列索引（左上角为0）
    y: 0,           // 在网格中的行索引
    color: null,    // 颜色值
    nodes: []       // 组成当前方块的四个Node（用于移动显示）
};

// 下一个方块形状（预览）
var nextPieceShape = null;
var nextPieceColor = null;

// 分数
var score = 0;
var scoreLabel = null;

// 游戏状态
var gameOver = false;
var gameOverLabel = null;

// 初始化UI
function initUI() {
    // 分数标签
    scoreLabel = new Label();
    scoreLabel.setPosition(400, 100);
    scoreLabel.setSize(200, 50);
    scoreLabel.setFont("font/st.ttf", 24);
    scoreLabel.setTextColor(255, 255, 255, 1);
    scoreLabel.setText("分数: 0");
    scene.addNode(scoreLabel);

    // 下一个方块提示标签
    var nextLabel = new Label();
    nextLabel.setPosition(400, 200);
    nextLabel.setSize(200, 30);
    nextLabel.setFont("font/st.ttf", 20);
    nextLabel.setTextColor(255, 255, 255, 1);
    nextLabel.setText("下一个:");
    scene.addNode(nextLabel);

    // 游戏结束标签（初始隐藏）
    gameOverLabel = new Label();
    gameOverLabel.setPosition(300, 300);
    gameOverLabel.setSize(200, 80);
    gameOverLabel.setFont("font/st.ttf", 36);
    gameOverLabel.setTextColor(255, 0, 0, 1);
    gameOverLabel.setText("游戏结束");
    gameOverLabel.setHide(true);
    scene.addNode(gameOverLabel);
}

// 定义七种方块形状（经典俄罗斯方块）
var pieces = [
    // I
    {
        shape: [
            [1,1,1,1]
        ],
        color: [0, 255, 255, 1] // 青色
    },
    // O
    {
        shape: [
            [1,1],
            [1,1]
        ],
        color: [255, 255, 0, 1] // 黄色
    },
    // T
    {
        shape: [
            [0,1,0],
            [1,1,1]
        ],
        color: [128, 0, 128, 1] // 紫色
    },
    // S
    {
        shape: [
            [0,1,1],
            [1,1,0]
        ],
        color: [0, 255, 0, 1] // 绿色
    },
    // Z
    {
        shape: [
            [1,1,0],
            [0,1,1]
        ],
        color: [255, 0, 0, 1] // 红色
    },
    // L
    {
        shape: [
            [1,0,0],
            [1,1,1]
        ],
        color: [255, 165, 0, 1] // 橙色
    },
    // J
    {
        shape: [
            [0,0,1],
            [1,1,1]
        ],
        color: [0, 0, 255, 1] // 蓝色
    }
];

// 随机生成一个方块
function randomPiece() {
    var idx = Math.floor(Math.random() * pieces.length);
    var piece = pieces[idx];
    return {
        shape: piece.shape.map(row => row.slice()), // 深拷贝
        color: piece.color.slice()
    };
}

// 初始化下一个方块
nextPieceShape = randomPiece();

// 生成新当前方块（从next取，并随机生成下一个）
function spawnNewPiece() {
    if (nextPieceShape) {
        currentPiece.shape = nextPieceShape.shape.map(row => row.slice());
        currentPiece.color = nextPieceShape.color.slice();
    } else {
        // 初始情况
        var np = randomPiece();
        currentPiece.shape = np.shape;
        currentPiece.color = np.color;
    }
    currentPiece.x = Math.floor((gridWidth - currentPiece.shape[0].length) / 2);
    currentPiece.y = 0;

    // 生成下一个方块
    nextPieceShape = randomPiece();

    // 创建当前方块的四个Node（如果已有则先移除）
    for (var i = 0; i < currentPiece.nodes.length; i++) {
        scene.removeNode(currentPiece.nodes[i]); // 假设有removeNode方法，如果没有，可以隐藏或重新利用
    }
    currentPiece.nodes = [];

    // 创建四个小方块Node
    for (var r = 0; r < currentPiece.shape.length; r++) {
        for (var c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                var node = new Node();
                node.setSize(cellSize, cellSize);
                node.setColor(currentPiece.color[0], currentPiece.color[1], currentPiece.color[2], currentPiece.color[3]);
                // 位置稍后根据x,y更新
                scene.addNode(node);
                currentPiece.nodes.push(node);
            }
        }
    }

    // 更新位置显示
    updatePiecePosition();

    // 检查生成时是否立即碰撞（游戏结束）
    if (collision(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        gameOver = true;
        gameOverLabel.setHide(false);
    }
}

// 更新当前方块Node的位置（根据currentPiece.x, y）
function updatePiecePosition() {
    var index = 0;
    for (var r = 0; r < currentPiece.shape.length; r++) {
        for (var c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                var node = currentPiece.nodes[index++];
                var x = gridOffsetX + (currentPiece.x + c) * cellSize;
                var y = gridOffsetY + (currentPiece.y + r) * cellSize;
                node.setPosition(x, y);
            }
        }
    }
}

// 碰撞检测
function collision(shape, offsetX, offsetY) {
    for (var r = 0; r < shape.length; r++) {
        for (var c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                var gridX = offsetX + c;
                var gridY = offsetY + r;
                // 超出左右边界或底部
                if (gridX < 0 || gridX >= gridWidth || gridY >= gridHeight) {
                    return true;
                }
                // 与已固定的格子重叠
                if (gridY >= 0 && gridColors[gridY][gridX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// 固定当前方块到网格
function lockPiece() {
    var index = 0;
    for (var r = 0; r < currentPiece.shape.length; r++) {
        for (var c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                var gridX = currentPiece.x + c;
                var gridY = currentPiece.y + r;
                if (gridY >= 0 && gridY < gridHeight && gridX >= 0 && gridX < gridWidth) {
                    gridColors[gridY][gridX] = currentPiece.color; // 存储颜色
                    // 更新网格Node颜色
                    gridNodes[gridY][gridX].setColor(currentPiece.color[0], currentPiece.color[1], currentPiece.color[2], currentPiece.color[3]);
                }
                // 移除当前方块的Node
                scene.removeNode(currentPiece.nodes[index]);
                index++;
            }
        }
    }
    currentPiece.nodes = [];

    // 消除满行并计分
    clearFullRows();

    // 生成下一个方块
    spawnNewPiece();
}

// 消除满行
function clearFullRows() {
    var rowsCleared = 0;
    for (var row = gridHeight - 1; row >= 0; ) {
        var full = true;
        for (var col = 0; col < gridWidth; col++) {
            if (gridColors[row][col] === 0) {
                full = false;
                break;
            }
        }
        if (full) {
            // 消除该行
            for (var r = row; r > 0; r--) {
                for (var col = 0; col < gridWidth; col++) {
                    gridColors[r][col] = gridColors[r-1][col];
                    // 更新网格Node颜色
                    if (gridColors[r][col] !== 0) {
                        var colVal = gridColors[r][col];
                        gridNodes[r][col].setColor(colVal[0], colVal[1], colVal[2], colVal[3]);
                    } else {
                        gridNodes[r][col].setColor(0, 0, 0, 1);
                    }
                }
            }
            // 最上面一行置空
            for (var col = 0; col < gridWidth; col++) {
                gridColors[0][col] = 0;
                gridNodes[0][col].setColor(0, 0, 0, 1);
            }
            rowsCleared++;
            // 继续检查同一行（因为下移了）
        } else {
            row--;
        }
    }

    if (rowsCleared > 0) {
        // 计分：一行10分，两行30分，三行60分，四行100分
        var addScore = 0;
        if (rowsCleared === 1) addScore = 10;
        else if (rowsCleared === 2) addScore = 30;
        else if (rowsCleared === 3) addScore = 60;
        else if (rowsCleared === 4) addScore = 100;
        score += addScore;
        scoreLabel.setText("分数: " + score);
    }
}

// 移动当前方块
function movePiece(dx, dy) {
    if (gameOver) return;
    var newX = currentPiece.x + dx;
    var newY = currentPiece.y + dy;
    if (!collision(currentPiece.shape, newX, newY)) {
        currentPiece.x = newX;
        currentPiece.y = newY;
        updatePiecePosition();
        return true;
    } else if (dy === 1) { // 向下移动失败，固定
        lockPiece();
    }
    return false;
}

// 旋转当前方块
function rotatePiece() {
    if (gameOver) return;
    // 简单旋转：顺时针旋转90度
    var oldShape = currentPiece.shape;
    var rotated = [];
    for (var c = 0; c < oldShape[0].length; c++) {
        var newRow = [];
        for (var r = oldShape.length - 1; r >= 0; r--) {
            newRow.push(oldShape[r][c]);
        }
        rotated.push(newRow);
    }
    // 踢墙处理（简单版：如果旋转后碰撞，则尝试左右微移）
    if (!collision(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
        // 重新创建nodes？因为形状变化，格子数量可能变化，需要重新生成nodes
        // 简单起见，我们重新生成当前方块的nodes
        // 先移除旧的nodes
        for (var i = 0; i < currentPiece.nodes.length; i++) {
            scene.removeNode(currentPiece.nodes[i]);
        }
        // 根据新形状创建nodes
        currentPiece.nodes = [];
        for (var r = 0; r < rotated.length; r++) {
            for (var c = 0; c < rotated[r].length; c++) {
                if (rotated[r][c]) {
                    var node = new Node();
                    node.setSize(cellSize, cellSize);
                    node.setColor(currentPiece.color[0], currentPiece.color[1], currentPiece.color[2], currentPiece.color[3]);
                    scene.addNode(node);
                    currentPiece.nodes.push(node);
                }
            }
        }
        updatePiecePosition();
    } else {
        // 尝试左移或右移
        if (!collision(rotated, currentPiece.x - 1, currentPiece.y)) {
            currentPiece.x -= 1;
            currentPiece.shape = rotated;
            // 重新创建nodes（同上）
            for (var i = 0; i < currentPiece.nodes.length; i++) {
                scene.removeNode(currentPiece.nodes[i]);
            }
            currentPiece.nodes = [];
            for (var r = 0; r < rotated.length; r++) {
                for (var c = 0; c < rotated[r].length; c++) {
                    if (rotated[r][c]) {
                        var node = new Node();
                        node.setSize(cellSize, cellSize);
                        node.setColor(currentPiece.color[0], currentPiece.color[1], currentPiece.color[2], currentPiece.color[3]);
                        scene.addNode(node);
                        currentPiece.nodes.push(node);
                    }
                }
            }
            updatePiecePosition();
        } else if (!collision(rotated, currentPiece.x + 1, currentPiece.y)) {
            currentPiece.x += 1;
            currentPiece.shape = rotated;
            for (var i = 0; i < currentPiece.nodes.length; i++) {
                scene.removeNode(currentPiece.nodes[i]);
            }
            currentPiece.nodes = [];
            for (var r = 0; r < rotated.length; r++) {
                for (var c = 0; c < rotated[r].length; c++) {
                    if (rotated[r][c]) {
                        var node = new Node();
                        node.setSize(cellSize, cellSize);
                        node.setColor(currentPiece.color[0], currentPiece.color[1], currentPiece.color[2], currentPiece.color[3]);
                        scene.addNode(node);
                        currentPiece.nodes.push(node);
                    }
                }
            }
            updatePiecePosition();
        }
    }
}

// 硬降
function hardDrop() {
    if (gameOver) return;
    while (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    }
    updatePiecePosition();
    lockPiece(); // 固定
}

// 键盘回调处理
game.setKeyCallBack((key, action) => {
    // action: 1 按下, 0 抬起（假设）
    if (action === 1) { // 只处理按下事件
        if (gameOver) return;
        // 方向键控制
        switch (key) {
            case 37: // 左箭头
            case 65: // A
                movePiece(-1, 0);
                break;
            case 39: // 右箭头
            case 68: // D
                movePiece(1, 0);
                break;
            case 40: // 下箭头
            case 83: // S
                // 加速下落，这里实现为移动一格，也可以使用硬降
                movePiece(0, 1);
                break;
            case 38: // 上箭头
            case 87: // W
                rotatePiece();
                break;
            case 32: // 空格键（硬降）
                hardDrop();
                break;
        }
    }
});

// 自动下落计时器
var fallInterval = 500; // 毫秒
var lastFallTime = 0;

// 场景更新回调
scene.upDate((time) => {
    // time可能是当前时间戳（毫秒）
    if (!gameOver) {
        var now = new Date().getTime();
        if (now - lastFallTime > fallInterval) {
            // 下落一格
            movePiece(0, 1);
            lastFallTime = now;
        }
    }
});

// 初始化UI和第一个方块
initUI();
spawnNewPiece();

// 将场景推入游戏
game.pushScene(scene);

// 运行游戏
game.run();