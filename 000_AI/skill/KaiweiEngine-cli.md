
# 常用命令

> `运行Windows下面的cmd命令窗口，管理员权限` <br>
> `用于agent，mcp，skill，cli`

```bash
gameide.exe  /be  [工程全路径名] [导出目录]         ;导出exe版本
gameide.exe  /bh  [工程全路径名] [导出目录]         ;导出html网页版本
gameide.exe  /bw  [工程全路径名] [导出目录]         ;导出微信小游戏工程
gameide.exe  /bk  [工程全路径名] [导出目录]         ;导出安卓apk 
gameide.exe  /ba  [工程全路径名] [导出目录]         ;一键导出所有平台
gameide.exe  /c   [工程全路径名]                   ;新建工程
gameide.exe  /run [工程全路径名]                   ;运行游戏或调试游戏，默认调试游戏
gameide.exe  /gks [安卓特化参数]                   ;创建安卓证书，参数和安卓打包一致
gameide.exe  /ua                                  ;命令行更新安卓打包环境
gameide.exe  /?                                   ;帮助
```

可选全局修饰参数（可任意组合，通用安卓与微信）：

* `/landscape` 或 `/l` ：强制横屏
* `/portrait`  或 `/p` ：强制竖屏 (默认)
* `/debug`     或 `/d` ：开发调试版 (默认)
* `/release`   或 `/r` ：正式发布/签名版

安卓release时的参数

* `--name [应用名]`：指定安卓应用的展示名称（如 大话西游）
* `--pkg [包名]`：指定安卓应用的 ApplicationID 包名（如 com.game.mylove）
* `--ver [版本号]`：指定应用版本字符串（如 1.0.2）
* `--code [版本代码]`：指定应用的版本整数序号（如 102）
* `--keystore [全路径]`：证书文件的完整路径（如 D:\keys\mygame.keystore）
* `--storepass [密码]`：证书库的整体密码
* `--alias [别名]`：证书的别名（Key Alias）
* `--icon [全路径]`：指定安卓应用的自定义高清高清图标路径（可选，如 D:\icon.png，若无则使用默认图标）
* `--splash [全路径]`：指定安卓应用的自定义启动页大图路径（可选，如 D:\splash.png，若无则使用默认图）

命令说明

1. widnows下，用于cmd，管理员权限
2. 导出安卓APK、生成安卓证书时，如果没有安卓环境，会自动下载环境
2. 更新安卓打包环境，会解压CreateAndroid.zip安卓环境文件，初始化安卓打包环境


# 命令实例

> `运行Windows下面的cmd命令窗口，管理员权限`

## 1. 创建游戏工程

*  说明：在指定目录下创建工程目录和文件，包括main.js等。阻塞命令，直到命令行运行结束后才退出。

```bash
start /wait gameide.exe /c "C:\MyNewGame"
```

## 2. 导出 Window应用（.exe）

* 说明：游戏引擎安装后，安装目录有Hello world实例，游戏工程导出exe，导出目录为C盘根目录

```bash
start /wait gameide.exe /be "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 
```

## 3. 导出 页面Web（.html）

* 说明：游戏工程导出Web页面，导出目录为C盘根目录

```bash
start /wait gameide.exe /bh "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 
```

## 4. 导出 微信小游戏 竖屏

* 说明：导出微信小游戏工程，导出目录为C盘根目录，portrait竖屏（默认），没有参数时，默认竖屏

```bash
start /wait gameide.exe /bw "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 

start /wait gameide.exe /bw /p "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 

start /wait gameide.exe /bw /portrait "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 
```

## 5. 导出 微信小游戏 横屏

* 说明：导出微信小游戏工程，导出目录为C盘根目录，landscape横屏

```bash
start /wait gameide.exe /bw /l "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 

start /wait gameide.exe /bw /landscape "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C: 
```

## 6. 导出 安卓 debug 竖屏
* 说明：如果发现没有安卓环境，会自动下载安卓打包环境包，安装后，继续打包导出apk。portrait竖屏（默认），没有参数时，默认竖屏

