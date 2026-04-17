
// 工具类：生成对象

class Util{
    
    // 函数功能：创建背景场景，并返回场景和背景节点
    static bj=(options={})=>{

        //let w = game.getWindow().getWidth();
        //let h = game.getWindow().getHeight();
        let w = GlobalVariable.w;
        let h = GlobalVariable.h;
        
        var pressx = 0,pressy = 0;
        
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
        
        scene.onPress((x,y)=>{
            pressx = x;
            pressy = y;
        });
        scene.onRelease((x,y)=>{
            var ox = x-pressx;
            var oy = y-pressy;
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
            Game2048.logic(type)
        });

         // 添加游戏背景图   
        const cache_res = game.getResource();
        let bg = cache_res.getTexture(config.picture);
        const node = new Sprite();
        node.setTexture(bg);
        node.setSize(config.width,config.height);
        node.setPosition(config.x,config.y);
        node.setColor(1,1,1,1);
        scene.addNode(node);

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
            widthCenter:false,
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

        if (config.clickCb !== undefined && config.clickCb instanceof Function){
            sprite.click(()=>{
                    config.clickCb();
            });
        }
        if (config.widthCenter){
            this.center(sprite)
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
            widthCenter:false,
            ...options
        };

        // 打印日志，调试用
        log(JSON.stringify(config));

        // 设置lab标签
        const lab = new Label();
        lab.setPosition(config.x, config.y);
        lab.setSize(config.width, config.height);
        lab.setFont("st.ttf", config.fontSize);
        lab.setText(config.text);

        // 设置颜色
        if(config.textColor !== undefined && config.textColor.length === 3){
            let configColor = config.textColor;
            lab.setTextColor(configColor[0],configColor[1],configColor[2],1);
        }else {
            lab.setTextColor(1,0,0,1);
        }
        lab.setColor(1,1,1,0);
        // lab.setbackgroundColor(0,0,0,0);
        GlobalVariable.scene.addNode(lab);

        if (config.widthCenter){
            this.center(lab)
        }

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

    static center(node){
        if(!node){
            return;
        }

        let {x,y,width,height} = this.getPosition(node);

        let w = game.getWindow().getWidth();
        let centerX = (w-width)/2

        node.setPosition(centerX,y);
    }

}
