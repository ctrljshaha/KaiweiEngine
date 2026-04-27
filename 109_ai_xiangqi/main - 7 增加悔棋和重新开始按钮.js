// ==============================================================================================
// 开维游戏引擎：中国象棋 (提示点精准对齐与走法逻辑版)
// ==============================================================================================

// --- 1. 初始化 ---
var system = game.getSystemName();
var w, h, window;
if (system == "WINDOWS" || system == "WEB") {
    game.initSize(700,800); 
    window = game.getWindow();
    w = window.getWidth();
    h = window.getHeight();
} else {
    game.initSize(canvas.width, canvas.height);
    window = game.getWindow();
    w = canvas.width;
    h = canvas.height;
}
game.setFPS(60);

// --- 2. 布局参数 ---
const BOARD_W = 507;
const BOARD_H = 567;
const PIECE_SIZE = 54;
const DOT_SIZE = 12; // 提示点大小，设置小一点

const BOARD_X = (w - BOARD_W) / 2;
const BOARD_Y = (h - BOARD_H) / 2;

const SPACE_X = (BOARD_W - PIECE_SIZE) / 8; 
const SPACE_Y = (BOARD_H - PIECE_SIZE) / 9; 

// --- 3. 资源预加载 ---
var resPath = "img/stype_2/";
var textures = {
    screenBg: game.getResource().getTexture(resPath + "bg.jpg"),
    bg: game.getResource().getTexture(resPath + "bg.png"),
    dot: game.getResource().getTexture(resPath + "dot.png"),
    r_j: game.getResource().getTexture(resPath + "r_j.png"), r_m: game.getResource().getTexture(resPath + "r_m.png"),
    r_x: game.getResource().getTexture(resPath + "r_x.png"), r_s: game.getResource().getTexture(resPath + "r_s.png"),
    r_k: game.getResource().getTexture(resPath + "r_c.png"), r_p: game.getResource().getTexture(resPath + "r_p.png"),
    r_z: game.getResource().getTexture(resPath + "r_z.png"),
    b_j: game.getResource().getTexture(resPath + "b_j.png"), b_m: game.getResource().getTexture(resPath + "b_m.png"),
    b_x: game.getResource().getTexture(resPath + "b_x.png"), b_s: game.getResource().getTexture(resPath + "b_s.png"),
    b_k: game.getResource().getTexture(resPath + "b_c.png"), b_p: game.getResource().getTexture(resPath + "b_p.png"),
    b_z: game.getResource().getTexture(resPath + "b_z.png"),
    b_ret: game.getResource().getTexture(resPath + "b_ret.jpg"),
    b_start: game.getResource().getTexture(resPath + "b_start.jpg")
};

// 在创建场景后立即设置
var scene = new Scene();
scene.setBg(textures.screenBg); // 设置全屏背景

// 然后再添加棋盘节点
var boardNode = new Sprite();
boardNode.setTexture(textures.bg);
boardNode.setSize(BOARD_W, BOARD_H);
boardNode.setPosition(BOARD_X, BOARD_Y);
scene.addNode(boardNode); // 棋盘会叠在 screenBg 之上

// --- 4. 棋盘数据 ---
// 初始布局备份，用于重新开始
const INITIAL_MAP = [
    ["b_k","b_m","b_x","b_s","b_j","b_s","b_x","b_m","b_k"],
    [null, null, null, null, null, null, null, null, null],
    [null, "b_p", null, null, null, null, null, "b_p", null],
    ["b_z",null, "b_z",null, "b_z",null, "b_z",null, "b_z"],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    ["r_z",null, "r_z",null, "r_z",null, "r_z",null, "r_z"],
    [null, "r_p", null, null, null, null, null, "r_p", null],
    [null, null, null, null, null, null, null, null, null],
    ["r_k","r_m","r_x","r_s","r_j","r_s","r_x","r_m","r_k"]
];

// 深拷贝初始数据到当前地图
var map = JSON.parse(JSON.stringify(INITIAL_MAP));
var history = []; // 悔棋栈

var sprites = [];
var selectedPos = null;
var currentMoves = []; // 当前选中的棋子可以走的点

// --- 辅助函数：判断目标位置棋子的颜色 ---
function getPieceColor(gx, gy) {
    var p = map[gy][gx];
    if (!p) return null;
    return p.indexOf("r_") === 0 ? "red" : "black";
}

