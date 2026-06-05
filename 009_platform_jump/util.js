// 工具类：生成对象
class Util{
    static audio = new Audio();
    static bgMusic = false;

    // 函数功能：创建背景场景，并返回场景和背景节点
    static bj=(options={})=>{

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let config = {
            x: 0,
            y: 0,
            width: w,
            height: h,
            picture: "bg.jpg",
            ...options
        };

        // 创建场景
        let scene = new Scene();
        GlobalVariable.scene = scene;
        game.pushScene(scene);

        // 添加游戏背景图
        const cache_res = game.getResource();
        let bg = cache_res.getTexture(config.picture);
        const node = new Sprite();
        node.setTexture(bg);
        node.setSize(config.width,config.height);
        node.setPosition(config.x,config.y);
        node.setColor(1,1,1,1);
        scene.addNode(node);

        let pressx = 0, pressy = 0;
        scene.onPress((x,y)=>{
            pressx = x;
            pressy = y;
        });
        scene.onRelease((x,y)=>{
            const ox = x - pressx;
            const oy = y - pressy;
            let type = "";
            if( Math.abs(ox)>Math.abs(oy)){
                //左右
                if(ox>0){
                    //右
                    type =  "right";
                }
                else{
                    type =  "left";
                }
            }
            else {
                //上下
                if(oy>0){
                    //下
                    type =  "down";
                }
                else{
                    type = "up";
                }
            }

            //log(type);
            GlobalVariable.platformJump.changePos(type)
        });


        // 返回场景对象
        return {scene:scene,backgroundNode:node};
    }

    // 函数功能：创建精灵节点，并返回精灵
    static newSprite(options={}){
        let config = {
            x: 0,
            y: 0,
            width: 50,
            height: 30,
            clickCb: undefined,
            texture: undefined,
            addToScene: true,
            addTo:undefined,
            widthCenter: false,
            name: "",
            ...options
        };
        if(!GlobalVariable.scene ){
            //   log("scene is not exist");
            return;
        }
        let sprite = new Sprite();
        if(config.texture){
            const cache_ = game.getResource();
            let bg = cache_.getTexture(config.texture);
            sprite.setTexture(bg);
        }
        sprite.setSize(config.width, config.height);
        sprite.setPosition(config.x, config.y);
        if (config.addToScene === true){
            GlobalVariable.scene.addNode(sprite);
        }else if(config.addTo){
            config.addTo.addNode(sprite);
        }
        if (config.name){
            sprite.setName(config.name);
        }
        if (config.hide){
            sprite.setHide(true);
        }
        if (config.clickCb !== undefined && config.clickCb instanceof Function){
            sprite.click(()=>{
                config.clickCb();
            });
        }

        if (config.widthCenter){
            this.centerWidth(sprite)
        }
        return sprite;
    }

    // 函数功能：创建文本节点，并返回文本对象
    static newText(options){
        // 如果场景不存在，返回
        if(!GlobalVariable.scene){
            return;
        }

        // 文本节点参数
        let config = {
            x: 0,
            y: 0,
            width: 50,
            height: 30,
            text: "",
            fontSize: 20,
            textColor: [1,0,0],
            font:"st.ttf",
            addToScene: true,
            addTo:undefined,
            widthCenter: false,
            ...options
        };

        // 打印日志，调试用
        // log(JSON.stringify(config));

        // 设置lab标签
        const lab = new Label();
        lab.setPosition(config.x, config.y);
        lab.setSize(config.width, config.height);
        lab.setFont(config.font, config.fontSize);
        lab.setText(config.text);

        // 设置颜色
        if(config.textColor !== undefined && config.textColor.length === 3){
            let configColor = config.textColor;
            lab.setTextColor(configColor[0],configColor[1],configColor[2],1);
        }else {
            lab.setTextColor(1,0,0,1);
        }
        lab.setColor(1,1,1,0);
        if (config.addToScene === true){
            GlobalVariable.scene.addNode(lab);
        }else if(config.addTo){
            config.addTo.addNode(lab);
        }
        if (config.clickCb !== undefined && config.clickCb instanceof Function){
            lab.click(()=>{
                config.clickCb();
            });
        }
        if (config.widthCenter){
            this.centerWidth(lab)
        }
        return lab;
    }

    // 函数功能：创建文本节点，并返回文本对象
    static newEdit(options){

        // 如果场景不存在，返回
        if(!GlobalVariable.scene){
            return;
        }

        // 文本节点参数
        let config = {
            x: 0,
            y: 0,
            width: 50,
            height: 30,
            fontSize: 20,
            font:"st.ttf",
            texture: "",
            text: "",
            addToScene: true,
            addTo:undefined,
            ...options
        };

        // 打印日志，调试用
        // log(JSON.stringify(config));
        const cache_ = game.getResource();
        // 设置lab标签
        const edit = new Edit();
        if (config.texture){
            let bg = cache_.getTexture(config.texture);
            edit.setTexture(bg);
        }
        edit.setPosition(config.x, config.y);
        edit.setSize(config.width, config.height);
        edit.setFont(config.font, config.fontSize);
        edit.setPadding(10);
        if(config.text){
            // edit.setPubText(config.text);
        }
        if (config.addToScene === true){
            GlobalVariable.scene.addNode(edit);
        }else if(config.addTo){
            config.addTo.addNode(edit);
        }
        GlobalVariable.scene.addNode(edit);
        return edit;
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

    // 函数功能：播放音效
    static playSound(soundPath){
        if (soundPath){
            this.audio.playSound(soundPath); // 播放音效

            // audio.setMusicVolume(0.8); // 设置背景音乐音量大小值
            //audio.setSoundVolume(0.5); // 设置音效音量大小值
        }else {
            let path = GlobalVariable.defaultSoundPath;
            if (path){
                this.audio.playSound(path); // 播放音效
            }
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

    static getChildNodeByName(node,name){
        if (!GlobalVariable.scene || !node){
            return;
        }

        const nodeArray = node.getNodes(); // 获取node节点数组对象数据，从0开始
        if (!nodeArray || nodeArray.length === 0){
            return;
        }
        for (let i = 0; i < nodeArray.length; i++) {
            if (nodeArray[i].getName() === name){
                return nodeArray[i];
            }
        }
    }

    static getPicFileName(pic = ""){
        if (!pic || pic.length === 0){
            return;
        }
        let split = pic.split("/");
        let fileName = split[split.length - 1];


        let have = false;
        for (let i = 0; i < 5; i++) {
            let s = "n"+(i+1)+".png";
            if(fileName == s){
                have = true;
                break;
            }
        }
        for (let i = 0; i < 6; i++) {
            let s = "t"+(i+1)+".png";
            if(fileName == s){
                have = true;
                break;
            }
        }

        if (!have){
            log("头像图片不存在");
            fileName = "n1.png";
        }

        return fileName;
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


}
