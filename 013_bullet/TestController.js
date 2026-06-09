
// 物理引擎，角色

class TestController
{
   
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
     
        // 创建地面
        var gound = new Sprite();
        gound.setPosition(0,300); // 地面高度500
        gound.setSize(800,35);
        gound.setColor(0,1,1,1);
        gound.useBoxBody();
        this.scene.addNode(gound);
        
        // 大方块
        this.user = new Sprite();
        this.user.setPosition(400,200);
        this.user.setSize(50,100);
        this.user.setColor(0.5,1,0,1);
        this.user.useCapsuleShape();// 使用胶囊模型
        
        this.user.setJumpSpeed(120);// 跳跃速度
        var jumpSpeed = this.user.getJumpSpeed(); // 获取跳跃速度值
        log("JumpSpeed = " + jumpSpeed);
        
        this.user.setFallSpeed(120);// 下落速度
        var fallSpeed = this.user.getFallSpeed(); // 获取下落速度值
        log("FallSpeed = " + fallSpeed);
        
        this.user.setStepHeight(100);// 设置取角色可跨越的最大台阶高度，小于这个高度无法跨越
        var stepHeight = this.user.getStepHeight(); // 获取角色可跨越的最大台阶高度
        log("StepHeight = " + stepHeight);
        
        this.scene.addNode(this.user);
        
        // 小方块，看看是否可以跨越过去
        var taijie = new Sprite();
        taijie.setPosition(600,295); // 地面高度是500，台阶高度是10，此时高出地面5
        taijie.setSize(10,10); // 方框大小，这个高度角色可以跨过去，前面设置是100，如果小于5就跨不过去
        taijie.setColor(0.5,1,0.5,1);
        taijie.useBoxBody();
        this.scene.addNode(taijie);
        
        var tiaoyue = new Label();
        tiaoyue.setPosition(700,0);
        tiaoyue.setSize(80,30);
        tiaoyue.setFont("font/st.ttf",20);
        tiaoyue.setText("跳跃");
        tiaoyue.click((type,x,y)=>{
            this.user.jump(); // 角色向上跳跃
        });
        this.scene.addNode(tiaoyue);
        
        // 前进按钮
        var qianjin = new Label();
        qianjin.setPosition(700,50);
        qianjin.setSize(80,30);
        qianjin.setFont("font/st.ttf",20);
        qianjin.setText("前进");
        qianjin.click((type,x,y)=>{
            this.user.setMaxSlope(30);              // 设置角色最大爬坡角度（度数）
            var maxSlope = this.user.getMaxSlope(); // 获取角色最大爬坡角度（度数）
            log("MaxSlope = " + maxSlope);
            
            this.user.setMoveSpeed(5,5); // 水平向右前进
            var move = this.user.getMoveSpeed(); // 获取角色移动速度
            log("MoveSpeed x = " + move.x + " MoveSpeed y = " + move.y);
            
            var isGrounded = this.user.onGround(); // 检测角色是否站在地面上，当跳跃时false
            log("isGrounded = " + isGrounded);
            
            var pressed = this.user.isPress(); // 检测按键是否被按下
            log("pressed = " + pressed);
        });
    
        qianjin.upDate((time)=>{ // 前进按钮的回调
             // 点击时，如果在地面则跳跃
            if (this.user.isPress() && this.user.onGround()) {
                log("isPress-----------------------------------------------");
                this.user.jump();
            }
        });
        
        this.scene.addNode(qianjin);
        
        // 后退按钮
        var houtui = new Label();
        houtui.setPosition(700,100);
        houtui.setSize(80,30);
        houtui.setFont("font/st.ttf",20);
        houtui.setText("后退");
        houtui.click((type,x,y)=>{
            this.user.setMoveSpeed(-5,0); // 水平向左后退
        });
        this.scene.addNode(houtui);

        // 停止按钮            
        var tingzhi = new Label();
        tingzhi.setPosition(700,150);
        tingzhi.setSize(80,30);
        tingzhi.setFont("font/st.ttf",20);
        tingzhi.setText("停止");
        tingzhi.click((type,x,y)=>{
            this.user.setMoveSpeed(0,0);
        });
        this.scene.addNode(tingzhi);
        
    }   
    
}


