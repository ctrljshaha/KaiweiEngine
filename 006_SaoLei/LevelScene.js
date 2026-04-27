class LevelScene{

    constructor(isWeiXin){
        let scene = Util.bj();
        let cache_ = game.getResource();
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let left = w*0.3;
        let top = 60;

        let width=Util.w(55);
        let height=Util.h(15);


        let chujichangBg = cache_.getTexture("chujichang.png");
        let chujichang = new Sprite();
        chujichang.setTexture(chujichangBg);
        chujichang.setSize(width,height);
        chujichang.setPosition(left,top);
        chujichang.setColor(1,1,1,1);
        chujichang.setName("chujichang");
        scene.addNode(chujichang);
        Util.centerWidth(chujichang);
        chujichang.click((type,x,y)=>{
            let play = new MineSweep(9,9,10);
        });


        let gaojichangPg = cache_.getTexture("gaojichang.png");
        const gaojichang = new Sprite();
        gaojichang.setTexture(gaojichangPg);
        gaojichang.setSize(width,height);
        gaojichang.setPosition(left,top*2+height);
        gaojichang.setColor(1,1,1,1);
        scene.addNode(gaojichang);
        Util.centerWidth(gaojichang);
        gaojichang.click((type,x,y)=>{
            let play = new MineSweep(16,9,30);
        });

        if(!isWeiXin){
            let dashichangPg = cache_.getTexture("dashichang.png");
            const dashichang = new Sprite();
            dashichang.setTexture(dashichangPg);
            dashichang.setSize(width,height);
            dashichang.setPosition(left,top*3+height*2);
            dashichang.setColor(1,1,1, 1);
            scene.addNode(dashichang);
            Util.centerWidth(dashichang);
            dashichang.click((type,x,y)=>{
                let play = new MineSweep(16,16,50);
            });
        }

    }



}
