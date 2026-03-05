/**
 * 五子棋核心逻辑类
 */
class Gobang {
    // 棋子精灵对象数组，用于后续悔棋或清空画布
    static chessPieces = [];
    // 15x15 棋盘状态数组 (0:无子, 1:玩家/黑子, 2:电脑/白子)
    static chessBoard = [];
    // 赢法三维数组 [x][y][winIndex]
    static wins = [];
    // 赢法统计数组
    static myWin = [];
    static computerWin = [];
    // 赢法总数
    static count = 0;
    // 游戏结束标志位
    static win = false;
    // 棋盘在屏幕上的偏移坐标
    static posX = 0;
    static posY = 0;
    // 当前活动场景引用
    static scene;
    static audio = new Audio();

    constructor() {
        Gobang.init();
    }

    /**
     * 初始化游戏环境、棋盘状态及赢法统计
     */
    static init() {
        // 重置全局与静态状态
        GlobalVariable.gameOver = false;
        this.win = false;
        this.chessBoard = [];
        this.chessPieces = [];
        this.wins = [];
        this.myWin = [];
        this.computerWin = [];

        // 初始化UI背景
        let { scene } = Util.bj({ picture: "mainbg.png" });
        this.scene = scene;
        let bg = Gobang.createChessBg();

        // 注册交互事件：0-下子，1-其他功能
        bg.click((type, x, y) => {
            if (GlobalVariable.gameOver) return;
            if (type === 0) {
                this.logic(x, y);
            }
        });

        // 获取棋盘物理坐标起始点
        let position = Util.getPosition(bg);
        this.posX = position.x;
        this.posY = position.y;


        // --- 预计算赢法统计 (空间换时间) ---
        // 初始化三维赢法空间
        for (let i = 0; i < 15; i++) {
            this.wins[i] = [];
            for (let j = 0; j < 15; j++) {
                this.wins[i][j] = [];
            }
        }

        let count = 0;
        // 1. 横线赢法
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i][j + k][count] = true;
                }
                count++;
            }
        }
        // 2. 竖线赢法
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[j + k][i][count] = true;
                }
                count++;
            }
        }
        // 3. 正斜线赢法 (\)
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i + k][j + k][count] = true;
                }
                count++;
            }
        }
        // 4. 反斜线赢法 (/)
        for (let i = 0; i < 11; i++) {
            for (let j = 14; j > 3; j--) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i + k][j - k][count] = true;
                }
                count++;
            }
        }

        this.count = count;

        // 初始化每种赢法的达成进度
        for (let i = 0; i < count; i++) {
            this.myWin[i] = 0;
            this.computerWin[i] = 0;
        }

        // 初始化逻辑棋盘
        for (let i = 0; i < 15; i++) {
            this.chessBoard[i] = [];
            for (let j = 0; j < 15; j++) {
                this.chessBoard[i][j] = 0;
            }
        }
    }

    /**
     * AI 决策逻辑 - 基于分值的启发式算法
     * 算法逻辑：遍历棋盘所有空位，计算拦截分(myScore)和进攻分(computerScore)，选出最优点。
     */
    static computerAI() {
        if (GlobalVariable.gameOver) return;

        let myScore = [];
        let computerScore = [];
        let iMax = 0; // 最高评分
        let u = 0, v = 0; // 选中的坐标

        // 初始化当次评分表
        for (let i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (let j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.chessBoard[i][j] === 0) {
                    for (let k = 0; k < this.count; k++) {
                        if (this.wins[i][j][k]) {
                            // 评估玩家威胁程度 (拦截逻辑)
                            const playerP = this.myWin[k];
                            const scoresP = [0, 200, 400, 2000, 10000];
                            if (playerP < 5) myScore[i][j] += scoresP[playerP] || 0;

                            // 评估电脑优势程度 (攻击逻辑)
                            const aiP = this.computerWin[k];
                            const scoresAI = [0, 400, 800, 2200, 20000];
                            if (aiP < 5) computerScore[i][j] += scoresAI[aiP] || 0;
                        }
                    }

                    // 择优录取：比较玩家得分，决定是否围堵
                    if (myScore[i][j] > iMax) {
                        iMax = myScore[i][j];
                        u = i; v = j;
                    } else if (myScore[i][j] === iMax) {
                        if (computerScore[i][j] > computerScore[u][v]) {
                            u = i; v = j;
                        }
                    }

                    // 择优录取：比较电脑得分，决定是否进攻
                    if (computerScore[i][j] > iMax) {
                        iMax = computerScore[i][j];
                        u = i; v = j;
                    } else if (computerScore[i][j] === iMax) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i; v = j;
                        }
                    }
                }
            }
        }

        // 执行AI落子
        this.createChessPiece(u + 1, v + 1, true);
        this.chessBoard[u][v] = 2;

        // 更新赢法权重统计
        for (let k = 0; k < this.count; k++) {
            if (this.wins[u][v][k]) {
                this.computerWin[k]++;
                this.myWin[k] = 6; // 该赢法路径已被阻塞，设为无效值
                if (this.computerWin[k] === 5) {
                    GlobalVariable.gameOver = true;
                    this.win = false;
                }
            }
        }
    }

    /**
     * 创建棋盘背景精灵
     * @returns {Sprite} 背景精灵对象
     */
    static createChessBg() {
        let w = game.getWindow().getWidth();
        return Util.newSprite({
            x: Math.abs(300 - w / 2) + 5,
            y: 5,
            width: 600,
            height: 600,
            texture: "gobang.png"
        });
    }

    /**
     * 实例化并渲染棋子
     * @param {number} row 行号 (1-15)
     * @param {number} col 列号 (1-15)
     * @param {boolean} isWhite 是否为白棋
     */
    static createChessPiece(row, col, isWhite) {
        const cache = game.getResource();
        let texture = cache.getTexture(isWhite ? "chess_white.png" : "chess_black.png");

        let chessPiece = new Sprite();
        chessPiece.setTexture(texture);
        chessPiece.setSize(25, 25);

        // 核心渲染计算：坐标偏移量 + (行列间隔 * 单位长度)
        let x = this.posX + 3 + 40.5 * (col - 1);
        let y = this.posY + 3 + 40.5 * (row - 1);

        chessPiece.setPosition(x, y);
        this.scene.addNode(chessPiece);
        this.chessPieces.push(chessPiece);
    }

    /**
     * 处理玩家点击落子逻辑
     * @param {number} x 点击点绝对横坐标
     * @param {number} y 点击点绝对纵坐标
     */
    static logic(x, y) {
        if (GlobalVariable.gameOver) return;

        // 坐标反算：将屏幕坐标转为网格坐标
        let col = Math.floor((x - this.posX - 3) / 40.5) + 1;
        let row = Math.floor((y - this.posY - 3) / 40.5) + 1;

        // 边界防御检查
        if (row < 1 || row > 15 || col < 1 || col > 15) return;
        if (this.chessBoard[row - 1][col - 1] !== 0) return;

        // 玩家落子逻辑
        this.createChessPiece(row, col, false);
        this.chessBoard[row - 1][col - 1] = 1;
        this.audio.playSound("1.wav"); // 播放音效

        // 更新赢法权重并检测玩家是否获胜
        for (let k = 0; k < this.count; k++) {
            if (this.wins[row - 1][col - 1][k]) {
                this.myWin[k]++;
                this.computerWin[k] = 6; // 阻塞AI在该赢法上的可能性
                if (this.myWin[k] === 5) {
                    GlobalVariable.gameOver = true;
                    this.win = true;
                    break;
                }
            }
        }

        // 若玩家未胜，触发AI响应
        if (!GlobalVariable.gameOver) {
            this.computerAI();
        }

        this.gameEnd();
    }

    /**
     * 结算处理与UI反馈
     */
    static gameEnd() {
        if (!GlobalVariable.gameOver) return;

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let msg = this.win ? "游戏结束，胜利！" : "游戏结束，失败！";

        Util.newText({
            text: msg,
            x: w / 3 + 70,
            y: 10,
            width: 150,
        });

        // 显示重试按钮
        Util.newSprite({
            x: w / 2 - 73,
            y: h / 2 - 26,
            width: 147,
            height: 53,
            texture: 'restart.png',
            clickCb: () => {
                new Gobang(); // 重新实例化
            }
        });
    }
}