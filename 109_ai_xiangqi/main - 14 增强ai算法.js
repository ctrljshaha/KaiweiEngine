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
} else if(system =="WEIXIN") {
    game.initSize(canvas.width, canvas.height);
    window = game.getWindow();
    w = canvas.width;
    h = canvas.height;
}
game.setFPS(60);

// --- 2. 布局参数 ---
var BOARD_W, BOARD_H, PIECE_SIZE;
if (system == "WINDOWS" || system == "WEB") {
     BOARD_W = 507;  // 象棋的棋盘宽507，高567
     BOARD_H = 567; 
     PIECE_SIZE = 54; // 棋子正方形宽度54
} else if(system =="WEIXIN"){
     BOARD_W = w-20;  // 象棋的棋盘宽507，高567，根据这个比例算高度
     BOARD_H = BOARD_W*567/507; 
     PIECE_SIZE = BOARD_W*54/507; // 棋子正方形宽度54，根据这个比例算大小
}

const DOT_SIZE = 12; // 提示点大小，设置小一点

const BOARD_X = (w - BOARD_W) / 2;
const BOARD_Y = (h - BOARD_H) / 2;

const SPACE_X = (BOARD_W - PIECE_SIZE) / 8; 
const SPACE_Y = (BOARD_H - PIECE_SIZE) / 9; 

// --- 3. 资源预加载 ---
var resPath = "img/";
var textures = {
    screenBg: game.getResource().getTexture(resPath + "bg.jpg"),
    bg: game.getResource().getTexture(resPath + "bg.png"),
    dot: game.getResource().getTexture(resPath + "dot.png"),
    b_box: game.getResource().getTexture(resPath + "b_box.png"), // 起始位置框
    r_box: game.getResource().getTexture(resPath + "r_box.png"), // 落子位置框
    r_j: game.getResource().getTexture(resPath + "r_j.png"), r_m: game.getResource().getTexture(resPath + "r_m.png"),
    r_x: game.getResource().getTexture(resPath + "r_x.png"), r_s: game.getResource().getTexture(resPath + "r_s.png"),
    r_k: game.getResource().getTexture(resPath + "r_c.png"), r_p: game.getResource().getTexture(resPath + "r_p.png"),
    r_z: game.getResource().getTexture(resPath + "r_z.png"),
    b_j: game.getResource().getTexture(resPath + "b_j.png"), b_m: game.getResource().getTexture(resPath + "b_m.png"),
    b_x: game.getResource().getTexture(resPath + "b_x.png"), b_s: game.getResource().getTexture(resPath + "b_s.png"),
    b_k: game.getResource().getTexture(resPath + "b_c.png"), b_p: game.getResource().getTexture(resPath + "b_p.png"),
    b_z: game.getResource().getTexture(resPath + "b_z.png"),
    b_ret: game.getResource().getTexture(resPath + "b_ret.png"),
    b_start: game.getResource().getTexture(resPath + "b_start.png"),
    logo: game.getResource().getTexture(resPath + "logo.png")
};

// 在创建场景后立即设置
var scene = new Scene();
scene.setBg(textures.screenBg); // 设置全屏背景

// 设置标题
window.setIcon(textures.logo); // 设置窗口图标
window.setTitle("开维游戏引擎 - 中国象棋"); // 设置窗口标题


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
var lastMove = null; // 记录上一手：{from:{x,y}, to:{x,y}}

