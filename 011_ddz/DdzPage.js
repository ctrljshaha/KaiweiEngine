/**
 * @class DdzPage
 * @description 斗地主主游戏场景类，处理桌面渲染、玩家状态及游戏逻辑
 */
class DdzPage {
    static roomId;

    constructor(end_gold) {
        this.end_gold = end_gold;
        this.init();
    }

    // 初始化游戏
    init(){
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        this.myCards = [];       // 我方手牌对象数组
        this.diCards = [];
        this.users = [];
        this.cards = [];
        this.cardPosSetting=[
            {
                "type":"left",
                "cardX":Util.w(9),
                "cardY":Util.h(37),
                "cardMargin":20,
                "cardWidth":Util.w(6),
                "cardHeight":Util.h(10),
            },
            {
                "type":"right",
                "cardX":Util.w(68),
                "cardY":Util.h(37),
                "cardMargin":20,
                "cardWidth":Util.w(6),
                "cardHeight":Util.h(10),
            },
            {
                "type":"bottom",
                "cardX":50,
                "cardY":Util.h(84.6),
                "cardMargin":Util.w(3.5),
                "cardWidth":Util.w(7),
                "cardHeight":Util.h(12),
            },
            {
                "type":"middle",
                "cardX":Util.w(40),
                "cardY": Util.h(52),
                "cardMargin":20,
                "cardWidth":Util.w(6),
                "cardHeight":Util.h(10),
            }
        ];

        this.rule = new Rule();
        this.baseUi();
        this.initCards();
    }

    // UI
    baseUi() {
        Util.bj({picture: "ddzview/ddz_bg.png"});
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        this.topUi();

        this.createMyUi();
    }

    // 我的ui
    createMyUi(){
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let uid = GlobalVariable.uid;
        let nickname = GlobalVariable.userinfo.nickname;
        let pic = GlobalVariable.userinfo.pic;
        let sex = GlobalVariable.userinfo.sex;

        let player = this.createPlayerUi(10, Util.h(68), nickname,false,"right",false,pic);
        this.users.push({uid,...player,position:"bottom",name:nickname,index:0,sex:sex});
    }

    // 牌初始化
    initCards() {
        let find = this.cardPosSetting.find(e=>e.type=="bottom");
        if(!find){
            return;
        }
        let {cardX,cardY,cardMargin,cardWidth,cardHeight} = find;

        // 玩家1的牌
        let card = [];
        for (let i = 0; i < 21; i++) {
            card[i] = new Card(-1, cardX + cardMargin * i, cardY,false,cardWidth,cardHeight,true);
        }
        this.cards = card;

        let card2 = [];
        for (let j = 0; j < 21; j++) {
            card2[j] = new Card(-1, 10000 + 20 * j, 200000,false,50,60,true);
        }
        this.cards2 = card2;

        // 玩家2的牌
        let card3 = [];
        for (let k = 0; k < 21; k++) {
            card3[k] = new Card(-1, 100000 + 20 * k, 2000000,false,50,60,true);
        }
        this.cards3 = card3;

    }

    /**
     * 创建玩家UI
     * @param x x坐标
     * @param y y坐标
     * @param name 昵称
     * @param isBoss 是否为地主
     * @param signDirection "left","right" 标识方向，用以确定地主标识的位置
     * @param showCardNum 是否显示牌数
     * @param pic 头像图片路径
     * @return {{cardNum: *, type: Sprite}|{nameSprite: *, type: Sprite}}
     */
    createPlayerUi(x, y, name, isBoss = false, signDirection = "right",showCardNum =false,pic="") {

        // 头像背景框
        let width = Util.w(9);
        let height = Util.h(12);
        let sprite = Util.newSprite({
            texture: "ddzview/ddz_nmbg.png",
            x: x,
            y: y,
            width: width,
            height: height,
        })

        let fileName = Util.getPicFileName(pic);
        if (fileName){
            let p = "gerenzhongxin/"+fileName;

            Util.newSprite({
                texture: p,
                x: width*0.12,
                y: height*0.12,
                width: width*0.75,
                height: height*0.75,
                addToScene: false,
                addTo:sprite,
            })
        }

        // 名称
       let nameSprite = Util.newText({
            text: "" + name,
            textColor: [1, 1, 1],
            x: x + width*0.16,
            y: y - height*0.2,
            width: Util.w(10),
            height: Util.h(4),
            font: "fonts/st.ttf",
            fontSize: 15,
        })

        let typeImage;
        if (isBoss) {
            typeImage = "ddz_sxdz.png";
        } else {
            typeImage = "ddz_sxnm.png";
        }

        let signX = x + width + 5;
        if (signDirection == "left") {
            signX = x - Util.w(4.5)-5;
        }

        let type = Util.newSprite({
            texture: "ddzview/" + typeImage,
            x: signX,
            y: y + 5,
            width: Util.w(4.5),
            height: Util.h(11.8),
        })

        // 剩余牌数
        if (showCardNum){
            let cardNum = Util.newText({
                text: "17",
                textColor: [0.98,0.78,0.01],
                x: x + width * 0.4,
                y: y + height+5,
                width: Util.w(10),
                height: Util.h(3.2),
                font: "fonts/st.ttf",
                fontSize: 15,
            });
            return {cardNum,type,nameSprite};
        }
        return {type,nameSprite};
    }

