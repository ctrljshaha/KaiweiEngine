---
name: kaiwei-game
description: |
  使用开维游戏引擎(KaiweiEngine)自动生成游戏并一键竖屏导出到所有平台(exe/html/微信小游戏/安卓)，导出后自动运行游戏查看效果。
  当用户需要创建游戏、生成游戏代码、导出游戏时使用。
  触发词：开维、kaiwei、游戏引擎、生成游戏、导出游戏、小游戏、制作游戏。
---

# 开维游戏引擎 (KaiweiEngine) 游戏自动生成与导出

使用开维游戏引擎 JavaScript API，根据用户描述自动生成完整游戏项目，默认竖屏一键导出 exe、html、微信小游戏、安卓 apk，导出后自动运行游戏查看效果。

---

## 一、环境检测与安装

### 1.1 检测引擎是否已安装

判断 `C:\Program Files\KaiweiEngine\gameIde.exe` 是否存在。

**存在** → 跳过安装，直接进入游戏生成流程。

**不存在** → 先检查管理员权限，再下载安装。

### 1.2 检查管理员权限

安装引擎需要管理员权限。先判断当前是否以管理员身份运行：

```powershell
net session >nul 2>&1 && echo "ADMIN" || echo "NOT_ADMIN"
```

如果不是管理员权限，需要提权——打开一个管理员 cmd 窗口：

```powershell
Start-Process cmd -Verb RunAs -ArgumentList '/c cd /d %CD% && cmd'
```

后续安装命令在管理员 cmd 窗口中执行。

### 1.3 下载并静默安装

```cmd
curl -L -o "%TEMP%\kaiwei_gameide_setup.exe" "https://www.ikaiwei.com/download/gamejs/kaiwei_gameide_setup.exe"
"%TEMP%\kaiwei_gameide_setup.exe" /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /SP-
del "%TEMP%\kaiwei_gameide_setup.exe"
```

安装完成后引擎位于 `C:\Program Files\KaiweiEngine`，包含 `gameIde.exe`、`example\`、`AI\skill\` 等。

---

## 二、引擎资料库

| 文件 | 说明 |
|------|------|
| `C:\...\AI\skill\KaiweiEngine-api.md` | API 参考 — 所有类、函数签名、参数表、返回值 |
| `C:\...\AI\skill\KaiweiEngine-example.md` | 代码实例 — 多个完整游戏源码，知识库 |
| `C:\...\AI\skill\KaiweiEngine-cli.md` | CLI 手册 — 18 条命令 |
| `C:\...\example\001_HelloWorld` | 模板工程 — `font/st.ttf`、`img/logo.png` |

**这些文件已复制到本 skill 的 `assets/references/user/` 目录，生成代码时直接读取。**

---

## 三、游戏自动生成流程

> **所有 CLI 命令必须在管理员 cmd 窗口中执行，用 `start /wait ""` 前缀阻塞等待完成。**

### 步骤 1 — 新建工程

```cmd
start /wait "" "C:\Program Files\KaiweiEngine\gameIde.exe" /c "<工程全路径>"
```

- **默认路径**：`C:\<工程名称>`
- 自动创建 `main.js`、`<工程名>.gmp`、`resource\` 目录

### 步骤 2 — 拷贝模板资源

将引擎 HelloWorld 模板中的 `font` 和 `img` 目录（含全部文件）拷贝到工程：

```cmd
xcopy "C:\Program Files\KaiweiEngine\example\001_HelloWorld\resource\font" "<工程路径>\resource\font" /E /I /Y
xcopy "C:\Program Files\KaiweiEngine\example\001_HelloWorld\resource\img" "<工程路径>\resource\img" /E /I /Y
```

- `font\st.ttf` — 中文字体库（所有 Label/Edit 必需）
- `img\logo.png` — 默认 logo

### 步骤 3 — 生成游戏代码

#### ⚠️ 核心约束

1. **只能使用 `KaiweiEngine-api.md` 和 `KaiweiEngine-example.md` 中已出现的 API 函数**
2. **V8 引擎 JavaScript 标准库可以使用**（`Math`、`Date`、`Array`、`String`、`JSON` 等）
3. **禁止编造不存在的 API**

#### 3.1 生成前必读

1. `assets/references/user/KaiweiEngine-api.md` — 确认函数存在
2. `assets/references/user/KaiweiEngine-example.md` — 参考代码风格

#### 3.2 初始化模板（每个 main.js 必须以此开头）

```js
var system = game.getSystemName();         // WINDOWS / WEB / WEIXIN
var webOS = game.getOS();
var webDeviceType = game.getDeviceType();  // PC / Phone / Pad
var webDpr = game.getDpr();
var w, h;
var window;
var screenType;