// 场景回调，定时器实现在场景中根据帧率实现，游戏中不能用Sleep()或者 setTimeout(function() {}, 500);会阻塞进程
var messageTimeout = 0;
var messageLabel = null; // 消息框
var AiTimeout = 0; // ai延时走棋
var AiGo = 0; // ai走棋
scene.upDate((time)=>{ // 界面刷新回调函数，根据fps帧率的值回调，fps设置60就是一秒60次回调
     messageTimeout += time;
     if(messageTimeout > 3) // 延时3秒后，消息框消失
     {
         messageTimeout = 0;
         if (messageLabel)
            messageLabel.setHide(true); // 隐藏消息框
     }
     
     // 延时几秒后对方走棋
     if (AiGo == 1)
    {
         AiTimeout += time;
         if(AiTimeout > 2) 
         {
             AiTimeout = 0;
             aiMove(); // 对方走棋
             AiGo = 0;
         }
    }
    else
    {
        AiTimeout = 0;
    }

});

// 创建屏幕中间的消息标签
function createMessageLabel() 
{
    messageLabel = new Label(); 
    var labW = 290;
    var labH = 120;
    messageLabel.setSize(labW, labH);   // 标签宽，高
    messageLabel.setPosition((w-labW)/2, (h-labH)/2); // 动态计算位置：(w-labW)/2是横向正中心；(h-labH)/2是纵向正中心
    messageLabel.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
    //messageLabel.setText("提示"); // 标签文字
    messageLabel.setTextColor(0,255,0,1);  // 标签字体颜色
    messageLabel.setFont("font/st.ttf",20); // 标签汉字字库，字体大小
    scene.addNode(messageLabel); // 把标签增加到场景中
}

// 函数功能：在屏幕中间显示信息后，延时消失
function showMessage(msg) 
{
    if (messageLabel)
    {
        messageTimeout = 0;// 重新开始计时
        messageLabel.setText(msg); // 设置消息
        messageLabel.setHide(false); // 显示消息框
    }
}


// ADDED: 游戏胜利者标记，null表示未结束，"red"红方胜，"black"黑方胜
var gameWinner = null;

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

    // 0. 绘制上一手的标记框 (起始位置和落子位置)
    if (lastMove) {
        // 起始位置框 (b_box)
        var bBox = new Sprite();
        bBox.setTexture(textures.b_box);
        bBox.setSize(PIECE_SIZE, PIECE_SIZE);
        bBox.setPosition(BOARD_X + lastMove.from.x * SPACE_X - 3, BOARD_Y + lastMove.from.y * SPACE_Y - 3);
        scene.addNode(bBox);
        sprites.push(bBox);

        // 落子位置框 (r_box)
        var rBox = new Sprite();
        rBox.setTexture(textures.r_box);
        rBox.setSize(PIECE_SIZE, PIECE_SIZE);
        rBox.setPosition(BOARD_X + lastMove.to.x * SPACE_X, BOARD_Y + lastMove.to.y * SPACE_Y);
        scene.addNode(rBox);
        sprites.push(rBox);
    }

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
    undoBtn.setTexture(textures.b_ret); 
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
// ======================= 1. 棋子基础价值（保持原样） ======================= //
const PIECE_VALUE = { 'j': 10000, 'k': 1000, 'p': 450, 'm': 400, 'x': 200, 's': 200, 'z': 100 };

// ======================= 2. 棋子位置表（中国象棋） ======================= //
// 补充缺失的位置权重表以增强 AI “棋感”
const POSITION_MA = [
    -5,-5,-5,-5,-5,-5,-5,-5,-5,
    -5, 5, 5, 5, 5, 5, 5, 5,-5,
    -5, 5,10,10,10,10,10, 5,-5,
    -5, 5,10,15,15,15,10, 5,-5,
    -5, 5,10,15,20,15,10, 5,-5,
    -5, 5,10,15,20,15,10, 5,-5,
    -5, 5,10,15,15,15,10, 5,-5,
    -5, 5,10,10,10,10,10, 5,-5,
    -5, 0, 5, 5, 5, 5, 5, 0,-5,
    -5,-5,-5,-5,-5,-5,-5,-5,-5
];

