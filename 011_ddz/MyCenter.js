class MyCenter{
    constructor() {
        let {scene} = Util.bj({picture: "shouye/mainbj.jpg"});
        this.ui();
    }

    ui(userinfo){
        if(!userinfo){
            this.user = GlobalVariable.userinfo;
        }else {
            this.user = userinfo;
        }

        // 背景
        let sprite = Util.newSprite({
            texture: "transparency.png",
            x: 100,
            y: 100,
            addToScene: false,
            width: 700,
            height: 500,
        })
        let bg = Util.newSprite({
            texture: "gerenzhongxin/user_bg.png",
            x: 0,
            y: 0,
            addToScene: false,
            addTo: sprite,
            width: 600,
            height: 450,
        })

        let close = Util.newSprite({
            texture: "gerenzhongxin/user_close.png",
            x: 560,
            y: 0,
            addToScene: false,
            addTo: sprite,
            width: 60,
            height: 60,
            clickCb: ()=>{
                new MainPage()
            }
        })

        // 用户信息
        this.userinfoUi(sprite);

        Util.newText({
            text: "我的资产：",
            textColor: [0,0,0],
            x: 110,
            y: 230,
            width: 150,
            height: 30,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })


        Util.newSprite({
            texture:"gerenzhongxin/user_kb.png",
            x: 200,
            y: 230,
            width: 150,
            height: 35,
            addToScene: false,
            addTo: sprite,
        });
        // 积分
        Util.newText({
            text: ""+this.user.score,
            textColor: [1,1,1],
            x: 240,
            y: 235,
            width: 100,
            height: 30,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })


        Util.newSprite({
            texture:"gerenzhongxin/user_fz_bg.png",
            x: 200,
            y: 290,
            width: 150,
            height: 35,
            addToScene: false,
            addTo: sprite,
        });
        // 欠钱
        Util.newText({
            text: ""+this.user.debt,
            textColor: [1,1,1],
            x: 240,
            y: 295,
            width: 100,
            height: 30,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        let {vitory,lose} = this.user.fight;
        Util.newText({
            text: "比赛胜场："+vitory,
            textColor: [0,0,0],
            x: 110,
            y: 340,
            width: 150,
            height: 30,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })
        Util.newText({
            text: "胜率："+(vitory/(vitory+lose)*100).toFixed(2)+"%",
            textColor: [0,0,0],
            x: 110,
            y: 380,
            width: 150,
            height: 30,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        GlobalVariable.scene.addNode(sprite);
    }

    userinfoUi(bg){
        let titleX = 440;
        let titleY = 72;
        let titleBg = Util.newSprite({
            texture: "gerenzhongxin/user_bt_l.png",
            x: titleX,
            y: titleY,
            addToScene: false,
            addTo: bg,
            width: 135,
            height: 50,
        })
        let titleBg2 = Util.newSprite({
            texture: "gerenzhongxin/user_info.png",
            x: titleX,
            y: titleY,
            addToScene: false,
            addTo: bg,
            width: 135,
            height: 50,
        })

        let userBg = Util.newSprite({
            texture: "gerenzhongxin/user_infobg.png",
            x: 20,
            y: 120,
            addToScene: false,
            addTo: bg,
            width: 560,
            height: 100,
        })

        Util.newText({
            text: "昵称："+this.user.nickname,
            textColor: [0,0,0],
            x: 90,
            y: 2,
            width: 300,
            height: 30,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,

        })

        // 编辑昵称
        Util.newSprite({
            texture: "gerenzhongxin/ck_bj.png",
            x: 435,
            y: 5,
            addToScene: false,
            addTo: userBg,
            width: 100,
            height: 28,
            clickCb:()=>{
                this.editNickname();

            }
        })

        Util.newText({
            text: "性别：",
            textColor: [0,0,0],
            x: 90,
            y: 35,
            width: 60,
            height: 30,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        this.sexCheckBoxUi(userBg,this.user.sex);

        Util.newText({
            text: "手机："+this.user.tel,
            textColor: [0,0,0],
            x: 90,
            y: 68,
            width: 150,
            height: 30,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        Util.newText({
            text: "等级称号："+this.user.grade,
            textColor: [0,0,0],
            x: 370,
            y: 68,
            width: 150,
            height: 30,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })
    }

    sexCheckBoxUi(bg,sex){
        let man = Util.newSprite({
            texture: "gerenzhongxin/ck_sex.png",
            x: 150,
            y: 40,
            addToScene: false,
            addTo: bg,
            width: 20,
            height: 20,
            clickCb:()=>{
                log("1111111111111111111111111111111")
                httpMgr.upsex();
                httpMgr.getUserInfo((d)=>{
                    this.ui(d.data)
                });
            }
        })

        Util.newText({
            text: "男",
            textColor: [0,0,0],
            x: 170,
            y: 35,
            width: 40,
            height: 30,
            addToScene: false,
            addTo: bg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        let woman = Util.newSprite({
            texture: "gerenzhongxin/ck_sex.png",
            x: 190,
            y: 40,
            addToScene: false,
            addTo: bg,
            width: 20,
            height: 20,
            clickCb:()=>{
                log("22222222222222222222222222222222")

                httpMgr.upsex();
                httpMgr.getUserInfo((d)=>{
                    this.ui(d.data)
                });
            }
        })

        Util.newText({
            text: "女",
            textColor: [0,0,0],
            x: 210,
            y: 35,
            width: 40,
            height: 30,
            addToScene: false,
            addTo: bg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })
        if (sex == "男"){
            Util.newSprite({
                texture: "gerenzhongxin/ck_sexOk.png",
                x: 0,
                y: 0,
                addToScene: false,
                addTo: man,
                width: 20,
                height: 20,
                clickCb:()=>{
                    log("aaaaaaaaaaaaaaaaaaa")
                }
            })
        }else {
            Util.newSprite({
                texture: "gerenzhongxin/ck_sexOk.png",
                x: 0,
                y: 0,
                addToScene: false,
                addTo: woman,
                width: 20,
                height: 20,
                clickCb:()=>{
                    log("bbbbbbbbbbbbbbbbbbbbbb")
                }
            })
        }
    }

    editNickname() {
        if (this.editUi){
            if (this.editUi.isHide()){
                this.editUi.setHide(false);
            } else {
                this.editUi.setHide(true);
            }
            return;
        }

        // 背景
        let sprite = Util.newSprite({
            texture: "transparency.png",
            x: 100,
            y: 30,
            width: 700,
            height: 100,
        })

        this.editUi = sprite;

        let nameEdit = Util.newEdit({
            texture:"shouye/zdy_bg_kuang.png",
            x: 0,
            y: 0,
            width: 200,
            height: 40,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf"
        });
        this.nameEdit = nameEdit;

        let submitButton = Util.newSprite({
            texture:"gerenzhongxin/submit.png",
            x: 300,
            y: 0,
            width: 80,
            height: 40,
            font:"fonts/st.ttf",
            addToScene: false,
            addTo: sprite,
            clickCb:()=>{
                this.editName();
            }
        });


        Util.newSprite({
            texture:"gerenzhongxin/cancel.png",
            x: 400,
            y: 0,
            width: 80,
            height: 40,
            addToScene: false,
            addTo: sprite,
            clickCb:()=>{
                this.editNickname();
            }
        });
    }

    editName(){
        log("editName");
        let name = this.nameEdit.getText();
        if (name.length < 1){
            return;
        }else {
            httpMgr.updateNickname(name,()=>{
            });

            httpMgr.getUserInfo((d)=>{
                let userinfo = d.data;
                this.ui(userinfo)
                GlobalVariable.userinfo = userinfo;
            });
        }
    }
}