    // 顶部ui
    topUi(di) {
        if(!di && this.end_gold){
            di = this.end_gold;
        }

        let width = Util.w(70);
        let height = Util.h(15);
        Util.newSprite({
            texture: "ddzview/ddz_topbg.png",
            x: Util.w(15),
            y: 0,
            width: width,
            height: height,
        })

        // 底数
        Util.newSprite({
            texture: "ddzview/ddz_ds.png",
            x: Util.w(22),
            y: height*0.2,
            width: Util.w(11.3),
            height: Util.h(8.2),
        })

        Util.newText({
            text: ""+di,
            textColor: [0.98, 0.78, 0.01],
            x: Util.w(33),
            y: height*0.3,
            width: Util.w(10),
            height: Util.h(6.6),
            font: "fonts/st.ttf",
            fontSize: Util.h(5),
        })

        // 倍数
        Util.newSprite({
            texture: "ddzview/ddz_bs.png",
            x: Util.w(60),
            y: height*0.2,
            width: Util.w(11.3),
            height: Util.h(8.2),
        })

        this.beishu = Util.newText({
            text: "0",
            textColor: [0.98, 0.78, 0.01],
            x: Util.w(72),
            y: height*0.3,
            width: Util.w(10),
            height: Util.h(6.6),
            font: "fonts/st.ttf",
            fontSize: Util.h(5),
        })

        // 底牌
        Util.newSprite({
            texture: "ddzview/ddz_fjbg.png",
            x: Util.w(40),
            y: 1,
            width: Util.w(19),//150
            height: Util.h(12),//80
        })
        let diList =[]
        for (let i = 0; i < 3; i++) {
            let di = new Card(-1,Util.w(41)  + i * Util.w(5.7)+1,Util.h(1.9),true,Util.w(5.7),Util.h(9.5));
            diList[i] = di;
        }
        this.diCards = diList;

        //
        let x = Util.w(80);
        Util.newSprite({
            texture: "ddzview/ddz_dian.png",
            x: x+1,
            y: 15,
            width: Util.w(2.6),
            height: Util.h(3.4),
        })

        Util.newSprite({
            texture: "ddzview/ddz_line.png",
            x: x+5,
            y: 25,
            width: Util.w(1.4),
            height: Util.h(8),
            clickCb: () => {
                log("ddz_line click")
                this.topUi2();
            }
        })

        Util.newSprite({
            texture: "ddzview/ddz_yuan.png",
            x: x-12,
            y: Util.h(10),
            width: Util.w(6),
            height: Util.h(8),
            clickCb: () => {
                log("yuan click")
                this.topUi2();
            }
        })
    }

    // 顶部下拉后的ui
    topUi2() {
        log("顶部下拉后的ui")
        if (this.topUiSprite2) {
            if(!this.topUiSprite2.isHide()){
                this.topUiSprite2.setHide(true);
            }else {
                this.topUiSprite2.setHide(false);
            }
            return;
        }

        let width = Util.w(70);
        let height = Util.h(15);
        this.topUiSprite2 = Util.newSprite({
            texture: "ddzview/ddz_topbg.png",
            addToScene: false,
            x: Util.w(15),
            y: 0,
            width: width,
            height: height,
        })

        let tuoguan = Util.newSprite({
            texture: "ddzview/ddz_jqr.png",
            x: Util.w(15),
            y: 2,
            addToScene: false,
            width: width*0.15,
            height: height*0.8,
            clickCb: () => {
                this.jqrClick();
            }
        })

        let tuichu = Util.newSprite({
            texture: "ddzview/ddz_tuichu.png",
            x: Util.w(40),
            y: 2,
            addToScene: false,
            width: width*0.15,
            height: height*0.8,
            clickCb: () => {
                this.exitRoom();
            }
        })

        this.topUiSprite2.addNode(tuoguan);
        this.topUiSprite2.addNode(tuichu);

        GlobalVariable.scene.addNode(this.topUiSprite2);
    }