// --- 5. 完整走法逻辑计算 ---
function getPossibleMoves(gx, gy) {
    var piece = map[gy][gx];
    if (!piece) return [];
    var moves = [];
    var myColor = getPieceColor(gx, gy);
    var type = piece.split("_")[1]; // 取出 j, m, x, s, k, p, z

    // 辅助：检查并添加位置
    function addMove(tx, ty) {
        if (tx < 0 || tx > 8 || ty < 0 || ty > 9) return false;
        var targetColor = getPieceColor(tx, ty);
        if (targetColor !== myColor) { // 只要不是自己的棋子（空位或对方棋子）就可以走
            moves.push({x: tx, y: ty});
            return targetColor === null; // 返回true表示路径未被阻挡
        }
        return false; // 遇到自己人，阻挡
    }

    switch (type) {
        case "k": // 车 (原本代码里你写的是k，对应r_k, b_k)
            var dirs = [[0,1],[0,-1],[1,0],[-1,0]];
            for (var d of dirs) {
                for (var i = 1; i < 10; i++) {
                    var nx = gx + d[0] * i, ny = gy + d[1] * i;
                    if (nx < 0 || nx > 8 || ny < 0 || ny > 9) break;
                    if (!addMove(nx, ny)) break; // 遇到棋子就停止搜索
                }
            }
            break;

        case "m": // 马
            var mOffsets = [[1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]];
            for (var o of mOffsets) {
                var nx = gx + o[0], ny = gy + o[1];
                // 检查蹩马腿：如果水平位移大，检查水平邻位；垂直位移大，检查垂直邻位
                var legX = gx + (Math.abs(o[0]) === 2 ? o[0]/2 : 0);
                var legY = gy + (Math.abs(o[1]) === 2 ? o[1]/2 : 0);
                if (legX >=0 && legX <=8 && legY >=0 && legY <=9 && !map[legY][legX]) {
                    addMove(nx, ny);
                }
            }
            break;

            case "x": // 象 / 相
            // 象走的四个斜向“田”字坐标偏移
            var xOffsets = [
                {nx: 2, ny: 2, ex: 1, ey: 1},   // 右下
                {nx: 2, ny: -2, ex: 1, ey: -1},  // 右上
                {nx: -2, ny: 2, ex: -1, ey: 1},  // 左下
                {nx: -2, ny: -2, ex: -1, ey: -1} // 左上
            ];

            for (var i = 0; i < xOffsets.length; i++) {
                var o = xOffsets[i];
                var nx = gx + o.nx; // 目标点X
                var ny = gy + o.ny; // 目标点Y
                var eyeX = gx + o.ex; // 象眼点X
                var eyeY = gy + o.ey; // 象眼点Y

                // 1. 边界检查：不能出棋盘
                if (nx < 0 || nx > 8 || ny < 0 || ny > 9) continue;

                // 2. 阵营与河界检查
                if (myColor === "red") {
                    if (ny < 5) continue; // 红相不能过河（y=5-9）
                } else {
                    if (ny > 4) continue; // 黑象不能过河（y=0-4）
                }

                // 3. 塞象眼检查：田字中间(eyeX, eyeY)必须没有棋子
                if (map[eyeY][eyeX] === null) {
                    // 4. 目标点不能是自己的棋子
                    var targetColor = getPieceColor(nx, ny);
                    if (targetColor !== myColor) {
                        moves.push({x: nx, y: ny});
                    }
                }
            }
            break;

        case "s": // 士
            var sOffsets = [[1,1],[1,-1],[-1,1],[-1,-1]];
            for (var o of sOffsets) {
                var nx = gx + o[0], ny = gy + o[1];
                // 限制在九宫格内
                if (nx >= 3 && nx <= 5 && ((myColor === "red" && ny >= 7) || (myColor === "black" && ny <= 2))) {
                    addMove(nx, ny);
                }
            }
            break;

        case "j": // 将/帅 (原本代码里你写的是j)
            var jDirs = [[0,1],[0,-1],[1,0],[-1,0]];
            for (var d of jDirs) {
                var nx = gx + d[0], ny = gy + d[1];
                if (nx >= 3 && nx <= 5 && ((myColor === "red" && ny >= 7) || (myColor === "black" && ny <= 2))) {
                    addMove(nx, ny);
                }
            }
            break;

        case "p": // 炮
            var pDirs = [[0,1],[0,-1],[1,0],[-1,0]];
            for (var d of pDirs) {
                var overPiece = false; // 是否翻山
                for (var i = 1; i < 10; i++) {
                    var nx = gx + d[0]*i, ny = gy + d[1]*i;
                    if (nx < 0 || nx > 8 || ny < 0 || ny > 9) break;
                    var target = map[ny][nx];
                    if (!overPiece) {
                        if (!target) moves.push({x: nx, y: ny});
                        else overPiece = true; // 发现第一颗棋子，准备翻山
                    } else if (target) { // 翻山后遇到第一颗棋子
                        if (getPieceColor(nx, ny) !== myColor) moves.push({x: nx, y: ny}); // 敌人就吃掉
                        break; // 炮只能翻一颗山
                    }
                }
            }
            break;

        case "z": // 卒/兵
            if (myColor === "red") {
                addMove(gx, gy - 1); // 向上
                if (gy <= 4) { // 过河
                    addMove(gx - 1, gy);
                    addMove(gx + 1, gy);
                }
            } else {
                addMove(gx, gy + 1); // 向下
                if (gy >= 5) { // 过河
                    addMove(gx - 1, gy);
                    addMove(gx + 1, gy);
                }
            }
            break;
    }
    return moves;
}

