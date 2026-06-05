class PlatformJump{

    constructor(){
        this.initUi()
    }

    initUi(){
        GlobalVariable.gameOver = false;
        Util.bj({picture:"mainbg.png"})
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        this.score = 0;
        this.tipText = Util.newText({text:"分数：0",width:300,x:10,y:10});

        // 创建地面平台
        this.createPlatform(0,h*0.8,w);
        this.createPlatform(0,h*0.25,w*0.4);
        this.createPlatform(w*0.5,h*0.52,w*0.5);
        // 创建边界
        this.createPlatform(-10,-h,12,h*2);
        this.createPlatform(w-2,-h,12,h*2);
        this.createPlatform(0,-2*h+10,w,10);

        // 创建英雄
        this.hero = this.createHero();
        // 创建星星
        this.start = this.createStar();
        // 创建炸弹
        let bomb = this.createBomb();
        this.bombs = [bomb];

        // 键盘事件
        game.setKeyCallBack((key,action)=>{
            let type = "";
            if (key == GlobalVariable.KEY_W || key == GlobalVariable.KEY_UP || key == GlobalVariable.KEY_SPACE){
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

        //更新事件
        GlobalVariable.scene.upDate(()=> {
            if (GlobalVariable.gameOver) {
                return;
            }

            let position = Util.getPosition(this.hero);
            let startPosition = Util.getPosition(this.start);

            if( Physics.rectRect(position,startPosition) ){
                this.score++;
                log("分数："+this.score);
                GlobalVariable.scene.removeNode(this.start);
                this.tipText.setText("分数："+this.score);
                this.start = this.createStar();

                if(this.score % 3 == 0){
                    this.randomCreateBomb();
                }
            }

            if(this.overScreen(this.start)){
                this.start = this.createStar();
            }

            let bombs = this.bombs;
            if(bombs.length > 0){
                let allOverScreen = true;
                for (let bomb of bombs) {


                    let bombPosition = Util.getPosition(bomb);
                    if( Physics.rectRect(position,bombPosition) ){
                        GlobalVariable.gameOver = true;
                        Util.newText({text:"游戏结束",width:100,x:10,y:10,widthCenter: true});
                        // 重新开始按钮
                        Util.newSprite({
                            x: w/2-73,
                            y: h/2-26,
                            width: 147,
                            height: 53,
                            texture: 'restart.png',
                            clickCb: ()=>{
                                this.initUi()
                            }
                        })
                        return;
                    }

                    if(!this.overScreen(bomb)){
                        allOverScreen = false;
                    }
                }
                if (allOverScreen){
                    this.bombs = [];
                    this.randomCreateBomb();
                }
            }


        })


    }

    // 函数功能：改变位置
    changePos(type){
        if (GlobalVariable.gameOver) {
            return;
        }
        let position = Util.getPosition(this.hero);
        log(JSON.stringify(position));
        let x,y = 0;
        const cache_ = game.getResource();
        let heroImg = "dude_5.png";
        switch (type){
            case "up":
                this.hero.jump();
                break;
            case "down":
                x = 0;
                y = 0;
                break;
            case "left":
                x = -10;
                heroImg = "dude_3.png";
                break;
            case "right":
                x = 10;
                heroImg = "dude_7.png";
                break;
        }
        let bg = cache_.getTexture(heroImg);
        this.hero.setTexture(bg);

        //this.hero.setPosition(position.x,position.y);
        this.hero.setMoveSpeed(x,y);
    }

    // 创建地面平台
    createPlatform(x, y,width,height = 20){
        let cache_ = game.getResource();
        let platform = Util.newSprite({
            x:x,
            y:y,
            width:width,
            height:height,
            texture:"platform.png"
        });
        //使用方形
        platform.useBoxBody();
        //添加弹性系数
        platform.setRestitution(0.1);

        return platform;
    }

    // 创建英雄
    createHero(){
        let hero = Util.newSprite({
            x:50,
            y:200,
            width:30,
            height:30,
            texture:"dude_5.png"
        });
        //跳起速度
        hero.setJumpSpeed(120);
        //使用胶囊模型
        hero.useCapsuleShape();
        //能跨过台阶高
        hero.setStepHeight(100);

        return hero;
    }

    // 创建星星
    createStar(){
        let star = Util.newSprite({
            x:50,
            y:50,
            width:20,
            height:20,
            texture:"star.png"
        });
        //设置质量(无质量的物体是静止的)
        star.setMass(0.1);
        //使用圆形碰撞体
        star.useSphereBody();
        //添加弹性系数
        star.setRestitution(5);
        //给物体持久力
        star.setCentralForce(1,1);
        //设置物体初速度
        // star.setSpeed(1,0);
        //添加摩擦因数
        // star.setFriction(1);
        return star;
    }

    // 创建炸弹
    createBomb(direction = "left"){
        let bomb = Util.newSprite({
            x:400,
            y:50,
            width:20,
            height:20,
            texture:"bomb.png"
        });
        //设置质量(无质量的物体是静止的)
        bomb.setMass(0.1);
        //使用圆形碰撞体
        bomb.useSphereBody();
        //添加弹性系数
        bomb.setRestitution(10);
        //给物体持久力
        if(direction == "left"){
            bomb.setCentralForce(-0.5,0);
        }else{
            bomb.setCentralForce(0.5,0);
        }
        //设置物体初速度
        // bomb.setSpeed(1,1);
        //添加摩擦因数
        // bomb.setFriction(1);

        return bomb;
    }

    randomCreateBomb() {
        let random = Math.random();
        let direction = random < 0.5 ? "left" : "right";
        let bomb = this.createBomb(direction);
        this.bombs.push(bomb);
    }

    overScreen(node){
        if(!node){
            return;
        }
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let position = Util.getPosition(node);
        if (position.x < -10 || position.x > w + 10 || position.y < -2*h || position.y > h + 10) {
            GlobalVariable.scene.removeNode(node);
            return true;
        }
    }

}