    //抢地主按钮ui
    qdzUi() {
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let x = 0;
        let y = h;

        if (this.jdz) {
            this.jdz.setHide(false);
            return;
        }

        this.daojishiUiCreate("bottom")

        // 透明背景
        let width = 1000;
        let height = 70;
        let sprite = Util.newSprite({
            texture: "transparency.png",
            // texture: "qd.png",
            x: 100,
            y: Util.h(66),
            addToScene: false,
            width: width,
            height: height,
        })

        this.jdz = sprite;

        let bu = Util.newSprite({
            texture: "ddzview/ddz_bujiao.png",
            x: width * 0.08,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            name: "0",
            clickCb: () => {
                this.jdzbjClick();
            }
        })


        let fen1 = Util.newSprite({
            texture: "ddzview/ddz_yifen.png",
            x: width * 0.3,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            name: "1",
            clickCb: () => {
                this.jdzClick(1);
            }
        })


        let fen2 = Util.newSprite({
            texture: "ddzview/ddz_erfei.png",
            x: width * 0.3 + width * 0.12,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            name: "2",
            clickCb: () => {
                this.jdzClick(2);
            }
        })

        let fen3 = Util.newSprite({
            texture: "ddzview/ddz_sanfen.png",
            x: width * 0.3 + width * 0.12 * 2,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            name: "3",
            clickCb: () => {
                this.jdzClick(3);
            }
        })

        sprite.addNode(bu);
        sprite.addNode(fen1);
        sprite.addNode(fen2);
        sprite.addNode(fen3);


        GlobalVariable.scene.addNode(sprite);
    }

    //出牌按钮ui
    sendCardUi(hide = false) {

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let x = 0;
        let y = h;
        if (this.sendCardSprite != null && hide != undefined) {
            this.sendCardSprite.setHide(hide);
            return;
        }

        // 透明背景
        let width = 1000;
        let height = 70;
        let sprite = Util.newSprite({
            texture: "transparency.png",
            // texture: "80.png",
            x: Util.w(12.8),
            y: Util.h(66),
            addToScene: false,
            width: width,
            height: height,
        })

        this.sendCardSprite = sprite;

        // 不出牌按钮
        let bu = Util.newSprite({
            texture: "ddzview/ddz_bc.png",
            x: width * 0.08,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            clickCb: () => {
                this.noSendCard();
            }
        })


        // 提示按钮
        let ts = Util.newSprite({
            texture: "ddzview/ddz_ts.png",
            x: width * 0.3,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            clickCb: () => {
                this.tishi();
            }
        })


        // 出牌按钮
        let chupai = Util.newSprite({
            texture: "ddzview/ddz_chupai.png",
            x: width * 0.3 + width * 0.12,
            y: height * 0.33,
            addToScene: false,
            width: width * 0.08,
            height: height * 0.6,
            clickCb: () => {
                this.sendCard();
            }
        })


        sprite.addNode(bu);
        sprite.addNode(ts);
        sprite.addNode(chupai);


        GlobalVariable.scene.addNode(sprite);
    }

    // 创建倒计时ui
    daojishiUiCreate(direction) {
        if (direction == "left") {
            // this.daojishiUi(130, 100,30);
            this.daojishiUi(Util.w(16.5), Util.h(18),30);
        }else if (direction == "right"){
            // this.daojishiUi(570, 100,30);
            this.daojishiUi(Util.w(75), Util.h(18),30);
        }else {
            // this.daojishiUi(290, 400,30);
            this.daojishiUi(Util.w(37), Util.h(68),30);
        }
    }

    // 倒计时
    daojishiUi(x, y, num) {
        this.daojishiTime = new Date().getTime();
        if(this.daojishi){
            this.daojishi.setHide(false);
            this.daojishi.setPosition(x, y);
            this.daojishiNum = num;
            this.daojishiNumText.setText(num + "");
            return;
        }

        let width = Util.w(9);
        let daojishi = Util.newSprite({
            texture: "ddzview/ddz_shizhong.png",
            x: x,
            y: y,
            width: width,
            height: width,
            name: "daojishi",
        })
        this.daojishi = daojishi;
        this.daojishiNum = num;
        this.daojishiNumText = Util.newText({
            text: "" + num,
            textColor: [0, 0, 0],
            x: width*0.33,
            y: width*0.4,
            width: width,
            height: width*0.3,
            font: "fonts/st.ttf",
            addToScene: false,
            addTo: daojishi,
            fontSize: width*0.3,
        })

        daojishi.upDate(() => {
            let now = new Date().getTime();
            let time = now - this.daojishiTime;
            if (time >= 1000) {
                let number = this.daojishiNum;
                if (number > 0) {
                    this.daojishiNum = number - 1;
                    let s = number - 1 + "";
                    if(this.daojishiNum < 10){
                        s = "0" + s;
                    }
                    this.daojishiNumText.setText(s);
                } else {
                    this.daojishi.setHide(true);
                }
                this.daojishiTime = now;
            }
        })
        return daojishi;
    }

