/**
 * @class Card
 * @description 扑克牌逻辑与显示组件，支持点击弹起/落下状态切换
 */
class Card {
    /**
     * @constructor
     * @param {number} cardNum - 扑克牌数值 (0-51: 普通牌, 52: 小王, 53: 大王)
     */

    constructor(cardNum,x,y,isBack = false,width = 80,height=100,hide = false) {
        this.isSelected = false;
        this.cardNum = cardNum;
        // this.id = Math.floor(Math.random() * 100)+"_"+Math.floor(Math.random() * 100)+"_" + Math.floor(Math.random() * 100);
        // log("cardNum "+cardNum+", x "+x+", y "+y+", isBack "+isBack+", width "+width+", height "+height)
        this.init(x,y,isBack,width,height,hide);
    }

    /**
     * 初始化UI组件
     */
    init(x,y,isBack,width = 80,height=100,hide = false) {
        // Util.bj({picture: "ddzview/ddz_bg.png"});
        if(isBack){
            // 背景
            this.sprite = Util.newSprite({
                texture: "ddzview/ddz_pockerbg.png",
                x: x,
                y: y,
                width: width,
                height: height,
                addToScene:false,
                clickCb: () => this.onCardClick()
            });
        }else {
            // 背景
            this.sprite = Util.newSprite({
                texture: "cardbg/poker_bg.png",
                x: x,
                y: y,
                width: width,
                height: height,
                addToScene:false,
                clickCb: () => this.onCardClick()
            });

        }

        this.sprite.setHide(hide);

        // 数字标识 (左上角)
        this.numNode = Util.newSprite({
            addToScene: false,
            clickCb: () =>{ this.onCardClick()},
            x: width/12, y: height/16, width: width/4, height: height/4 });

        // 小花色 (数字下方)
        this.smallHsNode = Util.newSprite({
            addToScene: false,
            clickCb: () =>{ this.onCardClick()},
            x: width/8, y: height/3, width: width/5, height: height/6 });

        // 大中心图
        this.centerNode = Util.newSprite({
            addToScene: false,
            clickCb: () =>{ this.onCardClick()},
            x: width/4, y: height/3, width: width/2, height: height/2 });

        // 层级管理
        this.sprite.addNode(this.numNode);
        this.sprite.addNode(this.smallHsNode);
        this.sprite.addNode(this.centerNode);
        GlobalVariable.scene.addNode(this.sprite);

        this.setData(this.cardNum);
    }

    /**
     * 设置卡牌数据并刷新纹理
     * @param {number} num - 扑克牌索引值
     */
    setData(num) {
        if (num === undefined ) return;
        const cache = game.getResource();
        if(this.cardNum <0 && num >= 0){
            this.sprite.setTexture(cache.getTexture("cardbg/poker_bg.png"))
        }
        // log("set num : "+num )
        // log("set num : "+num +" id :"+this.id)
        this.cardNum = num;

        // 重置选中偏移
        if (this.isSelected) this.onCardClick();

        if (num === 52) { // 小王
            this.setJoker(cache, "poker_xw.png", "poker_0.png");
        } else if (num === 53) { // 大王
            this.setJoker(cache, "poker_dw.png", "poker_00.png");
        } else {
            this.setNormalCard(cache, num);
        }
    }

    /** @private 处理王牌逻辑 */
    setJoker(cache, centerTex, numTex) {
        let centerPath = `cardbg/${centerTex}`;
        let numPath = `cardbg/${numTex}`;

        this.centerNode.setTexture(cache.getTexture(centerPath));
        this.numNode.setTexture(cache.getTexture(numPath));
        this.smallHsNode.setHide(true);
        this.numNode.setHide(false);
    }

    /** @private 处理普通花色牌逻辑 */
    setNormalCard(cache, num) {
        this.smallHsNode.setHide(false);
        const hsType = Math.floor(num / 13); // 0:黑, 1:红, 2:梅, 3:方
        const val = (num % 13) + 1;

        // log("val: "+ val+" hsType: "+hsType);
        let hsPath, smallHsPath, colorPrefix;

        switch (hsType) {
            case 0: hsPath = "poker_hh.png"; smallHsPath = "poker_heitao.png"; colorPrefix = "poker_b"; break;
            case 1: hsPath = "poker_hht.png"; smallHsPath = "poker_ht.png"; colorPrefix = "poker_r"; break;
            case 2: hsPath = "poker_mm.png"; smallHsPath = "poker_mh.png"; colorPrefix = "poker_b"; break;
            default: hsPath = "poker_ff.png"; smallHsPath = "poker_fk.png"; colorPrefix = "poker_r"; break;
        }

        let centerPicture = `cardbg/${hsPath}`;
        let smallPicture = `cardbg/${smallHsPath}`;
        let path = `cardbg/${colorPrefix}${val}.png`;

        if(num < 0){
            centerPicture = `transparency.png`;
            smallPicture = `transparency.png`;
            path = `transparency.png`;
        }

        this.centerNode.setTexture(cache.getTexture(centerPicture));
        this.smallHsNode.setTexture(cache.getTexture(smallPicture));

        //log("centerPicture: "+ centerPicture + " smallPicture: "+smallPicture+ " colorPrefix: "+colorPrefix+" val: "+val);

        this.numNode.setTexture(cache.getTexture(path));
    }

    /**
     * 点击交互逻辑：实现卡牌弹起或落下
     */
    onCardClick() {
        // log("onCardClick: "+JSON.stringify(this));
        if(this.cardNum < 0 || this.sprite.isHide()){
            return;
        }
        Util.playSound();
        this.isSelected = !this.isSelected;

        const currentPos = this.sprite.getPosition();
        const offset = this.isSelected ? -10 : 10;

        // 仅修改根节点 Y 轴，子节点随动，优化性能
        this.sprite.setPosition(currentPos.x, currentPos.y + offset);
    }

    /**
     * 设置位置
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.sprite.setPosition(x, y);
    }

    /**
     * 添加到指定的父视图
     * @param {Node} view - 引擎的 Scene 或 Layer 对象
     */
    addToView(view) {
        if (view && view.addNode) {
            // view.addNode(this.sprite);
        }
    }

    getIsSelected() {
        return this.isSelected;
    }

    getCardValue() {
        return this.cardNum;
    }

    setHide(hide){
        if(hide){
            this.isSelected = false;
            this.hide = true;
        }else {
            this.hide = false;
        }
        this.sprite.setHide(hide);
    }

    isNotHide() {
        this.hide = this.sprite.isHide();
        return !this.sprite.isHide();
    }
}
