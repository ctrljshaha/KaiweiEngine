


# 欢迎使用“开维游戏引擎” ！

<img src="https://www.ikaiwei.com/gamejs/api/res/pc100.jpg" width="1000">

## 一、简介

**开维游戏引擎（Kaiwei Engine）** 是一款基于JavaScript语法规范设计的游戏开发软件。引擎完全自主开发，底层由C++编写，逐步扩展实现JavaScript的跨平台运行。配套提供集成开发环境（IDE），支持JavaScript调试，支持一键打包生成多平台应用程序。功能持续完善中。

开维游戏引擎js代码跨平台通用，一次编写，多端运行。**支持导出exe、网页html、微信小游戏**。网页使用wasm运行，小游戏运行效率网页版和exe无太大差别，比原生javacript游戏引擎运行速度快数倍。

开维游戏引擎适合AI写小游戏、特效或功能模块。利用AI模型自动生成特效代码，代码短小精炼，函数简单易懂，200行左右即可完成独立功能。导出的html网页可以内嵌到各种网站、安卓苹果手机app中。

**开维引擎的底层是C++编写的高性能内核，通过V8引擎封装JavaScript接口，再通过WASM实现网页端高效运行。这意味着，虽然你用的是JavaScript，但实际执行效率远高于普通HTML5游戏引擎（如Phaser），接近原生应用。这一架构决定了它特别适合AI生成代码——因为AI模型只需理解JavaScript API层，无需关心底层C++实现，即可生成可直接运行的高效代码。因此以API为标准，避免参考其他引擎（如Unity或Cocos）的思维模式，否则容易混淆概念。**

**技术架构**

底层实现：完全自主研发，采用C++构建高性能引擎内核

脚本支持：基于JavaScript语法，实现跨平台运行

开发环境：提供IDE开发工具，支持代码调试与实时预览

发布系统：集成化打包工具，支持多平台应用生成

**开发优势**

简洁高效：提供简洁的游戏JavaScript游戏函数，降低学习门槛

功能强大：即使是简单的JavaScript代码也能实现丰富的游戏功能

成本低廉：JavaScript学习难度低，编写速度快，开发成本低

维护低廉：JavaScript代码易懂好改，维护成本低

**AI生成游戏**

自动生成：使用AI大模型，加上引擎提供的API知识库，可以自动生成JavaScript游戏代码，简单修改后即可使用，降低开发成本

**跨平台能力**

一次编写，多端运行。同一套JavaScript代码可生成：

桌面应用：Windows平台的EXE可执行文件

网页应用：标准HTML5网页应用程序

移动应用：安卓和苹果应用

小游戏平台：微信小游戏、抖音小游戏、快手小游戏

**应用场景**

开维游戏引擎不仅适用于游戏开发，还可广泛应用于：

数学与物理模拟演示

动画特效制作与预览

虚拟主播与实时交互内容

数字文化展览与虚拟展馆

**开维游戏引擎** 致力于为开发者提供一套完整、高效、易用的游戏开发解决方案，让游戏开发更简单，让创意实现更容易。

## 二、软件下载

