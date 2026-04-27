// ==============================================================================================
// 开维游戏引擎：中国象棋 (提示点精准对齐与走法逻辑版)
// ==============================================================================================

// --- 1. 初始化 ---
var system = game.getSystemName();
var w, h, window;
if (system == "WINDOWS" || system == "WEB") {
    game.init(); 
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
const DOT_SIZE = 20; // 提示点大小，设置小一点

const BOARD_X = (w - BOARD_W) / 2;
const BOARD_Y = (h - BOARD_H) / 2;

const SPACE_X = (BOARD_W - PIECE_SIZE) / 8; 
const SPACE_Y = (BOARD_H - PIECE_SIZE) / 9; 

// --- 3. 资源预加载 ---
var resPath = "img/stype_2/";
var textures = {
    bg: game.getResource().getTexture(resPath + "bg.png"),
    dot: game.getResource().getTexture(resPath + "dot.png"),
    r_j: game.getResource().getTexture(resPath + "r_j.png"), r_m: game.getResource().getTexture(resPath + "r_m.png"),
    r_x: game.getResource().getTexture(resPath + "r_x.png"), r_s: game.getResource().getTexture(resPath + "r_s.png"),
    r_k: game.getResource().getTexture(resPath + "r_c.png"), r_p: game.getResource().getTexture(resPath + "r_p.png"),
    r_z: game.getResource().getTexture(resPath + "r_z.png"),
    b_j: game.getResource().getTexture(resPath + "b_j.png"), b_m: game.getResource().getTexture(resPath + "b_m.png"),
    b_x: game.getResource().getTexture(resPath + "b_x.png"), b_s: game.getResource().getTexture(resPath + "b_s.png"),
    b_k: game.getResource().getTexture(resPath + "b_c.png"), b_p: game.getResource().getTexture(resPath + "b_p.png"),
    b_z: game.getResource().getTexture(resPath + "b_z.png")
};

var scene = new Scene();
var boardNode = new Sprite();
boardNode.setTexture(textures.bg);
boardNode.setSize(BOARD_W, BOARD_H);
boardNode.setPosition(BOARD_X, BOARD_Y);
scene.addNode(boardNode);

// --- 4. 棋盘数据 ---
var map = [
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

var sprites = [];
var selectedPos = null;
var currentMoves = []; // 当前选中的棋子可以走的点

// --- 5. 走法逻辑计算 (简易示例) ---
function getPossibleMoves(gx, gy) {
    var piece = map[gy][gx];
    if (!piece) return [];
    var moves = [];

    // 示例：红卒 (r_z) 的走法逻辑
    if (piece === "r_z") {
        if (gy > 0) moves.push({x: gx, y: gy - 1}); // 前进
        if (gy <= 4) { // 过河后可以横着走
            if (gx > 0) moves.push({x: gx - 1, y: gy});
            if (gx < 8) moves.push({x: gx + 1, y: gy});
        }
    }
    // 示例：车 (k) 的直线走法 (简化版，未处理挡路)
    else if (piece.indexOf("_k") !== -1) {
        for (var i = 0; i < 9; i++) if (i !== gx) moves.push({x: i, y: gy});
        for (var j = 0; j < 10; j++) if (j !== gy) moves.push({x: gx, y: j});
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
            
            // 居中公式：(当前格点位置) + (大棋子尺寸 - 小点尺寸) / 2
            var dotPosX = BOARD_X + move.x * SPACE_X + (PIECE_SIZE - DOT_SIZE) / 2;
            var dotPosY = BOARD_Y + move.y * SPACE_Y + (PIECE_SIZE - DOT_SIZE) / 2;
            
            dot.setPosition(dotPosX, dotPosY);
            scene.addNode(dot);
            sprites.push(dot);
        }
    }
}

// --- 7. 点击交互 ---
scene.onPress((tx, ty) => {
    var gx = Math.round((tx - BOARD_X) / SPACE_X);
    var gy = Math.round((ty - BOARD_Y) / SPACE_Y);

    if (gx >= 0 && gx <= 8 && gy >= 0 && gy <= 9) {
        var piece = map[gy][gx];
        
        // 如果点击的是棋子
        if (piece) {
            selectedPos = {x: gx, y: gy};
        } 
        // 如果点击的是空位，且当前有选中棋子
        else if (selectedPos) {
            // 检查点击的位置是否在“可走点”列表中
            var isLegal = false;
            for (var i = 0; i < currentMoves.length; i++) {
                if (currentMoves[i].x === gx && currentMoves[i].y === gy) {
                    isLegal = true;
                    break;
                }
            }

            if (isLegal) {
                map[gy][gx] = map[selectedPos.y][selectedPos.x];
                map[selectedPos.y][selectedPos.x] = null;
                selectedPos = null;
                currentMoves = [];
            }
        }
        renderBoard();
    }
});

// --- 8. 运行 ---
game.pushScene(scene);
renderBoard();
game.run();