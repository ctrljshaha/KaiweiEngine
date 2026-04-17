// 工具类：生成对象
class Util{

    // 函数功能：创建背景场景，并返回场景和背景节点
    static bj=(options={})=>{

        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let w = GlobalVariable.w;
        let h = GlobalVariable.h;
        
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
        
        // 微信手机显示游戏手柄，控制上下左右键。改为点击长按控制飞机后，注释手柄
        // ----------------------------------------------------------------------------------------------
        /*if(system =="WEIXIN")
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
                let a = GlobalVariable.aAirplaneBattle;
                a.changePos(dir);
            }
        }*/

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
            texture: "",
            ...options
        };
        if(!GlobalVariable.scene){
            //   log("scene is not exist");
            return;
        }
        const cache_ = game.getResource();
        let bg = cache_.getTexture(config.texture);
        let sprite = new Sprite();
        sprite.setTexture(bg);
        sprite.setSize(config.width, config.height);
        sprite.setPosition(config.x, config.y);
        GlobalVariable.scene.addNode(sprite);

        sprite.click(()=>{
            if (config.clickCb !== undefined && config.clickCb instanceof Function){
                config.clickCb();
            }
        });
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
            ...options
        };

        // 打印日志，调试用
        log(JSON.stringify(config));

        // 设置lab标签
        const lab = new Label();
        lab.setPosition(config.x, config.y);
        lab.setSize(config.width, config.height);
        lab.setFont("font/st.ttf", config.fontSize);
        lab.setText(config.text);

        // 设置颜色
        if(config.textColor !== undefined && config.textColor.length === 3){
            let configColor = config.textColor;
            lab.setTextColor(configColor[0],configColor[1],configColor[2],1);
        }else {
            lab.setTextColor(1,0,0,1);
        }
        lab.setColor(1,1,1,0);
        GlobalVariable.scene.addNode(lab);
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
