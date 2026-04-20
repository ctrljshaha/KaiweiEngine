class Character {
    // 角色对象
    sprite;
    // 用户的角色对象
    hero;
    // 子弹集合
    bullets = [];
    // 是否是敌方
    enemy;
    // 血量
    heart = 10;
    heartList= [];
    // 移动时间
    moveTime;
    // 移动间隔时间毫秒
    moveInterval = 300;
    // 创建子弹间隔
    createBulletInterval = 1000;
    // 创建子弹时间
    createBulletTime = new Date().getTime();
    // 更新子弹时间
    updateBulletTime = new Date().getTime();
    // 能否发射子弹
    canFire = true;

    // 构造函数
    constructor(x, y, enemy,hero) {
        this.scene = GlobalVariable.scene;
        this.enemy = enemy;
        this.moveTime = new Date().getTime();
        this.hero = hero;

        let img;
        if (enemy == 0) {
            img = "hero.png";
            this.heartUpdate()
        } else if (enemy == 1) {
            img = "monster.png";
            this.canFire = false;
        } else if (enemy == 2) {
            img = "monster2.png";
        }

        // 创建角色
        this.sprite = Util.newSprite({
            x: x,
            y: y,
            width: 100,
            height: 100,
            texture: img,
        });


        if (enemy == 0) {
            // 按住飞机拖动的实现，按住和移动的回调
            this.scene.onPress((x, y) => {
                if (this.sprite.isContainPostion(x, y)) {
                    this.isPress = true;

                    let pos = Util.getPosition(this.sprite);
                    this.offsetx = pos.x - x;
                    this.offsety = pos.y - y;
                } else {
                    this.isPress = false;
                }
            });
            this.scene.onMove((x, y) => {
                if (this.isPress)
                    this.sprite.setPosition(x + this.offsetx, y + this.offsety);
            });
        }



        // 更新事件
        this.sprite.upDate((time) => {
            this.handleUpdate(time);
        })
    }

    // 函数功能：移除子弹
    removeBullet() {
        let bullets = this.bullets;
        if (bullets && bullets.length > 0) {
            for (let j = 0; j < bullets.length; j++) {
                let enemyBullet = bullets[j].bullet;
                enemyBullet.setHide(true);
            }
        }
        this.bullets = [];
    }

    // 函数功能：更新事件
    handleUpdate() {
        if (GlobalVariable.gameOver) {
            return;
        }
        let createBulletTime = this.createBulletTime;
        let moveTime = this.moveTime;
        let createBulletInterval = this.createBulletInterval;
        let sprite_ = this.sprite;
        let heroSprite;
        if(this.hero){
            heroSprite = this.hero.sprite;
        }
        let bullets_ = this.bullets;
        let updateBulletTime = this.updateBulletTime;

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let position;
        let x;
        let y;

        if (sprite_) {
            position = Util.getPosition(sprite_);
            x = position.x;
            y = position.y;
        }
        let now = new Date().getTime();
        if (this.enemy) {
            // 创建子弹
            if (now - createBulletTime > createBulletInterval * 5 && y <= h && sprite_ ) {
                this.createBullets(x, y, Util.getPosition(heroSprite));
            }
            // 敌方移动
            if (sprite_ && now - moveTime > this.moveInterval) {
                this.move(sprite_, heroSprite.getPosition(), 8);
                this.moveTime = now;
                // 碰撞检测
                if (this.crash(sprite_, heroSprite)) {
                    this.hero.heart = this.hero.heart - 1;
                    this.hero.bloodChange();
                    this.resetPos();
                }
            }
        } else {
            // 创建子弹
            if (now - createBulletTime > createBulletInterval && sprite_) {
                this.createBullets(x, y, GlobalVariable.cursorPosition);
            }

            // 判断子弹是否击中敌人
            this.defeatEnemy();
        }

        // 子弹移动
        if (bullets_ && bullets_.length > 0) {
            for (let i = 0; i < bullets_.length; i++) {
                let bullet = bullets_[i];
                let bulletSprite = bullet.bullet;

                let targetPosition = bullet.targetPosition;
                let bulletPosition = Util.getPosition(bulletSprite);
                let bulletX = bulletPosition.x;
                let bulletY = bulletPosition.y;

                // 超出边界移除子弹
                if (this.beyondBorder(bulletX, bulletY)) {
                    bulletSprite.setHide(true);
                    bullets_.splice(i, 1);
                    i--;
                    continue;
                }

                let x = bulletPosition.x + targetPosition.x;
                let y = bulletY + targetPosition.y;
                if (bullet.enemy) {
                        // 碰撞检测
                        let b = this.crash(bulletSprite, heroSprite);
                        if (b) {
                            this.hero.heart = this.hero.heart - 1;
                            bulletSprite.setHide(true);
                            this.hero.bloodChange();
                            bullets_.splice(i, 1);
                            i--;
                            continue;
                        }
                        if (targetPosition) {
                            bulletSprite.setPosition(x, y);
                        }
                        // 移动后碰撞检测
                        b = this.crash(bulletSprite, heroSprite);
                        if (b) {
                            this.hero.heart = this.hero.heart - 1;
                            bulletSprite.setHide(true);
                            this.hero.bloodChange();
                            bullets_.splice(i, 1);
                            i--;
                        }
                } else {
                    if (targetPosition) {
                        bulletSprite.setPosition(x, y);
                    }
                }
            }
        }

        this.updateBulletTime = now;
        if (this.heart <= 0) {
            GlobalVariable.gameOver = true;
        }
        if (GlobalVariable.gameOver) {
            return;
        }
    }

    /**
     * 函数功能：创建子弹
     * @param x x坐标
     * @param y y坐标
     * @param targetPosition 目标位置
     */
    createBullets(x, y, targetPosition) {
        if(!this.canFire){
            return;
        }
        const cache_ = game.getResource();

        let bulletPng;
        if (this.enemy) {
            bulletPng = cache_.getTexture("bullet1.png");
        } else {
            bulletPng = cache_.getTexture("bullet2.png");
        }

        let bullet = new Sprite();

        x = x + 35;
        y = y + 30;
        bullet.setPosition(x, y);
        bullet.setTexture(bulletPng);
        bullet.setSize(21, 21);
        GlobalVariable.scene.addNode(bullet);

        this.createBulletTime = new Date().getTime();

        if (targetPosition) {
            let initialPosition = {x, y};
            let directionPosition = {x: targetPosition.x - initialPosition.x, y: targetPosition.y - initialPosition.y};
            let normalization1 = this.normalization(directionPosition);

            this.bullets.push({bullet: bullet, targetPosition: normalization1, enemy: this.enemy});
        } else {
            this.bullets.push({bullet: bullet, enemy: this.enemy});
        }
    }

    // 函数功能：碰撞检测
    crash(o1, o2) {
        if (o1 && o2) {
            let position1 = Util.getPosition(o1);
            let position2 = Util.getPosition(o2);

            if (Physics.rectRect(position1, position2)) {
                audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
                return true;
            }
        }
        return false;
    }

    /**
     * 函数功能：移动到目标位置
     * @param sprite 移动对象
     * @param targetPosition 目标位置
     * @param speed 速度
     * @returns {boolean}
     */
    move(sprite, targetPosition, speed) {
        if (sprite && targetPosition) {
            let position = Util.getPosition(sprite);
            let spriteX = position.x;
            let spriteY = position.y;

            let targetX = targetPosition.x;
            let targetY = targetPosition.y;


            spriteX = spriteX + (spriteX > targetX ? -speed : speed);
            spriteY = spriteY + (spriteY > targetY ? -speed : speed);
            sprite.setPosition(spriteX, spriteY);
        }
        return false;
    }

    // 函数功能：向量化： 保持方向不变，将长度缩小
    normalization(pos) {
        // 1. 处理无效输入或零向量
        if (!pos || (pos.x === 0 && pos.y === 0)) {
            return { x: 0, y: 0 };
        }

        let x = pos.x;
        let y = pos.y;

        // 倍数
        let m = 8;
        // 2. 计算向量的模（长度）: length = sqrt(x^2 + y^2)
        let magnitude = Math.sqrt(x * x + y * y);

        // 3. 归一化：将分量除以模，得到单位向量（长度为1）
        // 直接返回浮点数以保持精度和方向
        const x1 = x / magnitude;
        const y1 = y / magnitude;
        log("x1:"+x1+" y1:"+y1)
        return {
            x: x1*m,
            y: y1*m
        };
    }

    // 函数功能：检测是否击中敌人
    defeatEnemy() {
        if (!this.enemy) {
            let bullets = this.bullets;
            if (bullets && bullets.length > 0) {

                let crashEnemy = false;
                for (let i = 0; i < bullets.length; i++) {
                    let bullet = bullets[i].bullet;

                    let enemyList = GlobalVariable.enemyList;
                    if (enemyList.length > 0) {
                        for (let j = 0; j < enemyList.length; j++) {
                            let childNode = enemyList[j];
                            let sprite = childNode.sprite;
                            if (this.crash(bullet, sprite)) {
                                crashEnemy = true;
                                GlobalVariable.score += 1;
                                GlobalVariable.scoreText.setText("分数："+GlobalVariable.score);
                                bullet.setHide(true);
                                childNode.resetPos();
                                bullets.splice(i, 1);
                                break;
                            }
                        }
                    }

                }
            }
        }
    }

    // 函数功能：判断是否超出界限
    beyondBorder(x, y) {
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        if (x < 0 || x > w || y < 0 || y > h) {
            return true;
        }
        return false;
    }

    // 函数功能：创建血量
    createHeart(x, y,full){
        const cache_ = game.getResource();
        let img;
        if (full){
            img = cache_.getTexture("full-heart.png");
        }else {
            img = cache_.getTexture("empty-heart.png");
        }
        const heart = new Sprite();
        heart.setTexture(img);
        heart.setPosition(x, y);
        heart.setSize(24, 22);

        GlobalVariable.scene.addNode(heart);

        return heart;
    }

    // 函数功能：血量
    heartUpdate(){
        let list = this.heartList;
        if(list && list.length === 0){
            for (let i = 0; i < this.heart; i++) {
                list.push(this.createHeart(10 + i * 32, 5,true));
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

    // 函数功能：血量变化
    bloodChange(){
        if (this.enemy){
            return;
        }
        if (this.heart <= 0){
            GlobalVariable.gameOver = true;
        }
        this.heartUpdate()

        if (GlobalVariable.gameOver) {
            let w = game.getWindow().getWidth();
            let h = game.getWindow().getHeight();
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
                    new Survivor()
                }
            })
        }
    }

    // 函数功能：重置位置
    resetPos() {
        if(this.canFire){
            this.removeBullet();
        }

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
        if (this.sprite) {
            this.sprite.setHide(false);
            this.sprite.setPosition(x, y);
        }
    };

}
