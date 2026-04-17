class AirplaneBattle{
    // 敌方飞机
    enemys = [];

    // 主角飞机
    heroAirplane = null;

    constructor() {
        this.init()
    }

    init(){
        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let w = GlobalVariable.w;
        let h = GlobalVariable.h;

        GlobalVariable.aAirplaneBattle = this;
        
        GlobalVariable.gameOver = false;
        Util.bj({picture: "mainbg.png"});

        this.heroAirplane = this.createHeroAirplane()
        this.createEnemy();

        // 分数
        GlobalVariable.score = 0;
        GlobalVariable.scoreText = Util.newText({
            x: w - 120,
            y: 40,
            text: "分数："+GlobalVariable.score+"",
            width:300
        })

        // 更新事件
        GlobalVariable.scoreText.upDate(()=> {
            if (GlobalVariable.gameOver) {
                return;
            }
            // 难度升级
            if(GlobalVariable.score > 5 && this.enemys.length  == 1){
                this.createEnemy();
            }
        })

        game.setKeyCallBack((key,action)=>{
            log(key+"   "+action);
            let type = "";
            if (key == GlobalVariable.KEY_W || key == GlobalVariable.KEY_UP){
                type = "up";
            }
            if (key == GlobalVariable.KEY_S || key == GlobalVariable.KEY_BOTTOM){
                type =  "down";
            }
            if (key == GlobalVariable.KEY_A || key == GlobalVariable.KEY_LEFT){
                type =  "left";
            }
            if (key == GlobalVariable.KEY_D || key == GlobalVariable.KEY_RIGHT){
                type =  "right";
            }
            this.changePos(type);
        });


    }


    changePos(type){
        let airplane = this.heroAirplane;
        if (airplane == null) {
            return;
        }
        let sprite = airplane.getSprite();
        let position = Util.getPosition(sprite);
        switch (type){
            case "up":
                position.y -= 10;
                break;
            case "down":
                position.y += 10;
                break;
            case "left":
                position.x -= 10;
                break;
            case "right":
                position.x += 10;
                break;
        }
        sprite.setPosition(position.x,position.y);
    }

    getHeroAirplane() {
        return this.heroAirplane;
    }

    // 创建飞机
    createHeroAirplane() {
        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let w = GlobalVariable.w;
        let h = GlobalVariable.h;
        
        let myAirplaneX = (w / 2)-50;
        let myAirplaneY = h - 80;
        return  new Airplane(myAirplaneX,myAirplaneY,64,64,false);
    }

    // 创建敌方飞机
    createEnemy(){
        //let w = game.getWindow().getWidth();
        const x = Math.floor(Math.random() * (w - 100)) + 50;
        const enemyAirplane = new Airplane(x,0,64,64,true,this.heroAirplane);
        this.enemys.push(enemyAirplane);
    }

}