    // 用户信息
    getUserUi(uid){
        let users = this.users;
        if (uid == null || users == null) {
            return;
        }

        return users.find(u => u.uid == uid);
    }

    // 游戏结束
    gameOverUi(win,result,user1Result,user2Result){
        if (this.gameOverSprite) {
            return;
        }

        let width = Util.w(60); // 480
        let height = Util.h(55); // 330
        let gameOverSprite = Util.newSprite({
            texture: "gameover/js_bg.png",
            x: Util.w(20),
            y: Util.h(20),
            addToScene: false,
            width: width,
            height: height,
            widthCenter: true,
        });
        this.gameOverSprite = gameOverSprite;
        Util.stopMusic();

        // 结果图片
        let resultImg = "gameover/js_sl.png";
        if (!win) {
            Util.playSound("sound/musicex/Lose.mp3")
            resultImg = "gameover/js_sb.png";
            Util.newSprite({
                texture: resultImg,
                x: width * 0.27,
                y: -(height*0.02),
                addToScene: false,
                width: width*0.5,
                height: height*0.2,
                addTo: gameOverSprite,
            })
        }else {
            Util.playSound("sound/musicex/Win.mp3")

            Util.newSprite({
                texture: resultImg,
                x: width * 0.1,
                y: -(height*0.3),
                addToScene: false,
                width: width*0.9,
                height: height*0.85,
                addTo: gameOverSprite,
            })
        }



        let gold = Util.newSprite({
            texture: "gameover/js_jb.png",
            x: width * 0.23,
            y: height * 0.18,
            addToScene: false,
            width: width*0.14,
            height: height*0.19,
            addTo: gameOverSprite,
        })
        let goldNum =  Util.newText({
            text: result,
            textColor: [0.98, 0.78, 0.01],
            x:  width * 0.42,
            y: height * 0.21,
            width: width*0.3,
            height: height*0.12,
            font: "fonts/st.ttf",
            fontSize: height*0.1,
            addToScene: false,
            addTo: gameOverSprite,
        })

        let user1 =  Util.newText({
            text: user1Result,
            textColor: [0.98, 0.78, 0.01],
            x:  width * 0.2,
            y: height * 0.4,
            width: width*0.7,
            height: height*0.12,
            font: "fonts/st.ttf",
            fontSize: height*0.1,
            addToScene: false,
            addTo: gameOverSprite,
        })

        let user2 =  Util.newText({
            text: user2Result,
            textColor: [0.98, 0.78, 0.01],
            x:  width * 0.2,
            y: height * 0.55,
            width: width*0.7,
            height: height*0.12,
            font: "fonts/st.ttf",
            fontSize: height*0.1,
            addToScene: false,
            addTo: gameOverSprite,
        })


        // 离开
        Util.newSprite({
            texture: "gameover/js_lk.png",
            x: width * 0.16,
            y: height * 0.7,
            addToScene: false,
            addTo: this.gameOverSprite,
            width: width*0.33,
            height: height*0.19,
            clickCb: () => {
                this.exitRoom();
            }
        })

        // 继续
        Util.newSprite({
            texture: "gameover/js_jx.png",
            x: width * 0.5,
            y: height * 0.7,
            addToScene: false,
            addTo: this.gameOverSprite,
            width: width*0.33,
            height: height*0.19,
            clickCb: () => {
                this.restart();
            }
        })
        GlobalVariable.scene.addNode(this.gameOverSprite);


        httpMgr.getUserInfo((d)=>{
            let userinfo = d.data;
            GlobalVariable.userinfo = userinfo;
        });
    }

    // 添加玩家
    addUser(data) {
        log("addUser:"+JSON.stringify(data));
        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();
        let intoUid = data.intoUid;
        let users = data["users"];

        if(users && users.length > 0){

            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                if(!user){
                    continue;
                }
                let nickname = user.nickname;
                let pic = user.pic;
                let sex = user.sex;
                let uid = user.id;
                let find = this.users.find(e=>e.uid==uid);
                if(!find){
                    let index = intoUid.findIndex(e=>e==uid);
                    if (index == 1){
                        let player = this.createPlayerUi(Util.w(90), Util.h(18), nickname, false, "left",true,pic);
                        this.users.push({uid,...player,position:"right",name:nickname,index:1,sex:sex});
                    }else if(index == 2){
                        let player = this.createPlayerUi(10, Util.h(18), nickname, false, "right",true,pic);
                        this.users.push({uid,...player,position:"left",name:nickname,index:2,sex:sex});
                    }
                }else {
                    // find.uid = uid;
                    // find.name = nickname;
                    // find.nameSprite.setText(nickname);
                    // find.cardNum.setText("");
                }
            }
        }