const POSITION_JU = [
    0, 0, 5,10,10,10, 5, 0, 0,
    0, 0, 5,10,10,10, 5, 0, 0,
    0, 0, 5,10,10,10, 5, 0, 0,
    0, 0, 5,10,10,10, 5, 0, 0,
    0, 0, 5,10,10,10, 5, 0, 0,
    0, 0, 5,10,10,10, 5, 0, 0,
    0, 0, 5,10,10,10, 5, 0, 0,
    5, 5, 5,10,10,10, 5, 5, 5,
    10,10,10,10,10,10,10,10,10,
    0, 0, 5,10,10,10, 5, 0, 0
];

const POSITION_JIANG = [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2, 5, 2, 0, 0, 0,
    0, 0, 0, 5, 8, 5, 0, 0, 0,
    0, 0, 0, 8,10, 8, 0, 0, 0
]; 

const POSITION_SHI = [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 3, 0, 0, 0, 0,
    0, 0, 0, 5, 0, 5, 0, 0, 0
];

const POSITION_BING_RED = [
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    2,  5, 15, 20, 20, 20, 15,  5,  2,
    5, 10, 20, 30, 35, 30, 20, 10,  5,
    9,  9,  9, 11, 13, 11,  9,  9,  9,
    19, 24, 34, 42, 44, 42, 34, 24, 19,
    0,  0,  0,  0,  0,  0,  0,  0,  0
];
const POSITION_BING_BLACK = [...POSITION_BING_RED].reverse();

// ======================= 置换表系统 (Zobrist) ======================= //
let zobristTable = [];
let transpositionTable = new Map();
function initZobrist() {
    for (let i = 0; i < 90; i++) {
        zobristTable[i] = {};
        ['r_j','r_k','r_p','r_m','r_x','r_s','r_z','b_j','b_k','b_p','b_m','b_x','b_s','b_z'].forEach(p => {
            zobristTable[i][p] = Math.floor(Math.random() * 0xFFFFFFFF);
        });
    }
}
initZobrist();
function getHash(map) {
    let h = 0;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            let p = map[y][x];
            if (p) h ^= zobristTable[y * 9 + x][p];
        }
    }
    return h;
}

function evaluateBoardAdvanced(map) {
    let total = 0;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            const piece = map[y][x];
            if (!piece) continue;
            const isRed = piece[0] === 'r';
            const type = piece[2];
            let val = PIECE_VALUE[type] || 0;
            
            // 基于位置表的加成
            let ty = isRed ? (9 - y) : y;
            let idx = ty * 9 + x;
            if (type === 'z') val += isRed ? POSITION_BING_RED[idx] : POSITION_BING_BLACK[idx];
            else if (type === 'j') val += POSITION_JIANG[idx];
            else if (type === 's') val += POSITION_SHI[idx];
            else if (type === 'm') val += POSITION_MA[idx];
            else if (type === 'k') val += POSITION_JU[idx];

            total += isRed ? val : -val;
        }
    }
    return total;
}

// ======================= 3. AI 搜索核心 ======================= //

let historyHeuristic = {}; 
let killerMoves = new Array(10).fill(null).map(() => []);

function getAllBlackMovesSorted(map) {
    let moves = [];
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            if (map[y][x] && map[y][x].indexOf('b_') === 0) {
                let possible = getPossibleMoves(x, y);
                for (let to of possible) {
                    let move = { from: { x, y }, to };
                    let targetPiece = map[to.y][to.x];
                    let eatValue = targetPiece ? (PIECE_VALUE[targetPiece[2]] || 0) : 0;
                    let histKey = `${x},${y},${to.x},${to.y}`;
                    let histVal = historyHeuristic[histKey] || 0;
                    move.score = eatValue * 100 + histVal; // 增加吃子权重
                    moves.push(move);
                }
            }
        }
    }
    moves.sort((a,b) => b.score - a.score);
    return moves;
}

