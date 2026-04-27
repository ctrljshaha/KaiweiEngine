// ==============================================================================================
// 开维游戏引擎：中国象棋 (stype_2 大图适配版)
// ==============================================================================================

// --- 1. 引擎初始化与屏幕适配 ---
var system = game.getSystemName();
var w, h, window;

if (system == "WINDOWS" || system == "WEB") {
    game.init(); // Windows 默认 800*600，Web 默认全屏
    window = game.getWindow();
    w = window.getWidth();
    h = window.getHeight();
} else if (system == "WEIXIN") {
    game.initSize(canvas.width, canvas.height);
    window = game.getWindow();
    w = canvas.width;
    h = canvas.height;
}

game.setFPS(60);
window.setTitle("中国象棋 - stype_2 高清版");

// --- 2. 资源加载 (全面切换为 stype_2) ---
var resPath = "img/stype_2/";
var textures = {
    bg: game.getResource().getTexture(resPath + "bg.png"),
    dot: game.getResource().getTexture(resPath + "dot.png"), // 选中框
    // 棋子纹理 (红黑各 7 种)
    r_j: game.getResource().getTexture(resPath + "r_j.png"), r_m: game.getResource().getTexture(resPath + "r_m.png"),
    r_x: game.getResource().getTexture(resPath + "r_x.png"), r_s: game.getResource().getTexture(resPath + "r_s.png"),
    r_k: game.getResource().getTexture(resPath + "r_k.png"), r_p: game.getResource().getTexture(resPath + "r_p.png"),
    r_z: game.getResource().getTexture(resPath + "r_z.png"),
    b_j: game.getResource().getTexture(resPath + "b_j.png"), b_m: game.getResource().getTexture(resPath + "b_m.png"),
    b_x: game.getResource().getTexture(resPath + "b_x.png"), b_s: game.getResource().getTexture(resPath + "b_s.png"),
    b_k: game.getResource().getTexture(resPath + "b_k.png"), b_p: game.getResource().getTexture(resPath + "b_p.png"),
    b_z: game.getResource().getTexture(resPath + "b_z.png")
};


var scene = new Scene();
scene.setBg(textures.bg); // 设置背景图

// --- 3. 布局参数调整 (针对 stype_2 的大尺寸进行微调) ---
// 如果运行仍是白板，请根据你 stype_2/bg.png 的实际像素调整以下数值
const SPACE = 66;      // stype_2 通常间距更大 (建议尝试 60-70 之间)
const OFFSET_X = 50;   // 横向起始偏移
const OFFSET_Y = 55;   // 纵向起始偏移
const PIECE_SIZE = 60; // 棋子显示尺寸

// --- 4. 棋局数据 ---
var map = [
    ["b_j","b_m","b_x","b_s","b_k","b_s","b_x","b_m","b_j"],
    [null, null, null, null, null, null, null, null, null],
    [null, "b_p", null, null, null, null, null, "b_p", null],
    ["b_z",null, "b_z",null, "b_z",null, "b_z",null, "b_z"],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    ["r_z",null, "r_z",null, "r_z",null, "r_z",null, "r_z"],
    [null, "r_p", null, null, null, null, null, "r_p", null],
    [null, null, null, null, null, null, null, null, null],
    ["r_j","r_m","r_x","r_s","r_k","r_s","r_x","r_m","r_j"]
];

var sprites = []; 
var selectedPos = null;

// --- 5. 渲染逻辑 ---
function renderBoard() {
    // 清除旧精灵
    for(var i=0; i<sprites.length; i++) {
        scene.removeNode(sprites[i]);
    }
    sprites = [];

    for (var y = 0; y < 10; y++) {
        for (var x = 0; x < 9; x++) {
            var key = map[y][x];
            if (key && textures[key]) {
                var s = new Sprite();
                s.setTexture(textures[key]);
                s.setSize(PIECE_SIZE, PIECE_SIZE);
                s.setPosition(OFFSET_X + x * SPACE, OFFSET_Y + y * SPACE);
                scene.addNode(s);
                sprites.push(s);
            }
        }
    }

    // 绘制选中提示
    if (selectedPos) {
        var dot = new Sprite();
        dot.setTexture(textures.dot);
        dot.setSize(PIECE_SIZE, PIECE_SIZE);
        dot.setPosition(OFFSET_X + selectedPos.x * SPACE, OFFSET_Y + selectedPos.y * SPACE);
        scene.addNode(dot);
        sprites.push(dot);
    }
}

// --- 6. 交互处理 ---
scene.onPress((tx, ty) => {
    var gx = Math.round((tx - OFFSET_X) / SPACE);
    var gy = Math.round((ty - OFFSET_Y) / SPACE);

    if (gx < 0 || gx > 8 || gy < 0 || gy > 9) return;

    var piece = map[gy][gx];
    if (piece) {
        selectedPos = {x: gx, y: gy};
    } else if (selectedPos) {
        map[gy][gx] = map[selectedPos.y][selectedPos.x];
        map[selectedPos.y][selectedPos.x] = null;
        selectedPos = null;
    }
    renderBoard();
});

// --- 7. 启动 ---
game.pushScene(scene);
renderBoard();
game.run();