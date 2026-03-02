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






}
