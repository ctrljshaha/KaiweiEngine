class Airplane {
    // 飞机
    sprite;
    // 用户的飞机
    userAirPlane;
    // 子弹
    bullets = [];
    // 是否是敌方飞机
    isEnemy;
    heart = 3;
    heartList = [];
    // 速度
    speed = 3;
    // 子弹速度
    bulletSpeed = 10;
    // 创建子弹间隔
    createBulletInterval = 2000;
    // 创建子弹时间
    createBulletTime = 0;
    scene;

    isPressPlane = false;
    offsetx=0;
    offsety=0;
    // 获取飞机对象
    getSprite = function () {
        return this.sprite;
    }

    // 获取子弹
    getBullets = function () {
        return this.bullets;
    }

    constructor(x, y, w, h, enemy,userAirPlane) {
        this.scene = GlobalVariable.scene;
        this.bullets = [];
        this.isEnemy = enemy;
        if (userAirPlane){
            this.userAirPlane = userAirPlane;
        }

        let cache_ = game.getResource();
        let texture;
        if (enemy){
            texture = cache_.getTexture("shmup_obj/enemy02.png");
        }else {
            texture = cache_.getTexture("shmup_obj/airplane_01_64x64.png");
            this.heartUpdate()
        }
        const node = new Sprite();
        node.setTexture(texture);
        node.setSize(w, h);
        node.setPosition(x, y);
        node.setColor(1, 1, 1,1);
        this.scene.addNode(node);
        this.sprite = node;
    
        // 创建子弹
        this.createBullets(x, y);
        

        // 按住飞机拖动的实现，按住和移动的回调
        this.scene.onPress((x,y)=>{
            if(userAirPlane.getSprite().isContainPostion(x,y))
            {
                this.isPressPlane = true;
                
                let pos = Util.getPosition(userAirPlane.getSprite());
                this.offsetx = pos.x-x;
                this.offsety = pos.y-y;
            }
            else{
                this.isPressPlane = false;
            }
        });
        this.scene.onMove((x,y)=>{
            if(this.isPressPlane)
            userAirPlane.getSprite().setPosition(x+this.offsetx,y+this.offsety);
        });
        
        
        // 更新事件
        node.upDate(()=>{
            if(GlobalVariable.gameOver){
                return;
            }
            //let w = game.getWindow().getWidth();
            //let h = game.getWindow().getHeight();
            let w = GlobalVariable.w;
            let h = GlobalVariable.h;

            let x;
            let y;

            let sprite = this.sprite;
            if (sprite) {
                let pos = Util.getPosition(sprite);
                x = pos.x;
                y = pos.y;
            }

            // 创建子弹
            let now = new Date().getTime();
            let createBulletTime = this.createBulletTime;
            let bulletInterval = this.createBulletInterval;

            if (createBulletTime) {
                // 敌人创建子弹
                if (this.isEnemy) {
                    if (now - createBulletTime > bulletInterval && y <= h && sprite) {
                        this.createBullets(x, y);
                    }
                } else {
                    // 创建子弹
                    if (now - createBulletTime > bulletInterval/3 && sprite) {
                        this.createBullets(x, y);
                    }
                }
            }

            // 敌方飞机移动
            if (this.isEnemy && this.sprite) {
                this.sprite.setPosition(x, y + this.speed);
                if (y > h + 10) {
                    this.resetPos();
                }
            }
            // 子弹碰撞
            this.bulletCrash();
            // 飞机碰撞
            this.crashAirplane();

            // 子弹移动
            let bullets = this.bullets;
            if (bullets && bullets.length > 0) {
                for (let i = 0; i < bullets.length; i++) {
                    let bullet = bullets[i];
                    let pos = Util.getPosition(bullet);
                    let bulletX = pos.x;
                    let bulletY = pos.y;
                    if (this.isEnemy) {
                        if(bulletY < h + 80 && bulletY > 0) {
                            bullet.setPosition(bulletX, bulletY + 2 * this.bulletSpeed);
                        }
                    } else {
                        if (bulletY > -80 && bulletY < h ){
                            bullet.setPosition(bulletX, bulletY - 4 * this.bulletSpeed);
                        }
                    }
                }
            }

            if (GlobalVariable.gameOver) {
                //this.gameEndLogic();
                return;
            }
        })

    }


    // 血量变化
    bloodChange(){
        log(""+this.heart)
        if (this.isEnemy){
            return;
        }
        this.heart -= 1;
        if (this.heart <= 0){
            GlobalVariable.gameOver = true;
        }
        this.heartUpdate()

        if (GlobalVariable.gameOver) {
            //let w = game.getWindow().getWidth();
            //let h = game.getWindow().getHeight();
            let w = GlobalVariable.w;
            let h = GlobalVariable.h;
            Util.newText({
                text: "游戏结束",
                x: w/3 + 70,
                y: 10,
                width:90,
            });


            // 重新开始按钮
            Util.newSprite({
                x: w/2-73,
                y: h/2-26,
                width: 147,
                height: 53,
                texture: 'restart.png',
                clickCb: ()=>{
                    new AirplaneBattle()
                }
            })
        }
    }


    // 移除
    remove = function () {
        this.removeBullet();
        this.sprite = null;
    }

    // 移除子弹
    removeBullet() {
        let bullets1 = this.bullets;
        for (let bullets1Element of bullets1) {
            bullets1Element.setHide(true)
        }
        this.bullets = [];
    };

    // 改变位置
    resetPos() {
        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let w = GlobalVariable.w;
        let h = GlobalVariable.h;

        if (this.sprite) {
            let x = Math.floor(Math.random() * (w - 100)) + 50;
            this.sprite.setHide(false);
            this.sprite.setPosition(x, -10);
        }
    };

    // 创建子弹
    createBullets(x, y) {
        let cache_ = game.getResource();

        if (!this.sprite) {
            return;
        }
        let bulletPng;
        if (this.isEnemy) {
            bulletPng = cache_.getTexture("shmup_obj/bullet_01_32x32.png");
            y = y + 60;
        } else {
            bulletPng = cache_.getTexture("shmup_obj/bullet_01_32x32_up.png");
            y = y - 80;
        }
        let bullet = new Sprite();
        bullet.setPosition(x, y);
        bullet.setTexture(bulletPng);
        bullet.setSize(64, 64);
        bullet.setColor(1,1,1,1);

        if(this.scene){
            this.scene.addNode(bullet);
            this.createBulletTime = new Date().getTime();
            this.bullets.push(bullet);
        }
    }

    // 飞机碰撞检测
    crashAirplane() {
        let enemy = this.isEnemy;
        let userAirPlane = this.userAirPlane;
        let sprite = this.sprite;
        if (enemy && sprite) {
            if(!userAirPlane){
                return;
            }

            let userSprite = userAirPlane.getSprite();

            // 飞机与飞机碰撞检测
            if (this.crash(sprite, userSprite)) {
                sprite.setHide(true);
                this.resetPos();
                userAirPlane.bloodChange()
                return;
            }

            // 子弹碰撞敌方飞机检测
            let bullets = userAirPlane.getBullets();
            if (bullets && bullets.length > 0) {
                for (let j = 0; j < bullets.length; j++) {
                    let bullet = bullets[j];
                    if (this.crash(bullet, sprite)) {
                        bullet.setHide(true);
                        sprite.setHide(true);
                        GlobalVariable.score +=  1;
                        GlobalVariable.scoreText.setText("分数："+GlobalVariable.score);

                        bullets.splice(j, 1);
                        this.resetPos()
                        return;
                    }
                }
            }

            // 敌方子弹碰撞飞机检测
            let bullets2 = this.bullets;
            if (bullets2 && bullets2.length > 0) {
                for (let j = 0; j < bullets2.length; j++) {
                    let enemyBullet = bullets2[j];
                    if (this.crash(enemyBullet, userSprite)) {
                        bullets2.splice(j, 1);

                        enemyBullet.setHide(true);
                        userAirPlane.bloodChange()
                        return;
                    }
                }
            }
        }
    }

    // 子弹碰撞检测
    bulletCrash() {
        let enemy = this.isEnemy;
        let userAirPlane = this.userAirPlane;
        let sprite = this.sprite;
        if (enemy && sprite) {
            if(!userAirPlane){
                return;
            }
            let bullets = userAirPlane.getBullets();
            let bullets2 = this.bullets;
            if (bullets2 && bullets2.length > 0) {
                for (let i = 0; i < bullets2.length; i++) {
                    let enemyBullet = bullets2[i];
                    if (bullets && bullets.length > 0) {
                        for (let j = 0; j < bullets.length; j++) {
                            let bullet = bullets[j];
                            if (this.crash(bullet, enemyBullet)) {
                                bullet.setHide(true);
                                enemyBullet.setHide(true);
                                bullets2.splice(i, 1);
                                i--;
                                bullets.splice(j, 1);
                                j--;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    // 碰撞检测
    crash(o1, o2) {
        if (o1 && o2) {
            if (Physics.rectRect(Util.getPosition(o1), Util.getPosition(o2))) {
                audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
                return true;
            }
        }
        return false;
    }


    // 创建血量
    createHeart(x, y,full){
        const cache_ = game.getResource();
        let img;
        if (full){
            img = cache_.getTexture("full-heart.png");
        }else {
            img = cache_.getTexture("empty-heart.png");
        }
        const heart = new Sprite();
        // log("sprite start")
        // ObjUtil.printAllObjectMethods(heart);
        heart.setTexture(img);
        heart.setPosition(x, y);
        heart.setSize(24, 22);

        GlobalVariable.scene.addNode(heart);

        return heart;
    }

    // 血量
    heartUpdate(){
        let list = this.heartList;
        if(list && list.length === 0){
            for (let i = 0; i < this.heart; i++) {
                list.push(this.createHeart(10 + i * 32, 40,true));
            }
        }else {
            const cache_ = game.getResource();
            for (let i = 0; i < list.length; i++) {
                const h = list[i];
                let img;
                if (i < this.heart){
                    img = cache_.getTexture("full-heart.png");
                }else {
                    img = cache_.getTexture("empty-heart.png");
                }
                h.setTexture(img);
            }
        }
    }

}
