
// 物理引擎，圆锥扭曲约束演示


/*
创建了一个静态红色底座 base 和一个绿色动态臂 arm。

使用 coneTwist.set2Data(base, 0, 20, arm, 0, -60) 将臂的底部连接到底座的顶部中心。

setLimit(30, 45) 限制扭转角度 ±30°，摆动圆锥半角 45°。

启用了马达并设置最大冲量，使关节能主动运动（配合外部力或速度更明显）。

添加了阻尼和调试绘制尺寸。
*/

class TestConeTwist {
    
    constructor() {
        this.scene = new Scene();               // 创建场景
        game.pushScene(this.scene);
        
        // 返回按钮
        var lab = new Label();
        lab.setPosition(0, 0);
        lab.setSize(80, 30);
        lab.setFont("font/st.ttf", 20);
        lab.setText("返回");
        lab.click((type, x, y) => {
            game.popScene();
        });
        this.scene.addNode(lab);
        
        // 静态底座（红色方块，作为固定端）
        var base = new Node();
        base.setPosition(300, 250);
        base.setSize(100, 40);
        base.setColor(1, 0, 0, 1);   // 红色
        base.useBoxBody();            // 不设置质量，默认为静态刚体
        this.scene.addNode(base);
        
        // 摆动臂（绿色方块，动态刚体）
        var arm = new Node();
        arm.setPosition(300, 200);
        arm.setSize(40, 120);
        arm.setColor(0, 1, 0, 1);     // 绿色
        arm.setMass(1);               // 质量1
        arm.useBoxBody();
        this.scene.addNode(arm);
        
        // 创建圆锥扭曲约束
        var coneTwist = new BulletConeTwist();
        // 连接 base 和 arm，锚点分别位于 base 顶部中心 (0,20) 和 arm 底部中心 (0,-60)
        coneTwist.set2Data(base, 0, 20, arm, 0, -180);
        
        // 设置摆动范围（圆锥半角）和扭转范围
        // 参数：swing1（绕局部X轴摆动半角），swing2（绕局部Y轴摆动半角），twist（绕Z轴扭转全角）
        // 以下设置：两个摆动轴限制为45°圆锥半角，扭转限制为±30°（全角60°）
        coneTwist.setLimit(45, 45, 60);    // 摆动45°圆锥，扭转±30°
        
        // 可选：启用马达并设置最大冲量，使关节有主动旋转能力
        coneTwist.enableMotor(true);
        coneTwist.setMaxMotorImpulse(5.0);
        
        // 设置阻尼，使运动更平缓
        coneTwist.setDamping(0.2);
        
        // 设置调试绘制大小（可视化辅助）
        coneTwist.setDbgDrawSize(20);
        
        // 将约束添加到场景
        this.scene.addConTwistConstraint(coneTwist);
        
        // 添加一个辅助点，显示锚点位置
        var anchorPoint = new Node();
        anchorPoint.setPosition(300, 220);   // base (300,350) + (0,20) 偏移 -> 350? 实际计算：base.y=350 + 20 = 370，但 arm 锚点在 arm.y=300-60=240，此处仅为视觉参考
        anchorPoint.setSize(5, 5);
        anchorPoint.setColor(1, 1, 0, 1);    // 黄色
        this.scene.addNode(anchorPoint);
        
        // 可选：给臂一个初始速度，展示摆动效果
        arm.setSpeed(10, 0);          // 初速度0
        // 或者施加一个瞬时力
        //arm.setCentralImpulse(100, 0);
    }
}

