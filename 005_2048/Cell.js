
// 方格子类

class Cell{
    // 行
    row;
    // 列
    col;
    // 数字
    number;
    // 游戏对象：格子
    sprite;
    // 游戏对象：格子里的数字文本对象
    textSprite;
    // 行坐标位置
    posX;
    // 列坐标位置
    posY;

    // 构造函数
    constructor(number,x,y,row,col) {
        this.number = number; 
        this.row = row; 
        this.col = col;
        // 创建格子对象
        this.sprite = Util.newSprite({
            x: x,
            y: y,
            width: 50,
            height: 50,
            texture: "0.png"
        });

        let text = number>0?number+"":"";
        this.posX = x;
        this.posY = y;
        // 创建格子里的数字文本对象
        this.textSprite = Util.newText({
            x: this.posX,
            y: this.posY,
            text: text,
            width: 70,
            height: 50,
            fontSize:30
        });
        this.updateNumber();
    }

    // 函数功能：更新格子里的数字文本对象
    updateNumber(){
        let lab = this.textSprite;
        let x = Number(this.posX);
        let y = Number(this.posY);

        // 数字不同位数，设置不同起始位置
        let s = this.number+"";
        let length = s.length;
        if(length == 1){
            x = x + 18;
            lab.setPosition(x, y);
            lab.setFont("st.ttf", 20);
        }else if(length == 2){
            x = x + 15;
            lab.setPosition(x, y);
            lab.setFont("st.ttf", 20);
        }else if(length == 3){
            x = x + 10;
            lab.setPosition(x, y);
            lab.setFont("st.ttf", 20);
        }else if(length == 4){
            lab.setFont("st.ttf", 18);
        }

        lab.setTextColor(0,0,0,1);
        let n = this.number;
        if(n != 0) {
            lab.setText(this.number + "");
        }else {
            lab.setText("");
        }
    }

    // 函数功能：更改图片
    changePicture(){
        if(this.sprite){
            let cache_ = game.getResource();
            let img = cache_.getTexture(this.number + ".png");
            this.sprite.setTexture(img);
            this.updateNumber();
        }
    }
    
    
}
