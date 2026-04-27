class Card {
	// 雷
	isbomb = false;
	// UI元素
	sprite_ = null;
	// 点击时间
	sTime =0;
	size = 0;
	// 0-8雷数  9雷
	category = 0;
	flip = false;
	row = 0;
	col = 0;
	flag=false;

	getSprite = function()
	{
		return this.sprite_;
	}

	constructor(scene,row,col,size,marginX,marginY)
	{
		this._scene = scene
		this.row = row;
		this.col = col;
		this.flip = false;
		this.flag = false;
		this.sTime = new Date().getTime();
		this.sprite_ = new Sprite();
		this.size = size;
		scene.addNode(this.sprite_);

		const cache_ = game.getResource();
		let bg = cache_.getTexture("leibg.png");
		this.sprite_.setTexture(bg);
		this.sprite_.setSize(size, size);
		let interval = size + 5;

		this.sprite_.setPosition(col*interval+marginX, row*interval+marginY);
		// 0是左键  1是右键
		this.sprite_.click((type,x,y)=>{
			log("sprite_click");
			this.clickHandle(type,x,y);
		})

		this.sprite_.longClick((type,x,y)=>{
			this.longHandler(type,x,y);
		})

	}

	longHandler(type,x,y){
		// 浏览器环境适配
		if(window){
			// 标记
			MineSweep.click(1,this.row,this.col);
		}
	}

	clickHandle(type,x,y){
		let time = new Date().getTime();
		const st = time - this.sTime;
		if(type ===0){
			if(st < 600)
			{
				// 双击
				log("双击");
				console.log("双击")
				MineSweep.click(2,this.row,this.col);
			}else {
				log("单击");
				console.log("单击")
				//click
				MineSweep.click(0,this.row,this.col);
			}
		}else if (type ===1){
			// 标记
			MineSweep.click(1,this.row,this.col);
		}

		this.sTime = time;
		this.changeStatus()
	}

	// 显示雷数量
	showLeiNum()
	{
		let num = this.category;
		let cache_ = game.getResource();
		let bg = cache_.getTexture("lei0.png");
		this.sprite_.setTexture(bg);

		let tsize = this.sprite_.getSize();
		// log("position:"+JSON.stringify(position)+" num:"+num);
		if(num!==9 && num!==0)
		{
			let lab = new Label();
			lab.setPosition((tsize.x-30)/2, (tsize.y-30)/2);
			lab.setSize(30, 30);
			lab.setFont("st.ttf", 20);
			lab.setText(" "+num);
			lab.setTextColor(1.0,1.0,1.0,1.0);
			lab.setColor(1.0,1.0,0.0,0);
			lab.click((type,x,y)=>{
				console.log("label click")
				log("label click")
				this.clickHandle(type,x,y);
			});

			lab.longClick((type,x,y)=>{
				console.log("label long click")
				log("label long click")
				this.longHandler(type,x,y);
			});

			this.sprite_.addNode(lab);
		}
	}

	// 改变状态
	changeStatus()
	{
		const cache_ = game.getResource();
		let bg = cache_.getTexture("leibg.png");
		if(this.flip && !this.flag)
		{
			if(this.category==9)
			{
				bg = cache_.getTexture("btlei.png");
				this.sprite_.setTexture(bg);
				//Play.gameEndLogic();
			}else {
				// bg = cache_.getTexture("lei0.png");
				// this.sprite_.setTexture(bg);
				this.showLeiNum();
			}
		}else {
			bg = cache_.getTexture("leibg.png");
			this.sprite_.setTexture(bg);
		}

		if(this.flag)
		{
			bg = cache_.getTexture("hongqi.png");
			this.sprite_.setTexture(bg);
		}

	}


}