// --- 6. 渲染函数 ---
function renderBoard() {
    for(var i=0; i<sprites.length; i++) { scene.removeNode(sprites[i]); }
    sprites = [];

    // 1. 绘制棋子
    for (var y = 0; y < 10; y++) {
        for (var x = 0; x < 9; x++) {
            var key = map[y][x];
            if (key) {
                var s = new Sprite();
                s.setTexture(textures[key]);
                s.setSize(PIECE_SIZE, PIECE_SIZE);
                s.setPosition(BOARD_X + x * SPACE_X, BOARD_Y + y * SPACE_Y);
                scene.addNode(s);
                sprites.push(s);
            }
        }
    }

    // 2. 绘制选中棋子的“可走点”提示 (Dot)
    if (selectedPos) {
        currentMoves = getPossibleMoves(selectedPos.x, selectedPos.y);
        for (var k = 0; k < currentMoves.length; k++) {
            var move = currentMoves[k];
            var dot = new Sprite();
            dot.setTexture(textures.dot);
            dot.setSize(DOT_SIZE, DOT_SIZE);
            
            // 居中公式：(当前格点位置) + (大棋子尺寸 - 小点尺寸) / 2.5
            var dotPosX = BOARD_X + move.x * SPACE_X + (PIECE_SIZE - DOT_SIZE) / 2.5;
            var dotPosY = BOARD_Y + move.y * SPACE_Y + (PIECE_SIZE - DOT_SIZE) / 2.5;
            
            dot.setPosition(dotPosX, dotPosY);
            scene.addNode(dot);
            sprites.push(dot);
        }
    }

    // 3. 绘制控制按钮 (在棋盘下方)
    drawControlButtons();
}

function drawControlButtons() {
    const btnW = 120;
    const btnH = 45;
    const btnY = BOARD_Y + BOARD_H + 30; // 棋盘底部下方30像素

    // 悔棋按钮
    var undoBtn = new Sprite();
    undoBtn.setTexture(textures.b_ret); // 临时用卒纹理或你能找到的按钮图
    undoBtn.setSize(btnW, btnH);
    undoBtn.setPosition(w / 2 - btnW - 20, btnY);
    scene.addNode(undoBtn);
    sprites.push(undoBtn);

    // 重新开始按钮
    var resetBtn = new Sprite();
    resetBtn.setTexture(textures.b_start);
    resetBtn.setSize(btnW, btnH);
    resetBtn.setPosition(w / 2 + 20, btnY);
    scene.addNode(resetBtn);
    sprites.push(resetBtn);
}

// --- 7. 点击交互优化版 ---
scene.onPress((tx, ty) => {
    // 检查是否点击了按钮区域
    const btnY = BOARD_Y + BOARD_H + 30;
    const btnW = 120;
    const btnH = 45;

    // 悔棋判定
    if (ty >= btnY && ty <= btnY + btnH && tx >= w/2 - btnW - 20 && tx <= w/2 - 20) {
        if (history.length > 0) {
            map = history.pop();
            selectedPos = null;
            currentMoves = [];
            renderBoard();
        }
        return;
    }
    // 重新开始判定
    if (ty >= btnY && ty <= btnY + btnH && tx >= w/2 + 20 && tx <= w/2 + 20 + btnW) {
        map = JSON.parse(JSON.stringify(INITIAL_MAP));
        history = [];
        selectedPos = null;
        currentMoves = [];
        renderBoard();
        return;
    }

    // 1. 修正坐标逻辑
    var floatGx = (tx - BOARD_X - PIECE_SIZE / 2) / SPACE_X;
    var floatGy = (ty - BOARD_Y - PIECE_SIZE / 2) / SPACE_Y;
    var gx = Math.round(floatGx);
    var gy = Math.round(floatGy);
    var dist = Math.sqrt(Math.pow(floatGx - gx, 2) + Math.pow(floatGy - gy, 2));
    if (dist > 0.8) return;

    if (gx >= 0 && gx <= 8 && gy >= 0 && gy <= 9) {
        var clickedPiece = map[gy][gx];
        var clickedColor = clickedPiece ? (clickedPiece.indexOf("r_") === 0 ? "red" : "black") : null;
        var selectedColor = selectedPos ? (map[selectedPos.y][selectedPos.x].indexOf("r_") === 0 ? "red" : "black") : null;

        if (clickedPiece) {
            if (!selectedPos || clickedColor === selectedColor) {
                selectedPos = {x: gx, y: gy};
            } else {
                handleMove(gx, gy);
            }
        } else if (selectedPos) {
            handleMove(gx, gy);
        }
        renderBoard();
    }
});

// 提取移动/吃子逻辑
function handleMove(gx, gy) {
    var isLegal = false;
    for (var i = 0; i < currentMoves.length; i++) {
        if (currentMoves[i].x === gx && currentMoves[i].y === gy) {
            isLegal = true;
            break;
        }
    }

    if (isLegal) {
        // 移动前保存快照用于悔棋
        history.push(JSON.parse(JSON.stringify(map)));
        
        map[gy][gx] = map[selectedPos.y][selectedPos.x];
        map[selectedPos.y][selectedPos.x] = null;
        selectedPos = null;
        currentMoves = [];
    }
}

// --- 8. 运行 ---
game.pushScene(scene);
renderBoard();
game.run();