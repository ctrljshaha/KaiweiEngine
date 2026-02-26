class Util{
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

    // 函数功能：设置字体和颜色
    static newText(x,y,text,width=50,height=30){
        if(!this.scene){
            return;
        }

        const lab = new Label();
        lab.setPosition(x, y);
        lab.setSize(width, height);
        lab.setFont("st.ttf", 20);
        lab.setText(text);
        lab.setTextColor(1.0,0.5,0.2,1.0); // 设置字体颜色
        lab.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
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
