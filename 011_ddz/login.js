class Login{
    name;
    pwd;
    pwd2;
    type = "login";
    constructor(){
        this.loginUi();
    }

    // 基础ui
    baseUi(){
        let {scene} = Util.bj({picture: "shouye/mainbj.jpg"});

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let left = w/6;
        let top = h/6;
        this.loginButton = Util.newSprite({
            texture:"login/ddz_dl.png",
            x: Util.w(12),
            y: Util.h(84),
            width: Util.w(25),
            height: Util.h(12),
            clickCb:()=>this.loginClick()
        })

        this.regButton = Util.newSprite({
            texture:"login/ddz_zc.png",
            x: Util.w(63),
            y: Util.h(84),
            width: Util.w(25),
            height: Util.h(12),
            clickCb:()=>this.zcClick()
        })
    };

    // 登录ui
    loginUi(){
        Util.stopMusic();

        this.baseUi();

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let sprite = Util.newSprite({
            texture:"login/ddz_dlbg.png",
            x: Util.w(13),
            y: Util.h(13),
            width: Util.w(80),
            height: Util.h(70),
        });

        Util.centerWidth(sprite);
        Util.centerHeight(sprite);

        this.quickLoginButton = Util.newSprite({
            texture:"login/ddz_ksdz.png",
            x: Util.w(68),
            y: Util.h(49),
            width: Util.w(17),
            height: Util.h(22),
            clickCb:()=>this.quickLoginClick()
        })

        let {x,y} = Util.getPosition(sprite);


        let left = w/4;
        let top = h/3;
        this.name = Util.newEdit({
            // texture:"login/edit.png",
            texture:"shouye/zdy_bg_kuang.png",
            x: Util.w(28),
            y: Util.h(51),
            width: Util.w(38),
            height: Util.h(7),
            font:"fonts/st.ttf"
        })

        this.pwd = Util.newEdit({
            // texture:"login/edit.png",
            texture:"shouye/zdy_bg_kuang.png",
            x: Util.w(28),
            y: Util.h(64),
            width: Util.w(38),
            height: Util.h(7),
            text:"123456",
            font:"fonts/st.ttf"
        })
    }

    // 注册ui
    regUi(){
        this.baseUi();

        let w = game.getWindow().getWidth();
        let h = game.getWindow().getHeight();

        let sprite = Util.newSprite({
            texture:"login/ddz_zcbg.png",
            x: Util.w(10),
            y: Util.h(13),
            width: Util.w(80),
            height: Util.h(70),
        });

        this.quickLoginButton = Util.newSprite({
            texture:"login/ddz_ksdz.png",
            x: Util.w(68),
            y: Util.h(49),
            width: Util.w(17),
            height: Util.h(22),
            clickCb:()=>this.quickLoginClick()
        })

        let left = w/4+90;
        let top = h/3;
        this.name = Util.newEdit({
            // texture:"login/edit.png",
            texture:"shouye/zdy_bg_kuang.png",
            x: Util.w(31),
            y: Util.h(46),
            width: Util.w(35),
            height: Util.h(7),
            font:"fonts/st.ttf"
        })

        this.pwd = Util.newEdit({
            // texture:"login/edit.png",
            texture:"shouye/zdy_bg_kuang.png",
            x: Util.w(31),
            y: Util.h(58),
            width: Util.w(35),
            height: Util.h(7),
            text:"123456",
            font:"fonts/st.ttf"
        })


        this.pwd2 = Util.newEdit({
            // texture:"login/edit.png",
            texture:"shouye/zdy_bg_kuang.png",
            x: Util.w(31),
            y: Util.h(69),
            width: Util.w(35),
            height: Util.h(7),
            text:"123456",
            font:"fonts/st.ttf"
        })


    }

    // 登录
    loginClick(){
        Util.playSound();
        let type = this.type;
        log(type)
        if (type == "login") {
            let name = this.name.getText();
            let pwd = this.pwd.getText();
            if (name.length > 0 && pwd.length > 0) {
                httpMgr.login(name, pwd, (dat)=> {
                    if(dat["status"]==1) {
                        const data = dat["data"];
                        GlobalVariable.uid = data["id"];
                        GlobalVariable.userinfo = data;
                        GlobalVariable.userPic = data["pic"];
                        socketIoMgr.init(GlobalVariable.uid);
                        this.tomainView();
                    }else{
                        log(dat["msg"]);
                    }
                });
            }
        }else{
            this.loginUi();
            this.type = "login";
        }
    }

    // 注册按钮点击
    zcClick(){
        Util.playSound();
        let type = this.type;
        log(type)
        if (type == "login"){
            this.regUi();
            this.type = "reg";
            return;
        }else {
            const name = this.name.getText();
            const pwd =  this.pwd.getText();
            const pwd2 = this.pwd2.getText();
            if(pwd!=pwd2){
                log("两次密码不一致");
                return;
            }
            if(name.length>0 &&pwd.length>0)
            {
                httpMgr.zhuce(name,pwd,(dat)=>{
                    if(dat["status"]==1) {
                        this.tomainView();
                    }
                    else{
                        log(dat["msg"]);
                    }
                });

            }

        }
    }

    // 快速登录
    quickLoginClick() {
        Util.playSound();
        httpMgr.login("15037667644","123456",(dat)=>{
            if(dat["status"]==1) {
                const data = dat["data"];
                GlobalVariable.uid = data["id"];
                GlobalVariable.userinfo = data;
                GlobalVariable.userPic = data["pic"];

                socketIoMgr.init(GlobalVariable.uid);
                this.tomainView();
            }else{
                log(dat+"");
            }
        });
    }

    // 跳转到主界面
    tomainView(){
        new MainPage();
    }

}