```bash
start /wait gameide.exe /bk /debug /p "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 7. 导出 安卓 debug 横屏
* 说明：如果发现没有安卓环境，会自动下载安卓打包环境包，安装后，继续打包导出apk。landscape横屏

```bash
start /wait gameide.exe /bk /debug /l "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 8. 导出 安卓 release 竖屏
* 说明：导出安卓release版本时，需要证书，信息包括包名等信息，需要指定。如果没有证书则需要用命令先生成证书。portrait竖屏（默认），没有参数时，默认竖屏

```bash
start /wait gameide.exe /bk /release /p --name "hello" --pkg com.game.mylove --ver 1.0.0 --code 10 --keystore C:\111111.jks --storepass 111111 --alias release_key --icon "C:\Program Files\KaiweiEngine\resource\img\icon.png" --splash "C:\Program Files\KaiweiEngine\resource\img\splash.png" "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 9. 导出 安卓 release 横屏
* 说明：导出安卓release版本时，需要证书，信息包括包名等信息，需要指定。如果没有证书则需要用命令先生成证书。portrait竖屏（默认），没有参数时，默认竖屏

```bash
start /wait gameide.exe /bk /release /l --name "hello" --pkg com.game.mylove --ver 1.0.0 --code 10 --keystore C:\111111.jks --storepass 111111 --alias release_key --icon "C:\Program Files\KaiweiEngine\resource\img\icon.png" --splash "C:\Program Files\KaiweiEngine\resource\img\splash.png" "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 10. 一键导出 debug 竖屏
* 说明：包括exe，web，微信小游戏，安卓debug版本，竖屏

```bash
start /wait gameide.exe /ba /debug /p "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 11. 一键导出 debug 横屏
* 说明：包括exe，web，微信小游戏，安卓debug版本，横屏

```bash
start /wait gameide.exe /ba /debug /l "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 12. 一键导出 release 竖屏
* 说明：包括exe，web，微信小游戏，安卓release版本，竖屏

```bash
start /wait gameide.exe /ba /release /p --name "hello" --pkg com.game.mylove --ver 1.0.0 --code 10 --keystore C:\111111.jks --storepass 111111 --alias release_key --icon "C:\Program Files\KaiweiEngine\resource\img\icon.png" --splash "C:\Program Files\KaiweiEngine\resource\img\splash.png" "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 13. 一键导出 release 横屏
* 说明：包括exe，web，微信小游戏，安卓release版本，横屏

```bash
start /wait gameide.exe /ba /release /l --name "hello" --pkg com.game.mylove --ver 1.0.0 --code 10 --keystore C:\111111.jks --storepass 111111 --alias release_key --icon "C:\Program Files\KaiweiEngine\resource\img\icon.png" --splash "C:\Program Files\KaiweiEngine\resource\img\splash.png" "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp" C:
```

## 14. 创建安卓证书
* 说明：如果没有安卓环境，会自动下载并安装安卓环境，然后生成证书

```bash
start /wait gameide.exe /gks --name "hello" --keystore C:\111111.jks --alias release_key --storepass 111111 
```

## 15. 更新安卓环境包
* 说明：安卓环境包是独立的压缩文件CreateAndroid.zip，包含安卓打包所需要的最小环境，每次更新默认会解压这个文件到程序当前目录，并初始化安卓环境

```bash
start /wait gameide.exe /ua  
```

## 16. 运行游戏
* 说明：加载游戏工程，并运行

```bash
start /wait gameide.exe /run /release "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp"
```

## 17. 调试游戏
* 说明：加载游戏工程，并调试，默认调用chrome浏览器进行调试

```bash
start /wait gameide.exe /run /debug "C:\Program Files\KaiweiEngine\example\001_HelloWorld\001_HelloWorld.gmp"
```

## 18. 帮助

```bash
start /wait gameide.exe /?
```