// 静态搜索：处理吃子链，防止AI在搜索末端产生误判
function quiescenceSearch(map, alpha, beta, isMaximizing) {
    let standPat = -evaluateBoardAdvanced(map);
    if (isMaximizing) {
        if (standPat >= beta) return beta;
        if (alpha < standPat) alpha = standPat;
    } else {
        standPat = -standPat;
        if (standPat <= alpha) return alpha;
        if (beta > standPat) beta = standPat;
    }

    let moves = getAllBlackMovesSorted(map).filter(m => map[m.to.y][m.to.x] !== null);
    for (let move of moves) {
        let oldTarget = map[move.to.y][move.to.x];
        let oldSource = map[move.from.y][move.from.x];
        map[move.to.y][move.to.x] = oldSource;
        map[move.from.y][move.from.x] = null;
        let score = quiescenceSearch(map, alpha, beta, !isMaximizing);
        map[move.from.y][move.from.x] = oldSource;
        map[move.to.y][move.to.x] = oldTarget;
        if (isMaximizing) {
            if (score >= beta) return beta;
            alpha = Math.max(alpha, score);
        } else {
            if (score <= alpha) return alpha;
            beta = Math.min(beta, score);
        }
    }
    return isMaximizing ? alpha : beta;
}

function alphaBeta(map, depth, alpha, beta, isMaximizing) {
    let hash = getHash(map);
    if (transpositionTable.has(hash)) {
        let entry = transpositionTable.get(hash);
        if (entry.depth >= depth) return entry.score;
    }

    if (depth === 0) return quiescenceSearch(map, alpha, beta, isMaximizing);

    let moves = getAllBlackMovesSorted(map);
    if (moves.length === 0) return isMaximizing ? -100000 : 100000;

    let bestEval = isMaximizing ? -Infinity : Infinity;

    for (let move of moves) {
        let oldTarget = map[move.to.y][move.to.x];
        let oldSource = map[move.from.y][move.from.x];
        map[move.to.y][move.to.x] = oldSource;
        map[move.from.y][move.from.x] = null;
        let value = alphaBeta(map, depth-1, alpha, beta, !isMaximizing);
        map[move.from.y][move.from.x] = oldSource;
        map[move.to.y][move.to.x] = oldTarget;

        if (isMaximizing) {
            if (value > bestEval) {
                bestEval = value;
                let histKey = `${move.from.x},${move.from.y},${move.to.x},${move.to.y}`;
                historyHeuristic[histKey] = (historyHeuristic[histKey] || 0) + depth * depth;
            }
            alpha = Math.max(alpha, value);
        } else {
            bestEval = Math.min(bestEval, value);
            beta = Math.min(beta, value);
        }
        if (beta <= alpha) break;
    }

    transpositionTable.set(hash, { score: bestEval, depth: depth });
    return bestEval;
}

// 移除迭代加深的时间截断，改为同步固定深度搜索
function aiMove() {
    if (gameWinner !== null) return;

    // 根据游戏引擎性能设定深度。深度 4 为流畅，深度 6 为强力。
    const MAX_DEPTH = 4; 
    let bestMove = null;
    let currentBestEval = -Infinity;
    
    transpositionTable.clear();
    let moves = getAllBlackMovesSorted(map);

    // 同步执行搜索
    for (let move of moves) {
        let oldTarget = map[move.to.y][move.to.x];
        let oldSource = map[move.from.y][move.from.x];
        map[move.to.y][move.to.x] = oldSource;
        map[move.from.y][move.from.x] = null;
        
        // AI为黑方（Maximizing），故下一层红方为 !isMaximizing
        let value = alphaBeta(map, MAX_DEPTH - 1, -Infinity, Infinity, false);
        
        map[move.from.y][move.from.x] = oldSource;
        map[move.to.y][move.to.x] = oldTarget;

        if (value > currentBestEval) {
            currentBestEval = value;
            bestMove = move;
        }
    }

    if (!bestMove) return;

    history.push(JSON.parse(JSON.stringify(map)));
    lastMove = {from: {x: bestMove.from.x, y: bestMove.from.y}, to: {x: bestMove.to.x, y: bestMove.to.y}};
    map[bestMove.to.y][bestMove.to.x] = map[bestMove.from.y][bestMove.from.x];
    map[bestMove.from.y][bestMove.from.x] = null;
    
    renderBoard();
    console.log(`AI 固定深度 ${MAX_DEPTH} 计算完成，评分 ${currentBestEval}`);
    checkGameOver();
}

