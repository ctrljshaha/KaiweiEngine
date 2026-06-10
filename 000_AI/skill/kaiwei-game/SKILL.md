---
name: kaiwei-game
description: |
  使用开维游戏引擎(KaiweiEngine)自动生成游戏并一键竖屏导出到所有平台(exe/html/微信小游戏/安卓)。
  当用户需要创建游戏、生成游戏代码、导出游戏时使用。
  触发词：开维、kaiwei、游戏引擎、生成游戏、导出游戏、小游戏、制作游戏。
---

# 开维游戏引擎 (KaiweiEngine) 游戏自动生成与导出

使用开维游戏引擎 JavaScript API，根据用户描述自动生成完整游戏项目，并一键竖屏导出 exe、html、微信小游戏、安卓 apk。

---

## 一、环境检测与安装

### 检测

判断 `C:\Program Files\KaiweiEngine\gameIde.exe` 文件是否存在：

```bash
test -f "C:/Program Files/KaiweiEngine/gameIde.exe" && echo "INSTALLED" || echo "NOT_INSTALLED"
```

### 自动下载安装（如未安装）

```bash
curl -L -o "$TEMP/kaiwei_gameide_setup.exe" "https://www.ikaiwei.com/download/gamejs/kaiwei_gameide_setup.exe"
start /wait "" "$TEMP/kaiwei_gameide_setup.exe" /S /D=C:\Program Files\KaiweiEngine
rm -f "$TEMP/kaiwei_gameide_setup.exe"
```

安装完成后默认路径为 `C:\Program Files\KaiweiEngine`，包含：
- `gameIde.exe` — CLI 命令行工具
- `example\` — 游戏实例（001_HelloWorld ~ 110_ai_fruit）
- `AI\skill\` — AI 知识库文件（API 参考、代码实例、CLI 手册）

---

## 二、引擎资料库

| 文件 | 路径 | 用途 |
|------|------|------|
| API 参考 | `C:\Program Files\KaiweiEngine\AI\skill\KaiweiEngine-api.md` | 所有类、函数签名、参数表、返回值、示例 |
| 代码实例 | `C:\Program Files\KaiweiEngine\AI\skill\KaiweiEngine-example.md` | 5 个完整游戏源码供大模型学习 |
| CLI 手册 | `C:\Program Files\KaiweiEngine\AI\skill\KaiweiEngine-cli.md` | 18 条 CLI 命令实例 |
| 模板工程 | `C:\Program Files\KaiweiEngine\example\001_HelloWorld` | 默认字体 `font/st.ttf`、logo 图片 `img/logo.png` |

**这些文件已复制到本 skill 的 `assets/references/user/` 目录中，生成代码时直接读取。**

---

## 三、游戏自动生成流程

> **约定**：所有 CLI 命令必须用 `start /wait ""` 前缀，确保命令阻塞执行完毕后再继续下一步。

### 步骤 1 — 新建工程

```bash
start /wait "" "C:\Program Files\KaiweiEngine\gameIde.exe" /c "<工程全路径>"
```

- **默认路径**：`C:\<工程名称>`（C 盘根目录下）
- 也可由用户在对话中指定
- 此命令自动创建工程目录结构：`main.js`、`<工程名>.gmp`、`resource\` 目录

### 步骤 2 — 拷贝模板资源

```bash
xcopy "C:\Program Files\KaiweiEngine\example\001_HelloWorld\resource\font" "<工程路径>\resource\font" /E /I /Y
xcopy "C:\Program Files\KaiweiEngine\example\001_HelloWorld\resource\img" "<工程路径>\resource\img" /E /I /Y
```

- `font\st.ttf` — 中文字体库（必需，Label/Edit 控件依赖此文件）
- `img\logo.png` — 默认 logo 图片

如果用户提供了自定义资源（图片、音效等），一并拷贝到 `resource\` 对应子目录。

### 步骤 3 — 生成游戏代码

**在编写代码前，必须先阅读以下文件：**
1. `assets/references/user/KaiweiEngine-api.md` — 完整 API 参考
2. `assets/references/user/KaiweiEngine-example.md` — 完整游戏实例源码

根据用户描述的游戏需求，生成符合开维引擎 API 规范的 JavaScript 代码。

#### 3.1 必要初始化模板

```js
// ----------------------------------------------------------------------------------------------
// 初始化引擎与环境
// ----------------------------------------------------------------------------------------------
var system = game.getSystemName();         // WINDOWS / WEB / WEIXIN
var webOS = game.getOS();                  // 操作系统
var webDeviceType = game.getDeviceType();  // PC / Phone / Pad
var webDpr = game.getDpr();                // 设备像素比
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

