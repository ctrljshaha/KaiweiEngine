class Util{
    static audio = new Audio();
    static bgMusic = false;
    static scene;

    static bj=()=>{
        let scene = new Scene();
        this.scene = scene;
        game.pushScene(scene);

        const cache_ = game.getResource();

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let bg = cache_.getTexture("mainbg.png");
        const node = new Sprite();
        node.setTexture(bg);
        node.setSize(w,h);
        node.setPosition(0,0);
        node.setColor(1,1,1,1);
        scene.addNode(node);

        return scene;
    }

    static newSprite(options={}){
        let config = {
            x: 0,
            y: 0,
            width: 50,
            height: 30,
            clickCb: undefined,
            texture: "",
            ...options
        };
        if(!this.scene){
            return;
        }
        const cache_ = game.getResource();
        let bg = cache_.getTexture(config.texture);
        let sprite = new Sprite();
        sprite.setTexture(bg);
        sprite.setSize(config.width, config.height);
        sprite.setPosition(config.x, config.y);
        this.scene.addNode(sprite);

        sprite.click(()=>{
            if (config.clickCb !== undefined && config.clickCb instanceof Function){
                config.clickCb();
            }
        });
        return sprite;
    }


    static newText(x,y,text,width=50,height=30){
        if(!this.scene){
            return;
        }

        const lab = new Label();
        lab.setPosition(x, y);
        lab.setSize(width, height);
        lab.setFont("st.ttf", 20);
        lab.setText(text);
        lab.setTextColor(1.0,0.5,0.2,1.0);
        lab.setColor(1.0,0.5,0.2,0);
        this.scene.addNode(lab);
        return lab;
    }

    // 函数功能：获取节点位置和大小
    static getPosition(node){
        if (!node){
            return;
        }
        let x = node.getPosition().x;
        let y = node.getPosition().y;

        let width = node.getSize().x;
        let height = node.getSize().y;

        return {x:x, y:y, width:width, height:height};
    }


    static w(percent){
        let w = game.getWindow().getWidth();
        let p = percent/100;
        return w * p;
    }

    static h(percent){
        let h = game.getWindow().getHeight();
        let p = percent/100;
        return h * p;
    }



    static centerWidth(node){
        if(!node){
            return;
        }

        let {x,y,width,height} = this.getPosition(node);

        let w = game.getWindow().getWidth();
        let centerX = (w-width)/2

        node.setPosition(centerX,y);
    }

    static centerX(width){
        if(!width){
            return;
        }


        let w = game.getWindow().getWidth();
        let x = (w-width)/2

        return x;
    }

    static centerHeight(node) {
        if(!node){
            return;
        }

        let {x,y,width,height} = this.getPosition(node);

        let h = game.getWindow().getHeight();
        let centerY = (h-height)/2

        node.setPosition(x,centerY);
    }

    static centerY(height){
        if(!height){
            return;
        }
        let h = game.getWindow().getHeight();
        let y = (h-height)/2

        return y;
    }


    // 函数功能：播放音效
    static playSound(soundPath){
        if (soundPath){
            this.audio.playSound(soundPath); // 播放音效

            // audio.setMusicVolume(0.8); // 设置背景音乐音量大小值
            //audio.setSoundVolume(0.5); // 设置音效音量大小值
        }
    }

    // 函数功能：播放背景音乐,循环播放
    static playMusic(soundPath){
        let bgMusic = this.bgMusic;
        if (soundPath){
            if(bgMusic){
                this.stopMusic();
            }

            this.bgMusic = true;
            this.audio.playMusic(soundPath); // 播放音效
            // audio.setMusicVolume(0.8); // 设置背景音乐音量大小值
            //audio.setSoundVolume(0.5); // 设置音效音量大小值
        }
    }

    // 函数功能：停止背景音乐
    static stopMusic(){
        if (this.audio){
            this.bgMusic = false;
            this.audio.stopMusic();
        }
    }
}
