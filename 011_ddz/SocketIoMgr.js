/**
 * 基于 SocketIO 类的长连接网络管理器
 */

class SocketIoManager {
    constructor() {
        // 配置信息
        this.nettyUrl = "https://imtest.linchixuan.com";
        //  this.nettyUrl = "https://2822h2f982.zicp.fun";

        this.appId = "h11do3gq";

        // 状态标识
        this.isConnected = false;

        // 实例初始化 (开维引擎底层 SocketIO 对象)
        this.socket = new SocketIO();

        // 协议分发映射表：替代 switch-case，提升 O(1) 查找性能
        this.msgHandlers = {
            "connectGame": (data) => {

            },
            "intoRoom": (data) => {
                //log("intoRoom: " + JSON.stringify(data))
                let d = data.data;
                DdzPage.roomId = d.rid;
                let room = d.room;

                let ddzPage = new DdzPage(room.end_gold);
                this.ddzPage = ddzPage;
            },
            "user_into_ddz": (data) => this.ddzPage.addUser(data.data),
            "game_deal": (data) => this.ddzPage.playData(data.data),
            "sendCard": (data) => this._onCommonStatusCheck(data),
            "trusteeship": (data) => {
                if(this.ddzPage) {
                    this.ddzPage.enableTg();
                }
            },
            "user_out": (data) => {
                if(this.ddzPage) {
                    //this.ddzPage.removeUser(data.data);
                }
            },

        };
    }


    newDdzPage(end_gold) {
        this.ddzPage = null;
        let ddzPage = new DdzPage(end_gold);
        this.ddzPage = ddzPage;
    }

    /**
     * 初始化 Netty 连接
     * @param {string} uid 用户 ID
     */
    init(uid) {
        if (!uid) {
            log("Netty Error: uid is required.");
            return;
        }

        // 初始化 AppID
        this.socket.initIO(this.appId);

        // 建立长连接
        const fullUrl = this.nettyUrl + "/" + this.appId;
        console.log("Connecting to " + fullUrl)
        this.socket.connectIO(fullUrl, "appId="+this.appId+"&uid="+uid+"&deviceId="+"1234567890123");

        // 注册引擎底层事件监听
        this.socket.on("connect", () => this._onOpen());
        this.socket.on("fail", (dat) => log("Netty iofail: " + dat));
        this.socket.on("close", (dat) => {
            this.isConnected = false;
            log("Netty ioclose: " + dat);
        });

        // 注册消息下发监听
        this.socket.on("SIO_MESSAGE_DOWN", (dat) => this._onMessageDown(dat));
        this.socket.on("SIO_MESSAGE_TRANSMIT_DOWN", (dat) => log("Transmit Down: " + dat));
        this.socket.on("SIO_INFO", (dat) => log("socket Info: " + dat));
        this.socket.on("SIO_MESSAGE_MONITOR_DOWN", (dat) => log("Monitor Down: " + dat));

    }

    /**
     * 连接开启回调
     */
    _onOpen() {
        this.isConnected = true;
        log("Netty Open Success");
        // 发送握手信号
        this.send("SIO_MESSAGE_UP");
    }

    /**
     * 统一消息接收处理
     */
    _onMessageDown(dat) {
        // 强制转换为字符串并清理
        const strData = String(dat).trim();
        const jsondat = JSON.parse(strData);

        log("");
        log("onMessageDown :"+JSON.stringify(jsondat));
        let type = jsondat.type;
        if (type != undefined){
            const handler = this.msgHandlers[type];
            if (handler) {
                log("handler type " + type);
                handler(jsondat);
            } else {
                log("Warning: No handler for type " + type);
            }
        }
    }

    /**
     * 业务逻辑：进入房间处理
     */
    _onIntoRoom(jsondat) {
        if (jsondat.status != 1) {
            if (typeof msg === "function") msg(jsondat.msg);
            return;
        }
        mainshow.gotoRoom(jsondat.data);
    }

    /**
     * 业务逻辑：通用状态校验
     */
    _onCommonStatusCheck(jsondat) {
        if (jsondat.status != 1) {
            log(JSON.stringify(jsondat.msg));
        }
    }

    /**
     * 发送网络数据
     * @param {string} data 要发送的字符串或指令
     */
    send(data) {
        if (!this.isConnected) {
            log("Netty Warning: Socket is not connected.");
            return;
        }
        log("Sending Data: " + data);
        this.socket.emitMsg("SIO_MESSAGE_UP", data);
    }
}

// 导出单例，方便全局调用
const socketIoMgr = new SocketIoManager();