        // if (intoUid.length == 3) {
        //     if(this.users && this.users[2]){
        //         let user = this.users[2];
        //         user.uid = uid;
        //         user.name = nickname;
        //         user.nameSprite.setText(nickname);
        //         user.cardNum.setText("");
        //     }else {
        //         let player = this.createPlayerUi(10, 100, nickname, false, "right",true,pic);
        //         this.users.push({uid,...player,position:"left",name:nickname,index:2,sex:sex});
        //     }
        // } else if (intoUid.length == 2) {
        //     if(this.users && this.users[1]){
        //         let user = this.users[1];
        //         user.uid = uid;
        //         user.name = nickname;
        //         user.nameSprite.setText(nickname);
        //         user.cardNum.setText("");
        //     }else {
        //         let player = this.createPlayerUi(w - 100, 100, nickname, false, "left",true,pic);
        //         this.users.push({uid,...player,position:"right",name:nickname,index:1,sex:sex});
        //     }
        // }

    }

    // 显示其他玩家牌
    showCardOther(cards,type = "bottom",i){
        log("showCardOther: "+cards +" type: "+type + " i:"+i)
        let find = this.cardPosSetting.find(e=>e.type==type);
        if(!find){
            return;
        }

        let {cardX,cardY,cardMargin,cardWidth,cardHeight} = find;

        let cardList = this.cards2 || [];
        if(i==2){
            cardList = this.cards3 || [];
        }
        if (cardList && cardList.length > 0) {
            for (let i = 0; i < cardList.length; i++) {
                if (i > cards.length - 1) {
                    cardList[i].setHide(true);
                    continue;
                }
                let card = cardList[i];
                card.setHide(false);
                card.setData(cards[i]);

                let x = cardX + cardMargin * i;
                card.setPosition(x,cardY);
            }
        }
        // let card = [];
        // for (let i = 0; i < cards.length; i++) {
        //     let num = cards[i];
        //     card[i] = new Card(num, cardX + cardMargin * i, cardY,false,cardWidth,cardHeight);
        // }

        // this.cards2 = card;
    }

    // 显示自己的牌
    showCard(cards) {

        let cardList = this.cards || [];
        log("cards: "+cards );

        let find = this.cardPosSetting.find(e=>e.type=="bottom");
        if(!find){
            return;
        }
        let {cardX,cardY,cardMargin,cardWidth,cardHeight} = find;

        if (cardList && cardList.length > 0) {
            for (let i = 0; i < cardList.length; i++) {
                if (i > cards.length-1) {
                    cardList[i].setPosition(0, 0);
                    cardList[i].setHide(true);
                    cardList[i].setData(0);
                    continue;
                }

                let card = cardList[i];
                card.setData(cards[i]);
                card.setHide(false);
                card.setPosition(cardX + cardMargin * i, cardY);
            }
        }

    }

    // 用户顺序
    userIndex(uids,uid){
        if(uids == null  || uid == null) {
            return;
        }
        return uids.findIndex(e => e == uid);
    }

    // 游戏逻辑
    playData(data) {
        if(this.showNoCardTipSprite){
            this.showNoCardTipSprite.setHide(true);
        }
        const cache_ = game.getResource();
        let uid = GlobalVariable.uid;
        let type = data.type;
        let cards = data.cards;
        let uids = data.uids;
        let actionIndex = data.actionIndex;
        let index = actionIndex % 3;
        let tuid = uids[index];
        let userCardCount = data.userCardCount;
        // 上局出牌
        let sendCards = data["sendCards"];

        log(" type : "+ type);


        let prevIndex = (index+2)%3;
        let prevSendCards = sendCards[prevIndex];

        // 上一轮出牌玩家
        let prevUser = this.getUserUi(uids[prevIndex]);
        console.log(prevUser)
        if(prevSendCards && prevSendCards.length > 0){
            let pos = prevUser.position;
            if(prevUser.uid  == uid){
                pos = "middle";
                this.prevSendCards = [];
            }else{
                this.prevSendCards = prevSendCards;
            }
            this.showCardOther(prevSendCards,pos);
            this.prevCardIndex = prevIndex;
        }

        // 发牌
        if (type == 0) {
            if (cards && cards.length > 0) {
                this.showCard(cards);
            }
        } else if (type == 1)
        {
            // 叫地主
            this.qdzUi();
            const multiple = data["multiple"];
            //抢地主
            if (tuid == uid) {
                if (multiple == 2) {
                    let n = Util.getChildNodeByName(this.jdz, "1");
                    if (n) {
                        let bg = cache_.getTexture("ddzview/ddz_gyifen.png");
                        n.setTexture(bg);
                    }
                }
                if (multiple == 3) {
                    let n = Util.getChildNodeByName(this.jdz, "1");
                    if (n) {
                        let bg = cache_.getTexture("ddzview/ddz_gyifen.png");
                        n.setTexture(bg);
                    }
                    let n2 = Util.getChildNodeByName(this.jdz, "2");
                    if (n2) {
                        let bg = cache_.getTexture("ddzview/ddz_gerfen.png");
                        n2.setTexture(bg);
                    }
                }
            } else {
                let sex = prevUser.sex;
                this.jdzSound(sex,multiple);
            }
        } else if (type == 2) {
            log("chupai")

            // 隐藏叫地主按钮
            if (this.jdz && !this.jdz.isHide()) {
                this.jdz.setHide(true);
            }

            // 轮到自己出牌
            let turn = index == this.userIndex(uids, uid);

            // 剩余牌数
            if(userCardCount && userCardCount.length > 0){
                for (let i = 0; i < uids.length; i++) {
                    let u = uids[i];
                    let userUi = this.getUserUi(u);
                    if (userUi){
                        let cardNum = userUi.cardNum;
                        if (cardNum){
                            cardNum.setText(userCardCount[i]+"")
                        }
                    }
                }
            }

            // 倒计时
            let u = this.getUserUi(uids[index]);
            if (u) {
                let pos = u.position;
                this.daojishiUiCreate(pos)
            }

            if(this.qxtgSprite && !this.qxtgSprite.isHide()){
                this.sendCardUi(true)
            }else {
                this.sendCardUi(false)
            }

            // 叫地主后
            if (data["actionCount"] == 0) {
                let index = 0;
                for (let i = 0; i < 3; i++) {
                    let tmx = data["callScore"][i];
                    if (tmx == data["multiple"]) {
                        index = i;
                    }
                }
                log("最大:"+index)
                for (let i = 0; i < uids.length; i++) {
                    let u = uids[i];
                    let userUi = this.getUserUi(u);
                    if (userUi){
                        let type = userUi.type;
                        if (type){
                            if(i == index){
                                log("地主:"+u)
                                let bg = cache_.getTexture("ddzview/ddz_sxdz.png");
                                type.setTexture(bg);
                            }else {
                                log("农民:"+u)
                                let bg = cache_.getTexture("ddzview/ddz_sxnm.png");
                                type.setTexture(bg);
                            }
                        }
                    }
                }
                this.beishu.setText(data["multiple"] + "");

            } else {
                // console.log("prevSendCards",prevSendCards)

                // console.log("index : "+index+" prevCardIndex: "+this.prevCardIndex+ " actionIndex:"+actionIndex)
                //声音
                let myself = index !== this.prevCardIndex;
                this.playSound(prevSendCards,prevUser,myself);
            }

            if(cards.length > 0 && cards.length != this.cards.length){
                this.showCard(cards);
            }

            // 显示底牌
            let endCards = data["endCards"];
            if (endCards.length > 0 && this.diCards.find(e=>e.getCardValue() < 0)) {
                let diCards = this.diCards;
                for (let j = 0; j < endCards.length; j++) {
                    diCards[j].setData(endCards[j]);
                }
            }


        } else if (type == 3) {
            //结束
            let overGold = data["overGold"];
            let data1;

            let result = [];
            for (let i = 0; i < uids.length; i++) {
                let id = uids[i];
                if (id == uid) {
                    let glod = overGold[this.userIndex(uids, uid)];
                    data1 = glod>0?"+"+glod:""+glod;
                }else {
                    let userInfo = this.getUserUi(id);
                    let glod = overGold[this.userIndex(uids, id)];
                    let g = glod > 0 ? " +"+glod : " "+glod;
                    let res = userInfo.name + g;
                    result.push(res);
                }
            }

            this.gameOverUi(data1>0,data1, result[0], result[1])


            for (let i = 0; i < sendCards.length; i++) {
                let c = sendCards[i];
                let user = this.users[i];
                if(!user || !user.position){
                    continue;
                }
                if(i == 1 || i == 2){
                    this.showCardOther(c,user.position,i);
                }
            }

        }

        // 显示底牌
        let endCards = data["endCards"];
        if (endCards.length > 0 && this.diCards.length == 0) {
            let diCards = this.diCards;
            for (let j = 0; j < endCards.length; j++) {
                diCards[j].setData(endCards[j]);
            }
        }
    }

    // 不抢地主按钮
    jdzbjClick() {
        let uid = GlobalVariable.uid;
        const data = '{"type":"callLord","data":{"uid":"' + uid + '","roomId":"' + DdzPage.roomId + '","callScore":0}}';
        socketIoMgr.send(data);
        let sex = GlobalVariable.userinfo.sex;
        this.jdzSound(sex,0);
    }

    // 退出
    exitRoom(){
        let uid = GlobalVariable.uid;
        socketIoMgr.send('{"type":"exit","data":{"uid":"' + uid + '","roomId":"' + DdzPage.roomId + '"}}');
        Util.stopMusic();
        new MainPage();
    }

    // 叫地主按钮
    jdzClick(type) {
        if(!type || type<1 || type>3) return;
        let uid = GlobalVariable.uid;
        socketIoMgr.send('{"type":"callLord","data":{"uid":"' + uid + '","roomId":"' + DdzPage.roomId + '","callScore":'+type+'}}');
        // man Woman
        let sex = GlobalVariable.userinfo.sex;
        this.jdzSound(sex,type);
    }


    jdzSound(sex,type){

        let p = "sound/Woman";

        if(sex === "男"){
            p = "sound/man";
        }
        if (type <= 0){
            Util.playSound(p+"/notorder.mp3");
            return;
        }
        Util.playSound(p+"/callScore"+type+".mp3");
    }


    // 出牌
    sendCard() {
        let uid = GlobalVariable.uid;
        const cards = [];
        for (let i = 0; i < this.cards.length; i++) {
            const mycard = this.cards[i];
            if (mycard.getIsSelected()) {
                cards.push(mycard.getCardValue());
            }
        }

        socketIoMgr.send('{"type":"sendCard","data":{"uid":"' + uid + '","roomId":"' + DdzPage.roomId + '","cards":[' + cards + ']}}');
    }

    // 不出牌
    noSendCard() {
        let uid = GlobalVariable.uid;
        socketIoMgr.send('{"type":"sendCard","data":{"uid":"' + uid + '","roomId":"' + DdzPage.roomId + '","cards":[]}}');
    }

    // 托管
    jqrClick(){
        this.tg = true;
        if(!this.qxtgSprite){
            let w = game.getWindow().getWidth();
            let h = game.getWindow().getHeight();
            this.qxtgSprite = Util.newSprite({
                texture: "ddzview/ddz_qxtg.png",
                x: Util.w(80),
                y: Util.h(70),
                clickCb: () => {
                    this.qxtgClick();
                },
                width: Util.w(18.5),
                height: Util.h(10),
                hide: true
            })
        }
        this.qxtgSprite.setHide(false);
        let uid = GlobalVariable.uid;
        this.sendCardUi(true);

        socketIoMgr.send('{"type":"trusteeship","data":{"uid":"'+uid+'","roomId":"'+DdzPage.roomId+'","trusteeship":1}}');
    }

    // 开启托管
    enableTg(){
        this.sendCardUi(true);
        if(!this.qxtgSprite){
            let w = game.getWindow().getWidth();
            let h = game.getWindow().getHeight();
            this.qxtgSprite = Util.newSprite({
                texture: "ddzview/ddz_qxtg.png",
                x: Util.w(80),
                y: Util.h(70),
                clickCb: () => {
                    this.qxtgClick();
                },
                width: Util.w(18.5),
                height: Util.h(10),
                hide: true
            })
        }
        this.qxtgSprite.setHide(false);
    }

    //取消托管
    qxtgClick(){
        log("取消托管")
        this.qxtgSprite.setHide(true);
        this.sendCardUi(false);

        let uid = GlobalVariable.uid;
        socketIoMgr.send('{"type":"trusteeship","data":{"uid":"'+uid+'","roomId":"'+DdzPage.roomId+'","trusteeship":0}}');
    }

    // 重开
    restart(){
        log("重开");

        let uid = GlobalVariable.uid;
        socketIoMgr.send('{"type":"ready","data":{"uid":"'+uid+'","roomId":"'+DdzPage.roomId+'"}}');
        let endGold = this.end_gold;
        socketIoMgr.newDdzPage(endGold);
        Util.playMusic("sound/musicex/Normal2.mp3");
    }

    // 提示
    tishi(){
        if(this.showNoCardTipSprite){
            this.showNoCardTipSprite.setHide(true);
        }
        const cards = [];
        for(let i = 0; i < this.cards.length; i++)
        {
            let mycard = this.cards[i];
            if(mycard.isNotHide()){
                cards.push(mycard.getCardValue());
            }
        }

        // log(JSON.stringify(this.cards))
        const tishiCards = this.rule.outOfCards(cards, this.prevSendCards);
        // log("tishiCards: "+JSON.stringify(tishiCards));
        if(tishiCards && tishiCards.length > 0){
            for(let j=0;j < this.cards.length;j++) {
                let mycard = this.cards[j];
                const num = mycard.getCardValue();
                const select = mycard.getIsSelected();
                if (select == true){
                    mycard.onCardClick();
                }
                for (let i = 0; i < tishiCards.length; i++) {
                    if(num == tishiCards[i]){
                        mycard.onCardClick();
                    }
                }
            }
        }else {
            log("没有牌能大过上家！");

            if(this.showNoCardTipSprite) {
                this.showNoCardTipSprite.setHide(false);
                return;
            }

            this.showNoCardTipSprite = Util.newSprite({
                texture: "ddzview/ddz_spx.png",
                x: Util.w(40),
                y: Util.h(55),
                width: Util.w(25),
                height: Util.h(12),
                widthCenter:true
            })

        }
    }

    // 音效
    playSound(data, user,myself) {
        let i;
        let p = "sound/Woman";

        if(user.sex === "男"){
            p = "sound/man";
        }

        if (data.length == 0) {
            Util.playSound(p + "/buyao1.mp3");
        } else if (data.length == 1) {

            if (data[0] == 52) {
                Util.playSound(p + "/114.mp3");
            } else if (data[0] == 53) {
                Util.playSound(p + "/115.mp3");
            } else {
                let tnum = data[0] % 13 + 1;
                tnum += 100;
                let path = p + "/" + tnum + ".mp3";
                // log(path);
                Util.playSound(path);
            }
        } else if (data.length == 2) {

            if (data[0] == 52 || data[0] == 53) {
                Util.playSound(p + "/wangzha.mp3");
            } else {
                let tnum = data[0] % 13 + 1;
                tnum += 100;
                let path = p + "/dui" + tnum + ".mp3";
                // log(path);
                Util.playSound(path);
            }
        } else if (data.length == 3) {

            if (myself) {
                Util.playSound(p + "/sange.mp3");
            } else {
                Util.playSound(p + "/dani2.mp3");
            }
        } else if (data.length == 4) {

            if (data[0] % 13 == data[1] % 13 && data[0] % 13 == data[2] % 13 && data[0] % 13 == data[3] % 13) {
                Util.playSound(p + "/zhadan.mp3");
            } else if (myself) {
                Util.playSound(p + "/sandaiyi.mp3");
            } else {
                Util.playSound(p + "/dani1.mp3");
            }
        } else if (data.length == 5) {

            if (myself) {
                if (data[0] % 13 == data[1] % 13 || data[0] % 13 == data[2] % 13 || data[0] % 13 == data[3] % 13 || data[0] % 13 == data[4] % 13) {
                    Util.playSound(p + "/sandaiyidui.mp3");
                } else {
                    Util.playSound(p + "/shunzi.mp3");
                }

            } else {
                Util.playSound(p + "/dani3.mp3");
            }
        } else if (data.length == 6) {

            if (myself) {
                //四带二  顺子 飞机 连队
                if (data[0] % 13 != data[1] % 13 && data[0] % 13 != data[2] % 13 && data[0] % 13 != data[3] % 13 && data[0] % 13 != data[4] % 13)//顺子
                {
                    Util.playSound(p + "/shunzi.mp3");
                } else if ((data[0] % 13 == data[1] % 13 && data[0] % 13 == data[2] % 13 && data[0] % 13 != data[3] % 13))//飞机
                {
                    Util.playSound(p + "/feiji.mp3");
                } else if ((data[0] % 13 == data[1] % 13 && data[0] % 13 != data[2] % 13 && data[2] % 13 == data[3] % 13 && data[2] % 13 != data[4] % 13))//连队
                {
                    Util.playSound(p + "/liandui.mp3");
                } else {

                    Util.playSound(p + "/sidaier.mp3");
                }

            } else {
                Util.playSound(p + "/dani3.mp3");
            }
        } else {

            if (myself) {

                if (data.length % 2 == 1 || (data[0] % 13 != data[1] % 13))//顺子
                {
                    Util.playSound(p + "/shunzi.mp3");
                } else {

                    Util.playSound(p + "/liandui.mp3");
                }

            } else {
                Util.playSound(p + "/dani3.mp3");
            }
        }
    }

}
