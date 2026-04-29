function GameOver(){
    this.jsui = new GameOverUI();
    this.init = function(){
        this.jsui.loadUI(this);
    };
    
    this.setData = function(data1,data2,data3)
    {
         var scene_ = scene.create();
         var cache_ = game.getResourceCache();
         var sound_ = cache_.getResourceSound("ddz/sound/special/Win.mp3");
        if(data1>0)
        {
            this.jsui.topfail.setVisible(false);
            this.jsui.topsu.setVisible(true);
            this.jsui.mylab.setText("+"+data1);
        }
        else
        {
            this.jsui.topfail.setVisible(true);
            this.jsui.topsu.setVisible(false);
            this.jsui.mylab.setText(""+data1);
            sound_ = cache_.getResourceSound("ddz/sound/special/Lose.mp3");
        }
        this.jsui.user1.setText(data2);
        this.jsui.user2.setText(data3);
        
         
         if (sound_)
       {
            var soundSource_ = scene_.createComponentSoundSource();
            soundSource_.setAutoRemoveMode('REMOVE_COMPONENT');
                soundSource_.play(sound_);
                soundSource_.setGain(0.75);
        }
    }
    this.setVisible = function(b)
    {
        this.jsui.bg.setVisible(b);
    }
    
    this.jxClick = function()
    {
        ddzview.newGame();
    }
    this.lkClick=function()
    {
        var root = game.getUI().getRoot();
        root.removeAllChildren();
        mainshow.init();
    }
}