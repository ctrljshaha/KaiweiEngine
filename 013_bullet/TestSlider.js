
// 物理引擎，滑动约束演示

class TestSlider{

    constructor() {

        this.scene = new Scene(); // 创建新场景
        game.pushScene(this.scene);

        // 返回标签        
        var lab = new Label();
        lab.setPosition(0,0);
        lab.setSize(80,30);
        lab.setFont("font/st.ttf",20);
        lab.setText("返回");
        lab.click((type,x,y)=>{
        game.popScene();
        });
        this.scene.addNode(lab);
        
        // 约束节点1 红色方框
        this.n1 = new Node();
        this.n1.setPosition(10,300);
        this.n1.setSize(400,50);
        this.n1.setColor(1,0,0,1);
        this.n1.useBoxBody();
        this.scene.addNode( this.n1);
        
        // 约束节点2 绿色方块
        this.n2 = new Node();
        this.n2.setPosition(10,60);
        this.n2.setSize(30,30);
        this.n2.setColor(0,1,0,1);
        this. n2.setMass(1);
        this.n2.useBoxBody();
        this.scene.addNode( this.n2);
        
        this.testSlider =new BulletSlider();            // 滑动约束类
        this.testSlider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
        this.testSlider.setLowerLinLimit(-200);         // 设置线性滑动下限
        this.testSlider.setUpperLinLimit(200);          // 设置线性滑动上限
        this.testSlider.setTargetLinMotorVelocity(30.0); // 设置线性马达目标速度，给它一个向右运动的速度
        this.testSlider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
        this.testSlider.setPoweredLinMotor(true);       // 开启线性马达
        this.scene.addSliderConstraint(this.testSlider);// 场景增加滑动约束类
    }
}