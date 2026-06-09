
// 物理引擎，铰链约束演示

class TestHinge{
     
     constructor() {
        this.scene = new Scene();
        game.pushScene(this.scene);

        // 返回按钮        
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
            game.popScene();
        });
        this.scene.addNode(lab);
        
        // 刚体1，红色方块
        var n1 = new Node();
        n1.setPosition(200,300);
        n1.setSize(50,50);
        n1.setColor(1,0,0,1);
        n1.setMass(1);
        n1.useBoxBody();
        this.scene.addNode(n1);

        // 刚体2：绿色方框        
        var n2 = new Node();
        n2.setPosition(200,150);
        n2.setSize(100,5);
        n2.setColor(0,1,0,1);
        //n2.setMass(1);
        n2.useBoxBody();
        this.scene.addNode(n2);
        
        var hinge = new BulletHinge();        // 创建铰链约束类
        hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
        hinge.setLimit(30, 120);              // 设置铰链角度限制
        var min = hinge.getMin();             // 获取当前最小角度限制         
        var max = hinge.getMax();             // 获取当前最大角度限制      
        log("Min = " + min + " Max = " + max);
        this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
    }
}


