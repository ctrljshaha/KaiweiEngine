# 欢迎使用“开维游戏引擎” ！

<img src="https://www.ikaiwei.com/gamejs/api/res/pc100.jpg" width="700">

## 一、简介

**开维游戏引擎（Kaiwei Engine）** 是一款基于JavaScript语法规范设计的游戏开发软件。引擎完全自主开发，底层由C++编写，逐步扩展实现JavaScript的跨平台运行。配套提供集成开发环境（IDE），支持JavaScript调试，支持一键打包生成多平台应用程序。功能持续完善中。

开维游戏引擎js代码跨平台通用，一次编写，多端运行。支持导出exe和网页html，网页使用wasm运行，小游戏运行效率网页版和exe无太大差别，比原生javacript游戏引擎运行速度快数倍。

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

游戏开发环境IDE 下载： [https://www.ikaiwei.com/download/gamejs/kaiwei_gameide_setup.exe](https://www.ikaiwei.com/download/gamejs/kaiwei_gameide_setup.exe)<br/>

游戏开发环境IDE 用法：https://www.ikaiwei.com/download/gamejs/help.pdf

支持Windows10及以上系统。

## 三、技术支持

官方技术交流群 QQ：702784617

官网：www.ikaiwei.com

## 四、部分游戏演示

001.Hello world

网页版本：https://www.ikaiwei.com/gamejs/example/001_HelloWorld_html/index.html

使用说明：https://blog.csdn.net/weixin_41399197/article/details/158352011

windows版（exe）、网页版（html）、微信小游戏竖屏、微信小游戏横屏：

<img src="https://www.ikaiwei.com/gamejs/vid/001/0011.jpg" width="640" height="320" alt="演示动画">


002.游戏登录界面

网页版本：https://www.ikaiwei.com/gamejs/example/002_Login_html/index.html

使用说明：https://blog.csdn.net/weixin_41399197/article/details/158384807

<img src="https://www.ikaiwei.com/gamejs/vid/002/002.gif" width="480" height="360" alt="演示动画">


003.贪吃蛇

网页版本：https://www.ikaiwei.com/gamejs/example/003_Snake_html/index.html

使用说明：https://blog.csdn.net/weixin_41399197/article/details/158423275

<img src="https://www.ikaiwei.com/gamejs/vid/003/003.gif" width="480" height="360" alt="演示动画">


005.2048小游戏

网页版本：https://www.ikaiwei.com/gamejs/example/005_2048_html/index.html

使用说明：https://blog.csdn.net/weixin_41399197/article/details/158385491

<img src="https://www.ikaiwei.com/gamejs/vid/005/005.gif" width="480" height="360" alt="演示动画">

007.飞机大战

网页版本：https://www.ikaiwei.com/gamejs/example/007_airplane_html/index.html

使用说明：https://blog.csdn.net/weixin_41399197/article/details/158508724

<img src="https://www.ikaiwei.com/gamejs/vid/007/007.gif" width="480" height="360" alt="演示动画">

010.五子棋

网页版本：https://www.ikaiwei.com/gamejs/example/010_Gobang_html/index.html

<img src="https://www.ikaiwei.com/gamejs/vid/010/010.gif" width="480" height="360" alt="演示动画">

106.AI生成：俄罗斯方块

网页版本：https://www.ikaiwei.com/gamejs/example/106_ai_tetris_html/index.html

AI步骤：https://blog.csdn.net/weixin_41399197/article/details/158656433

<img src="https://www.ikaiwei.com/gamejs/vid/106/106.gif" width="480" height="360" alt="演示动画">

107.AI生成：飞翔的小鸟 FlappyBird

网页版本：https://www.ikaiwei.com/gamejs/example/107_ai_flappybird_html/index.html

AI步骤：https://blog.csdn.net/weixin_41399197/article/details/158702071

<img src="https://www.ikaiwei.com/gamejs/vid/107/107.gif" width="280" height="500" alt="演示动画">

108.AI生成：愤怒的小鸟 angrybirds

网页版本：https://www.ikaiwei.com/gamejs/example/108_ai_angrybirds_html/index.html

<img src="https://www.ikaiwei.com/gamejs/vid/108/108.gif" width="480" height="360" alt="演示动画">


## 五、全部实例演示

普通代码 游戏演示视频：

https://www.ikaiwei.com/gamejs/api/index.html#/zh-cn/docs/example/example

AI代码 游戏演示视频：

https://www.ikaiwei.com/gamejs/api/index.html#/zh-cn/docs/example/example_ai