#### 3.2 可用 API 速查

**game 全局**：`init()`, `initSize(w,h)`, `getSystemName()`, `getOS()`, `getDeviceType()`, `getDpr()`, `getWindow()`, `getResource()`, `setFPS(n)`, `pushScene(s)`, `popScene()`, `replaceScene(s)`, `setKeyCallBack(fn)`, `run()`

**Window**：`getWidth()`, `getHeight()`, `setIcon(tex)`, `setTitle(str)`

**Resource**：`getTexture("img/xxx.png")` → 返回纹理对象

**Scene**：`new Scene()`, `setBg(tex)`, `setColor(r,g,b,a)` (0-1), `addNode(n)`, `removeNode(n)`, `getChilds()`, `upDate((time)=>{})`, `onPress((x,y)=>{})`, `onMove((x,y)=>{})`, `onRelease((x,y)=>{})`

**Node（所有控件基类）**：`setPosition(x,y)`, `getPosition()`, `setSize(w,h)`, `getSize()`, `setColor(r,g,b,a)`, `getColor()`, `setRotate(deg)`, `getRotate()`, `setHide(bool)`, `isHide()`, `addNode(child)`, `removeNode(child)`, `getNodes()`, `upDate(fn)`, `isContainPostion(x,y)`

**Label**：`new Label()`, `setFont("font/st.ttf", size)`, `setText(str)`, `setTextColor(r,g,b,a)`, `click((type,x,y)=>{})`, `longClick((type,x,y)=>{})`, `setTexture(tex)`, `setPadding(n)`
- type: 0=左键, 1=右键（网页和微信中右键失效）

**Sprite**：`new Sprite()`, `setTexture(tex)`, `click(fn)`, `longClick(fn)`, `getSprite()`

**Edit**：`new Edit()`, `setFont("font/st.ttf", size)`, `setTexture(tex)`, `setPadding(n)`, `getText()`, `setPubText("提示")`

**ProgressBar**：`new ProgressBar()`, `setBgTexture(tex)`, `setTexture(tex)`, `setBgColor(r,g,b,a)`, `setMax(n)`, `setValue(n)`, `getValue()`, `getMax()`

**Slide**：`new Slide()`, `setBarTexture(tex)`, `setBarColor(r,g,b,a)`, `setMax(n)`, `setValue(n)`, `getValue()`, `getMax()`

**ScrollView**：`new ScrollView()`, `setContentSize(w,h)`, `setShowHBar(bool)`, `setShowVBar(bool)`, `setScrollOffsetX(n)`, `setScrollOffsetY(n)`, `addNode(n)`, `getVScrollBar()`, `getHScrollBar()`

**Audio**：`new Audio()`, `playMusic("sound/x.mp3")`, `playMusicOne("sound/x.mp3")`, `stopMusic()`, `playSound("sound/x.wav")`, `setMusicVolume(0-1)`, `setSoundVolume(0-1)`, `getMusicVolume()`, `getSoundVolume()`

**Http**：`new Http()`, `get(url, callback)`, `post(url, data, callback)`

**SocketIO**：`new SocketIO()`, `initIO(appid)`, `connectIO(url, params)`, `on(event, callback)`, `emitMsg(event, data)`, `disConnect()`

**物理引擎 — 刚体**：`setMass(n)`, `useBoxBody()`, `useSphereBody()`, `useCapsuleShape()`, `setSpeed(vx,vy)`, `getSpeed()`, `setRestitution(n)`, `getRestitution()`, `setFriction(n)`, `getFriction()`, `setCentralForce(fx,fy)`, `setCentralImpulse(ix,iy)`

