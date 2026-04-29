class Shop{
    /**
     * 排行榜
     * @param type 0财富榜 ,1等级榜
     */
    constructor(type){
        this.type = 0;
        this.ui(type);
    }

    ui(type){
        if(type != undefined){
            this.type = type;
        }else{
            //type = this.type;
        }

        let {scene} = Util.bj({picture: "shop/bg.png"});
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        this.topUi(type);



        let topList = ["3000","1800","105000","180000","360000"];
        let bottomList = ["￥1","￥6","￥30","￥50","￥98"];
        for (let i = 0; i < 5; i++) {

            let num = i +1;
            let pic = "shop/sc_jb"+num+".png";

            this.createProduct(topList[i]+"金币", pic, bottomList[i],i);

        }

    }


    topUi(type){

        Util.newSprite({
            texture:"shop/sc_back.png",
            x: 20,
            y: 15,
            width: Util.w(8),
            height: Util.h(8),
            clickCb:()=>{
                game.popScene();
            }
        });

        //
        let goldSprite = Util.newSprite({
            texture:"shop/sc_kb.png",
            x: Util.w(20),
            y: Util.h(3),
            width: Util.w(30),
            height: Util.h(8),
            clickCb:()=>{
            }
        });

        log(JSON.stringify(GlobalVariable.userinfo));
        let gold = GlobalVariable.userinfo.gold || "";
        Util.newText({
            text: gold+"",
            textColor: [0.98,0.78,0.01],
            x: 70,
            y: 8,
            addToScene: false,
            addTo:goldSprite,
            width: Util.w(20),
            height: 30,
            font:"fonts/st.ttf",
            fontSize: 20,
        })


        let t = Util.newSprite({
            texture:"shop/sc_btbg_l.png",
            x: Util.w(70),
            y: Util.h(3.7),
            width: Util.w(19),
            height: Util.h(10),
        });

        Util.newSprite({
            texture:"shop/sc_jbsp.png",
            x: Util.w(4),
            y: Util.h(1),
            width: Util.w(10),
            height: Util.h(7),
            addToScene: false,
            addTo:t,
        });

    }


    createProduct(topText,middlePic,bottomText,i){
        let height = Util.h(55);
        let width = Util.w(16);
        let bg = Util.newSprite({
            texture: "shop/sc_bg.png",
            x: 35+Util.w(18)*i,
            y: Util.h(20),
            width: width,
            height: height,
            clickCb: () => {
                //this.ui(i);
            }
        });
        Util.newText({
            text: topText,
            textColor: [0.98,0.78,0.01],
            x: width*0.05,
            y: 5,
            addToScene: false,
            addTo:bg,
            width: width*0.9,
            height: width*0.3,
            font:"fonts/st.ttf",
            fontSize: width*0.15,
        })
        Util.newSprite({
            texture: middlePic,
            x: 5,
            y: height*0.35,
            width: 100,
            height: 100,
            addToScene:false,
            addTo:bg,
            clickCb: () => {
                //this.ui(i);
            }
        })

        let button = Util.newSprite({
            texture: "shop/sc_btbg.png",
            x: 10,
            y: height * 0.75,
            width: width * 0.8,
            height: 50,
            addToScene:false,
            addTo:bg,
            clickCb: () => {
                //this.ui(i);
            }
        });
        Util.newText({
            text: bottomText,
            x: width*0.15,
            y: 10,
            addToScene: false,
            addTo:button,
            width: height*0.7,
            height: 30,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

    }



}