function checkGameOver() {
    let hasRedJiang = false;
    let hasBlackJiang = false;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            const p = map[y][x];
            if (p === "r_j") hasRedJiang = true;
            if (p === "b_j") hasBlackJiang = true;
        }
    }
    if (!hasRedJiang) {
        gameWinner = "black";
        showMessage("黑方胜利！红方将帅被吃！");
        return;
    }
    if (!hasBlackJiang) {
        gameWinner = "red";
        showMessage("红方胜利！黑方将帅被吃！");
        return;
    }
}

// --- 7. 点击交互优化版 ---
scene.onPress((tx, ty) => {
    const btnY = BOARD_Y + BOARD_H + 30;
    const btnW = 120;
    const btnH = 45;

    // 悔棋判定 (如果 AI 开启，悔棋应该连退两步：玩家的一步和 AI 的一步)
    if (ty >= btnY && ty <= btnY + btnH && tx >= w/2 - btnW - 20 && tx <= w/2 - 20) {
        if (history.length >= 2) {
            history.pop(); // 弹出 AI 的那步快照
            map = history.pop(); // 还原玩家走棋前的快照
            selectedPos = null;
            currentMoves = [];
            lastMove = null; // 悔棋时清除框
            gameWinner = null; // ADDED: 悔棋后清除胜利标记
            renderBoard();
        } else if (history.length === 1) {
            map = history.pop();
            lastMove = null;
            gameWinner = null; // ADDED
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
        lastMove = null; // 重置框
        gameWinner = null; // ADDED: 重置胜利标记
        renderBoard();
        return;
    }

    // ADDED: 如果游戏已结束，禁止落子并提示
    if (gameWinner !== null) {
        showMessage("游戏已结束，请点击\"重新开始\"。");  // REPLACED alert
        return;
    }

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
    // ADDED: 游戏结束时不能移动
    if (gameWinner !== null) {
        showMessage("游戏已结束，请点击\"重新开始\"。");  // REPLACED alert
        return;
    }

    var isLegal = false;
    for (var i = 0; i < currentMoves.length; i++) {
        if (currentMoves[i].x === gx && currentMoves[i].y === gy) {
            isLegal = true;
            break;
        }
    }

    if (isLegal) {
        history.push(JSON.parse(JSON.stringify(map)));
        
        // 记录玩家这一步的标记位置
        lastMove = {from: {x: selectedPos.x, y: selectedPos.y}, to: {x: gx, y: gy}};
        
        map[gy][gx] = map[selectedPos.y][selectedPos.x];
        map[selectedPos.y][selectedPos.x] = null;
        selectedPos = null;
        currentMoves = [];
        renderBoard();
        
        // ADDED: 玩家移动后立即检查胜负（吃将可能会在此时发生）
        checkGameOver();
        // 如果游戏已结束，AI不再继续走棋
        if (gameWinner !== null) return;
        
        // 玩家走完，AI自动回应，这里需要延时，则到回调中
        AiGo = 1;
        //aiMove();
        
    } else {
        // ADDED: 非法移动时给出提示 (使用标签)
        showMessage("不合规则，不能移动到此位置！");  // REPLACED alert
        // 清空选中状态
        selectedPos = null;
        currentMoves = [];
        renderBoard();
    }
}

// --- 8. 运行 ---
createMessageLabel();  // ADDED FOR LABEL: 创建消息标签
game.pushScene(scene);
renderBoard();
game.run();