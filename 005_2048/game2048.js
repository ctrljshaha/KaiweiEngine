
// 游戏类

class Game2048 {
    static cells = [];
    static score = 0;
    static scoreText;

    constructor() {
        Game2048.init();
    }

    // 函数功能：初始化游戏
    static init(){
        this.cells = []; // 格子数组
        GlobalVariable.gameOver = false;
        let cells = this.cells;
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let {scene} = Util.bj();

        // 显示游戏介绍
        Util.newSprite({
            x: w/10+20,
            y: 0,
            width: 552,
            height: 231,
            texture: 'header.png',
            clickCb: ()=>{
            }
        })

        //介绍文字
        Util.newText({
            x: w/5 - 30,
            y: 140,
            text: "玩法： 使用WASD键，或上下左右键，移动数字方块。相邻的两个方块\n                 数字相同，可以合并成一个。",
            width:600,
            height: 70,
            fontSize: 18,
            textColor:[0,0,0]
        })
        /*Util.newText({
            x: w/3,
            y: 180,
            text: "数字相同，可以合并成一个。",
            width:300,
            fontSize: 18,
            textColor:[0,0,0]
        })*/

        // 重新开始按钮
        Util.newSprite({
            x: w/3+25,
            y: h-65,
            width: 147,
            height: 53,
            texture: 'restart.png',
            clickCb: ()=>{
                Game2048.init(); // 点击回调函数，重新开始游戏
            }
        })

        // 分数
        this.score = 0;
        this.scoreText = Util.newText({
            x: w/3 + 60,
            y: h/2 - 45,
            text: "分数："+this.score+"",
            width:300
        })

        // 格子背景框
        Util.newSprite({
            x: w/3 - 15,
            y: h/2 - 15,
            width: 240,
            height: 240,
            texture: 'cellbg.png',
            clickCb: ()=>{
            }
        })


        // 生成格子
        let cellX = w/3;
        let cellY = h/2;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let cell = new Cell(0,cellX+j*53,cellY+i*53,i+1,j+1); // 创建方格
                cells.push(cell);
            }
        }

        // 设置格子初始值
        cells[0].number = 2;
        cells[4].number = 2;
        cells[0].changePicture();
        cells[4].changePicture();
    }

    // 函数功能：游戏主逻辑
    // 函数参数：direction，方向 up down left right
    static logic(direction){
        if(GlobalVariable.gameOver){
            return;
        }
        
        // 处理玩家输入的方向，移动所有格子并合并相同数字
        if(direction == "up") {
            // 向上移动：从第一列到第四列逐列处理
            for (let col = 1; col < 5; col++) {
                // 从上到下遍历每一行（从第一行到第四行）
                // 每行的格子都会被尝试与下面的格子合并
                for (let row = 1; row < 5; row++) {
                    // 核心合并逻辑：对于当前位置(row, col)的格子
                    // 检查它下面(row+1到第4行)的所有格子
                    for (let i = row + 1; i < 5; i++) {
                        // 将当前格子与其下方第i行的格子尝试合并
                        // getCell(row, col): 当前要移动/合并的目标格子（基准格子）
                        // getCell(i, col): 当前格子下方待检查的格子
                        // addCell()方法会判断两个格子是否能合并（值相同且未合并过）
                        // 如果能合并，则值相加；如果不能，则可能只是移动位置
                        this.addCell(this.getCell(row, col), this.getCell(i, col));
                    }
                }
            }
        } else if (direction == "down") {
            // 向下移动：从第一列到第四列逐列处理
            for (let col = 1; col < 5; col++) {
                // 从下到上遍历每一行（从第四行到第一行）
                // 这样确保底部的格子优先作为合并基准
                for (let row = 4; row > 0; row--) {
                    // 对于当前位置(row, col)的格子
                    // 检查它上面(row-1到第1行)的所有格子
                    for (let i = row - 1; i > 0; i--) {
                        // 将当前格子与其上方第i行的格子尝试合并
                        // 向下移动时，底部的格子是基准，上方的格子向其靠拢
                        this.addCell(this.getCell(row, col), this.getCell(i, col));
                    }
                }
            }
        } else if (direction == "left") {
            // 向左移动：从第一行到第四行逐行处理
            for (let row = 1; row < 5; row++) {
                // 从左到右遍历每一列（从第一列到第四列）
                for (let col = 1; col < 5; col++) {
                    // 对于当前位置(row, col)的格子
                    // 检查它右边(col+1到第4列)的所有格子
                    for (let i = col + 1; i < 5; i++) {
                        // 将当前格子与其右侧第i列的格子尝试合并
                        // 向左移动时，左边的格子是基准，右边的格子向其靠拢
                        this.addCell(this.getCell(row, col), this.getCell(row, i));
                    }
                }
            }
        } else if (direction == "right") {
            // 向右移动：从第一行到第四行逐行处理
            for (let row = 1; row < 5; row++) {
                // 从右到左遍历每一列（从第四列到第一列）
                // 这样确保右边的格子优先作为合并基准
                for (let col = 4; col > 0; col--) {
                    // 对于当前位置(row, col)的格子
                    // 检查它左边(col-1到第1列)的所有格子
                    for (let i = col - 1; i > 0; i--) {
                        // 将当前格子与其左侧第i列的格子尝试合并
                        // 向右移动时，右边的格子是基准，左边的格子向其靠拢
                        this.addCell(this.getCell(row, col), this.getCell(row, i));
                    }
                }
            }
        }


        // 生成新的格子
        this.createNumberCell();
        // 更新分数
        this.scoreText.setText("分数："+this.score+"");
        // 判断游戏是否结束
        this.gameEnd();
        
       audio.playSound("dj.wav"); // 播放音效

    }

    // 函数功能：随机生成新的格子
    static createNumberCell(){
        let cells = this.cells;

        // 获取所有值为0的格子
        const zeroCells = [];
        if(cells && cells.length > 0){
            for (let i = 0; i < cells.length; i++) {
                if(cells[i].number == 0){
                    zeroCells.push(cells[i]);
                }
            }
        }
        if (zeroCells && zeroCells.length > 0){
            // 随机选择一个格子生成数字
            const number = Math.floor(Math.random(0, zeroCells.length));
            const neroCell = zeroCells[number];
            if(neroCell){
                let b = Math.random() > 0.5;
                if (b){
                    neroCell.number = 4
                }else {
                    neroCell.number = 2;
                }
                neroCell.changePicture();
            }
        }
    }

     // 函数功能：获取指定行，列的格子
     // 函数参数：row-行号；col-列号
     // 函数返回：方格对象
    static getCell(row,col){
        let cells = this.cells;
        if(cells && cells.length > 0){
            for (let i = 0; i < cells.length; i++) {
                if(cells[i].row == row && cells[i].col == col ){
                    return cells[i];
                }
            }
        }
    }

    // 函数功能：根据距离判断是否可以相加：两个格子相邻 或则 中间格子为0
    // 函数返回：true 相邻 false 不相邻
    static canAdd(cell1, cell2){
        let cell;
        let i;
        if(cell1 && cell2) {
            const row = cell1.row;
            const col = cell1.col;
            const row2 = cell2.row;
            const col2 = cell2.col;

            // 同行
            if(row == row2){
                // 相邻：列距离为1
                const b = Math.abs(col - col2) == 1;
                if(!b){
                    // 判断中间是否有格子不为0
                    if(col > col2){
                        for (i = col2+1; i < col; i++) {
                            cell = this.getCell(row, i);
                            if(cell.number > 0){
                                return false;
                            }
                        }
                        return true;
                    }else {
                        for (i = col+1; i < col2; i++) {
                            cell = this.getCell(row,i);
                            if(cell.number > 0){
                                return false;
                            }
                        }
                        return true;
                    }
                }
                return b;
            }

            // 同列
            if(col == col2){
                // 相邻：行距离为1
                const b1 = Math.abs(row - row2) == 1;
                if(!b1){
                    // 判断中间是否有格子不为0
                    if(row > row2){
                        for (i = row2+1; i < row; i++) {
                            cell = this.getCell(i,col);
                            if(cell.number > 0){
                                return false;
                            }
                        }
                        return true;
                    }else {
                        for (i = row+1; i < row2; i++) {
                            cell = this.getCell(i,col);
                            if(cell.number > 0){
                                return false;
                            }
                        }
                        return true;
                    }
                }
                return b1;
            }
        }
        return false;
    }

     // 函数功能：格子相加：
     //                 相邻/中间为空 且数字相同，则相加。
     //                 否则交换位置。
     // 函数参数：cell1 被加格子
     //                 cell2 格子
    static addCell(cell1, cell2){
        if(cell1 && cell2){
            const num1 = cell1.number;
            const num2 = cell2.number;
            if(num1 != 0 || num2 != 0){
                // 两个格子相同且相邻位置
                if(num1 == num2 && this.canAdd(cell1,cell2)){
                    cell1.number = num1 + num2;
                    cell2.number = 0;
                    this.score = this.score + cell1.number;
                }
                // 被加格子为0，交换位置
                if (num1 == 0){
                    cell1.number = num2;
                    cell2.number = 0;
                }
                cell1.changePicture();
                cell2.changePicture();
            }
        }
    }

    // 游戏结束判断
    static gameEnd(){
        let cells = this.cells;

        // 判断相邻位置是否有相同的格子
        let same = false;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if(cell.number == 0){
                return;
            }
            const row = cell.row;
            const col = cell.col;
            const right = this.getCell(row, col + 1);
            const down = this.getCell(row + 1, col);
            if(right && right.number == cell.number){
                same = true;
                break;
            }
            if(down && down.number == cell.number){
                same = true;
                break;
            }
        }
        if(!same){
            GlobalVariable.gameOver = true;
        }
      //  log("same: "+same)

        if (GlobalVariable.gameOver){
          //  log("game over");
            let w = game.getWindow().getWidth();
            let h = game.getWindow().getHeight();
            Util.newText({
                text: "游戏结束",
                x: w/3 + 60,
                y: h/2 - 70,
                width:90,
            });
        }
    }
}
