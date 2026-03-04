/*太棒了！要把这款俄罗斯方块推向“专业版”，**一键触底（Hard Drop）**和**消除音效（Sound Effects）**是灵魂所在。

“一键触底”能极大提升高手的操作效率，而“消除音效”则能提供极佳的正反馈。

### 升级功能说明：

1. **一键触底**：监听 `Space`（空格键），通过一个 `while` 循环预判方块能到达的最深位置，瞬间移动并锁定。
2. **消除音效**：在 `clearLines` 逻辑触发时，播放特定的 `wav` 文件。

### 顶级版：俄罗斯方块完整代码

*/

/**
 * 开维游戏引擎 - 俄罗斯方块 (专业版)
 * 新增功能：
 * 1. 空格键一键触底 (Hard Drop)
 * 2. 消除行时的音效反馈
 * 3. 计分与预览系统
 */

game.init();
game.setFPS(60);

var scene = new Scene();
var blockSize = 25;
var gridCols = 10;
var gridRows = 20;
var startX = 200; 
var startY = 50;

// 1. 资源与音效初始化
var audio = new Audio();
audio.setSoundVolume(1.0);
// 假设 sound/1.wav 是消除音效，sound/bg.ogg 是背景音乐
// audio.playMusic("sound/bg.ogg"); 

var grid = [];
var score = 0;
for (var r = 0; r < gridRows; r++) grid[r] = new Array(gridCols).fill(null);

// 2. 创建主网格与预览网格 (保持之前的逻辑)
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

var previewX = startX + (gridCols * blockSize) + 30;
var previewY = startY + 50;
var previewNodes = [];
for (var r = 0; r < 4; r++) {
    previewNodes[r] = [];
    for (var c = 0; c < 4; c++) {
        var n = new Node();
        n.setSize(18, 18);
        n.setPosition(previewX + c * 20, previewY + r * 20);
        n.setColor(0.1, 0.1, 0.1, 0.5);
        scene.addNode(n);
        previewNodes[r][c] = n;
    }
}

var labScore = new Label();
labScore.setPosition(previewX, startY);
labScore.setSize(150, 40);
labScore.setFont("font/st.ttf", 20);
labScore.setText("得分: 0");
scene.addNode(labScore);

// 3. 方块形状与颜色
var shapes = {
    'I': [[1,1,1,1]], 'L': [[1,0,0], [1,1,1]], 'J': [[0,0,1], [1,1,1]],
    'O': [[1,1], [1,1]], 'Z': [[1,1,0], [0,1,1]], 'S': [[0,1,1], [1,1,0]], 'T': [[0,1,0], [1,1,1]]
};
var shapeColors = {
    'I': [0, 1, 1], 'L': [1, 0.5, 0], 'J': [0, 0, 1], 'O': [1, 1, 0], 'Z': [1, 0, 0], 'S': [0, 1, 0], 'T': [0.5, 0, 1]
};

var curPiece = { shape: null, color: [1, 1, 1], x: 0, y: 0 };
var nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];

function spawnPiece() {
    var type = nextType;
    nextType = Object.keys(shapes)[Math.floor(Math.random() * 7)];
    curPiece.shape = shapes[type];
    curPiece.color = shapeColors[type];
    curPiece.x = Math.floor(gridCols / 2) - Math.floor(curPiece.shape[0].length / 2);
    curPiece.y = 0;

    if (checkCollision(curPiece.x, curPiece.y, curPiece.shape)) {
        score = 0;
        labScore.setText("得分: 0");
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

// 锁定并处理消除
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
        // --- [新增] 播放消除音效 ---
        audio.playSound("sound/1.wav"); 
        var bonus = [0, 100, 300, 500, 800];
        score += bonus[linesCleared];
        labScore.setText("得分: " + score);
    }
}

// 4. 键盘交互优化
game.setKeyCallBack((key, action) => {
    if (action !== 1) return;
    // 32 = Space, 37 = Left, 38 = Up, 39 = Right, 40 = Down
    if (key === 37 && !checkCollision(curPiece.x - 1, curPiece.y, curPiece.shape)) curPiece.x--;
    if (key === 39 && !checkCollision(curPiece.x + 1, curPiece.y, curPiece.shape)) curPiece.x++;
    if (key === 40 && !checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
    
    // --- [新增] 空格键一键触底 ---
    if (key === 32) {
        while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) {
            curPiece.y++;
        }
        lockAndSpawn(); // 触底后立即锁定
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

// 5. 游戏主循环
var dropCounter = 0;
scene.upDate((time) => {
    if (++dropCounter >= 30) {
        if (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) curPiece.y++;
        else lockAndSpawn();
        dropCounter = 0;
    }

    // 绘制逻辑 (主网格 + 当前方块 + 预览窗口)
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
    // 渲染预览
    var s = shapes[nextType];
    var colNext = shapeColors[nextType];
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            var active = (r < s.length && c < s[r].length && s[r][c]);
            previewNodes[r][c].setColor(active ? colNext[0] : 0.1, active ? colNext[1] : 0.1, active ? colNext[2] : 0.1, active ? 1.0 : 0.3);
        }
    }
});

spawnPiece();
game.pushScene(scene);
game.run();

/*

### 代码亮点解析：

* **一键触底逻辑 (`while` 循环)**：
```javascript
while (!checkCollision(curPiece.x, curPiece.y + 1, curPiece.shape)) {
    curPiece.y++;
}

```


这段代码在按下空格的瞬间，会不断模拟向下移动，直到发生碰撞为止。然后立即调用 `lockAndSpawn()`。这在游戏开发中被称为 **Hard Drop**，是高阶玩家的核心操作。
* **音效触发位置**：
我们将 `audio.playSound("sound/1.wav")` 放在了消除检测成功的 `if (linesCleared > 0)` 分支里。这意味着只有当你真正得分时，耳朵才会接收到爽快的反馈。

**现在游戏已经非常完整了。下一步你想挑战“逐渐增加的下落速度（关卡系统）”，还是给方块加上“发光霓虹灯”的视觉效果？**

*/