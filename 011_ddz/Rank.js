class Rank{
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
            type = this.type;
        }

        let {scene} = Util.bj({picture: "rank/phb.png"});
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        this.topUi(type);

        // 中下背景图
        Util.newSprite({
            texture:"rank/phb_bg1.png",
            x: Util.w(50),
            y: Util.h(36),
            width: Util.w(46),
            height: Util.h(60),
            clickCb:()=>{

            }
        });

        // 排行榜列表
        if(type == 0){
            httpMgr.getGoldRank((data)=>{
                if (data.status == 1){
                    let d = data.data;
                    this.initUi(d, type);
                }
            })

        }else if(type == 1){
            httpMgr.getGradeRank((data)=>{
                if (data.status == 1){
                    let d = data.data;
                    this.initUi(d, type);
                }
            })
        }

    }

    initUi(d, type) {
        let top3=[];

        for (let i = 0; i < d.length; i++) {
            if (i > 4) {
                break;
            }
            let user = d[i];
            let nickname = user.nickname;
            let gold = user.gold;
            let pic = user.pic;

            if (i < 3) {
                top3.push({name: nickname, i, pic});
            }
            this.createOneRank(type,  i, nickname, gold, pic);
        }
        this.createTOP3(top3);
        this.oneselfUi();
    }

    createTOP3(top3){
        let text = "恭喜以下"+top3[0].name+"/"+top3[1].name+"/"+top3[2].name+"\n成功登上本期前三名";

        // 排行榜图标
        Util.newSprite({
            texture:"rank/phb_phb.png",
            x: Util.w(6),
            y: Util.h(20),
            width: Util.w(39),
            height: Util.h(18),
            clickCb:()=>{

            }
        });

        // 排行榜奖台
        Util.newSprite({
            texture:"rank/phb_jb.png",
            x: Util.w(5),
            y: Util.h(65),
            width: Util.w(38),
            height: Util.h(22),
            clickCb:()=>{

            }
        });

        // 排行前三的图标
        let jin = Util.newSprite({
            texture: "rank/phb_jin.png",
            x: Util.w(18),
            y: Util.h(48),
            width: 80,
            height: 80,
            clickCb: () => {
            }
        })

        let pic1 = top3[0].pic;
        let fileName = Util.getPicFileName(pic1);
        if (fileName){
            let p = "gerenzhongxin/"+fileName;
            log("p3 "+p)

            Util.newSprite({
                texture: p,
                x: 10,
                y: 10,
                width: 60,
                height: 60,
                addToScene: false,
                addTo:jin,
            })
        }


        let yin = Util.newSprite({
            texture: "rank/phb_yin.png",
            x: Util.w(7),
            y: Util.h(53),
            width: 80,
            height: 80,
            clickCb: () => {
            }
        })

        let pic2 = top3[1].pic;
        let fileName2 = Util.getPicFileName(pic2);
        if (fileName2){
            let p = "gerenzhongxin/"+fileName2;
            log("p3 "+p)

            Util.newSprite({
                texture: p,
                x: 10,
                y: 10,
                width: 60,
                height: 60,
                addToScene: false,
                addTo:yin,
            })
        }

        let tong = Util.newSprite({
            texture: "rank/phb_tong.png",
            x: Util.w(30),
            y: Util.h(57),
            width: 80,
            height: 80,
            clickCb: () => {
            }
        })


        let pic3 = top3[2].pic;
        let fileName3 = Util.getPicFileName(pic3);
        if (fileName3){
            let p = "gerenzhongxin/"+fileName3;
            log("p3 "+p)
            Util.newSprite({
                texture: p,
                x: 10,
                y: 10,
                width: 60,
                height: 60,
                addToScene: false,
                addTo:tong,
            })
        }

        let top3Text = Util.newText({
            text: text,
            textColor: [0,0,0],
            x: Util.w(8),
            y: Util.h(87),
            width: Util.w(35),
            height: 50,
            font:"fonts/st.ttf",
            fontSize: 15,
            clickCb:()=>{
            }
        })

    }

    topUi(type){

        Util.newSprite({
            texture:"rank/phb_back.png",
            x: Util.w(2),
            y: Util.h(2),
            width: Util.w(8),
            height: Util.h(10),
            clickCb:()=>{
                new MainPage()
            }
        });


        let a= "rank/phb_btbg_a.png";
        let b= "rank/phb_btbg_l.png";

        // 财富榜 等级榜
        let list = ["rank/phb_cfb.png","rank/phb_djb.png"];

        for (let i = 0; i < list.length; i++) {
            let path = list[i];

            let bj = a;
            if(type == i){
                bj = b;
            }
            Util.newSprite({
                texture: bj,
                x: Util.w(35)*i+100,
                y: Util.h(2.5),
                width: Util.w(28),
                height: Util.h(12),
                clickCb: () => {
                    //this.ui(i);
                }
            })

            let sprite = Util.newSprite({
                texture: path,
                x: Util.w(35)*i+100,
                y: Util.h(2.5),
                width: Util.w(28),
                height: Util.h(12),
                clickCb: () => {
                    this.ui(i);
                }
            })
        }






    }

    // 自己排行ui
    oneselfUi(rank){
        // 背景
        let sprite = Util.newSprite({
            // texture: "transparency.png",
            texture: "rank/phb_listbg.png",
            x: Util.w(50),
            y: Util.h(20) ,
            addToScene: false,
            width: Util.w(45),
            height: Util.h(15),
        })

        let touxiangkuang = Util.newSprite({
            texture: "rank/phb_jin.png",
            x: 0,
            y: 0,
            addToScene: false,
            width: Util.w(8),
            height: Util.w(8),
            name: "0",
            clickCb: () => {
            }
        })


        let fileName = Util.getPicFileName(GlobalVariable.userPic);
        if (fileName){
            let p = "gerenzhongxin/"+fileName;
            log(p)
            Util.newSprite({
                texture: p,
                x: 10,
                y: 10,
                width: Util.w(8)-20,
                height: Util.w(8)-20,
                addToScene: false,
                addTo:touxiangkuang,
            })
        }


        let pm = "";
        if (rank){
            pm = "第"+rank+"名";
        }else {
            pm = "未入榜";
        }

        let ph = Util.newText({
            text: pm,
            // textColor: [0.98,0.78,0.01],
            x: 90,
            y: 8,
            width: 100,
            height: 30,
            font:"fonts/st.ttf",
            fontSize: 20,
            clickCb:()=>{
            }
        })

        // 充值
        let cz = Util.newSprite({
            texture: "rank/phb_cz.png",
            x: Util.w(22),
            y: Util.h(6) ,
            addToScene: false,
            width: Util.w(15),
            height: 40,
            name: "0",
            clickCb: () => {
                new Shop();
            }
        })

        // 刷新
        let refresh = Util.newSprite({
            texture: "rank/phb_sx.png",
            x: Util.w(39),
            y:  Util.w(3.5) ,
            addToScene: false,
            width: Util.w(5),
            height: Util.w(5),
            name: "0",
            clickCb: () => {
                this.ui();
            }
        })

        sprite.addNode(touxiangkuang);
        sprite.addNode(ph);
        sprite.addNode(refresh);
        sprite.addNode(cz);

        GlobalVariable.scene.addNode(sprite);

    }

    createOneRank(type,i,name,info,pic){

        // 背景
        let width = Util.w(44);
        let height = Util.h(8);
        let number = height*0.3;
        let sprite = Util.newSprite({
            texture: "rank/phb_listbg.png",
            x: Util.w(50) + 10,
            y: Util.h(36) + i*(height+number) + number,
            addToScene: false,
            width: width,
            height: height,
        })

        let jpPng = "rank/phb_";
        if ( i == 0){
            jpPng += "1.png";
        }else if ( i == 1){
            jpPng += "2.png";
        }else if ( i == 2){
            jpPng += "3.png";
        }else {
            jpPng += "n.png";
        }
        let ph = Util.newSprite({
            texture: jpPng,
            x: height*0.25,
            y: height*0.1,
            addToScene: false,
            width: height-8,
            height: height-5,
            name: "0",
            clickCb: () => {
            }
        })
        if (i>2){
            let phNumber = Util.newText({
                text: (i+1)+"",
                textColor: [0.98,0.78,0.01],
                x: height*0.3,
                y: height*0.15,
                addToScene: false,
                width: height * 0.8,
                height: height * 0.6,
                font:"fonts/st.ttf",
                fontSize: height * 0.5,
                clickCb:()=>{
                }
            })
            ph.addNode(phNumber);
        }


        let touxiangkuang = Util.newSprite({
            texture: "rank/phb_jin.png",
            x: 60,
            y: 2,
            addToScene: false,
            width: height - 2,
            height: height - 2,
            name: "0",
        })

        let fileName = Util.getPicFileName(pic);
        if (fileName){
            let p = "gerenzhongxin/"+fileName;
            log(p)
            Util.newSprite({
                texture: p,
                x: height*0.15,
                y: height*0.15,
                width: height * 0.65,
                height: height * 0.65,
                addToScene: false,
                addTo:touxiangkuang,
            })
        }


        let n = Util.newText({
            text: name,
            textColor: [0.98,0.78,0.01],
            x: width * 0.3,
            y: height * 0.15,
            width: width * 0.5,
            height: height * 0.7,
            font:"fonts/st.ttf",
            fontSize: 20,
            clickCb:()=>{
            }
        })


        let signPng = "rank/phb_zc.png";
        if(type == 1){
            signPng = "rank/phb_dj.png";
        }

        let sign = Util.newSprite({
            texture: signPng,
            x: width * 0.55,
            y: height * 0.1,
            addToScene: false,
            width: height * 0.8,
            height: height * 0.8,
            name: "0",
            clickCb: () => {
            }
        })

        let g = Util.newText({
            text: info+"",
            textColor: [0.98,0.78,0.01],
            x: width * 0.7,
            y: height * 0.10,
            width: 180,
            height: height * 0.7,
            font:"fonts/st.ttf",
            fontSize: height * 0.4,
            clickCb:()=>{
            }
        })

        sprite.addNode(ph);
        sprite.addNode(touxiangkuang);
        sprite.addNode(sign);
        sprite.addNode(n);
        sprite.addNode(g);

        GlobalVariable.scene.addNode(sprite);

    }






}
