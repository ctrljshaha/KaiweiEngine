/**
 * @file HttpMgr.js
 * @description 基于开维引擎 Http 类的网络请求封装
 */

class HttpManager {
    constructor() {
        // 核心配置
        //this.host = "http://182.92.72.7:8880/ddz/";
        this.host = "https://imtest.linchixuan.com/ddz/";
        // this.host = "http://127.0.0.1:8080/";

        this.httpClient = new Http();

        // 设备信息缓存，减少重复调用原生接口
        //this.deviceId = device.getUuid();
        this.deviceId = "1234567890";

        this.token = this.deviceId; // 业务逻辑中 token 暂等同于 uuid
    }

    /**
     * 通用 POST 请求封装
     * @param {string} path 请求路径
     * @param {Object} query 请求参数对象
     * @param {function} callback 成功回调
     */
    _post(path, query, callback) {
        if (!path) return;
        const fullUrl = this.host + path;

        // 执行引擎底层 POST
        this.httpClient.post(fullUrl, JSON.stringify(query), (response) => {
            log(fullUrl+" ,params: "+ JSON.stringify(query)+" ; response: " + response);
            // 预处理返回数据，如果是字符串则尝试解析
            let data = typeof response === 'string' ? JSON.parse(response) : response;
            if(callback !== null && typeof callback === 'function'){
                callback(data);
            }
        });
    }

    /**
     * 注册/登录通用逻辑
     * @param {string} name 用户名
     * @param {string} pwd 密码
     * @param {string} endpoint 接口名
     * @param {function} fc 回调
     */
    _authRequest(name, pwd, endpoint, fc) {
        if (!name || !pwd) {
            log("Auth Error: Name or Pwd is null");
            return;
        }
        let d = {
            tel: name,
            pwd: pwd,
            deviceid: this.deviceId,
            tokenid: this.token,
            isios: 0,
        }
        this._post(endpoint, d, fc);
    }

    // --- 业务接口 ---

    register(name, pwd, fc) {
        this._authRequest(name, pwd, "user/register", fc);
    }

    login(name, pwd, fc) {
        this._authRequest(name, pwd, "user/login", fc);
    }

    fetchProducts(fc) {
        this._post("shop/list", {type:"g"}, fc);
    }

    buyProduct(shopId, fc) {
        let uid = GlobalVariable.uid;
        this._post("shop/wxpay", {uid,shopId}, fc);
    }

    getGoldRank(fc) {
        let uid = GlobalVariable.uid;
        this._post("user/gold", {uid}, fc);
    }
    getGradeRank(fc) {
        let uid = GlobalVariable.uid;
        this._post("user/grade", {uid}, fc);
    }
    getUserInfo(fc) {
        let uid = GlobalVariable.uid;
        this._post("user/info?id="+uid, {id:uid}, (data)=>{
            GlobalVariable.userInfo = "";
            GlobalVariable.userInfo = data.data;
            log("user info: "+JSON.stringify(GlobalVariable.userInfo));
            if (fc !== undefined && typeof fc === 'function') {
                fc(data);
            }
        });
    }

    updateNickname(name, fc) {
        let uid = GlobalVariable.uid;
        this._post("user/upnick?id="+uid+"&nick="+name, {id:uid,nick:name}, fc);
    }
    upsex(fc) {
        let uid = GlobalVariable.uid;
        this._post("user/upsex?id="+uid, {"id":uid}, fc);
    }
}

// 导出全局单例
const httpMgr = new HttpManager();
