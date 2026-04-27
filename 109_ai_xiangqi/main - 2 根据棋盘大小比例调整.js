// ==============================================================================================
// 开维游戏引擎：中国象棋 (基于四角坐标自动布子版)
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

// --- 2. 核心布局参数 ( stype_2 适配 ) ---
const BOARD_W = 507;
const BOARD_H = 567;
const PIECE_SIZE = 54;

// 计算棋盘左上角的起始点，确保棋盘图片居中
const BOARD_X = (w - BOARD_W) / 2;
const BOARD_Y = (h - BOARD_H) / 2;

/**
 * 核心逻辑：四角对齐算法
 * 我们定义棋子(0,0)到(8,9)的坐标范围。
 * 为了让棋子边缘对齐棋盘边缘，间距计算如下：
 */
const SPACE_X = (BOARD_W - PIECE_SIZE) / 8; // X轴间隔：(总宽-1个棋子宽)/8个间距
const SPACE_Y = (BOARD_H - PIECE_SIZE) / 9; // Y轴间隔：(总高-1个棋子宽)/9个间距

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

// 绘制居中的棋盘底图
var boardNode = new Sprite();
boardNode.setTexture(textures.bg);
boardNode.setSize(BOARD_W, BOARD_H);
boardNode.setPosition(BOARD_X, BOARD_Y);
scene.addNode(boardNode);

// --- 4. 完整的初始化棋盘数据 (基于 play.js 标准布局) ---
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

// --- 5. 渲染函数：根据四角推算位置 ---
function renderBoard() {
    // 清理
    for(var i=0; i<sprites.length; i++) { scene.removeNode(sprites[i]); }
    sprites = [];

    for (var y = 0; y < 10; y++) {
        for (var x = 0; x < 9; x++) {
            var key = map[y][x];
            if (key) {
                var s = new Sprite();
                s.setTexture(textures[key]);
                s.setSize(PIECE_SIZE, PIECE_SIZE);
                
                /**
                 * 位置计算公式：
                 * 这里的坐标 (x, y) 对应逻辑网格
                 * 实际像素 X = 棋盘起点X + 索引 * 动态间距
                 * 实际像素 Y = 棋盘起点Y + 索引 * 动态间距
                 */
                var posX = BOARD_X + x * SPACE_X;
                var posY = BOARD_Y + y * SPACE_Y;
                
                s.setPosition(posX, posY);
                scene.addNode(s);
                sprites.push(s);
            }
        }
    }

    // 选中状态提示
    if (selectedPos) {
        var dot = new Sprite();
        dot.setTexture(textures.dot);
        dot.setSize(PIECE_SIZE, PIECE_SIZE);
        dot.setPosition(BOARD_X + selectedPos.x * SPACE_X, BOARD_Y + selectedPos.y * SPACE_Y);
        scene.addNode(dot);
        sprites.push(dot);
    }
}

// --- 6. 点击交互 ---
scene.onPress((tx, ty) => {
    // 逆向推算：根据点击像素反求网格索引 (0-8, 0-9)
    var gx = Math.round((tx - BOARD_X) / SPACE_X);
    var gy = Math.round((ty - BOARD_Y) / SPACE_Y);

    if (gx >= 0 && gx <= 8 && gy >= 0 && gy <= 9) {
        var piece = map[gy][gx];
        if (piece) {
            selectedPos = {x: gx, y: gy};
        } else if (selectedPos) {
            // 简单移动逻辑
            map[gy][gx] = map[selectedPos.y][selectedPos.x];
            map[selectedPos.y][selectedPos.x] = null;
            selectedPos = null;
        }
        renderBoard();
    }
});

// --- 7. 运行游戏 ---
game.pushScene(scene);
renderBoard();
game.run();