class Util{
    static scene;
    static bj=(options={})=>{

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
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
