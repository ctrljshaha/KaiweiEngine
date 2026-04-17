class Car {
    // 移动距离
    static carSpeed = 30;
    static updateTime = new Date().getTime();
    static KEY_W = 87;
    static KEY_S = 83;
    static KEY_A = 65;
    static KEY_D = 68;
    static KEY_BOTTOM = 40;
    static KEY_UP = 38;
    static KEY_LEFT = 37;
    static KEY_RIGHT = 39;
    // 默认移动方向
    static type = "up";
    static gameOver = false;
    static score = 0;
    static score_text;
    static jp_button;
    static car;
    static car2;
    static scene;
    // 道路移动速度
    static roadSpeed = 10;
    static roadHeight = 1100;
    constructor() {
        Car.init();
    }

    static init(){
        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let bgLocationY = h - this.roadHeight;
        let {scene,backgroundNode} = Util.bj({
            x:0,
            y: bgLocationY,
            width: w,
            height: this.roadHeight,
            picture: "cityRoad.jpg"
        });
        this.scene = scene;
        this.createJp(200,200)
        this.score_text = Util.newText(w-50,40,""+this.score,30,30);
        // 重新开始按钮
        Util.newSprite({
            x: 10,
            y: 30,
            width: 80,
            height: 40,
            texture: 'zaicitiaozhan.png',
            clickCb: ()=>{
                Car.restart();
            }
        })

        this.createCar((w / 2)-50,500);
        this.scene.upDate((time)=>{
            if(!this.gameOver){
                const etime = new Date().getTime();
                const st = etime - this.updateTime;

                this.updateTime = etime;
                if(backgroundNode){
                    let {x,y} = Util.getPosition(backgroundNode);
                    if(y >= 0){
                        backgroundNode.setPosition(0,bgLocationY);
                    }else{
                        backgroundNode.setPosition(0,y + this.roadSpeed);
                    }
                }
                let {x,y} = Util.getPosition(this.jp_button);

                this.jp_button.setPosition(x,y + this.roadSpeed);
                this.changePosition(this.car,this.type);
                if(this.car2){
                    let {x,y} = Util.getPosition(this.car2);
                    this.car2.setPosition(x,y + this.roadSpeed);
                }
                if(this.score_text){
                    this.score_text.setText(""+this.score);
                }

                if(this.gameOver){
                    Util.newText(w/2-50,40,"游戏结束",85,30);
                    return;
                }
            }
        });

    }


    static restart(){
        this.gameOver = false;
        this.score = 0;
        this.car2 = null;
        this.car = null;
        this.init();
    }


    static createCar(x,y){
        let car = Util.newSprite({
            x,y,
            texture:"car.png",
            width:130,
            height: 130,
        });

        this.car = car;
    }

    static createCar2(x,y){
        let car = Util.newSprite({
            x,y,
            texture:"police.png",
            width:130,
            height: 130,
        });

        this.car2 = car;
    }

   // 函数功能：创建奖品
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
        //log("direction "+direction);
        if(direction){
            let speed = this.carSpeed;
            if(direction == "left"){
                x = x - speed;
                if(x <= - speed){
                    x = - speed;
                }
            }
            if(direction == "right"){
                x = x + speed;
                if(x >= w-100){
                    x = w-100;
                }
            }

            let newPosition = {x,y,width:position.width,height:position.height};
            const jpPosition = Util.getPosition(this.jp_button);
            // 吃奖牌
            const jp_x = Math.floor(Math.random() * w + 50);
            if(Physics.rectRect(jpPosition,newPosition)){
                this.score = this.score + 1;
                this.jp_button.setPosition(jp_x > w-100 ? w-100 : jp_x,-150);
            }else {
                if(jpPosition.y > h){
                    this.jp_button.setPosition(jp_x > w-100 ? w-100 : jp_x,-150);
                }
            }

            node.setPosition(x,y);

            let car2_x = jp_x - 100 < 0 ?jp_x + 100 :jp_x - 200;
            if(this.car2){
                const carPosition = Util.getPosition(this.car2);
                if(Physics.rectRect(carPosition,newPosition,0.6,0.6)){
                    this.gameOver = true;
                }
                if(carPosition.y > h){
                    this.car2.setPosition(car2_x ,-100);
                }
            }else {
                if(this.score >= 1) {
                    log("创汽车");
                    this.createCar2(car2_x,-100)
                }
            }
        }

        this.type = "up";

    }





}
