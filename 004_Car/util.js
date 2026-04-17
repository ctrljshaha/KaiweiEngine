class Util{
    static scene;
    static bj=(options={})=>{

        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let config = {
            x: 0,
            y: 0,
            width: w,
            height: h,
            picture: "mainbg.png",
            ...options
        };


        let scene = new Scene();
        this.scene = scene;
        game.pushScene(scene);

        const cache_ = game.getResource();

        let bg = cache_.getTexture(config.picture);
        const node = new Sprite();
        node.setTexture(bg);
        node.setSize(config.width,config.height);
        node.setPosition(config.x,config.y);
        node.setColor(1,1,1,1);
        scene.addNode(node);
        
        // 微信手机显示游戏手柄，控制上下左右键
        // ----------------------------------------------------------------------------------------------
        if(system =="WEIXIN")
        {
            // 上下左右按钮图
            var texUp    = res.getTexture("up.png");
            var texDown  = res.getTexture("down.png");
            var texLeft  = res.getTexture("left.png");
            var texRight = res.getTexture("right.png");
            
            // 手柄布局参数
            var sprW = 40;  
            var sprH = 40;  
            var gap  = 1;   
            var startX = (w > h) ? 30 : (w - sprW * 3 - gap * 2) / 2;
            var startY = h - (sprH * 3 + gap * 2) - 20;    
            
            // 四个独立精灵按钮
            var sprUp = new Sprite();
            sprUp.setTexture(texUp);
            sprUp.setColor(1, 1, 1, 0.5); // 设置透明度：前三个参数 1,1,1 表示保持原图颜色，0.5 表示 50% 透明度
            sprUp.setSize(sprW, sprH);
            sprUp.setPosition(startX + sprW + gap, startY);
            sprUp.click(() => { logic("up"); });
            scene.addNode(sprUp);
            
            var sprDown = new Sprite();
            sprDown.setTexture(texDown);
            sprDown.setColor(1, 1, 1, 0.5); // 设置透明度：前三个参数 1,1,1 表示保持原图颜色，0.5 表示 50% 透明度
            sprDown.setSize(sprW, sprH);
            sprDown.setPosition(startX + sprW + gap, startY + (sprH + gap) * 2);
            sprDown.click(() => { logic("down"); });
            scene.addNode(sprDown);
            
            var sprLeft = new Sprite();
            sprLeft.setTexture(texLeft);
            sprLeft.setColor(1, 1, 1, 0.5); // 设置透明度：前三个参数 1,1,1 表示保持原图颜色，0.5 表示 50% 透明度
            sprLeft.setSize(sprW, sprH);
            sprLeft.setPosition(startX, startY + sprH + gap);
            sprLeft.click(() => { logic("left"); });
            scene.addNode(sprLeft);
            
            var sprRight = new Sprite();
            sprRight.setTexture(texRight);
            sprRight.setColor(1, 1, 1, 0.5); // 设置透明度：前三个参数 1,1,1 表示保持原图颜色，0.5 表示 50% 透明度
            sprRight.setSize(sprW, sprH);
            sprRight.setPosition(startX + (sprW + gap) * 2, startY + sprH + gap);
            sprRight.click(() => { logic("right"); });
            scene.addNode(sprRight);
        
            // 核心事件逻辑（在此处统一处理显示和业务）
            function logic(dir) 
            {
                //log("逻辑触发 -> " + dir);
                Car.type = dir;
            }
        }


        return {scene:scene,backgroundNode:node};
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
        lab.setColor(0,0,0,0);
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
    

}
