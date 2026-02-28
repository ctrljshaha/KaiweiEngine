class Survivor{
    hero;
    constructor() {
        this.init()
    }

    // 函数功能：初始化
    init(){
        GlobalVariable.gameOver = false;
        let {backgroundNode} = Util.bj({picture: "mainbg.png"});
        // 鼠标点击事件
        backgroundNode.click((type,x,y) => {
            log("mouse click，type:"+type+" x: "+x+" y: "+y);
            GlobalVariable.cursorPosition = {x,y};
        });

        // 创建英雄
        this.hero = new Character(300,300,0);

        // 创建敌人
        this.createEnemy();

        let w = game.getWindow().getWidth();

        // 分数
        GlobalVariable.score = 0;
        GlobalVariable.scoreText = Util.newText({
            x: w - 120,
            y: 10,
            text: "分数："+GlobalVariable.score+"",
            width:300
        })

        // 更新事件
        GlobalVariable.scoreText.upDate(()=> {
            if (GlobalVariable.gameOver) {
                return;
            }
            // 难度升级
            let score = GlobalVariable.score;
            if(GlobalVariable.enemyList.length - 1 < score/5){
                this.createEnemy();
            }
        })

        // 键盘事件
        game.setKeyCallBack((key,action)=>{
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
            // log("key "+key+" action "+action+" type "+type);
            this.changePos(type);
        });

    }

    // 函数功能：改变位置
    changePos(type){
        let position = Util.getPosition(this.hero.sprite);
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
        if (GlobalVariable.gameOver) {
            return;
        }
        this.hero.sprite.setPosition(position.x,position.y);
    }


    // 函数功能：创建敌人
    createEnemy(){
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        // x小于0 或大于w
        // y小于0 或大于h
        let x;
        let y;
        if(Math.random() > 0.5){
            x = Math.floor(10 * Math.random() ) + w;
        }else {
            x = Math.floor(-10 * Math.random() );
        }
        if(Math.random() > 0.5){
            y = Math.floor(10 * Math.random() ) + h;
        }else {
            y = Math.floor(-10 * Math.random());
        }


        let type = Math.random() > 0.5 ? 2 : 1;
        let monster = new Character(x,y,type,this.hero);
        GlobalVariable.enemyList.push(monster);
    }






}