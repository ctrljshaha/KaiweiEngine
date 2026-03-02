class MineSweep {
    /**
     * 行数
     */
    static row;
    /**
     * 列数
     */
    static col;

    /**
     * 地雷总数
     */
    static leiNum = 10;

    /**
     * 剩余地雷数
     */
     static remain = 10;

    /**
     * 格子
     */
    static blocks = [];

    /**
     * 游戏是否结束
     */
    static over = false;

    /**
     * 游戏是否开始
     */
    static begin = false;
    /**
     * 玩家是否胜利
     */
    static win = false;
    static firstClickNormal = false;
    static startTime;
    static scene;

    constructor(row, col, sum) {
        MineSweep.initRowColSum(row, col, sum);
    }

    /**
     * 开始新游戏
     */
    static restart() {
        this.initRowColSum(this.row, this.col, this.leiNum);
    }

    /**
     * 初始化 行列 地雷数量
     *
     * @param row
     * @param col
     * @return
     */
    static initRowColSum(row, col, sum) {
        this.scene = Util.bj();
        this.row = row;
        this.col = col;
        this.leiNum = sum;
        this.remain = this.leiNum;
        this.firstClickNormal = false;
        this.over = false;
        this.begin = false;
        this.win = false;
        this.initBlocks();

        let w = game.getWindow().getWidth();

        // 返回主页
        Util.newSprite({
            x: w-100,
            y: 5,
            width: 90,
            height: 50,
            texture: 'zaicitiaozhan.png',
            clickCb: ()=>{
                MineSweep.restart();
            }
        })

        // 返回按钮
        Util.newSprite({
            x: 10,
            y: 10,
            width: 60,
            height: 40,
            texture: 'btback.png',
            clickCb: ()=>{
                new LevelScene();
            }
        })

        return this;
    }

    /**
     * 初始化方块，随机产生地雷
     */
    static initBlocks() {
        // 已有地雷数
        let count = 0;

        let row = this.row;
        let col = this.col;
        let sum = this.leiNum;

        this.blocks = [];
        let blocks = this.blocks;
        // 剩余地雷数
        this.remain = this.leiNum;

        for (let i = 0; i < row; i++) {
            let arr = [];
            for (let j = 0; j < col; j++) {
                arr.push(new Card(this.scene,i,j,40));
            }
            blocks.push(arr);
        }

        // 随机指定地雷
        while (count < sum) {
            let i = parseInt(Math.random() * row);
            let j =parseInt (Math.random() * col);
            if (blocks[i][j].category != 9) {
                blocks[i][j].category = 9;
                count++;
            }
        }

        // 计算非地雷方块的数值
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (blocks[i][j].category != 9) {
                    // 左上
                    if (i - 1 >= 0 && j - 1 >= 0 && blocks[i - 1][j - 1].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 上
                    if (i - 1 >= 0 && blocks[i - 1][j].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 右上
                    if (i - 1 >= 0 && j + 1 < col && blocks[i - 1][j + 1].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 左
                    if (j - 1 >= 0 && blocks[i][j - 1].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 右
                    if (j + 1 < col && blocks[i][j + 1].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 左下
                    if (i + 1 < row && j - 1 >= 0 && blocks[i + 1][j - 1].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 下
                    if (i + 1 < row && blocks[i + 1][j].category == 9) {
                        blocks[i][j].category++;
                    }
                    // 右下
                    if (i + 1 < row && j + 1 < col && blocks[i + 1][j + 1].category == 9) {
                        blocks[i][j].category++;
                    }
                }
            }
        }

        return this;
    }

    /**
     * 翻开相邻的方块
     * 如果方块为空（category为0），则递归地翻开与空相邻的方块
     * fanNumber  翻开相邻的方块的数量
     */
     static flipAround(i, j,fanNumber) {
        let blocks = this.blocks;
        let row = this.row;
        let col = this.col;
        let block = blocks[i][j];
        block.changeStatus()

        // 左上
        if (i - 1 >= 0 && j - 1 >= 0 && !blocks[i - 1][j - 1].flip && !blocks[i - 1][j - 1].flag) {
            blocks[i - 1][j - 1].flip = true;
            blocks[i - 1][j - 1].changeStatus();
            fanNumber++;
            this.clickOver(blocks[i - 1][j - 1]);
            if (blocks[i - 1][j - 1].category == 0) {
                this.flipAround(i - 1, j - 1, fanNumber);
            }
        }
        // 上
        if (i - 1 >= 0 && !blocks[i - 1][j].flip && !blocks[i - 1][j].flag) {
            blocks[i - 1][j].flip = true;
            blocks[i - 1][j].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i - 1][j]);
            if (blocks[i - 1][j].category == 0) {
                this.flipAround(i - 1, j, fanNumber);
            }
        }
        // 右上
        if (i - 1 >= 0 && j + 1 < col && !blocks[i - 1][j + 1].flip && !blocks[i - 1][j + 1].flag) {
            blocks[i - 1][j + 1].flip = true;
            blocks[i - 1][j + 1].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i - 1][j + 1]);
            if (blocks[i - 1][j + 1].category == 0) {
                this.flipAround(i - 1, j + 1, fanNumber);
            }
        }
        // 左
        if (j - 1 >= 0 && !blocks[i][j - 1].flip && !blocks[i][j - 1].flag) {
            blocks[i][j - 1].flip = true;
            blocks[i][j - 1].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i][j - 1]);
            if (blocks[i][j - 1].category == 0) {
                this.flipAround(i, j - 1, fanNumber);
            }
        }
        // 右
        if (j + 1 < col && !blocks[i][j + 1].flip && !blocks[i][j + 1].flag)
        {
            blocks[i][j + 1].flip = true;
            blocks[i][j + 1].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i][j + 1]);
            if (blocks[i][j + 1].category == 0) {
                this.flipAround(i, j + 1, fanNumber);
            }
        }
        // 左下
        if (i + 1 < row && j - 1 >= 0 && !blocks[i + 1][j - 1].flip && !blocks[i + 1][j - 1].flag) {
            blocks[i + 1][j - 1].flip = true;
            blocks[i + 1][j - 1].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i + 1][j - 1]);
            if (blocks[i + 1][j - 1].category == 0) {
                this.flipAround(i + 1, j - 1, fanNumber);
            }
        }
        // 下
        if (i + 1 < row && !blocks[i + 1][j].flip && !blocks[i + 1][j].flag) {
            blocks[i + 1][j].flip = true;
            blocks[i + 1][j].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i + 1][j]);
            if (blocks[i + 1][j].category == 0) {
                this.flipAround(i + 1, j, fanNumber);
            }
        }
        // 右下
        if (i + 1 < row && j + 1 < col && !blocks[i + 1][j + 1].flip && !blocks[i + 1][j + 1].flag) {
            blocks[i + 1][j + 1].flip = true;
            blocks[i + 1][j + 1].changeStatus()

            fanNumber++;
            this.clickOver(blocks[i + 1][j + 1]);
            if (blocks[i + 1][j + 1].category == 0) {
                this.flipAround(i + 1, j + 1, fanNumber);
            }
        }
        return fanNumber;
     }



    /**
     * 当双击方块周围已标记雷数等于该位置数字时，相当于对该方块周围未打开的方块均进行一次左键单击操作
     * 地雷未标记完全时使用双击无效。若数字周围有标错的地雷，则游戏结束
     */
    static doubleClickFlip(i, j) {
        let blocks = this.blocks;
        let number = 0;
        let row = this.row;
        let col = this.col;
        let wrong = false;
        // 左上
        if (i - 1 >= 0 && j - 1 >= 0) {
            let block = blocks[i - 1][j - 1];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 上
        if (i - 1 >= 0 ) {
            let block = blocks[i - 1][j];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 右上
        if (i - 1 >= 0 && j + 1 < col) {
            let block = blocks[i - 1][j + 1];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 左
        if (j - 1 >= 0) {
            let block = blocks[i][j - 1];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 右
        if (j + 1 < col) {
            let block = blocks[i][j + 1];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 左下
        if (i + 1 < row && j - 1 >= 0) {
            let block = blocks[i + 1][j - 1];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 下
        if (i + 1 < row) {
            let block = blocks[i + 1][j];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }
        // 右下
        if (i + 1 < row && j + 1 < col) {
            let block = blocks[i + 1][j + 1];
            if (!block.flip) {
                number+=block.flag?1:0;
            }
        }

        // 数字和标旗数量相同
        if (number == blocks[i][j].category) {
            let flipNumber = this.flipAround(i, j,0);
        }else{
            // 数字和标旗数量不相同
            // blocks[i][j].cha = true;
        }
        this.isOver();
    }


    /**
     * 翻开所有方块
     */
    static flipAll() {
        let row = this.row;
        let col = this.col;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let blockElement = this.blocks[i][j];
                blockElement.flip = true;
                blockElement.changeStatus()
            }
        }
    }

    /**
     * 游戏操作
     * @param type 0：单击 ,1：标记 2 双击
     * @param i
     * @param j
     * @return 0 单击；1 标记；2 双击成功 ；3 双击成功无反应  4 双击失败 5 单击标记无反应
     */
    static click(type, i , j) {

        let blocks = this.blocks;
        let row = this.row;
        let col = this.col;
        let win = this.win;
        let block = blocks[i][j];

        // 单击 未翻开 是雷
        if(type == 0 && !block.flip && block.category == 9 && !this.firstClickNormal){
            this.restart();
            return this.click(type,i,j);
        }

        // 对局没结束 坐标没越界 方块没翻开
        if ((!this.over || !win) && i >= 0 && i < row && j >= 0 && j < col && !block.flip) {
            if (type == 0 && !block.flag){
                log("click 单击")
                // 第一次单击时开始记时
                if (!this.begin) {
                    this.begin = new Date();
                    this.startTime = new Date();
                }
                log(JSON.stringify(block))
                // 左键点击翻开方块
                block.flip = true;
                block.changeStatus();

                if (block.category == 0) {
                    // 空白 ，翻开相邻的
                    this.flipAround(i, j,0);
                } else{
                    this.clickOver(block);
                }
                this.firstClickNormal = true;
                if(block.category !== 9){
                    log("dj.mp3")
                    let audio = new Audio();
                    audio.playSound("dj.mp3"); // 播放音效
                }
            }
            else if (type == 1) {
                log("click 标记")
                block.flag = !block.flag;
                block.changeStatus();
            }else if (type == 2) {
                // 双击(未点开的) 同单击
                log("click 双击(未点开的) 同单击")
                return this.click(0,i,j);
            }
            this.isOver();
        } else if ((!this.over || !win) && i >= 0 && i < row && j >= 0 && j < col && type == 2) {
            // 方块已经被翻开 且不是地雷
            if (block.flip && block.category < 9) {
                log("click 双击")
                // 双击标旗 或 空白  不做任何处理
                if( block.category==0){

                }else{
                    audio.playSound("dj.mp3"); // 播放音效
                    // 双击成功
                    return this.doubleClickFlip(i, j);
                }
            }
        }
    }

    /**
     * 点到雷
     * @param block
     */
    static clickOver(block){
        if(block.category == 9) {
                this.over = true;
                this.begin = false;
                this.flipAll();
                this.gameEnd(false);
                audio.playSound("baoza.mp3"); // 播放音效
        }
    }

    /**
     * 游戏是否结束( 非雷格子全部翻开)
     */
    static isOver(){
        for (let block of this.blocks) {
            for (let block1 of block) {
                // 非雷 未翻开
                if(!block1.flip && block1.category<9){
                    return false;
                }
                // 雷 未标记
                if(!block1.flag && block1.category==9 && !block1.flip){
                    return false;
                }
            }
        }

        this.over = true;
        this.gameEnd();
        return true;
    }

    static gameEnd(win){
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        if(win === undefined){
            win = this.isWin();
        }
        let time = new Date();
        log("游戏结束:"+win)
        if(win){
            let number = time.getTime() - this.startTime.getTime();
            Util.newText(150,10,"游戏胜利,耗时:"+parseInt(number/1000)+"秒",220,30)
        }else {
            Util.newText(100,10,"游戏失败",80,30)
        }
    }

    /**
     * 游戏是否胜利：标记数量和雷格子数量是否相等
     */
    static isWin(){
        let flagNum = 0;
        for (let block of this.blocks) {
            for (let block1 of block) {
                // 非雷 未翻开
                if(block1.flag && block1.category===9){
                    flagNum++
                }
            }
        }

        if(flagNum === this.leiNum){
            this.win = true;
        }else{
            this.win = false;
        }

        return this.win;
    }

}
