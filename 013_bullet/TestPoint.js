
// 物理引擎，点对点约束演示

class TestPoint {
    
    constructor() {
        this.scene = new Scene(); // 创建场景
        game.pushScene(this.scene);
        
        var line = new Node();
        line.setPosition(400,0);
        line.setSize(1,600);
        line.setColor(0,0,0,1);
        this.scene.addNode(line);
        
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
        
        this.onePoint();   
        this.twoPoint();
    }

    // 一个点   
    onePoint(){
        var ballBg = game.getResource().getTexture("yuan.png");
        
        var sp1 = new Sprite();
        sp1.setPosition(185,185);
        sp1.setSize(30,30);
        sp1.setTexture(ballBg);
        sp1.setMass(1);      // 刚体质量
        sp1.useSphereBody(); // 圆形刚体
        sp1.setSpeed(20,0);  // 初始速度     
        this.scene.addNode(sp1);
        
        // 钟摆
        var pointConstraint = new  BulletPoint2Point();       // 新建约束点
        pointConstraint.setData(sp1,0,60);              // 设置一个约束点
        this.scene.addPointConstraint(pointConstraint); // 场景添加约束点
        
        // 红色中间点
        this.s1 = new Node();
        this.s1.setPosition(197,257);
        this.s1.setSize(6,6);
        this.s1.setColor(1,0,0,1);
        this.scene.addNode(this.s1);
        
        //this.scene.addNode(lab2);
    }
    
    // 两个点
    twoPoint()
    {
        var ballBg = game.getResource().getTexture("yuan.png");
        
        // 刚体1
        var sp1 = new Sprite();
        sp1.setPosition(585,185);
        sp1.setSize(30,30);
        sp1.setTexture(ballBg);
        sp1.setMass(1);      // 刚体质量
        sp1.useSphereBody(); // 圆形刚体
        sp1.setSpeed(20,0);  // 初始速度       
        this.scene.addNode(sp1);
        sp1.setCentralForce(0,-9.7);
        
        // 刚体2
        var sp2 = new Sprite();
        sp2.setPosition(585,215);
        sp2.setSize(30,30);
        sp2.setTexture(ballBg);
        sp2.setMass(1);
        sp2.useSphereBody();
        sp2.setCentralForce(0,-9.8);
        //sp2.setSpeed(20,0);      
        this.scene.addNode(sp2);
        
        var pointConstraint = new  BulletPoint2Point();       // 新建约束点
        pointConstraint.set2Data(sp1,0,60,sp2,10,0);    // 设置两个约束点
        this.scene.addPointConstraint(pointConstraint); // 场景添加约束点
    }
}