**物理引擎 — 角色控制器**（需 `useCapsuleShape()`）：`setJumpSpeed(n)`, `getJumpSpeed()`, `setFallSpeed(n)`, `getFallSpeed()`, `setStepHeight(n)`, `getStepHeight()`, `setMoveSpeed(vx,vy)`, `getMoveSpeed()`, `jump()`, `onGround()`, `isPress()`, `setMaxSlope(deg)`, `getMaxSlope()`

**物理约束**：
- `BulletPoint2Point` — 点对点约束；`setData(n,ox,oy)` / `set2Data(n1,ox1,oy1,n2,ox2,oy2)`
- `BulletHinge` — 铰链约束；`setData(...)`, `setLimit(min,max)`, `getMin()`, `getMax()`
- `BulletSlider` — 滑动约束；`setData(...)`, `setLowerLinLimit(n)`, `setUpperLinLimit(n)`, `setTargetLinMotorVelocity(v)`, `setMaxLinMotorForce(f)`, `setPoweredLinMotor(bool)`
- `BulletConeTwist` — 圆锥扭曲约束；`set2Data(...)`, `setLimit(sw1,sw2,tw)`, `enableMotor(bool)`, `setMaxMotorImpulse(n)`, `setDamping(n)`, `setDbgDrawSize(n)`

**键盘键值**：W=87, S=83, A=65, D=68, ↑=38, ↓=40, ←=37, →=39, 空格=32, R=82

**调试**：`log("message")`

#### 3.3 代码规则

1. **必须**包含初始化模板（3.1）
2. **必须**在末尾调用 `game.run()`
3. **所有** Label / Edit **必须**调用 `setFont("font/st.ttf", size)`
4. 图片路径：`"img/xxx.png"`，字体路径：`"font/st.ttf"`
5. 屏幕居中：`(w - nodeW) / 2`
6. 多分辨率适配：`var scaleX = w / 800; var scaleY = h / 600;`
7. 帧回调 `time` = 帧间隔秒数（用于计时器）
8. 颜色值域：多数 API 用 0.0–1.0 浮点数
9. 避开保留变量：`game`, `window`, `canvas`, `log`

### 步骤 4 — 写入代码文件

**单文件**：将生成的代码写入 `main.js`

**多文件**：创建额外 `.js` 文件，并更新 `.gmp`：
```json
{"proName":"工程名","file":{"n":["main.js","module.js"]},"scene":{}}
```

### 步骤 5 — 一键竖屏导出

```bash
start /wait "" "C:\Program Files\KaiweiEngine\gameIde.exe" /ba /debug /p "<工程路径>\<工程名>.gmp" C:
```

| 参数 | 说明 |
|------|------|
| `/ba` | 一键导出所有平台 |
| `/debug` | 开发调试版（默认） |
| `/p` | 强制竖屏（默认） |
| `C:` | 导出到 C 盘根目录（默认） |

**包含的导出产物**：exe（Windows 可执行文件）、html（网页版）、微信小游戏工程、安卓 apk

各平台单独导出：
```bash
start /wait "" ".../gameIde.exe" /be "工程.gmp" C:    # 仅 exe
start /wait "" ".../gameIde.exe" /bh "工程.gmp" C:    # 仅 html
start /wait "" ".../gameIde.exe" /bw "工程.gmp" C:    # 仅微信小游戏
start /wait "" ".../gameIde.exe" /bk "工程.gmp" C:    # 仅安卓
```

### 步骤 6 — 报告

输出：工程路径、文件列表、导出产物位置。

---

## 四、关键提醒

- 所有 CLI 命令**必须** `start /wait ""` 前缀，等待执行完毕
- 路径含空格用双引号包裹
- 导出目录用 `C:` 而非 `C:\`
- 导出安卓时引擎会自动检测/下载安卓打包环境
- 微信小游戏字体文件过大时需用工具精简
