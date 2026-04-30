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
        let width = Util.w(87); // 700
        let height = Util.h(82); // 500
        let sprite = Util.newSprite({
            texture: "transparency.png",
            x: Util.w(12.5),
            y: Util.h(16),
            addToScene: false,
            widthCenter: true,
            width: width,
            height: height,
        })

        Util.newSprite({
            texture: "gerenzhongxin/user_bg.png",
            x: 0,
            y: 0,
            addToScene: false,
            addTo: sprite,
            width: width * 0.86,
            height: height * 0.9,
        })

        let close = Util.newSprite({
            texture: "gerenzhongxin/user_close.png",
            x: width * 0.82,
            y: 0,
            addToScene: false,
            addTo: sprite,
            width: height * 0.12,
            height: height * 0.12,
            clickCb: ()=>{
                new MainPage()
            }
        })

        // 用户信息
        this.userinfoUi(sprite);

        Util.newText({
            text: "我的资产：",
            textColor: [0,0,0],
            x: width * 0.15,
            y: height * 0.47,
            width: width * 0.23,
            height: height * 0.06,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })


        Util.newSprite({
            texture:"gerenzhongxin/user_kb.png",
            x: width * 0.28,
            y: height * 0.47,
            width: width * 0.23,
            height: height * 0.07,
            addToScene: false,
            addTo: sprite,
        });
        // 积分
        Util.newText({
            text: ""+this.user.score,
            textColor: [1,1,1],
            x: width * 0.35,
            y: height * 0.48,
            width: width * 0.23,
            height: height * 0.06,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })


        Util.newSprite({
            texture:"gerenzhongxin/user_fz_bg.png",
            x: width * 0.28,
            y: height * 0.58,
            width: width * 0.23,
            height: height * 0.07,
            addToScene: false,
            addTo: sprite,
        });
        // 欠钱
        Util.newText({
            text: ""+this.user.debt,
            textColor: [1,1,1],
            x: width * 0.35,
            y: height * 0.59,
            width: width * 0.23,
            height: height * 0.06,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        let {vitory,lose} = this.user.fight;
        Util.newText({
            text: "比赛胜场："+vitory,
            textColor: [0,0,0],
            x: width * 0.15,
            y: height * 0.68,
            width: width * 0.23,
            height: height * 0.06,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })
        Util.newText({
            text: "胜率："+(vitory/(vitory+lose)*100).toFixed(2)+"%",
            textColor: [0,0,0],
            x: width * 0.15,
            y: height * 0.76,
            width: width * 0.23,
            height: height * 0.06,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        GlobalVariable.scene.addNode(sprite);
    }

    userinfoUi(bg){
        let {width,height} = Util.getPosition(bg);
        let titleX = width * 0.62;
        let titleY = height * 0.14;

        let titleBg = Util.newSprite({
            texture: "gerenzhongxin/user_bt_l.png",
            x: titleX,
            y: titleY,
            addToScene: false,
            addTo: bg,
            width: width * 0.20,
            height: height * 0.1,
        })
        let titleBg2 = Util.newSprite({
            texture: "gerenzhongxin/user_info.png",
            x: titleX,
            y: titleY,
            addToScene: false,
            addTo: bg,
            width: width * 0.20,
            height: height * 0.1,
        })

        let userBg = Util.newSprite({
            texture: "gerenzhongxin/user_infobg.png",
            x: width * 0.03,
            y: height * 0.24,
            addToScene: false,
            addTo: bg,
            width: width * 0.8,
            height: height * 0.2,
        })

        Util.newText({
            text: "昵称："+this.user.nickname,
            textColor: [0,0,0],
            x: width * 0.13,
            y: 2,
            width: width * 0.43,
            height: height * 0.06,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        // 编辑昵称
        Util.newSprite({
            texture: "gerenzhongxin/ck_bj.png",
            x: width * 0.62,
            y: 5,
            addToScene: false,
            addTo: userBg,
            width: width * 0.13,
            height: height * 0.05,
            clickCb:()=>{
                this.editNickname();

            }
        })

        Util.newText({
            text: "性别：",
            textColor: [0,0,0],
            x: width * 0.13,
            y: height * 0.07,
            width: width * 0.2,
            height: height * 0.06,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        this.sexCheckBoxUi(userBg,this.user.sex);

        Util.newText({
            text: "手机："+this.user.tel,
            textColor: [0,0,0],
            x: width * 0.13,
            y: height * 0.13,
            width: width * 0.3,
            height: height * 0.06,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        Util.newText({
            text: "等级称号："+this.user.grade,
            textColor: [0,0,0],
            x: width * 0.53,
            y: height * 0.13,
            width: width * 0.3,
            height: height * 0.06,
            addToScene: false,
            addTo: userBg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })
    }

    sexCheckBoxUi(bg,sex){
        // 560 100
        let {width,height} = Util.getPosition(bg);
        let man = Util.newSprite({
            texture: "gerenzhongxin/ck_sex.png",
            x: width * 0.268,
            y: height * 0.4,
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
            x: width * 0.31,
            y: height * 0.35,
            width: width * 0.7,
            height: height * 0.3,
            addToScene: false,
            addTo: bg,
            font:"fonts/st.ttf",
            fontSize: 20,
        })

        let woman = Util.newSprite({
            texture: "gerenzhongxin/ck_sex.png",
            x: width * 0.36,
            y: height * 0.4,
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
            x: width * 0.4,
            y: height * 0.35,
            width: width * 0.07,
            height: height * 0.3,
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
        let width = Util.w(88); // 700
        let height = Util.w(12); // 100
        let sprite = Util.newSprite({
            texture: "transparency.png",
            x: Util.w(12),
            y: Util.h(5),
            width: width,
            height: height,
        })

        this.editUi = sprite;

        let nameEdit = Util.newEdit({
            texture:"shouye/zdy_bg_kuang.png",
            x: 0,
            y: 0,
            width: width * 0.28,
            height: height * 0.4,
            addToScene: false,
            addTo: sprite,
            font:"fonts/st.ttf"
        });
        this.nameEdit = nameEdit;

        let submitButton = Util.newSprite({
            texture:"gerenzhongxin/submit.png",
            x: width * 44,
            y: 0,
            width: width * 0.12,
            height: height * 0.4,
            font:"fonts/st.ttf",
            addToScene: false,
            addTo: sprite,
            clickCb:()=>{
                this.editName();
            }
        });


        Util.newSprite({
            texture:"gerenzhongxin/cancel.png",
            x: width * 0.57,
            y: 0,
            width: width * 0.12,
            height: height * 0.4,
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