游戏引擎： [https://www.ikaiwei.com/download/gamejs/kaiwei_gameide_setup.exe](https://www.ikaiwei.com/download/gamejs/kaiwei_gameide_setup.exe)

游戏源码：[https://www.ikaiwei.com/download/gamejs/example.zip](https://www.ikaiwei.com/download/gamejs/example.zip)

开发文档：[https://www.ikaiwei.com/gamejs/api/index.html](https://www.ikaiwei.com/gamejs/api/index.html)

帮助文档：[https://www.ikaiwei.com/download/gamejs/help.pdf](https://www.ikaiwei.com/download/gamejs/help.pdf)

游戏市场：[https://gamejs.ikaiwei.com/#/Market](https://gamejs.ikaiwei.com/#/Market)

支持Windows10及以上系统。

## 三、技术支持

官方技术交流群 QQ：702784617

官网：www.ikaiwei.com

## 四、部分游戏演示

**所有实例均可导出：windows版（exe）、网页版（html）、微信小游戏**

001.Hello world

网页版本：[https://www.ikaiwei.com/gamejs/example/001_HelloWorld_html/index.html](https://www.ikaiwei.com/gamejs/example/001_HelloWorld_html/index.html)

使用说明：[https://blog.csdn.net/weixin_41399197/article/details/158352011](https://blog.csdn.net/weixin_41399197/article/details/158352011)

windows版（exe）、网页版（html）、微信小游戏竖屏、微信小游戏横屏：

<img src="https://www.ikaiwei.com/gamejs/vid/001/0011.jpg" width="640" height="320" alt="演示动画">


002.游戏登录界面

网页版本：[https://www.ikaiwei.com/gamejs/example/002_Login_html/index.html](https://www.ikaiwei.com/gamejs/example/002_Login_html/index.html)

使用说明：[https://blog.csdn.net/weixin_41399197/article/details/158384807](https://blog.csdn.net/weixin_41399197/article/details/158384807)

<img src="https://www.ikaiwei.com/gamejs/vid/002/002.gif" width="480" height="360" alt="演示动画">


003.贪吃蛇

网页版本：[https://www.ikaiwei.com/gamejs/example/003_Snake_html/index.html](https://www.ikaiwei.com/gamejs/example/003_Snake_html/index.html)

使用说明：[https://blog.csdn.net/weixin_41399197/article/details/158423275](https://blog.csdn.net/weixin_41399197/article/details/158423275)

<img src="https://www.ikaiwei.com/gamejs/vid/003/003.gif" width="480" height="360" alt="演示动画">


005.2048小游戏

网页版本：[https://www.ikaiwei.com/gamejs/example/005_2048_html/index.html](https://www.ikaiwei.com/gamejs/example/005_2048_html/index.html)

使用说明：[https://blog.csdn.net/weixin_41399197/article/details/158385491](https://blog.csdn.net/weixin_41399197/article/details/158385491)

<img src="https://www.ikaiwei.com/gamejs/vid/005/005.gif" width="480" height="360" alt="演示动画">

006.扫雷

网页版本：[https://www.ikaiwei.com/gamejs/example/006_SaoLei_html/index.html](https://www.ikaiwei.com/gamejs/example/006_SaoLei_html/index.html)

<img src="https://www.ikaiwei.com/gamejs/vid/006/006.gif" width="480" height="480" alt="演示动画">

007.飞机大战

网页版本：[https://www.ikaiwei.com/gamejs/example/007_airplane_html/index.html](https://www.ikaiwei.com/gamejs/example/007_airplane_html/index.html)

使用说明：[https://blog.csdn.net/weixin_41399197/article/details/158508724](https://blog.csdn.net/weixin_41399197/article/details/158508724)

<img src="https://www.ikaiwei.com/gamejs/vid/007/007.gif" width="480" height="360" alt="演示动画">

010.五子棋

网页版本：[https://www.ikaiwei.com/gamejs/example/010_Gobang_html/index.html](https://www.ikaiwei.com/gamejs/example/010_Gobang_html/index.html)

<img src="https://www.ikaiwei.com/gamejs/vid/010/010.gif" width="480" height="360" alt="演示动画">

011.斗地主

网页版本：[https://www.ikaiwei.com/gamejs/example/011_ddz_html/index.html](https://www.ikaiwei.com/gamejs/example/011_ddz_html/index.html)

使用说明：[https://blog.csdn.net/weixin_41399197/article/details/160693124](https://blog.csdn.net/weixin_41399197/article/details/160693124)

<img src="https://www.ikaiwei.com/gamejs/vid/011/011.gif" width="480" height="360" alt="演示动画">

106.AI生成：俄罗斯方块

网页版本：[https://www.ikaiwei.com/gamejs/example/106_ai_tetris_html/index.html](https://www.ikaiwei.com/gamejs/example/106_ai_tetris_html/index.html)

AI步骤：[https://blog.csdn.net/weixin_41399197/article/details/158656433](https://blog.csdn.net/weixin_41399197/article/details/158656433)

<img src="https://www.ikaiwei.com/gamejs/vid/106/106.gif" width="480" height="360" alt="演示动画">

107.AI生成：飞翔的小鸟 FlappyBird

网页版本：[https://www.ikaiwei.com/gamejs/example/107_ai_flappybird_html/index.html](https://www.ikaiwei.com/gamejs/example/107_ai_flappybird_html/index.html)

AI步骤：[https://blog.csdn.net/weixin_41399197/article/details/158702071](https://blog.csdn.net/weixin_41399197/article/details/158702071)

<img src="https://www.ikaiwei.com/gamejs/vid/107/107.gif" width="280" height="500" alt="演示动画">

108.AI生成：愤怒的小鸟 angrybirds

网页版本：[https://www.ikaiwei.com/gamejs/example/108_ai_angrybirds_html/index.html](https://www.ikaiwei.com/gamejs/example/108_ai_angrybirds_html/index.html)

AI步骤：[https://blog.csdn.net/weixin_41399197/article/details/160691791](https://blog.csdn.net/weixin_41399197/article/details/160691791)

<img src="https://www.ikaiwei.com/gamejs/vid/108/108.gif" width="480" height="360" alt="演示动画">

109.AI生成：中国象棋

网页版本：[https://www.ikaiwei.com/gamejs/example/109_ai_xiangqi_html/index.html](https://www.ikaiwei.com/gamejs/example/109_ai_xiangqi_html/index.html)

AI步骤：[https://blog.csdn.net/weixin_41399197/article/details/160692436](https://blog.csdn.net/weixin_41399197/article/details/160692436)

<img src="https://www.ikaiwei.com/gamejs/vid/109/109.gif" width="480" height="550" alt="演示动画">

110.AI生成：水果忍者

网页版本：[https://www.ikaiwei.com/gamejs/example/110_ai_fruit_html/index.html](https://www.ikaiwei.com/gamejs/example/110_ai_fruit_html/index.html)

AI步骤：[https://blog.csdn.net/weixin_41399197/article/details/160692785](https://blog.csdn.net/weixin_41399197/article/details/160692785)

<img src="https://www.ikaiwei.com/gamejs/vid/110/110.gif" width="480" height="360" alt="演示动画">

## 五、全部实例演示

普通代码 游戏演示视频：

[https://www.ikaiwei.com/gamejs/api/index.html#/zh-cn/docs/example/example](https://www.ikaiwei.com/gamejs/api/index.html#/zh-cn/docs/example/example)

AI代码 游戏演示视频：

[https://www.ikaiwei.com/gamejs/api/index.html#/zh-cn/docs/example/example_ai](https://www.ikaiwei.com/gamejs/api/index.html#/zh-cn/docs/example/example_ai)







# game游戏类

##  init()

> `初始化游戏引擎`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
game.init() // game为游戏引擎全局类，直接调用不用new
```

[共享实例1](../share/001_HelloWorld.md ':include')

##  initSize(w, h)

> `初始化游戏引擎，并设置主窗口宽度和高度`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
game.initSize(1024, 768); // 设置游戏主窗口大小，1024*768
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| w | `int`   | 游戏主窗口宽度|
| h | `int`   | 游戏主窗口高度 |

[共享实例](../share/001_HelloWorld.md ':include')

##  getResource()

> `获取游戏资源对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 初始化游戏引擎
game.init(); // 默认窗口大小为800*600
 
// 获取图片等资源
var res = game.getResource(); // 获取资源对象
var texture = res.getTexture("img/logo.png"); // 获取具体资源对象
//var texture = game.getResource().getTexture("img/logo.png"); // 另一种获取资源写法
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| res | `object` | 资源对象 |

[共享实例](../share/001_HelloWorld.md ':include')

##  getWindow()

> `获取游戏窗口对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 初始化游戏引擎
game.init(); // 默认窗口大小为800*600
 
// 主窗口设置
var window = game.getWindow(); //获取游戏窗口
window.setIcon(texture); // 设置窗口图标
window.setTitle("开维游戏引擎（Game.js）"); // 设置窗口标题
var w = window.getWidth(); // 屏幕宽带
var h = window.getHeight(); // 屏幕高度
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| win | `object` | 游戏窗口对象 |

##  getSystemName()

> `获取系统平台名称：WINDOWS、WEB、WEIXIN`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 初始化游戏引擎， 根据平台设置屏幕分辨率
var system = game.getSystemName(); // 获取系统名称
if (system =="WINDOWS")
    game.init() // 默认窗口大小为800*600
else if (system =="WEB")
    game.init() // 默认为全屏 
else if(system =="WEIXIN")
    game.initSize(canvas.width,canvas.height); // 微信窗口。微信因为有大小限制，字体库需用工具精简大小
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| SysName | `string` | 返回系统平台名称：WINDOWS、WEB、WEIXIN <br> **WINDOWS**：windows平台，导出exe  <br>  **WEIXIN**：微信小游戏平台，导出微信小游戏工程 <br> **WEB**：浏览器平台，导出网页。浏览器所在平台需区分：PC下的浏览器 或 手机pad下的浏览器 <br> 由于导出的安卓是浏览器+wasm的方式，所以需要判断安卓手机下浏览器的分辨率 |

[共享实例](../share/001_HelloWorld.md ':include')

##  getOS()

> `web页面所在的操作系统。用于浏览器中加载wasm引擎时，读取的操作系统。`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// ----------------------------------------------------------------------------------------------
// 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName();         // 获取系统名称：WINDOWS、WEB、WEIXIN
var webOS = game.getOS();                  // web页面所在的操作系统：Windows、macOS、Linux、Android、iOS、Unknown OS
var webDeviceType = game.getDeviceType();  // web页面所在的设备类型：PC、Phone、Pad
var webDpr = game.getDpr();                // web页面dpr值
var w, h;       // 屏幕宽高
var window;     // 窗口变量
var screenType; // 横屏还是竖屏
  
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone" && webOS == "Android")   // 安卓手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); 
    else if (webDeviceType == "Pad" && webOS == "Android")     // 安卓pad上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); 
    else if (webDeviceType == "Phone" && webOS == "iOS")       // 苹果手机上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); 
    else if (webDeviceType == "Pad" && webOS == "iOS")         // 苹果pad上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); 
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| webOS | `string` | 系统平台名称，返回字符串：Windows、macOS、Linux、Android、iOS、Unknown OS |

[共享实例](../share/001_HelloWorld.md ':include')

##  getDeviceType()

> `web页面所在的设备类型：PC、Phone、Pad。用于浏览器中加载wasm引擎时，读取的设备信息，区分PC、手机、pad`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// ----------------------------------------------------------------------------------------------
// 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName();         // 获取系统名称：WINDOWS、WEB、WEIXIN
var webOS = game.getOS();                  // web页面所在的操作系统：Windows、macOS、Linux、Android、iOS、Unknown OS
var webDeviceType = game.getDeviceType();  // web页面所在的设备类型：PC、Phone、Pad
var webDpr = game.getDpr();                // web页面dpr值
var w, h;       // 屏幕宽高
var window;     // 窗口变量
var screenType; // 横屏还是竖屏
  
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone" || webDeviceType == "Pad")         // 手机pad上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| webDeviceType | `string` | 设备名称，返回字符串：PC、Phone、Pad |

[共享实例](../share/001_HelloWorld.md ':include')

##  getDpr()

> `web页面所在的设备dpr值。用于浏览器中加载wasm引擎时，读取的浏览器的dpr值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// ----------------------------------------------------------------------------------------------
// 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName();         // 获取系统名称：WINDOWS、WEB、WEIXIN
var webOS = game.getOS();                  // web页面所在的操作系统：Windows、macOS、Linux、Android、iOS、Unknown OS
var webDeviceType = game.getDeviceType();  // web页面所在的设备类型：PC、Phone、Pad
var webDpr = game.getDpr();                // web页面dpr值
var w, h;       // 屏幕宽高
var window;     // 窗口变量
var screenType; // 横屏还是竖屏
  
// 根据平台不同，设置屏幕分辨率
if (system == "WINDOWS")                       // windows平台
    game.init();                               // windows默认窗口大小为800*600，自适应
else if (system == "WEIXIN")                   // 微信小游戏
    game.initSize(canvas.width,canvas.height); // 微信窗口大小，默认横屏844*390，竖屏390*844
else if (system == "WEB") {                    // web平台，导出网页或安卓
    if (webDeviceType == "PC")                 // PC机上的浏览器
        game.init();                           // windows下浏览器默认窗口大小为800*600，自适应
    else if (webDeviceType == "Phone" || webDeviceType == "Pad")         // 手机pad上的浏览器
        game.initSize(canvas.width/webDpr,canvas.height/webDpr); // 安卓导出时的逻辑分辨率
}
 
// 获取屏幕宽度和高度
window = game.getWindow(); // 获取资源对象
w = window.getWidth();     // 屏幕宽带
h = window.getHeight();    // 屏幕高度
screenType = (w>h)?"Landscape":"Portrait"; // 横屏Landscape 竖屏Portrait
game.setFPS(60);           // 设置帧率
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| webDpr | `int` | dpr值。这个数值用于转换逻辑分辨率。<br>逻辑视口分辨率 (Viewport) = 物理发光分辨率(Physical) / 设备像素比 (DPR)<br> 安卓浏览器中，需要设定逻辑分辨率，和微信小游戏保持一致|

[共享实例](../share/001_HelloWorld.md ':include')

##  pushScene(scene)

> `设置游戏场景`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scene1 = new Scene(); // new场景类
var scene2 = new Scene(); // new场景类
var scene3 = new Scene(); // new场景类
scene1.setColor(0,0,0,1); // 设置场景颜色，填充黑色（r,g,b,a）
scene2.setColor(255,255,0,1); // 设置场景1颜色
scene3.setColor(255,255,0,1); // 设置场景3颜色
 
// 把场景1设置到游戏主窗口 
game.pushScene(scene1);  
  
// 场景1点击后进入场景2
scene1.onPress((x,y)=>{
    game.pushScene(scene2);  // 把场景设置到游戏主窗口
});
 
// 场景2点击后进入场景3
scene2.onPress((x,y)=>{
    game.pushScene(scene3);  // 把场景设置到游戏主窗口
});
 
// 场景3，第一次点击后返回场景2，之后的点击场显示场景1
var scene3num = 0;
scene3.onPress((x,y)=>{
    if (scene3num++==0)
        game.popScene(); // 返回上一个场景
    else
        game.replaceScene(scene1); // 替换成当前的场景
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| scene | `object`   | 场景类 |

[共享实例](../share/002_Login.md ':include')

##  popScene()

> `返回到上一个游戏场景`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scene1 = new Scene(); // new场景类
var scene2 = new Scene(); // new场景类
var scene3 = new Scene(); // new场景类
scene1.setColor(0,0,0,1); // 设置场景颜色，填充黑色（r,g,b,a）
scene2.setColor(255,255,0,1); // 设置场景1颜色
scene3.setColor(255,255,0,1); // 设置场景3颜色
 
// 把场景1设置到游戏主窗口 
game.pushScene(scene1);  
  
// 场景1点击后进入场景2
scene1.onPress((x,y)=>{
    game.pushScene(scene2);  // 把场景设置到游戏主窗口
});
 
// 场景2点击后进入场景3
scene2.onPress((x,y)=>{
    game.pushScene(scene3);  // 把场景设置到游戏主窗口
});
 
// 场景3，第一次点击后返回场景2，之后的点击场显示场景1
var scene3num = 0;
scene3.onPress((x,y)=>{
    if (scene3num++==0)
        game.popScene(); // 返回上一个场景
    else
        game.replaceScene(scene1); // 替换成当前的场景
});
```

[共享实例](../share/002_Login.md ':include')

##  replaceScene(scene)

> `替换游戏场景。把游戏主窗口中的场景替换成scene` <br>
> `如果scene存在，scene调整顺序，放到当前游戏主窗口` <br>
> `如果scene不存在，scene直接添加到当前游戏主窗口` <br>


* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scene1 = new Scene(); // new场景类
var scene2 = new Scene(); // new场景类
var scene3 = new Scene(); // new场景类
scene1.setColor(0,0,0,1); // 设置场景颜色，填充黑色（r,g,b,a）
scene2.setColor(255,255,0,1); // 设置场景1颜色
scene3.setColor(255,255,0,1); // 设置场景3颜色
 
// 把场景1设置到游戏主窗口 
game.pushScene(scene1);  
  
// 场景1点击后进入场景2
scene1.onPress((x,y)=>{
    game.pushScene(scene2);  // 把场景设置到游戏主窗口
});
 
// 场景2点击后进入场景3
scene2.onPress((x,y)=>{
    game.pushScene(scene3);  // 把场景设置到游戏主窗口
});
 
// 场景3，第一次点击后返回场景2，之后的点击场显示场景1
var scene3num = 0;
scene3.onPress((x,y)=>{
    if (scene3num++==0)
        game.popScene(); // 返回上一个场景
    else
        game.replaceScene(scene1); // 替换成当前的场景
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| scene | `object`   | 场景类 |

[共享实例](../share/002_Login.md ':include')

##  run()

> `运行游戏引擎`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
game.init()
```

[共享实例](../share/001_HelloWorld.md ':include')

##  setFPS(fps)

> `设置游戏帧率 FPS(Frames Per Second)`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 设置游戏帧率，注意：设置高FPS但显示器不支持=浪费
game.setFPS(30);  // 适合简单游戏、手机游戏
game.setFPS(60);  // 标准流畅度（匹配60Hz显示器）
game.setFPS(144); // 电竞级别（需要144Hz显示器）
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| fps | `float`   | 帧率值 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setKeyCallBack(fun)

> `设置键盘回调函数，用于操控游戏，键值参考帮助文档中的键值表`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
//  设置游戏键盘回调函数
game.setKeyCallBack(funCallBack_Key);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| fun | `object`   | 键盘回调函数 [跳转键盘键值表](zh-cn/docs/base/keyboard.md)|

* 
图表
<img src="res/base_keyboard.png" width="900">

[共享实例](../share/001_HelloWorld.md ':include')



#  Audio音乐类

##  getMusicVolume()

> `获取音乐音量值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nVal | `int`   | 背景音乐音量值 |

[共享实例](../share/002_Login.md ':include')
 
##  getSoundVolume()

> `获取音效音量值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nVal | `int`   | 音效音量值 |

[共享实例](../share/002_Login.md ':include')
 
##  playMusic(path)

> `播放音乐，循环播放。支持wav,mp3,ogg格式。设置游戏主旋律、场景BGM、菜单背景音乐`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类 
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| path | `string`   | 音乐存放路径 |

[共享实例](../share/002_Login.md ':include')

##  playMusicOne(path)

> `播放音乐，仅播放一次。支持wav,mp3,ogg格式`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| path | `string`   | 音乐存放路径 |

[共享实例](../share/002_Login.md ':include')

##  playSound(path)

> `播放音效，仅播放一次。游戏中的动作反馈音效、UI音效包括：按钮点击声、枪声、脚步声、爆炸声、技能音效等`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| path | `string`   | 音乐存放路径 |

[共享实例](../share/002_Login.md ':include')

##  setMusicVolume(val)

> `设置音乐音量值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| var | `int`   | 音乐音量值 |

[共享实例](../share/002_Login.md ':include')
 
##  setSoundVolume(val)

> `设置音效音量值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| var | `int`   | 音效音量值 |

[共享实例](../share/002_Login.md ':include')
 
##  stopMusic()

> `停止播放音乐`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 音频全局变量，一个音频变量即可，所有声音都用这个类。声音放在前面初始化
var audio = new Audio(); // 定义全局音乐类
 
audio.playMusic("sound/bg.ogg"); // 播放背景音乐，循环播放
//audio.stopMusic(); // 停止当前背景音乐
//audio.playMusicOne("sound/bg.ogg"); // 播放音乐，仅播放一次
//audio.playMusic("sound/1.wav");
//audio.playMusic("sound/Normal2.mp3");
audio.playSound("sound/1.wav"); // 循环音效，例如按钮点击声、脚步声、爆炸声、技能音效
 
audio.setMusicVolume(val*1.0/max); // 设置背景音乐音量大小值
audio.setSoundVolume(0.5); // 设置音效音量大小值
var MusicVal = audio.getMusicVolume(); // 获取背景音乐音量大小值
var SoundVal = audio.getSoundVolume();// 获取音效音量大小值
```

[共享实例](../share/002_Login.md ':include')



#  Edit编辑框类

[支持Label类函数，点击查看](zh-cn/docs/windows/Label.md)

[支持Sprite类函数，点击查看](zh-cn/docs/windows/Sprite.md)

[支持Node类函数，点击查看](zh-cn/docs/windows/Node.md)

##  getText()

> `获取编辑框数据`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resEditBg = game.getResource().getTexture("img/edit.png"); // 获取纹理数据对象
var editName = new Edit(); // 新建编辑框
editName.setTexture(resEditBg); // 设置底图
editName.setPosition(290, 340); // 编辑框的位置，横坐标和纵坐标
editName.setSize(180, 60); // 编辑框的大小，宽度和高度
editName.setFont("font/st.ttf", 20); // 编辑框的汉字字库，字体大小，必不可少
scene.addNode(editName);  // 加入到场景中
 
var edittext = editName.getText(); // 点击时，读取edit框内容
log(edittext);
```

[共享实例](../share/002_Login.md ':include')
 
##  setPubText(str)

> `设置编辑框内容`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| str | `string` | 设置编辑框内容 |

[共享实例](../share/002_Login.md ':include')

##  setPosition(x,y)

> `设置编辑框的位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var editName = new Edit(); // 新建编辑框
editName.setPosition(290, 340); // 编辑框的位置，横坐标和纵坐标
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 标签在游戏界面中的横坐标 |
| y | `int` | 标签在游戏界面中的纵坐标 |

[共享实例](../share/002_Login.md ':include')

##  setPadding(x)

> `设置编辑框中光标的输入位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var editName = new Edit(); // 新建编辑框
editName.setTexture(resEditBg); // 设置底图
editName.setPosition(290, 340); // 编辑框的位置，横坐标和纵坐标
editName.setPadding(10); // 编辑框中开始输入的地方
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 编辑框开始输入的坐标 |

[共享实例](../share/002_Login.md ':include')




#  http网络类

##  get(url,f)
> `http get请求异步请求`

* *权限: 无障碍权限*

* 语法
```js
http.get(url,f)
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| url | `String` | 请求url |
| f | `Object` | {function} 回调函数 |

* 实例

```js
var http = new Http();
http.get("https://ctrljs.ikaiwei.com/api/test/request_logs.do?sf=sf",(str)=>{
    log(str);
});
http.post("https://ctrljs.ikaiwei.com/api/test/request_logs.do?","sff=sf111&se=1",(str)=>{
});
```

##  post(url,data,f)
> `http post请求异步请求`

* *权限: 无障碍权限*

* 语法
```js
 http.post(url,data,f)
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| url | `String` | 请求url |
| data | `String` | 参数 JSON格式 |
| f | `Object` | {function} 回调函数 |

* 实例

```js
var http = new Http();
http.get("https://ctrljs.ikaiwei.com/api/test/request_logs.do?sf=sf",(str)=>{
    log(str);
});
http.post("https://ctrljs.ikaiwei.com/api/test/request_logs.do?","sff=sf111&se=1",(str)=>{
});
```




#  Label标签类

[支持Sprite类函数，点击查看](zh-cn/docs/windows/Sprite.md)

[支持Node类函数，点击查看](zh-cn/docs/windows/Node.md)

##  click(type,x,y)

> `点标标签回调函数`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var lab = new Label(); 
lab.setText("Hello world！\n\n你好，世界！"); // 标签文字
lab.click((type,x,y)=>{ // 标签鼠标点击回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("点击: "+type+"\tx:"+x+"\ty:"+y);
})
lab.longClick((type,x,y)=>{ // 标签鼠标长按回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("长按: "+type+"\tx:"+x+"\ty:"+y);
})
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| type | `int` | 鼠标类型：0-左键；1-右键。注意：在网页和微信小游戏中，右键失效 |
| x | `int` | 鼠标横坐标 x |
| y | `int` | 鼠标纵坐标 y |

[共享实例](../share/001_HelloWorld.md ':include')

##  longClick(type,x,y)

> `长按标签回调函数`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var lab = new Label(); 
lab.setText("Hello world！\n\n你好，世界！"); // 标签文字
lab.click((type,x,y)=>{ // 标签鼠标点击回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("点击: "+type+"\tx:"+x+"\ty:"+y);
})
lab.longClick((type,x,y)=>{ // 标签鼠标长按回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("长按: "+type+"\tx:"+x+"\ty:"+y);
})
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| type | `int` | 鼠标类型：0-左键；1-右键。注意：在网页和微信小游戏中，右键失效 |
| x | `int` | 鼠标横坐标 x |
| y | `int` | 鼠标纵坐标 y |

[共享实例](../share/001_HelloWorld.md ':include')

##  setFont(path,size)

> `设置标签上显示文字的字体大小`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var lab = new Label();
lab.setFont(path,size)
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| path | `string` | 字体库所在路径 |
| size | `int`    | 字体大小       |

[共享实例](../share/001_HelloWorld.md ':include')

##  setPosition(x,y)

> `设置标签在游戏界面的位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var lab = new Label();
lab.setPosition(x,y)
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 标签在游戏界面中的横坐标 |
| y | `int` | 标签在游戏界面中的纵坐标 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setText(text)

> `设置标签上显示的文字内容`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var lab = new Label();
lab.setText(text)
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| text | `string` | 设置标签显示的字符串|

[共享实例](../share/001_HelloWorld.md ':include')

##  setTextColor(r,g,b,a)

> `设置标签上文字的颜色值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var lab = new Label();
lab.setTextColor(r,g,b,a)
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| r | `int`   | R通道颜色的int值 |
| g | `int`   | G通道颜色的int值 |
| b | `int`   | B通道颜色的int值 |
| a | `float` | A不透明度0~1的值，0为完全透明，1为完全不透明 |

[共享实例](../share/001_HelloWorld.md ':include')



#  Node节点类

`基础类，很多界面元素基于该类`

##  addNode(node)
> `把子节点加入父节点中`

* 语法
```js
// 左上角显示一个绿色小方块，中间有个蓝色小方块。先设置成红色，然后设置成蓝色
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
node.setSize(20,20);    // 设置节点宽，高
node.setColor(0,1,0,0.5);  // 设置节点颜色
 
var node1 = new Node(); // 新建子节点
node1.setPosition(2, 2);  // 节点位置横坐标，纵坐标
node1.setSize(10,10);    // 设置节点宽，高
node1.setColor(255,0,0,1);  // 设置节点颜色，红色
node.addNode(node1); // 把子节点添加到父节点中
node.removeNode(node1); // 把子节点删除
node.addNode(node1); // 再次把子节点添加到父节点中
var nodeArray = node.getNodes(); // 获取node节点数组对象数据，从0开始 
var nodeTemp = nodeArray[0]; // 获取第一个node对象
nodeTemp.setColor(0,0,255,1);  // 设置子节点颜色，蓝色
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| node | `object` | 节点对象 |

[共享实例](../share/002_Login.md ':include')

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| node | `object` | 节点对象 |

[共享实例](../share/002_Login.md ':include')

##  getColor()
> `获取节点颜色值`

* 语法
```js
var node = new Node(); // 新建节点
node.setColor(1,2,3,0.5);  // 设置节点颜色
var color = node.getColor(); // 获取节点颜色
log("获取节点颜色值为：r：" + color.x + "  g：" + color.y + "  b：" + color.z+ "  a：" + color.w);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| color | `object` | 颜色对象，对象4个值，分别为x,y,z,w |

[共享实例](../share/002_Login.md ':include')

##  getName()
> `设置节点文字`

* 语法
```js
var node = new Node(); // 新建节点
node.setName("Hello world"); // 设置节点文字
var name = node.getName(); // 获取节点文字
log("节点文字："+name);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| node | `object` | 节点对象 |

[共享实例](../share/002_Login.md ':include')

##  getNode()
> `获取节点`

* 语法
```js
// 左上角显示一个绿色小方块，中间有个蓝色小方块。先设置成红色，然后设置成蓝色
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
node.setSize(20,20);    // 设置节点宽，高
node.setColor(0,1,0,0.5);  // 设置节点颜色
 
var node1 = new Node(); // 新建子节点
node1.setPosition(2, 2);  // 节点位置横坐标，纵坐标
node1.setSize(10,10);    // 设置节点宽，高
node1.setColor(255,0,0,1);  // 设置节点颜色，红色
node.addNode(node1); // 把子节点添加到父节点中
var nodeArray = node.getNodes(); // 获取node节点数组对象数据，从0开始 
var nodeTemp = nodeArray[0]; // 获取第一个node对象
nodeTemp.setColor(0,0,255,1);  // 设置子节点颜色，蓝色
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| array | `object` | 节点数组对象 |

[共享实例](../share/002_Login.md ':include')

##  getPosition()
> `把节点加入到场景中`

* 语法
```js
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
var pos = node.getPosition(); // 获取节点坐标
log("节点横坐标x：" + pos.x + "节点纵坐标y：" + pos.y);
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pos | `object` | 坐标对象，该对象2个值，分别为x,y |

[共享实例](../share/002_Login.md ':include')

##  getRotate()
> `获取节点选择度`

* 语法
```js
var node = new Node(); // 新建节点
node.setRotate(90); // 设置节点选择角度0~360
var routate = node.getRotate(); // 获取节点选择角度
log("旋转角度为："+routate);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| node | `object` | 节点对象 |

[共享实例](../share/002_Login.md ':include')

##  getSize()
> `获取节点大小`

* 语法
```js
var node = new Node(); // 新建节点
node.setSize(20,20);    // 设置节点宽，高
var size = node.getSize(); // 获取节点大小
log("节点宽度：" + size.x + "节点宽度：" + size.y);
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| size | `object` | 大小对象，该对象2个值，分别为x,y  |

[共享实例](../share/002_Login.md ':include')

##  isContainPostion(x, y)
> `场景中，鼠标位置是否在节点之内`

* 语法
```js
// 场景中鼠标点击回调
scene.onPress((x,y)=>{
    if(sprAir.isContainPostion(x,y)) // 判断鼠标位置释放在精灵范围之内
    {
        // 点击精灵并计算位置，保留位置
        isPressPlane = true; // 按住精灵了
        offsetx = sprAir.getSprite().x-x; // 重新计算精灵横坐标
        offsety = sprAir.getPosition().y-y; // 重新计算精灵纵
    }
    else
    {
        // 没有命中精灵
        isPressPlane = false;
    }
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
|      x       | `int`          | 场景中鼠标横坐标 x               |
|      y       | `int`          | 场景中鼠标纵坐标 y               |


[共享实例](../share/002_Login.md ':include')

##  isHide()
> `获取节点是否隐藏`

* 语法
```js
var node = new Node(); // 新建节点
node.setHide(false); // 设置节点是否隐藏
var hide = node.isHide(); // 获取节点是否隐藏
log("node节点是否隐藏：" + hide);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| hide | `bool` | 是否隐藏 |

[共享实例](../share/002_Login.md ':include')

##  removeNode(node)
> `把节点从场景中删除`

* 语法
```js
// 左上角显示一个绿色小方块，中间有个蓝色小方块。先设置成红色，然后设置成蓝色
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
node.setSize(20,20);    // 设置节点宽，高
node.setColor(0,1,0,0.5);  // 设置节点颜色
 
var node1 = new Node(); // 新建子节点
node1.setPosition(2, 2);  // 节点位置横坐标，纵坐标
node1.setSize(10,10);    // 设置节点宽，高
node1.setColor(255,0,0,1);  // 设置节点颜色，红色
node.addNode(node1); // 把子节点添加到父节点中
node.removeNode(node1); // 把子节点删除
node.addNode(node1); // 再次把子节点添加到父节点中
var nodeArray = node.getNodes(); // 获取node节点数组对象数据，从0开始 
var nodeTemp = nodeArray[0]; // 获取第一个node对象
nodeTemp.setColor(0,0,255,1);  // 设置子节点颜色，蓝色
```
* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| node | `object` | 节点对象 |

[共享实例](../share/002_Login.md ':include')

##  setColor(r,g,b,a)

> `设置节点颜色值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var node = new Node(); // 新建节点
node.setColor(0,1,0,0.5);  // 设置节点颜色
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| r | `int`   | R通道颜色的int值 |
| g | `int`   | G通道颜色的int值 |
| b | `int`   | B通道颜色的int值 |
| a | `float` | A不透明度0~1的值，0为完全透明，1为完全不透明 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setHide(hide)
> `设置节点是否隐藏`

* 语法
```js
var node = new Node(); // 新建节点
node.setHide(false); // 设置节点是否隐藏
var hide = node.isHide(); // 获取节点是否隐藏
log("node节点是否隐藏：" + hide);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| hide | `bool` | 是否隐藏 |

[共享实例](../share/002_Login.md ':include')

##  setName(name)
> `设置节点文字`

* 语法
```js
var node = new Node(); // 新建节点
node.setName("Hello world"); // 设置节点文字
var name = node.getName(); // 获取节点文字
log("节点文字："+name);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `string` | 节点名称 |

[共享实例](../share/002_Login.md ':include')

##  setPosition(x,y)

> `设置节点位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标。
var point = node.getPosition(); // 获取节点坐标
log("节点横坐标x：" + point.x + "节点纵坐标y：" + point.y);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 横坐标 |
| y | `int` | 纵坐标 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setRotate(degree)
> `获取节点选择度`

* 语法
```js
var node = new Node(); // 新建节点
node.setRotate(90); // 设置节点选择角度0~360
var routate = node.getRotate(); // 获取节点选择角度
log("旋转角度为："+routate);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| degree | `int` | 旋转角度 |

[共享实例](../share/002_Login.md ':include')

##  setSize(x,y)

> `设置标签大小`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var node = new Node(); // 新建节点
node.setPosition(1, 1);  // 节点位置横坐标，纵坐标
node.setSize(10,10);    // 设置节点宽，高
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 标签的宽度 |
| y | `int` | 标签的高度 |

[共享实例](../share/001_HelloWorld.md ':include')

##  upDate(callback)
> `节点回调函数`

* 语法
```js
var node = new Node(); // 新建节点
node.upDate((time)=>{ // 设置帧率回调，如果不需要可以注释
 //log("Node callback");
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| callback | `object` | 回调函数 |

[共享实例](../share/002_Login.md ':include')

##  物理引擎

### useBoxBody

> `节点设置刚体：盒形`

* 语法
```js
node.useBoxBody();
```

* 形状
| 形状 | 特点 | 典型用途 |
|------|------|-------------|
| 盒形 | 棱角分明，稳定性好 | 箱子、墙壁、地面 |
| 球形 | 各向同性，滚动顺畅 | 弹珠、炮弹、滚球 |
| 胶囊形 | 直立、圆顶，适合模拟行走 | 角色控制器、人形NPC |

[共享实例](../share/013_bullet.md ':include')

### useSphereBody

> `节点设置刚体：球形`

* 语法
```js
node.useSphereBody();
```

* 形状
| 形状 | 特点 | 典型用途 |
|------|------|-------------|
| 盒形 | 棱角分明，稳定性好 | 箱子、墙壁、地面 |
| 球形 | 各向同性，滚动顺畅 | 弹珠、炮弹、滚球 |
| 胶囊形 | 直立、圆顶，适合模拟行走 | 角色控制器、人形NPC |

[共享实例](../share/013_bullet.md ':include')

### useCapsuleShape

> `节点设置刚体：胶囊形`<br>
> `角色碰撞常用：在游戏开发中（尤其是第三人称或第一人称角色），胶囊体比立方体更圆润，比球体更高，能更好地模拟人物、怪物的站立和移动姿态`<br>
> `运动顺滑：曲面边缘使得角色在爬坡、下台阶或贴着墙壁滑行时不容易卡住，碰撞响应更自然`<br>
> `物理性能：胶囊体的碰撞检测算法相对高效，且适合与球形、盒形等其他形状交互`<br>

* 语法
```js
node.useCapsuleShape();
```

* 形状
| 形状 | 特点 | 典型用途 |
|------|------|-------------|
| 盒形 | 棱角分明，稳定性好 | 箱子、墙壁、地面 |
| 球形 | 各向同性，滚动顺畅 | 弹珠、炮弹、滚球 |
| 胶囊形 | 直立、圆顶，适合模拟行走 | 角色控制器、人形NPC |

[共享实例](../share/013_bullet.md ':include')

### removeBody

> `节点删除刚体`

* 语法
```js
node.removeBody();
```

[共享实例](../share/013_bullet.md ':include')

### setMass

> `设置刚体质量`

* 语法
```js
node.setMass(1);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| mass | `number` | 质量值（大于0），无质量的物体是静止的 |

[共享实例](../share/013_bullet.md ':include')

### getMass

> `获取刚体质量`

* 语法
```js
var mass = node.getMass();
```

* 返回 
| Name | Type | Description |
|------|------|-------------|
| mass | `number` | 当前刚体质量 |

[共享实例](../share/013_bullet.md ':include')

### setRestitution

> `设置刚体弹性系数0-1（0软泥不回弹）`

* 语法
```js
node.setRestitution(value);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| value | `number` | 弹性系数（0~1，0为完全无弹性，1为完全弹性） |

[共享实例](../share/013_bullet.md ':include')

### getRestitution

> `获取刚体弹性系数0-1（0软泥不回弹）`

* 语法
```js
var restitution = node.getRestitution();
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `number` | 当前弹性系数（0~1，0为完全无弹性，1为完全弹性） |

[共享实例](../share/013_bullet.md ':include')

### setFriction

> `设置刚体摩擦力系数`

* 语法
```js
node.setFriction(value);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| value | `number` | 摩擦力系数（通常 ≥0） |

[共享实例](../share/013_bullet.md ':include')

### getFriction

> `获取刚体摩擦力系数`

* 语法
```js
var fri = ball.getFriction(1); // 读取小球的摩擦系数
log("Friction = " + fri);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `number` | 当前摩擦力系数 |

[共享实例](../share/013_bullet.md ':include')

### setSpeed

> `设置刚体初始速度`

* 语法
```js
node.setSpeed(vx, vy);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| vx | `number` | 线速度 X 分量 |
| vy | `number` | 线速度 Y 分量 |

[共享实例](../share/013_bullet.md ':include')

### getSpeed

> `获取刚体速度`

* 语法
```js
var speed = ball.getSpeed(); // 读取小球初始速度，xy两个方向的速度
log("vx = " + speed.x + "vy = " + speed.y);
```

* 返回值：`object` - 包含 `x, y` 属性的速度向量。
| Name | Type | Description |
|------|------|-------------|
| res | `object` | 速度 |


[共享实例](../share/013_bullet.md ':include')

### setCentralForce

> `设置刚体持久力`

* 语法
```js
node.setCentralForce(fx, fy);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| fx | `number` | 作用在质心上的力 X 分量 |
| fy | `number` | 作用在质心上的力 Y 分量 |

[共享实例](../share/013_bullet.md ':include')

### getCentralForce

> `获取刚体持久力`

* 语法
```js
var force = ball.getCentralForce(); // 读取小球持久力，xy两个方向
log("fx = " + force.x + " fy = " + force.y);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `object` | 当前施加的质心力向量 |

[共享实例](../share/013_bullet.md ':include')

### setCentralImpulse

> `设置刚体默认瞬时力`

* 语法
```js
node.setCentralImpulse(ix, iy);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| ix | `number` | 质心冲量 X 分量 |
| iy | `number` | 质心冲量 Y 分量 |

[共享实例](../share/013_bullet.md ':include')

### getCentralImpulse

> `获取刚体默认瞬时力`

* 语法
```js
var impulse = ball.getCentralImpulse(); // 获取小球默认瞬时力
log("ix = " + impulse.x + " iy = " + impulse.y);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `object` | 最近一次施加的冲量向量 |

[共享实例](../share/013_bullet.md ':include')

### setStepHeight

> `角色可跨越的最大台阶高度`

* 语法
```js
node.setStepHeight(height);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| height | `number` | 角色可跨越的最大台阶高度 |

[共享实例](../share/013_bullet.md ':include')

### getStepHeight

> `获取角色可跨越的最大台阶高度`

* 语法
```js
var stepHeight = node.getStepHeight();
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| height | `number` | 当前台阶高度值 |

[共享实例](../share/013_bullet.md ':include')

### setJumpSpeed

> `角色跳跃初速度`

* 语法
```js
node.setJumpSpeed(speed);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| speed | `number` | 跳跃初速度（向上为正） |

[共享实例](../share/013_bullet.md ':include')

### getJumpSpeed

> `获取角色跳跃速度值`

* 语法
```js
var jumpSpeed = node.getJumpSpeed(); // 获取跳跃速度值
log("JumpSpeed = " + jumpSpeed);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| speed | `number` | 跳跃速度值 |

[共享实例](../share/013_bullet.md ':include')

### setFallSpeed
> `设置角色最大下落速度`

* 语法
```js
node.setFallSpeed(speed);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| speed | `number` | 最大下落速度限制（负值或正值） |

[共享实例](../share/013_bullet.md ':include')

### getFallSpeed

> `获取下落速度限制值`

* 语法
```js
var fallSpeed = this.user.getFallSpeed(); // 获取下落速度值
log("FallSpeed = " + fallSpeed);
```

* 参数：无  
| Name | Type | Description |
|------|------|-------------|
| speed | `number` | 下落速度限制值 |

[共享实例](../share/013_bullet.md ':include')

### setMoveSpeed
> `设置角色移动速度`

* 语法
```js
node.setMoveSpeed(x, y);
node.setMoveSpeed(5,0);  // 水平向右前进
node.setMoveSpeed(-5,0); // 水平向左后退
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| x | `number` | 角色X分量移动速度（单位/秒） |
| y | `number` | 角色Y分量移动速度（单位/秒） |

[共享实例](../share/013_bullet.md ':include')

### getMoveSpeed

> `获取角色移动速度`

* 语法
```js
var move = this.user.getMoveSpeed(); // 获取角色移动速度
log("MoveSpeed x = " + move.x + " MoveSpeed y = " + move.y);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `object` | 角色移动速度值 |

[共享实例](../share/013_bullet.md ':include')

### setMaxSlope

> `设置角色角色可爬坡的最大角度`

* 语法
```js
node.setMaxSlope(angleDegrees);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| angleDegrees | `number` | 角色可爬坡的最大角度（度数） |

[共享实例](../share/013_bullet.md ':include')

### getMaxSlope

> `获取角色最大爬坡角度`

* 语法
```js
var maxSlope = this.user.getMaxSlope(); // 获取角色最大爬坡角度（度数）
log("MaxSlope = " + maxSlope);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `number` | 角色可爬坡的最大角度（度数） |

[共享实例](../share/013_bullet.md ':include')

### onGround

> `检测角色是否站在地面上`

* 语法
```js
var isGrounded = node.onGround(); // 检测角色是否站在地面上，当跳跃时false
log("isGrounded = " + isGrounded);
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `boolean` | 检测角色当前站在地面上 |

[共享实例](../share/013_bullet.md ':include')

### jump

> `调用后角色会立即施加向上的冲量（需满足onGround()为真）`

* 语法
```js
node.jump();
```

[共享实例](../share/013_bullet.md ':include')

### isPress
> `节点是否被点击，点击后可以执行跳跃等`

* 语法
```js
qianjin.upDate((time)=>{ // 前进按钮的回调
     // 点击时，如果在地面则跳跃
    if (this.user.isPress() && this.user.onGround()) 
        this.user.jump();
});
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| res | `boolean` | 节点是否被点击 |

[共享实例](../share/013_bullet.md ':include')



#  ProgressBar进度条类

[支持Sprite类函数，点击查看](zh-cn/docs/windows/Sprite.md)

[支持Node类函数，点击查看](zh-cn/docs/windows/Node.md)

##  getMax()

> `获取进度条最大值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nMax | `int`   | 滑动块最大值 |

[共享实例](../share/002_Login.md ':include')
 
##  getValue()

> `获取进度条当前值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nVal | `int`   | 滑动块当前值 |

[共享实例](../share/002_Login.md ':include')
 
##  setBgColor(r,g,b,a)

> `设置进度条中滑块的颜色值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| r | `int`   | R通道颜色的int值 |
| g | `int`   | G通道颜色的int值 |
| b | `int`   | B通道颜色的int值 |
| a | `float` | A不透明度0~1的值，0为完全透明，1为完全不透明 |

[共享实例](../share/002_Login.md ':include')

##  setBgTexture(obj)

> `设置进度条中滑块的图片`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 纹理数据对象 |

[共享实例](../share/002_Login.md ':include')

##  setPosition(x,y)

> `设置进度条在游戏界面的位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 标签在游戏界面中的横坐标 |
| y | `int` | 标签在游戏界面中的纵坐标 |

[共享实例](../share/002_Login.md ':include')

##  setMax(max)

> `设置进度条最大值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 参数数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| max | `int`   | 滑动块最大值 |

[共享实例](../share/002_Login.md ':include')
 
##  setValue(val)

> `设置进度条数值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| val | `int`   | 设置的滑动块数值 |

[共享实例](../share/002_Login.md ':include')

##  setSize(x,y)

> `设置进度条大小`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resLoad = game.getResource().getTexture("img/load.png"); // 获取纹理数据对象
var progLoad = new ProgressBar(); // 新建进度条
progLoad.setTexture(resLoad); // 设置进度条图片
progLoad.setPosition(200, 550); // 进度条显示位置
progLoad.setSize(380, 20); // 进度条区域大小，宽和高
progLoad.setBgColor(0,0,0,0); // 进度条背景颜色，透明
progLoad.setMax(100); // 进度条最大值
progLoad.setValue(0); // 设置初始进度为0
var i = 0;
progLoad.upDate((time)=>{ // 设置帧率回调
    if (i++>100) i = 0;
    progLoad.setValue(i); // 设置当前进度
    var max = progLoad.getMax(); // 获取最大进度值
    var val = progLoad.getValue(); // 获取当前进度值
    log("进度条最大值："+max+"进度条当前值："+val);
});
scene.addNode(progLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 进度条的宽度 |
| y | `int` | 进度条的高度 |

[共享实例](../share/002_Login.md ':include')




#  Scene场景类

##  addNode(obj)

> `增加场景节点对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scene = new Scene(); // 新建场景
var lab = new Label(); // 新建标签
lab.setPosition(100, 100);  // 标签位置横坐标，纵坐标。
lab.setSize(500,50);    // 标签宽，高
lab.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
lab.setText("Hello world！你好，世界！"); // 标签文字
lab.setTextColor(0,255,0,1);  // 标签字体颜色
lab.setFont("font/st.ttf",30); // 标签汉字字库，字体大小
scene.addNode(lab); // 把标签增加到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 控件对象 |

[共享实例](../share/001_HelloWorld.md ':include')
 
---

##  getChilds()

> `获取场景节点对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 标签设置
var lab = new Label(); 
lab.setPosition(w/4, h/2.5);  // 标签位置横坐标，纵坐标。居中 或坐标lab.setPosition(160,240);
lab.setSize(500,50);    // 标签宽，高
lab.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
lab.setText("Hello world！你好，世界！"); // 标签文字
lab.setTextColor(0,255,0,1);  // 标签字体颜色
lab.setFont("font/st.ttf",30); // 标签汉字字库，字体大小
scene.addNode(lab); // 把标签增加到场景中
 
// 获取场景里面对象数据，从0开始 
var nodeArray = scene.getChilds();
var labTest = nodeArray[0]; // 获取第一个Label对象
labTest.setText("世界，你好！"); // lab对象重写设置内容
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| array | `object` | 场景节点数组对象 |

[共享实例](../share/108_ai_angrybirds.md ':include')

---

##  onPress(x, y)

> `场景中，鼠标点击回调`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 场景中鼠标点击回调
scene.onPress((x,y)=>{
    if(sprAir.isContainPostion(x,y)) // 判断鼠标位置释放在精灵范围之内
    {
        // 点击精灵并计算位置，保留位置
        isPressPlane = true; // 按住精灵了
        offsetx = sprAir.getSprite().x-x; // 重新计算精灵横坐标
        offsety = sprAir.getPosition().y-y; // 重新计算精灵纵
    }
    else
    {
        // 没有命中精灵
        isPressPlane = false;
    }
});
// 场景中鼠标移动回调
scene.onMove((x,y)=>{
    if(isPressPlane)
        sprAir.setPosition(x+offsetx, y+offsety);
});
// 场景中鼠标抬起回调
scene.onRelease((x,y)=>{
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
|      x       | `int`          | 场景中鼠标横坐标 x               |
|      y       | `int`          | 场景中鼠标纵坐标 y               |

[共享实例](../share/108_ai_angrybirds.md ':include')

---

##  onMove(x, y)

> `场景中，鼠标移动回调`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 场景中鼠标点击回调
scene.onPress((x,y)=>{
    if(sprAir.isContainPostion(x,y)) // 判断鼠标位置释放在精灵范围之内
    {
        // 点击精灵并计算位置，保留位置
        isPressPlane = true; // 按住精灵了
        offsetx = sprAir.getSprite().x-x; // 重新计算精灵横坐标
        offsety = sprAir.getPosition().y-y; // 重新计算精灵纵
    }
    else
    {
        // 没有命中精灵
        isPressPlane = false;
    }
});
// 场景中鼠标移动回调
scene.onMove((x,y)=>{
    if(isPressPlane)
        sprAir.setPosition(x+offsetx, y+offsety);
});
// 场景中鼠标抬起回调
scene.onRelease((x,y)=>{
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
|      x       | `int`          | 场景中鼠标横坐标 x               |
|      y       | `int`          | 场景中鼠标纵坐标 y               |

[共享实例](../share/108_ai_angrybirds.md ':include')

---

##  onRelease(x, y)

> `场景中，鼠标抬起回调`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 场景中鼠标点击回调
scene.onPress((x,y)=>{
    if(sprAir.isContainPostion(x,y)) // 判断鼠标位置释放在精灵范围之内
    {
        // 点击精灵并计算位置，保留位置
        isPressPlane = true; // 按住精灵了
        offsetx = sprAir.getSprite().x-x; // 重新计算精灵横坐标
        offsety = sprAir.getPosition().y-y; // 重新计算精灵纵
    }
    else
    {
        // 没有命中精灵
        isPressPlane = false;
    }
});
// 场景中鼠标移动回调
scene.onMove((x,y)=>{
    if(isPressPlane)
        sprAir.setPosition(x+offsetx, y+offsety);
});
// 场景中鼠标抬起回调
scene.onRelease((x,y)=>{
});
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
|      x       | `int`          | 场景中鼠标横坐标 x               |
|      y       | `int`          | 场景中鼠标纵坐标 y               |

[共享实例](../share/108_ai_angrybirds.md ':include')

---

##  removeNode(obj)

> `删除场景节点对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scene = new Scene(); // 新建场景
var lab = new Label(); // 新建标签
lab.setPosition(100, 100);  // 标签位置横坐标，纵坐标。
lab.setSize(500,50);    // 标签宽，高
lab.setColor(0,0,0,0);  // 标签背景颜色为黑色并透明
lab.setText("Hello world！你好，世界！"); // 标签文字
lab.setTextColor(0,255,0,1);  // 标签字体颜色
lab.setFont("font/st.ttf",30); // 标签汉字字库，字体大小
scene.addNode(lab); // 把标签增加到场景中
scene.removeNode(lab); // 把标签从场景中删除
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 控件对象 |

[共享实例](../share/001_HelloWorld.md ':include')

---

##  upDate(fun)

> `游戏界面刷新帧率回调函数，根据fps帧率的值回调，fps设置60就是一秒60次回调`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 界面刷新回调
scene.upDate((time)=>{
       //log("fps callback");
 });
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| fun | `object` | 回调函数 |

[共享实例](../share/001_HelloWorld.md ':include')

---

##  setColor(r,g,b,a)

> `设置游戏主窗口场景颜色值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scene = new Scene();
scene.setColor(0,0,0,1); // 设置游戏主背窗口场景颜色（r,g,b,a），填充黑色不透明
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| r | `int`   | R通道颜色的int值 |
| g | `int`   | G通道颜色的int值 |
| b | `int`   | B通道颜色的int值 |
| a | `float` | A不透明度0~1的值，0为完全透明，1为完全不透明 |

[共享实例](../share/001_HelloWorld.md ':include')

---

##  setBg(bg)

> `设置游戏主窗口场景背景图`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var bg = game.getResource().getTexture("img/bg.jpg"); // 获取纹理数据对象
var scene = new Scene(); // 新建场景
scene.setBg(bg); // 设置背景图
game.pushScene(scene);  //  把场景设置到主游戏窗口
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| text | `string` | 设置标签显示的字符串|

[共享实例](../share/001_HelloWorld.md ':include')

---

##  物理引擎

### addPointConstraint

> `场景添加点对点约束` <br>
> `在两点之间创建一个“点对点”约束，使两个刚体在锚点处相连（类似球窝关节）。常用于布娃娃、链条等`

* 语法
```js
var sp1 = new Sprite();
sp1.setPosition(185,185);
sp1.setSize(30,30);
sp1.setTexture(ballBg);
sp1.setMass(1);
sp1.useSphereBody();
sp1.setSpeed(20,0);      
this.scene.addNode(sp1);
 
var pointConstraint = new BulletPoint2Point();
pointConstraint.setData(sp1,0,60);
this.scene.addPointConstraint(pointConstraint);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 点对点约束类 BulletPoint2 |

[共享实例](../share/013_bullet.md ':include')

---

### addSliderConstraint

> `场景增加滑动约束`

* 语法
```js
Slider =new BulletSlider();            // 滑动约束类
Slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
Slider.setLowerLinLimit(-200);         // 设置线性滑动下限
Slider.setUpperLinLimit(200);          // 设置线性滑动上限
Slider.setTargetLinMotorVelocity(30.0); // 设置线性马达目标速度，给它一个向右运动的速度
Slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
Slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(Slider);// 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 滑动约束类 Slider |

[共享实例](../share/013_bullet.md ':include')

---

### addHingeConstraint

> `场景增加铰链约束`<br>
> `说明：模拟门轴或合页效果，只允许绕一个轴旋转。可附加角度限制和马达`

* 语法
```js
var hinge = new BulletHinge();        // 创建铰链约束类
hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
hinge.setLimit(30, 120);              // 设置铰链角度限制
var min = hinge.getMin();             // 获取当前最小角度限制         
var max = hinge.getMax();             // 获取当前最大角度限制      
log("Min = " + min + " Max = " + max);
this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 铰链约束类 hinge |

[共享实例](../share/013_bullet.md ':include')

---

### addConTwistConstraint

> `场景增加圆锥扭曲约束`<br>
> `Cone Twist 约束常用来模拟人形骨骼的肩关节、髋关节，允许绕两个方向的摆动（圆锥范围）和一个方向的扭转（绕骨骼轴向的自旋）。适合角色四肢连接。`

* 语法
```js
var constraint = scene.addConTwistConstraint(A);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 圆锥扭曲约束类 ConTwistConstraint |

[共享实例](../share/013_bullet.md ':include')




#  ScrollView滑动视图类

[支持Sprite类函数，点击查看](zh-cn/docs/windows/Sprite.md)

[支持Node类函数，点击查看](zh-cn/docs/windows/Node.md)

##  getHScrollBar()

> `获取滚动视图中的水平滚动条对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
var hscrollBar =scrollview.getHScrollBar(); // 获取滚动窗口中的水平滚动条
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 水平滚动条对象 |

[共享实例](../share/002_Login.md ':include')
 
##  getOffsetX()

> `获取滚动视图中，水平滚动条中滑块位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
var sx = scrollview.getOffsetX(); // 获取水平滚动滑块的位置
var sy = scrollview.getOffsetY(); // 获取垂直滚动滑块的位置
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pos | `int`   | 水平滚动条中滑块位置 |

[共享实例](../share/002_Login.md ':include')
 
##  getOffsetY()

> `获取滚动视图中，垂直滚动条中滑块位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
var sx = scrollview.getOffsetX(); // 获取水平滚动滑块的位置
var sy = scrollview.getOffsetY(); // 获取垂直滚动滑块的位置
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pos | `int`   | 垂直滚动条中滑块位置 |

[共享实例](../share/002_Login.md ':include')
 
##  getVScrollBar()

> `获取滚动视图中的垂直滚动条对象`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 设置滚动视图垂直滚动条
var vscrollBar =scrollview.getVScrollBar(); // 获取滚动窗口中的垂直滚动条
var resVScrollBarBg = game.getResource().getTexture("img/resVScrollBarBg.png"); // 获取纹理数据对象，灰色背景图
vscrollBar.setColor(0,255,0,1); // 设置垂直滚动条背景颜色为绿色
vscrollBar.setTexture(resVScrollBarBg); // 设置滚动条里面滑块背景图为灰色
vscrollBar.setBarColor(0,0,255,1);  // 设置滚动条中滑块颜色为蓝色
vscrollBar.setBarTexture(resVScrollBarBg);// 设置滚动条中滑块背景图
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 垂直滚动条对象 |

[共享实例](../share/002_Login.md ':include')
 
##  setContentSize(x,y)

> `设置滚动条中内容大小`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 设置滚动视图大小，位置，背景等
var resScrollViewBg = game.getResource().getTexture("img/ScrollViewBg.png"); // 获取纹理数据对象
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setTexture(resScrollViewBg); //设置滚动视图背景图
scrollview.setColor(0.2, 0.5, 0.8, 0.5); // 设置滚动视图颜色
scrollview.setPosition(10,400);// 滚动视图的位置，横坐标和纵坐标
scrollview.setSize(100,100);// 滚动视图的大小，宽度和高度
scrollview.setContentSize(400,400); // 设置滚动视图中内容大小
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 滚动条中内容的宽度 |
| y | `int` | 滚动条中内容的高度 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setHBarHeight(h)

> `设置滚动视图中，水平滚动条滑道的高度`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setHBarHeight(10); // 设置水平滚动条滑道的高度
scrollview.setVBarWidth(10);  // 设置垂直滚动条滑道的宽度
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| h | `int` | 水平滚动条滑道的高度 |

[共享实例](../share/002_Login.md ':include')

##  setScrollOffsetX(x)

> `设置滚动视图中，水平滚动滑块的初始位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setScrollOffsetX(10); //  水平滚动滑块的初始位置，横坐标从10开始
scrollview.setScrollOffsetY(20); //  垂直滚动滑块的初始位置，纵坐标从20开始
var sx = scrollview.getOffsetX(); // 获取水平滚动滑块的位置
var sy = scrollview.getOffsetY(); // 获取垂直滚动滑块的位置
log("scrollview滚动窗口水平滑块初始位置："+sx);
log("scrollview滚动窗口垂直滑块初始位置："+sy);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 滚动视图中，垂直滚动滑块的初始位置 |

[共享实例](../share/002_Login.md ':include')

##  setScrollOffsetY(y)

> `设置滚动视图中，水平滚动滑块的初始位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setScrollOffsetX(10); //  水平滚动滑块的初始位置，横坐标从10开始
scrollview.setScrollOffsetY(20); //  垂直滚动滑块的初始位置，纵坐标从20开始
var sx = scrollview.getOffsetX(); // 获取水平滚动滑块的位置
var sy = scrollview.getOffsetY(); // 获取垂直滚动滑块的位置
log("scrollview滚动窗口水平滑块初始位置："+sx);
log("scrollview滚动窗口垂直滑块初始位置："+sy);
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| y | `int` | 滚动视图中，垂直滚动滑块的初始位置 |

##  setShowHBar(bShow)

> `设置滚动视图中，是否隐藏水平滚动条`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setShowHBar(false); // flase隐藏；ture显示；默认显示水平滚动条
scrollview.setShowVBar(false); // flase隐藏；ture显示；默认显示垂直滚动条
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| bShow | `bool` | flase隐藏；ture显示；默认显示水平滚动条 |

[共享实例](../share/002_Login.md ':include')

##  setShowVBar(bShow)

> `设置滚动视图中，是否隐藏垂直滚动条`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setShowHBar(false); // flase隐藏；ture显示；默认显示水平滚动条
scrollview.setShowVBar(false); // flase隐藏；ture显示；默认显示垂直滚动条
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| bShow | `bool` | flase隐藏；ture显示；默认显示垂直滚动条 |

[共享实例](../share/002_Login.md ':include')

##  setVBarWidth(w)

> `设置滚动视图中，垂直滚动条滑道的宽度`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setHBarHeight(10); // 设置水平滚动条滑道的高度
scrollview.setVBarWidth(10);  // 设置垂直滚动条滑道的宽度
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| w | `int` | 垂直滚动条滑道的宽度 |

[共享实例](../share/002_Login.md ':include')

##  setSize(x,y)

> `设置滚动视图的大小`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 设置滚动视图大小，位置，背景等
var resScrollViewBg = game.getResource().getTexture("img/ScrollViewBg.png"); // 获取纹理数据对象
var scrollview = new ScrollView(); // 新建滚动视图
scrollview.setTexture(resScrollViewBg); //设置滚动视图背景图
scrollview.setColor(0.2, 0.5, 0.8, 0.5); // 设置滚动视图颜色
scrollview.setPosition(10,400);// 滚动视图的位置，横坐标和纵坐标
scrollview.setSize(100,100);// 滚动视图的大小，宽度和高度
scrollview.setContentSize(400,400); // 设置滚动视图中内容大小
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 滚动视图的宽度 |
| y | `int` | 滚动视图的高度 |

[共享实例](../share/001_HelloWorld.md ':include')



#  Slide滑动控件类

[支持Sprite类函数，点击查看](zh-cn/docs/windows/Sprite.md)

[支持Node类函数，点击查看](zh-cn/docs/windows/Node.md)

##  getMax()

> `获取滑动控件最大值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
//slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nMax | `int`   | 滑动块最大值 |

[共享实例](../share/002_Login.md ':include')
 
##  getValue()

> `获取滑动控件当前值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
//slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| nVal | `int`   | 滑动块当前值 |

[共享实例](../share/002_Login.md ':include')
 
##  setBarColor(r,g,b,a)

> `设置滑动控件中滑块的颜色值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
//slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| r | `int`   | R通道颜色的int值 |
| g | `int`   | G通道颜色的int值 |
| b | `int`   | B通道颜色的int值 |
| a | `float` | A不透明度0~1的值，0为完全透明，1为完全不透明 |

[共享实例](../share/002_Login.md ':include')

##  setTexture(obj)

> `设置滑动控件中滑块的图片`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
//slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 纹理数据对象 |

[共享实例](../share/002_Login.md ':include')

##  setPosition(x,y)

> `设置滑动控件在游戏界面的位置`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
//slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 标签在游戏界面中的横坐标 |
| y | `int` | 标签在游戏界面中的纵坐标 |

[共享实例](../share/002_Login.md ':include')

##  setMax(max)

> `设置滑动控件最大值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
//slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 参数数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| max | `int`   | 滑动块最大值 |

[共享实例](../share/002_Login.md ':include')
 
##  setValue(val)

> `设置滑动控件数值`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
//slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| val | `int`   | 设置的滑动块数值 |

[共享实例](../share/002_Login.md ':include')

##  setSize(x,y)

> `设置滑动控件大小`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSlide = game.getResource().getTexture("img/slide.png"); // 获取纹理数据对象
var slideLoad = new Slide(); // 新建滑块条
slideLoad.setBarTexture(resSlide); // 设置滑块指针显示的图片
slideLoad.setPosition(300, 500); // 滑块显示位置，横坐标，纵坐标
slideLoad.setSize(150, 15); // 滑块区域大小，宽和高
//slideLoad.setBarColor(0,1,0,1); // 滑块颜色绿色，不透明
slideLoad.setColor(128,128,128,0.2); // 滑块背景颜色，透明
slideLoad.setMax(100); // 滑块最大值
slideLoad.setValue(50); // 设置初始值
var i = 0;
slideLoad.upDate((time)=>{ // 设置帧率回调
    var max = slideLoad.getMax(); // 获取最大进度值
    var val = slideLoad.getValue(); // 获取当前进度值
    log("滑块最大值："+max+"进度条当前值："+val);
});
scene.addNode(slideLoad);  // 加入到场景中
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| x | `int` | 滑动控件的宽度 |
| y | `int` | 滑动控件的高度 |

[共享实例](../share/002_Login.md ':include')




#  Sprite精灵类

[支持Node类函数，点击查看](zh-cn/docs/windows/Node.md)

##  click(type,x,y)

> `点击精灵回调函数`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resBtnBg = game.getResource().getTexture("img/button.png"); // 获取纹理数据对象
var sprLogin = new Sprite(); // 新建精灵
sprLogin.click((type,x,y)=>{ // 标签鼠标点击回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("点击: "+type+"\tx:"+x+"\ty:"+y);
})
sprLogin.longClick((type,x,y)=>{ // 标签鼠标长按回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("长按: "+type+"\tx:"+x+"\ty:"+y);
})
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| type | `int` | 鼠标类型：0-左键；1-右键。注意：在网页和微信小游戏中，右键失效 |
| x | `int` | 鼠标横坐标 x |
| y | `int` | 鼠标纵坐标 y |

[共享实例](../share/002_Login.md ':include')

##  longClick(type,x,y)

> `长按精灵回调函数`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resBtnBg = game.getResource().getTexture("img/button.png"); // 获取纹理数据对象
var sprLogin = new Sprite(); // 新建精灵
sprLogin.click((type,x,y)=>{ // 标签鼠标点击回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("点击: "+type+"\tx:"+x+"\ty:"+y);
})
sprLogin.longClick((type,x,y)=>{ // 标签鼠标长按回调 type=0鼠标左键；type=1鼠标右键；x,y是鼠标坐标
    log("长按: "+type+"\tx:"+x+"\ty:"+y);
})
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| type | `int` | 鼠标类型：0-左键；1-右键。注意：在网页和微信小游戏中，右键失效 |
| x | `int` | 鼠标横坐标 x |
| y | `int` | 鼠标纵坐标 y |

[共享实例](../share/002_Login.md ':include')

##  setTexture(obj)

> `设置精灵背景图片`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var resSmile = game.getResource().getTexture("img/smile.jpg"); // 获取纹理数据对象
var node = new Sprite(); // 新建精灵
node.setTexture(resSmile); // 设置精灵背景
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| obj | `object`   | 纹理数据对象 |

[共享实例](../share/002_Login.md ':include')




#  SocketIO网络长链接类

## initIO(appid)
> `初始化长链接`

* *权限: 无障碍权限*

* 语法
```js
 aWebSocket.initIO(appid); 
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| appid | `String` | 应用ID，用于不同的游戏分类 |

* 实例

```js
var aWebSocket = new SocketIO(); // 创建长连接类
var appid= "h11do3gq";
aWebSocket.initIO(appid);  // 初始化长链接中的appid，区分项目用，也可以为空
  
// 设置长连接
aWebSocket.connectIO("https://imtest.linchixuan.com/"+appid,"appId="+appid+"&uid=68661f92a88ebd78856482bc&deviceId=132441241244"); // 建立长链接
 aWebSocket.on("SIO_INFO",function(str){ // 监听长链接数据，设置回调函数
   log(JSON.stringify(str));
});
aWebSocket.on("connect",function(){
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    //aWebSocket.disConnect(); // 关闭长链接
});
```

## connectIO(urlStr, Query)
> `建立长链接`

* *权限: 无障碍权限*

* 语法
```js
 aWebSocket.connectIO(urlStr, Query); 
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| urlStr | `String` | WebSocket 服务器 URL |
| Query | `String` | 查询字符串 |

* 实例

```js
var aWebSocket = new SocketIO(); // 创建长连接类
var appid= "h11do3gq";
aWebSocket.initIO(appid);  // 初始化长链接中的appid，区分项目用，也可以为空
  
// 设置长连接
aWebSocket.connectIO("https://imtest.linchixuan.com/"+appid,"appId="+appid+"&uid=68661f92a88ebd78856482bc&deviceId=132441241244"); // 建立长链接
 aWebSocket.on("SIO_INFO",function(str){ // 监听长链接数据，设置回调函数
   log(JSON.stringify(str));
});
aWebSocket.on("connect",function(){
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    //aWebSocket.disConnect(); // 关闭长链接
});
```

## disConnect()
> `关闭长链接`

* *权限: 无障碍权限*

* 语法
```js
 aWebSocket.disConnect(); 
```

* 实例

```js
var aWebSocket = new SocketIO(); // 创建长连接类
var appid= "h11do3gq";
aWebSocket.initIO(appid);  // 初始化长链接中的appid，区分项目用，也可以为空
  
// 设置长连接
aWebSocket.connectIO("https://imtest.linchixuan.com/"+appid,"appId="+appid+"&uid=68661f92a88ebd78856482bc&deviceId=132441241244"); // 建立长链接
 aWebSocket.on("SIO_INFO",function(str){ // 监听长链接数据，设置回调函数
   log(JSON.stringify(str));
});
aWebSocket.on("connect",function(){
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    //aWebSocket.disConnect(); // 关闭长链接
});
```

## on(str, callback)
> `初始化长链接`

* *权限: 无障碍权限*

* 语法
```js
 aWebSocket.on(str, callback); 
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| str | `String` | 链接类型 |
| callback | `obj` | 回调函数 |

* 实例

```js
var aWebSocket = new SocketIO(); // 创建长连接类
var appid= "h11do3gq";
aWebSocket.initIO(appid);  // 初始化长链接中的appid，区分项目用，也可以为空
  
// 设置长连接
aWebSocket.connectIO("https://imtest.linchixuan.com/"+appid,"appId="+appid+"&uid=68661f92a88ebd78856482bc&deviceId=132441241244"); // 建立长链接
 aWebSocket.on("SIO_INFO",function(str){ // 监听长链接数据，设置回调函数
   log(JSON.stringify(str));
});
aWebSocket.on("connect",function(){
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    //aWebSocket.disConnect(); // 关闭长链接
});
```

## emitMsg(str, msg)
> `发送长链接数据`

* *权限: 无障碍权限*

* 语法
```js
 aWebSocket.emitMsg(str, msg); 
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| str | `String` | 事件名称/消息类型 |
| msg | `String` | 要发送的数据 |

* 实例

```js
var aWebSocket = new SocketIO(); // 创建长连接类
var appid= "h11do3gq";
aWebSocket.initIO(appid);  // 初始化长链接中的appid，区分项目用，也可以为空
  
// 设置长连接
aWebSocket.connectIO("https://imtest.linchixuan.com/"+appid,"appId="+appid+"&uid=68661f92a88ebd78856482bc&deviceId=132441241244"); // 建立长链接
 aWebSocket.on("SIO_INFO",function(str){ // 监听长链接数据，设置回调函数
   log(JSON.stringify(str));
});
aWebSocket.on("connect",function(){
    aWebSocket.emitMsg("SIO_MESSAGE_UP","SIO_MESSAGE_UP");   // 发送长链接数据
    //aWebSocket.disConnect(); // 关闭长链接
});
```


#  Windows游戏主界面类

##  getHeight()

> `获取游戏主窗口高度`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var window = game.getWindow(); // 获取游戏主窗口类，这个窗口是唯一的全局类
var h = window.getHeight(); // 屏幕高度
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| n | `int` | 游戏主窗口高度 |

[共享实例](../share/001_HelloWorld.md ':include')

##  getWidth()

> `获取游戏主窗口宽度`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var window = game.getWindow(); // 获取游戏主窗口类，这个窗口是唯一的全局类
var h = window.getWidth(); // 屏幕宽度
```

* 返回
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| n | `int` | 游戏主窗口宽度 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setIcon(object)

> `设置游戏主窗口图标`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
// 获取图片等资源,返回的是资源对象，如果读取失败，则是系统默认图标
var texture = game.getResource().getTexture("img/logo.png"); 
var window = game.getWindow(); // 获取游戏主窗口类，这个窗口是唯一的全局类
window.setIcon(texture); // 设置主窗口图标
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| object | `object` |  资源中的图标对象 |

[共享实例](../share/001_HelloWorld.md ':include')

##  setTitle(text)

> `设置游戏主窗口标题内容`

* 平台: windows/macos/linux <img src="res/os_windows.png" width="13"> <img src="res/os_apple.png" width="15"><img src="res/os_linux.png" width="15">

* 语法
```js
var window = game.getWindow(); // 获取游戏主窗口类，这个窗口是唯一的全局类
window.setTitle("开维游戏引擎（Game.js）"); // 设置主窗口标题
```

* 参数
| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| text | `string` | 显示内容 |

[共享实例](../share/001_HelloWorld.md ':include')



#  BulletSlider 物理引擎 滑动约束类

`物理引擎，主要用于游戏开发、实时仿真和视觉特效中的碰撞检测与刚体动力学模拟`

`主要特点：`

`刚体与软体：支持刚体（Rigid Body）和软体（Soft Body）物理`

`多种约束：提供点约束、滑动约束、铰链约束、圆锥扭曲约束等`

`高效：被许多 AAA 游戏（如《侠盗猎车手 V》《荒野大镖客：救赎》）、VR 应用以及机器人仿真（如 Gazebo、ROS）使用`

`跨平台：支持 C++ 原生库，也可通过 Emscripten 编译为 WebAssembly 在浏览器中运行`

## setData
> `设置滑动约束的关联刚体及参数`

* 语法
```js
slider.setData(NodeA, ox, oy, NodeB, ox1, oy1, isA);
  
slider = new BulletSlider();            // 滑动约束类
slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
slider.setLowerLinLimit(-200);         // 设置线性滑动下限
slider.setUpperLinLimit(200);          // 设置线性滑动上限
slider.setTargetLinMotorVelocity(30.0);// 设置线性马达目标速度，给它一个向右运动的速度
slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(slider);     // 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 第一个刚体节点（通常为约束的主体） |
| ox | `number` | 锚点相对于节点 A 局部坐标系的 X 偏移 |
| oy | `number` | 锚点相对于节点 A 局部坐标系的 Y 偏移 |
| B | `object` | 第二个刚体节点（可为 nullptr 表示静态世界） |
| ox1 | `number` | 锚点相对于节点 B 局部坐标系的 X 偏移 |
| oy1 | `number` | 锚点相对于节点 B 局部坐标系的 Y 偏移 |
| isA | `boolean` | 标志位：true 表示节点 A 为约束的参考物体（通常为静态或主要物体），false 表示 B 为参考 |

[共享实例](../share/013_bullet.md ':include')

---

## setLowerLinLimit

> `设置线性滑动下限`

* 语法
```js
slider.setLowerLinLimit(limit);
   
slider = new BulletSlider();            // 滑动约束类
slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
slider.setLowerLinLimit(-200);         // 设置线性滑动下限
slider.setUpperLinLimit(200);          // 设置线性滑动上限
slider.setTargetLinMotorVelocity(30.0);// 设置线性马达目标速度，给它一个向右运动的速度
slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(slider);     // 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| limit | `number` | 下限距离 |

[共享实例](../share/013_bullet.md ':include')

---

## setUpperLinLimit

> `设置线性滑动上限`

* 语法
```js
slider.setUpperLinLimit(limit);
   
slider = new BulletSlider();            // 滑动约束类
slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
slider.setLowerLinLimit(-200);         // 设置线性滑动下限
slider.setUpperLinLimit(200);          // 设置线性滑动上限
slider.setTargetLinMotorVelocity(30.0);// 设置线性马达目标速度，给它一个向右运动的速度
slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(slider);     // 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| limit | `number` | 上限距离 |

[共享实例](../share/013_bullet.md ':include')

---

## setPoweredLinMotor

> `启用/禁用线性马达`

* 语法
```js
slider.setPoweredLinMotor(enabled);
   
slider = new BulletSlider();            // 滑动约束类
slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
slider.setLowerLinLimit(-200);         // 设置线性滑动下限
slider.setUpperLinLimit(200);          // 设置线性滑动上限
slider.setTargetLinMotorVelocity(30.0);// 设置线性马达目标速度，给它一个向右运动的速度
slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(slider);     // 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| enabled | `boolean` | 是否启用电动机 |

[共享实例](../share/013_bullet.md ':include')

---

## setTargetLinMotorVelocity

> `设置线性马达目标速度`

* 语法
```js
slider.setTargetLinMotorVelocity(velocity);
   
slider = new BulletSlider();            // 滑动约束类
slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
slider.setLowerLinLimit(-200);         // 设置线性滑动下限
slider.setUpperLinLimit(200);          // 设置线性滑动上限
slider.setTargetLinMotorVelocity(30.0);// 设置线性马达目标速度，给它一个向右运动的速度
slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(slider);     // 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| velocity | `number` | 目标速度（单位/秒） |

[共享实例](../share/013_bullet.md ':include')

---

## setMaxLinMotorForce

> `设置线性马达最大力`

* 语法
```js
slider.setMaxLinMotorForce(force);
   
slider = new BulletSlider();            // 滑动约束类
slider.setData(this.n1,0,0,this.n2,0,0,true); // 设置滑动约束的关联刚体及参数
slider.setLowerLinLimit(-200);         // 设置线性滑动下限
slider.setUpperLinLimit(200);          // 设置线性滑动上限
slider.setTargetLinMotorVelocity(30.0);// 设置线性马达目标速度，给它一个向右运动的速度
slider.setMaxLinMotorForce(5.0);       // 设置线性马达最大力，动力大小
slider.setPoweredLinMotor(true);       // 开启线性马达
scene.addSliderConstraint(slider);     // 场景增加滑动约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| force | `number` | 最大力值 |

[共享实例](../share/013_bullet.md ':include')





#  BulletSlider 物理引擎 点对点约束类

`物理引擎，主要用于游戏开发、实时仿真和视觉特效中的碰撞检测与刚体动力学模拟`

`主要特点：`

`刚体与软体：支持刚体（Rigid Body）和软体（Soft Body）物理`

`多种约束：提供点对点约束、滑动约束、铰链约束、圆锥扭曲约束等`

`高效：被许多 AAA 游戏（如《侠盗猎车手 V》《荒野大镖客：救赎》）、VR 应用以及机器人仿真（如 Gazebo、ROS）使用`

`跨平台：支持 C++ 原生库，也可通过 Emscripten 编译为 WebAssembly 在浏览器中运行`

## setData

> `设置点对点约束（连接到静态世界或单个刚体）`<br>
> `该重载用于将节点 A 通过点对点约束连接到绝对空间中的一个固定点（即 mNodeB = nullptr）`<br>
> `锚点位置由 (ox, oy) 在 A 的局部坐标中定义，在全局中的位置会随 A 移动`<br>
> `实际上是锚点固定在 A 的局部位置，但因为没有 B，此锚点的世界位置固定（常见实现是创建一个静态锚点）。具体行为取决于引擎`<br>


* 语法
```js
point2.setData(NodeA, ox, oy);
 
var pointConstraint = new BulletPoint2Point();       // 新建约束点
pointConstraint.setData(sp1,0,60);              // 设置一个约束点
scene.addPointConstraint(pointConstraint); // 增加约束点
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object`  | 要连接的刚体节点（约束将把该节点锚定到世界坐标系中的固定点） |
| ox | `number`  | 锚点相对于节点 A 局部坐标系的 X 偏移 |
| oy | `number`  | 锚点相对于节点 A 局部坐标系的 Y 偏移 |

[共享实例](../share/013_bullet.md ':include')

---

## set2Data

> `设置点对点约束（连接两个刚体）`

* 语法
```js
point2.set2Data(NodeA, ox, oy, NodeB, ox1, oy1);
 
var pointConstraint = new BulletPoint2Point();       // 新建约束点
pointConstraint.set2Data(sp1,0,60,sp2,10,0);    // 设置两个约束点
this.scene.addPointConstraint(pointConstraint); // 场景添加约束点
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 第一个刚体节点 |
| ox | `number` | 锚点相对于节点 A 局部坐标系的 X 偏移 |
| oy | `number` | 锚点相对于节点 A 局部坐标系的 Y 偏移 |
| B | `object` | 第二个刚体节点 |
| ox1 | `number` | 锚点相对于节点 B 局部坐标系的 X 偏移 |
| oy1 | `number` | 锚点相对于节点 B 局部坐标系的 Y 偏移 |

[共享实例](../share/013_bullet.md ':include')




#  BulletSlider 物理引擎 铰链约束类

`物理引擎，主要用于游戏开发、实时仿真和视觉特效中的碰撞检测与刚体动力学模拟`

`主要特点：`

`刚体与软体：支持刚体（Rigid Body）和软体（Soft Body）物理`

`多种约束：提供点约束、滑动约束、铰链约束、圆锥扭曲约束等`

`高效：被许多 AAA 游戏（如《侠盗猎车手 V》《荒野大镖客：救赎》）、VR 应用以及机器人仿真（如 Gazebo、ROS）使用`

`跨平台：支持 C++ 原生库，也可通过 Emscripten 编译为 WebAssembly 在浏览器中运行`


## setData
> `设置铰链约束（连接两个刚体，旋转轴为 Z 轴）`

* 语法
```js
hinge.setData(NodeA, ox, oy, NodeB, ox1, oy1);
 
var hinge = new BulletHinge();        // 创建铰链约束类
hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
hinge.setLimit(30, 120);              // 设置铰链角度限制
var min = hinge.getMin();             // 获取当前最小角度限制         
var max = hinge.getMax();             // 获取当前最大角度限制      
log("Min = " + min + " Max = " + max);
this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 第一个刚体节点（铰链主体） |
| ox | `number` | 铰链锚点相对于节点 n 局部坐标系的 X 偏移 |
| oy | `number` | 铰链锚点相对于节点 n 局部坐标系的 Y 偏移 |
| B | `object` | 第二个刚体节点（铰链从体，通常可绕轴旋转） |
| ox1 | `number` | 铰链锚点相对于节点 n1 局部坐标系的 X 偏移 |
| oy1 | `number` | 铰链锚点相对于节点 n1 局部坐标系的 Y 偏移 |

[共享实例](../share/013_bullet.md ':include')

---

## setLimit
> `设置铰链角度限制`

* 语法
```js
hinge.setLimit(min, max);
 
var hinge = new BulletHinge();        // 创建铰链约束类
hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
hinge.setLimit(30, 120);              // 设置铰链角度限制
var min = hinge.getMin();             // 获取当前最小角度限制         
var max = hinge.getMax();             // 获取当前最大角度限制      
log("Min = " + min + " Max = " + max);
this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| min | `number` | 最小角度（弧度或度） |
| max | `number` | 最大角度 |

[共享实例](../share/013_bullet.md ':include')

---

## getMin
> `获取当前最小角度限制`

* 语法
```js
var min = hinge.getMin();
 
var hinge = new BulletHinge();        // 创建铰链约束类
hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
hinge.setLimit(30, 120);              // 设置铰链角度限制
var min = hinge.getMin();             // 获取当前最小角度限制         
var max = hinge.getMax();             // 获取当前最大角度限制      
log("Min = " + min + " Max = " + max);
this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| min | `number` | 当前下限角度 |

[共享实例](../share/013_bullet.md ':include')

---

## getMax
> `获取当前最大角度限制`

* 语法
```js
var max = hinge.getMax();
 
var hinge = new BulletHinge();        // 创建铰链约束类
hinge.setData(n1,0,-80,n2,20,0);      // 设置铰链约束
hinge.setLimit(30, 120);              // 设置铰链角度限制
var min = hinge.getMin();             // 获取当前最小角度限制         
var max = hinge.getMax();             // 获取当前最大角度限制      
log("Min = " + min + " Max = " + max);
this.scene.addHingeConstraint(hinge); // 场景增加铰链约束类
```

* 返回
| Name | Type | Description |
|------|------|-------------|
| max | `number` | 当前上限角度 |

[共享实例](../share/013_bullet.md ':include')



#  BulletConeTwist 物理引擎 圆锥扭曲约束类

`物理引擎，主要用于游戏开发、实时仿真和视觉特效中的碰撞检测与刚体动力学模拟`

`主要特点：`

`刚体与软体：支持刚体（Rigid Body）和软体（Soft Body）物理`

`多种约束：提供点约束、滑动约束、铰链约束、圆锥扭曲约束等`

`高效：被许多 AAA 游戏（如《侠盗猎车手 V》《荒野大镖客：救赎》）、VR 应用以及机器人仿真（如 Gazebo、ROS）使用`

`跨平台：支持 C++ 原生库，也可通过 Emscripten 编译为 WebAssembly 在浏览器中运行`

## setData

> `设置圆锥扭曲约束（连接到静态世界）`<br>
> `该重载用于将节点 A 通过 Cone Twist 约束连接到绝对空间中的一个固定点（mNodeB = nullptr）。`<br>
> `旋转轴为 Z 轴，允许 A 绕 Z 轴扭转（twist）以及在圆锥范围内摆动（cone）。通常用于模拟“关节球”连接到世界的情况。`<br>

* 语法
```js
coneTwist.setData(NodeA, ox, oy);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 要连接的刚体节点（约束将把该节点的锚点固定到世界坐标系中的某个点） |
| ox | `number` | 锚点相对于节点 A 局部坐标系的 X 偏移 |
| oy | `number` | 锚点相对于节点 A 局部坐标系的 Y 偏移 |

[共享实例](../share/013_bullet.md ':include')

---

## set2Data

> `设置圆锥扭曲约束（连接两个刚体）`<br>
> `在节点 A 和节点 B 之间创建一个 Cone Twist 约束，两个锚点分别在各自的局部坐标中定义（Z 坐标默认为 0）。`<br>
> `该约束允许两个刚体相对运动：一个轴向的扭转（twist）和一个圆锥形的摆动（swing）。`<br>
> `常用于模拟人形角色的肩关节、髋关节等。`<br>

* 语法
```js
coneTwist.set2Data(NodeA, ox, oy, NodeB, ox1, oy1);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| A | `object` | 第一个刚体节点 |
| ox | `number` | 锚点相对于节点 A 局部坐标系的 X 偏移 |
| oy | `number` | 锚点相对于节点 A 局部坐标系的 Y 偏移 |
| B | `object` | 第二个刚体节点 |
| ox1 | `number` | 锚点相对于节点 B 局部坐标系的 X 偏移 |
| oy1 | `number` | 锚点相对于节点 B 局部坐标系的 Y 偏移 |

[共享实例](../share/013_bullet.md ':include')

---

## setDamping
> `设置约束阻尼系数`

* 语法
```js
coneTwist.setDamping(damping);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| damping | `number` | 阻尼值（0-1） |

[共享实例](../share/013_bullet.md ':include')

---

## setDbgDrawSize
> `设置调试绘制时的可视化尺寸`

* 语法
```js
coneTwist.setDbgDrawSize(size);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| size | float | 调试图形的大小（例如坐标轴长度、关节显示半径等） |

[共享实例](../share/013_bullet.md ':include')

---

## setLimit

> `设置圆锥扭曲约束的摆动和扭转角度限制` <br>
> `该函数用于限制 Cone Twist 约束的运动范围。swing1 和 swing2 分别控制两个垂直方向上的摆动幅度（形成一个椭圆锥），twist 控制绕轴向的自旋角度。`<br>
> `若引擎内部使用弧度，传入前需转换；但根据代码风格，直接使用度数。`<br>
> `典型应用：模拟肩关节时，swing1 和 swing2 限制手臂前后、左右摆动的范围，twist 限制手臂绕自身轴向的旋转范围。`<br>

* 语法
```js
coneTwist.setLimit(swing1, swing2, twist);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| swing1 | float | 沿第一个摆动轴（通常为局部 X 轴）的圆锥半角，单位：度 |
| swing2 | float | 沿第二个摆动轴（通常为局部 Y 轴）的圆锥半角，单位：度 |
| twist | float | 绕约束轴（通常为 Z 轴）的扭转角度范围（全角，即正负各 twist/2 ，通常为最大扭转角），单位：度 |

---

## setMaxMotorImpulse
> `设置约束马达的最大冲量（力度）`

* 语法
```js
coneTwist.setMaxMotorImpulse(impulse);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| maxImpulse | float | 马达可施加的最大冲量值，单位取决于引擎（通常为牛顿·秒或冲量单位） |

[共享实例](../share/013_bullet.md ':include')

---

## enableMotor
> `启用/禁用约束马达`

* 语法
```js
coneTwist.enableMotor(enable);
```

* 参数
| Name | Type | Description |
|------|------|-------------|
| enable | `boolean` | 是否启用马达 true 启用马达，false 禁用 |

[共享实例](../share/013_bullet.md ':include')

---

