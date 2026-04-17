class Snake{
    // 移动距离
    static stepSize = 34;
    static updateTime = new Date().getTime();
    static KEY_W = 87;
    static KEY_S = 83;
    static KEY_A = 65;
    static KEY_D = 68;
    static KEY_BOTTOM = 40;
    static KEY_UP = 38;
    static KEY_LEFT = 37;
    static KEY_RIGHT = 39;
    // 刷新间隔：毫秒
    static refreshInterval=200;
    // 默认移动方向
    static type = "right";
    static gameOver = false;
    static score = 0;
    static score_text;
    static snake_ = [];
    static jp_button;

    static cache_ = game.getResource();
    static scene;
    constructor(){
        Snake.init();
    }

    // 函数功能：初始化界面
    static init(){
        this.scene = Util.bj();

        this.createSnakeButton(100,100)
        this.createJp(200,200)

        //let w = game.getWindow().getWidth();
        this.score_text = Util.newText(w-50,40,""+this.score,30,20);

        // 重新开始按钮
        Util.newSprite({
            x: 10,
            y: 25,
            width: 80,
            height: 40,
            texture: 'zaicitiaozhan.png',
            clickCb: ()=>{
                Snake.restart();
            }
        })


        this.scene.upDate((time)=>{
            let s;
            if(this.snake_ && !this.gameOver){
                if(this.gameOver){
                    this.gameEndLogic();
                    return;
                }
                const etime = new Date().getTime();
                const st = etime - this.updateTime;
                let number = this.refreshInterval - 10 * this.score <= 100 ? 100 : this.refreshInterval - 10 * this.score;
                if(st >= number){
                    this.updateTime = etime;

                    const oldPositions = [];
                    for(let i = 0; i < this.snake_.length; i++){
                        s = this.snake_[i];
                        if(s){
                            oldPositions.push(Util.getPosition(s));
                        }
                    }

                    this.changePosition(this.snake_[0],this.type);
                    if(this.gameOver){
                        Util.newText(w/2-50,40,"游戏结束",85,30);
                        return;
                    }else{
                        // 替换位置
                        for(let i = 1; i<this.snake_.length && this.snake_.length > 1 ; i++){
                            s = this.snake_[i];
                            if(s){
                                const img = this.cache_.getTexture("leibg.png");
                                const pos = oldPositions[i - 1];
                                s.setTexture(img);
                                s.setPosition(pos.x, pos.y);
                            }
                        }
                    }
                    if(this.score_text){
                        this.score_text.setText(""+this.score);
                    }
                }
            }
        });

    }

    // 函数功能：重新开始
    static restart(){
        this.gameOver = false;
        this.score = 0;
        this.snake_ = [];
        this.init();
    }

    static createSnakeButton(x,y,unshift){
        let button_ = Util.newSprite({
            x,y,
            texture:"lei0.png",
            width:34,
            height: 34,
        });

        if(unshift){
            this.snake_.unshift(button_)
        }else{
            this.snake_.push(button_)
        }
    }


    static createJp(x,y){
        let jp_button = Util.newSprite({
            x,y,
            texture:"phbjp.png",
            width:34,
            height: 34,
        });

        this.jp_button = jp_button;
    }

    static changePosition(node,direction){
        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let position = Util.getPosition(node);
        let x = position.x;
        let y = position.y;
        //log("direction "+direction+" x "+x+" y "+y+ " w "+w +" h "+h);
        if(direction){
            let stepSize1 = this.stepSize;
            if(direction == "left"){
                x = x - stepSize1;
                if(x < -stepSize1){
                    x = w + x;
                }
            }
            if(direction == "right"){
                x = x + stepSize1;
                if(x > w){
                    x = w - x;
                }
            }
            if(direction == "up"){
                y = y - stepSize1;
                if(y < -stepSize1){
                    y = h + y;
                }
            }
            if(direction == "down"){
                y = y + stepSize1;
                if(y > h){
                    y = y - h;
                }
            }
            log(" x "+x+" y "+y);
            let newPosition = {x,y,width:position.width,height:position.height};
            const jpPosition = Util.getPosition(this.jp_button);
            
            // 吃奖牌
            if(Physics.rectRect(jpPosition,newPosition)){
                this.score = this.score + 1;
                let number = 50;
                const jp_x = Math.floor(Math.random() * w + number);
                const jp_y = Math.floor(Math.random() * h + number);
                this.jp_button.setPosition(jp_x > w- number?w-number : jp_x,jp_y>h-number?h-number:jp_y );
                this.createSnakeButton(x,y,true)
            }else{
                for(let i = 1; i < this.snake_.length; i++){
                    const s = this.snake_[i];
                    if(s){
                        // 头与身体碰撞
                        if(Physics.rectRect(Util.getPosition(s),newPosition)){
                            this.gameOver = true;
                            break;
                        }
                    }
                }
                if(!this.gameOver){
                    node.setPosition(x, y);
                }
            }
        }
    }

}