if (system == "WINDOWS")
    game.init();
else if (system == "WEIXIN")
    game.initSize(canvas.width, canvas.height);
else if (system == "WEB") {
    if (webDeviceType == "PC")
        game.init();
    else if (webDeviceType == "Phone" || webDeviceType == "Pad")
        game.initSize(canvas.width/webDpr, canvas.height/webDpr);
}

window = game.getWindow();
w = window.getWidth();
h = window.getHeight();
screenType = (w > h) ? "Landscape" : "Portrait";
game.setFPS(60);
```

#### 3.3 API 速查

**game 全局**：`init()`, `initSize(w,h)`, `getSystemName()`, `getOS()`, `getDeviceType()`, `getDpr()`, `getWindow()`, `getResource()`, `setFPS(n)`, `pushScene(s)`, `popScene()`, `replaceScene(s)`, `setKeyCallBack(fn)`, `run()`

**Window**：`getWidth()`, `getHeight()`, `setIcon(tex)`, `setTitle(str)`

**Resource**：`getTexture("img/xxx.png")` → 返回纹理对象

**Scene**：`new Scene()`, `setBg(tex)`, `setColor(r,g,b,a)` (0.0–1.0), `addNode(n)`, `removeNode(n)`, `getChilds()`, `upDate((time)=>{})`, `onPress((x,y)=>{})`, `onMove((x,y)=>{})`, `onRelease((x,y)=>{})`

**Node**：`setPosition(x,y)`, `getPosition()`, `setSize(w,h)`, `getSize()`, `setName(str)`, `getName()`, `setColor(r,g,b,a)`, `getColor()`, `setRotate(deg)`, `getRotate()`, `setHide(bool)`, `isHide()`, `addNode(child)`, `removeNode(child)`, `getNodes()`, `upDate(fn)`, `isContainPostion(x,y)`

**Label**：`new Label()`, `setFont("font/st.ttf", size)`, `setText(str)`, `setTextColor(r,g,b,a)`, `setTexture(tex)`, `setPadding(n)`, `click((type,x,y)=>{})`, `longClick((type,x,y)=>{})`
- type: 0=左键, 1=右键

**Sprite**：`new Sprite()`, `setTexture(tex)`, `click(fn)`, `longClick(fn)`, `getSprite()`

**Edit**：`new Edit()`, `setFont("font/st.ttf", size)`, `setTexture(tex)`, `setPadding(n)`, `getText()`, `setPubText(str)`, `setColor(r,g,b,a)`

**ProgressBar**：`new ProgressBar()`, `setBgTexture(tex)`, `setTexture(tex)`, `setBgColor(r,g,b,a)`, `setMax(n)`, `setValue(n)`, `getValue()`, `getMax()`

**Slide**：`new Slide()`, `setBarTexture(tex)`, `setBarColor(r,g,b,a)`, `setMax(n)`, `setValue(n)`, `getValue()`, `getMax()`

**ScrollView**：`new ScrollView()`, `setContentSize(w,h)`, `setShowHBar(bool)`, `setShowVBar(bool)`, `setScrollOffsetX(n)`, `setScrollOffsetY(n)`, `getOffsetX()`, `getOffsetY()`, `setHBarHeight(n)`, `setVBarWidth(n)`, `addNode(n)`, `getVScrollBar()`, `getHScrollBar()`

**Audio**：`new Audio()`, `playMusic("sound/x.mp3")`, `playMusicOne("sound/x.mp3")`, `stopMusic()`, `playSound("sound/x.wav")`, `setMusicVolume(0–1)`, `setSoundVolume(0–1)`, `getMusicVolume()`, `getSoundVolume()`

**Http**：`new Http()`, `get(url, callback)`, `post(url, data, callback)`

**SocketIO**：`new SocketIO()`, `initIO(appid)`, `connectIO(url,params)`, `on(event,callback)`, `emitMsg(event,data)`, `disConnect()`

**物理刚体**：`setMass(n)`, `useBoxBody()`, `useSphereBody()`, `useCapsuleShape()`, `setSpeed(vx,vy)`, `getSpeed()`, `setRestitution(n)`, `getRestitution()`, `setFriction(n)`, `getFriction()`, `setCentralForce(fx,fy)`, `getCentralForce()`, `setCentralImpulse(ix,iy)`, `getCentralImpulse()`

**角色控制器**（需 `useCapsuleShape()`）：`setJumpSpeed(n)`, `getJumpSpeed()`, `setFallSpeed(n)`, `getFallSpeed()`, `setStepHeight(n)`, `getStepHeight()`, `setMoveSpeed(vx,vy)`, `getMoveSpeed()`, `jump()`, `onGround()`, `isPress()`, `setMaxSlope(deg)`, `getMaxSlope()`

**物理约束**：
- `BulletPoint2Point` — `setData(n,ox,oy)`, `set2Data(n1,ox1,oy1,n2,ox2,oy2)`, `scene.addPointConstraint(c)`
- `BulletHinge` — `setData(n1,ox1,oy1,n2,ox2,oy2)`, `setLimit(min,max)`, `getMin()`, `getMax()`, `scene.addHingeConstraint(c)`
- `BulletSlider` — `setData(n1,ox1,oy1,n2,ox2,oy2,lock)`, `setLowerLinLimit(n)`, `setUpperLinLimit(n)`, `setTargetLinMotorVelocity(v)`, `setMaxLinMotorForce(f)`, `setPoweredLinMotor(bool)`, `scene.addSliderConstraint(c)`
- `BulletConeTwist` — `set2Data(n1,ox1,oy1,n2,ox2,oy2)`, `setLimit(sw1,sw2,tw)`, `enableMotor(bool)`, `setMaxMotorImpulse(n)`, `setDamping(n)`, `setDbgDrawSize(n)`, `scene.addConTwistConstraint(c)`

**键盘键值**：W=87, S=83, A=65, D=68, ↑=38, ↓=40, ←=37, →=39, 空格=32, R=82

**调试**：`log("message")`

#### 3.4 代码规则

1. **必须**包含初始化模板（3.2）
2. **必须**在末尾调用 `game.run()`
3. **所有** Label/Edit **必须**调用 `setFont("font/st.ttf", size)`
4. 图片路径 `"img/xxx.png"`，字体路径 `"font/st.ttf"`
5. 居中 `(w - nodeW) / 2`
6. 多分辨率：`var scaleX = w / 800; var scaleY = h / 600;`
7. `upDate` 中 `time` 参数是帧间隔（秒）
8. 颜色值域 0.0–1.0
9. 避开保留字：`game`, `window`, `canvas`, `log`

### 步骤 4 — 写入代码

**单文件**：写入 `main.js`

**多文件**：创建对应 `.js` 文件，更新 `.gmp`：
```json
{"proName":"工程名","file":{"n":["main.js","module1.js"]},"scene":{}}
```

### 步骤 5 — 导出

#### 默认：debug 竖屏一键导出

```cmd
start /wait "" "C:\Program Files\KaiweiEngine\gameIde.exe" /ba /debug /p "<工程路径>\<工程名>.gmp" C:
```

`/ba` 全平台 + `/debug` 调试版 + `/p` 竖屏 → 导出到 `C:`

#### release 模式（用户明确指定时）

**① 先创建安卓证书**（默认密码 111111）：

```cmd
start /wait "" "C:\Program Files\KaiweiEngine\gameIde.exe" /gks --name "<应用名>" --keystore C:\<keystore名>.jks --alias release_key --storepass 111111
```

**② 再一键 release 导出**：

```cmd
start /wait "" "C:\Program Files\KaiweiEngine\gameIde.exe" /ba /release /p --name "<应用名>" --pkg <包名> --ver 1.0.0 --code 1 --keystore C:\<keystore名>.jks --storepass 111111 --alias release_key --icon "C:\Program Files\KaiweiEngine\resource\img\icon.png" --splash "C:\Program Files\KaiweiEngine\resource\img\splash.png" "<工程路径>\<工程名>.gmp" C:
```

### 步骤 6 — 运行游戏查看效果

一键导出后，运行导出的 exe 目录中的 `run.exe` 查看游戏运行效果：

```cmd
start "" "C:\<工程名称>_exe\run.exe"
```

- 导出目录结构：`C:\<工程名称>_exe\` 包含 `run.exe`
- `start ""` 非阻塞启动，让游戏窗口独立运行

### 步骤 7 — 报告

向用户输出：工程路径、文件列表、导出产物位置、游戏运行结果。

---

## 四、关键提醒

| # | 规则 |
|---|------|
| 1 | CLI 命令必须 `start /wait ""` 前缀，依次阻塞执行 |
| 2 | 必须管理员权限运行 CLI |
| 3 | 路径含空格用双引号包裹 |
| 4 | 导出目录用 `C:` 而非 `C:\` |
| 5 | **API 约束**：只能使用 API 文档和实例源码中已有的函数；V8 原生 JS 不受限制 |
| 6 | 导出安卓时引擎自动检测/下载打包环境 |
