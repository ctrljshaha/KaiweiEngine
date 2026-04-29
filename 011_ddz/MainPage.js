class MainPage{

    constructor(){
        this.ui();
    }
    ui(){
        let {scene} = Util.bj({picture: "shouye/mainbj.jpg"});
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        this.topUi();

        this.middleUi();

        this.bottomUi();

        socketIoMgr.ddzPage = null;
        Util.playMusic("sound/musicex/Normal2.mp3");
    }


    topUi(){
        let width = Util.w(8);
        let height = Util.h(8);
        let size = width > height ? height : width;
        Util.newSprite({
            texture:"shouye/sy_back.png",
            x: 10,
            y: 10,
            width: size,
            height: size,
            clickCb:()=>{
                new Login();
            }
        });
    }

    middleUi(){
        let roomLevel = ["sy_cn.png","sy_cj.png","sy_zj.png","sy_gj.png"];
        let m = [3,5,8,10];
        let base = [50,200,500,1000]
        for(let i = 0;i<roomLevel.length;i++){
            // 背景
            let width = Util.w(22);
            let height = Util.h(50);
            let sprite = Util.newSprite({
                texture: "shouye/bg.png",
                x: 10 + i*Util.w(24),
                y: Util.h(15),
                width: width,
                height: height,
                clickCb:()=>{
                }
            });

            Util.newSprite({
                texture: "shouye/"+roomLevel[i],
                x: width*0.05,
                y: height*0.05,
                width: width * 0.9,
                height: height * 0.25,
                addTo: sprite,
                addToScene: false,
                clickCb:()=>{
                }
            });
            let number = base[i];
            if (number > 0){
                Util.newText({
                    text: ""+number,
                    textColor: [1,1,1],
                    x: width*0.6,
                    y: height*0.42,
                    width: width*0.35,
                    height: Util.h(5),
                    addTo: sprite,
                    addToScene: false,
                    font:"fonts/st.ttf",
                    fontSize: 16,
                })
            }

            Util.newText({
                text: "最大倍数："+m[i]+"倍",
                textColor: [0.98,0.78,0.01],
                x: width*0.18,
                y: height*0.5,
                width: width*0.7,
                height: height*0.25,
                addTo: sprite,
                addToScene: false,
                font:"fonts/st.ttf",
                fontSize: 16,
                clickCb:()=>{
                }
            })

            Util.newSprite({
                texture: "shouye/sy_cbutton.png",
                x: width*0.15,
                y: height*0.75,
                width: width*0.7,
                height: height*0.15,
                addTo: sprite,
                addToScene: false,
                clickCb:()=>{
                    this.intoRoom(i)
                }
            });
        }
    }

    bottomUi(){
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();


        let width = Util.w(25);
        let height = Util.h(10);
        let txc = Util.newSprite({
            texture:"shouye/sy_usebg.png",
            x: 20,
            y: Util.h(80),
            width: width,
            height: height,
            clickCb:()=>{
                new MyCenter();
            }
        });

        let fileName = Util.getPicFileName(GlobalVariable.userPic);
        if (fileName){
            let p = "gerenzhongxin/"+fileName;
            log(p)
            Util.newSprite({
                texture: p,
                x: 1,
                y: height*0.1,
                width: width*0.21,
                height: width*0.24,
                addToScene: false,
                addTo:txc,
                clickCb:()=>{
                    new MyCenter();
                }
            })
        }

        // 名称
        Util.newText({
            text: ""+GlobalVariable.userinfo.nickname,
            textColor: [1,1,1],
            x: width * 0.23,
            y: height*0.38,
            width: width*0.65,
            height: 30,
            addToScene: false,
            addTo:txc,
            font:"fonts/st.ttf",
            fontSize: height*0.25,
        })


        let gold = Util.newSprite({
            texture:"shouye/sy_jb.png",
            x: 15,
            y: Util.h(92),
            width: 100,
            height: 20,
            clickCb:()=>{

            }
        });
        // 金币
        Util.newText({
            text: ""+GlobalVariable.userinfo.gold,
            textColor: [1,1,1],
            x: 25,
            y: 2,
            width: 80,
            height: 20,
            addToScene: false,
            addTo:gold,
            font:"fonts/st.ttf",
            fontSize: 15,
        });

        let s =Util.newSprite({
            texture:"shouye/sy_kb.png",
            x: 130,
            y: Util.h(92),
            width: 100,
            height: 20,
            clickCb:()=>{

            }
        });
        // 分数
         Util.newText({
            text: ""+GlobalVariable.userinfo.score,
            textColor: [1,1,1],
            x: 25,
            y: 2,
            width: 80,
            height: 20,
            addToScene: false,
            addTo:s,
            font:"fonts/st.ttf",
            fontSize: 15,
        });


        // 底部按钮: 商城,兑换,排行,银行
        // let images = ["sy_shop.png","sy_duihuan.png","sy_phb.png","sy_yinhang.png"];
        let images = ["sy_shop.png","sy_phb.png"];

        for (let i = 0; i < images.length; i++) {
            Util.newSprite({
                texture:"shouye/"+images[i],
                x: Util.w(70) + Util.w(15)*i,
                y: Util.h(80),
                width: Util.w(12),
                height: Util.w(12),
                clickCb:()=>{
                    switch (i){
                        case 0:
                            this.toShopPage();
                            break;
                        case 1:
                            this.toPhPage();
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                    }
                }
            });
        }
    }


    /**
     * 进入房间
     * @param roomLevel 房间等级
     * @param roomNumber 房间号(自定义房间才需要传入房间号)
     */
    intoRoom(roomLevel,roomNumber) {
        let uid = GlobalVariable.uid;
        socketIoMgr.send('{"type":"intoRoom","data":{"uid":"'+uid+'","roomLevel":'+roomLevel+',"roomNumber":0}}');
    }

    connetGame(type){
        let uid = GlobalVariable.userinfo.uid;
        socketIoMgr.send('{"type":"connectGame","data":{"uid":"'+uid+'","roomId":""}}');
    }
    gotoRoom (dat)
    {
        ddzview.roomId = dat["rid"];
        log.info("加入房间"+dat);
    }

    toShopPage (){
        new Shop();
    }
    toPhPage (){
        new Rank();
    }

}
