
// 物理引擎，碰撞演示

class Collision
{
     test()
    {
        // 创建场景
        this.scene = new Scene();
        this.scene.setColor(0.2,0.2,0.2,1);
        game.pushScene(this.scene);
        
        // 添加地面
        this.ground = new Sprite();
        this.ground.setPosition(0,300);
        this.ground.setSize(800,10);
        this.ground.setColor(0,1,0,1);
        this.ground.useBoxBody();
        this.scene.addNode(this.ground);
        
        // 添加方块1 蓝色
        this.sp1 = new Sprite();
        this.sp1.setSize(50,50);
        this.sp1.setColor(0, 0, 1, 1);
        this.sp1.setPosition(200,250);
        this.sp1.setMass(1);
        this.sp1.useBoxBody();
        this.scene.addNode(this.sp1);
        
        // 添加方块2 绿色
        this.sp2 = new Sprite();
        this.sp2.setSize(50,50);
        this.sp2.setColor(0, 1, 0, 1);
        this.sp2.setPosition(175,200);
        this.sp2.setMass(1);
        this.sp2.useBoxBody();
        this.scene.addNode(this.sp2);
        
        // 添加方块3 黄色
        this.sp3 = new Sprite();
        this.sp3.setSize(50,50);
        this.sp3.setColor(1, 1, 0, 1);
        this.sp3.setPosition(225,200);
        this.sp3.setMass(1);
        this.sp3.useBoxBody();
        this.scene.addNode(this.sp3);
        
        // 添加方块4 最上面的方块 红色
        this.sp4 = new Sprite();
        this.sp4.setSize(50,50);
        this.sp4.setColor(1, 0, 0, 1);
        this.sp4.setPosition(160,0);
        this.sp4.setMass(1);
        this.sp4.useBoxBody();
        this.scene.addNode(this.sp4);
         
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
    }
}

