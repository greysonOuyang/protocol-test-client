import JsonConsole from "@/components/common/JsonConsole";
import ConsoleInfo from "@/components/common/ConsoleInfo";
import Server from "@/components/Server";
import Vue from "vue";
import axios from "axios";

/**http请求类型*/
const REQUEST_TYPE_HTTP = "HTTP";
/**WebSocket请求类型*/
const REQUEST_TYPE_WEB_SOCKET = "WebSocket";
/**TCP请求类型*/
const REQUEST_TYPE_TCP = "TCP";

/** UDP 请求类型 */
const REQUEST_TYPE_UDP = "UDP";

const REQUEST_TYPE_MODBUS = "ModBus";
/**证书类型,默认证书*/
const REQUEST_CERT_DEFAULT = "DEFAULT";
/**证书类型pem*/
const REQUEST_CERT_PEM = "PEM";
/**证书类型PFX*/
const REQUEST_CERT_PFX = "PFX";
/**证书类型JKS*/
const REQUEST_CERT_JKS = "JKS";

/**普通日志*/
const LOG_INFO = "INFO";
/**成功日志*/
const LOG_SUCCESS = "SUCCESS";
/**异常日志*/
const LOG_ERROR = "ERROR";

/** 取消操作 */
const WS_COMMAND_CANCEL = -1;
/** 提交测试*/
const WS_COMMAND_SUBMIT_TEST = 1;
/** 开始的前测试,成功data=1,失败data=0 */
const WS_COMMAND_BEFORE_REQUEST_TEST = 2;
/** 测试数据响应 */
const WS_COMMAND_TEST_RESPONSE = 3;
/** 日志输出 */
const WS_COMMAND_TEST_LOG_RESPONSE = 4;
/** 测试任务提交进度 */
const WS_COMMAND_TEST_SUBMIT_PROGRESS = 5;
/** 任务已完成 */
const WS_COMMAND_TEST_COMPLETE = 99;
/** 缺少请求参数或存在无效的请求参数 */
const WS_COMMAND_INVALID_PARAMETER = 412;
/** 失败响应 */
const WS_COMMAND_ERROR = 500;
/** 超过GC开销限制:501 */
const WS_COMMAND_GC_OVERHEAD_LIMIT = 501;
/** 失败响应 */
const WS_COMMAND_JVM_METRIC = 1000;

export default {
    name: "Orion-Stress-Tester",
    inject: ['reload'],
    // 默认显示客户端tab
    components: {
        JsonConsole,
        Server,
        ConsoleInfo
    },
    data() {
        return {
            dataMsg: null,
            logType: "",
            tag: "",
            // 是否需要获取配置项 ,获取成功后设置为false，不再重复获取
            isGetConfig: true,
            // 配置中是否有选择框
            isExistSelect: false,
            // 有多少个选择框要展示
            SelectConfigArr: [],
            //  结构为二维数组, configSelectValueArr[item.index]表示一个选择项的下拉框数组，二维即下拉框数组中的选项
            configSelectValueArr: [],
            isExistInput: false,
            // 配置表单展示项
            inputConfigArr: [],
            // 配置表单
            ConfigDataForm: {},
            // 多选框的配置表单
            selectArr: {},
            // 接口下拉框当前选择的值
            currentId: "",
            // 接口下拉框数据
            requestInterfaceSelection: [],
            change: {
                testInterface: "",
                protocolType: "none",
                testSystem: "",
                gzIscsApplyFrame: "",
                paramData: "",
            },
            contextSlect: {
                isOpen: "1",
                showType: "1",
                limitStyle: "1",
                priority: "1",
                textcont: "",
                showTime: "10",
            },
            // 测试接口服务类别
            testSystemOpt: [
                {
                    value: "gzIscs",
                    label: "广州综合监控",
                },
                {
                    value: "qyAts",
                    label: "清远ATS",
                },
            ],
            // 广州综合监控的信号接口类型
            gzIscsInterfaceOpt: [
                {
                    value: "ats",
                    label: "地面ATS",
                },
                {
                    value: "turnstileState",
                    label: "闸机状态",
                },
                {
                    value: "passengerFlow",
                    label: "站内客流",
                },
            ],
            qyAtsInterfaceOpt: [
                {
                    value: "ats",
                    label: "清远ATS",
                },
            ],
            // 应用层协议类别
            protocolTypeOpt: [
                {
                    value: "none",
                    label: "无",
                },
                {
                    value: "modbus",
                    label: "ModBus",
                },
            ],
            gzIscsApplyFrameOpt: [
                {
                    value: "heart",
                    label: "心跳信息",
                },
                {
                    value: "train",
                    label: "列车信息",
                },
                {
                    value: "plan",
                    label: "计划信息",
                },
                {
                    value: "trainSchedule",
                    label: "首末班信息",
                },
                {
                    value: "doorStatus",
                    label: "车门隔离状态信息",
                },
            ],
            inputText: "",
            outputText: "",
            // 测试程序当前状态 0--客户端 1--服务端
            systemStatus: 0,
            // 请求内容形式 0--JSON 3--配置
            contentFormat: "0",
            // 寄存器个数
            registerCount: "",
            // 开始地址
            startAddress: "",
            // 功能码
            functionCode: "",
            writeData: "",
            // json控制台组件
            jsonConsoleComp: null,
            // 是否展示json控制台
            showJsonFlag: false,
            // json数据
            jsonData: {},
            // 是否显示请求统计信息
            isStatistics: false,
            //请求统计的信息
            statisticsInfo: "",
            //是否正在执行中
            isExecuting: false,
            //是否已经执行过
            isExecuted: false,
            //是否打印响应内容的选中的开启或关闭条件
            printShowLimit: 5000,
            //请求设置
            requestConfig: {
                //是否打印响应内容
                printResInfo: true,
                //测试机与URL服务器保持连接
                keepAlive: true,
                //最大建立连接数
                poolSize: null,
                //连接(请求)超时
                timeout: null,
            },
            //请求的数据
            requestData: {
                //请求的类型
                requestType: REQUEST_TYPE_HTTP,
                //WebSocket子协议
                subProtocols: [],
                //SNI 服务器名称
                serverName: "",
                //是否使用SSL
                isSSL: false,
                //证书的类型
                cert: "DEFAULT",
                //证书的key
                certKey: null,
                //证书的value
                certValue: null,
                //主机地址,TCP时有效
                host: "",
                //端口号,TCP、ModBus时有效
                port: null,
                //http请求的类型
                method: "GET",
                //请求的header数据
                headers: [],
                //请求的url
                url: "",
                //请求的body
                body: null,
                //请求的总次数
                count: 1,
                //每次请求多数次
                average: 1,
                //请求的间隔
                interval: 1,
            },
            //请求数据长度
            requestDataLen: 0,
            //请求响应数据长度
            responseDataLen: 0,
            //请求成功的数量
            responseSucceeded: 0,
            //请求失败的数量
            responseFailed: 0,
            responseTimeCount: [],
            serverMetrics: {
                processors: 0,
                totalMemory: 0,
                maxMemory: 0,
                freeMemory: 0,
            },
            //连接服务器的WebSocket
            websocket: null,
            //日志输出信息
            consoleInfos: [],
        };
    },
    created() {
        this.getRequestData();
    },
    activated() {
    },
    methods: {
        clearContent() {
            this.$refs.consoleInfoRef.clearContent();
        },
        getRequestData () {
            axios.post('/request/find/list/by/type', {params: {requestType: this.requestType}}).then(
                res => {
                    this.requestTable = res.data;
                }
            );
        },
        // 判断具体展现哪个
        watchBodyShowWhich() {
            if (this.contentFormat === "0") {
                return "json";
            } else if (this.contentFormat === "3") {
                if (this.requestData.requestType === REQUEST_TYPE_TCP) {
                    if (this.change.protocolType === "gzIscs") {
                        return "gzIscs";
                    }
                }
                if (this.requestData.requestType === REQUEST_TYPE_HTTP) {
                    return "config";
                }
                return "config";
            } else if (this.contentFormat === "4") {
                if (this.requestData.requestType === REQUEST_TYPE_TCP) {
                    return "modbusRead";
                }
            }else if (this.contentFormat === "5") {
                if (this.requestData.requestType === REQUEST_TYPE_TCP) {
                    return "modbusOperator";
                }
            }
            // 其余的只展示body
            return "json";
        },

        /**
         * 是否显示请求数量统计信息
         */
        isShowStatistics() {
            if (
                this.requestData.count > 0 &&
                this.requestData.average > 0 &&
                this.requestData.interval > 0
            ) {
                this.isStatistics = true;
                this.statisticsInfo = (this.requestData.requestType == REQUEST_TYPE_HTTP
                        ? this.$t("statisticsInfo")
                        : this.$t("statisticsWsTcpInfo")
                )
                    .replace("{interval}", this.requestData.interval)
                    .replace("{average}", this.requestData.average)
                    .replace("{count}", this.requestData.count)
                    .replace(
                        "{conn}",
                        this.requestConfig.poolSize == null
                            ? this.requestData.count
                            : this.requestConfig.poolSize
                    )
                    .replace("{sum}", this.requestData.count * this.requestData.average);
            } else {
                this.isStatistics = false;
            }
        },
        /**
         * 删除SubProtocols
         * @param {Object} item
         */
        removeSubProtocols(item) {
            this.$confirm("确认关闭？")
                .then((res) => {
                    var index = this.requestData.subProtocols.indexOf(item);
                    if (index !== -1) {
                        this.requestData.subProtocols.splice(index, 1);
                    }
                })
                .catch((err) => {
                });
        },
        /**
         * 添加SubProtocols
         */
        addSubProtocols() {
            this.requestData.subProtocols.push({
                value: "",
                key: Date.now(),
            });
        },
        /**
         * 删除header
         * @param {Object} item
         */
        removeHeader(item) {
            this.$confirm("确认关闭？")
                .then((res) => {
                    var index = this.requestData.headers.indexOf(item);
                    if (index !== -1) {
                        this.requestData.headers.splice(index, 1);
                    }
                })
                .catch((err) => {
                });
        },
        /**
         * 添加header
         */
        addHeader() {
            this.requestData.headers.push({
                key: "",
                value: "",
            });
        },
        /**
         * 加载证书的key
         */
        loadCertKey() {
            var reader = new FileReader();
            var file = this.$refs.readCertKey.files[0];
            reader.readAsText(file);
            var tis = this;
            reader.onload = function (res) {
                try {
                    tis.requestData.certKey = res.target.result;
                } catch (err) {
                    console.log(err);
                }
            };
        },
        /**
         * 加载证书的value
         */
        loadCertValue() {
            var reader = new FileReader();
            var file = this.$refs.readCertValue.files[0];
            reader.readAsText(file);
            var tis = this;
            reader.onload = function (res) {
                try {
                    tis.requestData.certValue = res.target.result;
                } catch (err) {
                    console.log(err);
                }
            };
        },
        /**
         * 清楚数据为默认数据
         */
        clearToDefaultData() {
            //请求数据长度
            this.requestDataLen = 0;
            //请求响应数据长度
            this.responseDataLen = 0;
            //请求成功的数量
            this.responseSucceeded = 0;
            //请求失败的数量
            this.responseFailed = 0;
            //请求统计信息
            this.responseTimeCount = [];
        },
        /**
         * 截取小数点并四舍五入
         * @param {Double} num
         * @param {int} len
         */
        toFixed(num, len) {
            var index = num.toString().indexOf(".");
            if (index != -1) {
                if (num.toString().substring(index).length > len) {
                    return num.toFixed(len);
                } else {
                    return num;
                }
            } else {
                return num;
            }
        },
        /**
         * 执行请求
         */
        execute() {
            function buildHeader(trData, reqData) {
                if (
                    trData.headers != null &&
                    trData.headers.length != 0 &&
                    trData.requestType != REQUEST_TYPE_TCP
                ) {
                    var headers = [];
                    for (var i = 0; i < trData.headers.length; i++) {
                        var h = trData.headers[i];
                        if (h.key.trim() != "" && h.value.trim() != "") {
                            headers.push(h);
                        }
                    }
                    if (headers.length > 0) {
                        reqData.headers = headers;
                    }
                }
            }

            // 构建请求body
            function buildBody(trData, reqData) {
                if (this.contentFormat === "0") {
                    if (trData.body != null && trData.body.trim() !== "") {
                        reqData.body = trData.body.trim();
                    }
                } else if (this.contentFormat === "3") {
                    if (this.selectArr !== null) {
                        let body = {}
                        body = JSON.stringify(this.selectArr);
                        reqData.body = JSON.parse(body);
                    }
                } else if (this.contentFormat === "4" || this.contentFormat === "5") {
                    let body = {};
                    body.functionCode = this.functionCode;
                    body.registerCount = this.registerCount;
                    body.startAddress = this.startAddress;
                    body.isOpen = this.contextSlect.isOpen;
                    body.showType = this.contextSlect.showType;
                    body.limitStyle = this.contextSlect.limitStyle;
                    body.priority = this.contextSlect.priority;
                    body.textCont = this.contextSlect.textcont;
                    body.showTime = this.contextSlect.showTime;
                    reqData.body = body;
                }
            }

            /**
             * 设置默认端口
             * @param trData
             * @param reqData
             */
            function setDefaultValue(trData, reqData) {
                if (
                    trData.port === "" ||
                    trData < 0 ||
                    trData > 65535 ||
                    isNaN(parseInt(trData.port))
                ) {
                    if (this.requestType === REQUEST_TYPE_TCP) {
                        if (this.change.protocolType === "modbus") {
                            reqData.port = 502;
                        } else {
                            reqData.port = trData.isSSL ? 443 : 80;
                        }
                    } else if (trData.requestType === REQUEST_TYPE_UDP) {
                        reqData.port = 9999;
                    }
                } else {
                    // 输入值合法,取输入值
                    reqData.port = parseInt(trData.port);
                }
            }

            this.$refs.requestTable.validate((valid) => {
                if (valid) {
                    this.isExecuting = true; //修改是否在执行状态,执行中
                    this.isExecuted = true; //标记前端控制台状态为已执行
                    var connectMsg = this.$t("consoleConnecting");
                    this.$refs.consoleInfoRef.addConsoleInfo(LOG_INFO, connectMsg, "text");
                    this.$refs.consoleInfoRef.showConsoleInfo();
                    //连接WebSocket并在open后请求数据
                    var wshost = process.env.VUE_APP_BASE_API;
                    if (wshost == null || wshost == "wlhost") {
                        wshost = window.location.host;
                    }
                    this.websocket = new WebSocket("ws://" + wshost + "/ws/ost");
                    this.websocket.onopen = () => {
                        var connected = this.$t("consoleConnected");
                        this.$refs.consoleInfoRef.addConsoleInfo(LOG_SUCCESS, connected);
                        this.$refs.consoleInfoRef.showConsoleInfo();
                        var trData = this.requestData;
                        //初始化默认数据
                        this.clearToDefaultData();

                        //加载请求数据
                        var reqData = {
                            type: trData.requestType,
                            count: trData.count,
                            average: trData.average,
                            interval: trData.interval,
                            protocolType: this.change.protocolType,
                        };
                        // host
                        if (trData.host == null || trData.host === "") {
                            reqData.host = "127.0.0.1";
                        } else {
                            reqData.host = trData.host.trim();
                        }
                        if (trData.url == null || trData.url === "") {
                            reqData.url = "127.0.0.1";
                        } else {
                            reqData.url = trData.url.trim();
                        }

                        /* PORT 如果非法(取值过大或者非数字或者空) 则根据以下规则取值: 先判断协议是否为TCP？
                                     否--UDP 9999, 是-- 1. 应用层协议是否为modbus?是--502, 否-->
                                                            1.1 是否有SSL? 是--443, 否--80 */
                        setDefaultValue.call(this, trData, reqData);

                        if (trData.requestType === REQUEST_TYPE_WEB_SOCKET) {
                            if (trData.subProtocols.length > 0) {
                                var subPs = [];
                                for (var i = 0; i < trData.subProtocols.length; i++) {
                                    var v = trData.subProtocols[i].value;
                                    if (v != null && v.trim() != "") {
                                        subPs.push(v.trim());
                                    }
                                }
                                if (subPs.length > 0) {
                                    reqData.subProtocols = subPs;
                                }
                            }
                        }
                        if (trData.requestType === REQUEST_TYPE_TCP) {
                            // SSL
                            if (trData.isSSL) {
                                reqData.isSSL = true;
                                if (trData.cert === REQUEST_CERT_DEFAULT) {
                                    reqData.cert = REQUEST_CERT_DEFAULT;
                                } else if (
                                    trData.certKey != null &&
                                    trData.certKey.trim() != "" &&
                                    trData.certValue != null &&
                                    trData.certValue.trim() != ""
                                ) {
                                    reqData.cert = trData.cert;
                                    reqData.certKey = trData.certKey.trim();
                                    reqData.certValue = trData.certValue.trim();
                                }
                            }
                        }

                        if (trData.requestType == REQUEST_TYPE_HTTP) {
                            reqData.method = trData.method;
                        }

                        // 构建请求头
                        buildHeader(trData, reqData);

                        // 构建请求body
                        buildBody.call(this, trData, reqData);

                        reqData.keepAlive = this.requestConfig.keepAlive;
                        if (reqData.keepAlive) {
                            var vu = this.requestConfig.poolSize;
                            if (vu == null || vu == 0 || vu == "" || isNaN(parseInt(vu))) {
                                vu = trData.count;
                            }
                            reqData.poolSize = parseInt(vu);
                        }
                        if (
                            this.requestConfig.timeout != null &&
                            this.requestConfig.timeout > 0
                        ) {
                            reqData.timeout = parseInt(this.requestConfig.timeout);
                        }

                        reqData.printResInfo = this.requestConfig.printResInfo;
                        var body = {code: WS_COMMAND_SUBMIT_TEST, data: reqData};
                        this.websocket.send(JSON.stringify(body));
                    };
                    //异常事件
                    this.websocket.onerror = (err) => {
                        console.log("Connection error:");
                        console.log(err);
                        this.isExecuting = false; //修改是否在执行状态,执行结束
                        this.$refs.consoleInfoRef.addConsoleInfo(LOG_ERROR, this.$t("consoleConnectFailed"));
                        this.$refs.consoleInfoRef.showConsoleInfo();
                    };
                    //每一秒钟显示控制台信息
                    var showLogs = setInterval(() => {
                        this.$refs.consoleInfoRef.showConsoleInfo();
                    }, 1000);
                    //关闭事件
                    this.websocket.onclose = () => {
                        window.clearInterval(showLogs);
                        this.$refs.consoleInfoRef.showConsoleInfo(1);
                        this.isExecuting = false; //修改是否在执行状态,执行结束
                        console.log(this.$t("consoleClosed"));
                    };
                    //响应事件
                    this.websocket.onmessage = (res) => {
                        //这里处理后台返回的结果
                        var data = JSON.parse(res.data);
                        // console.log(data);
                        if (data.code == WS_COMMAND_INVALID_PARAMETER) {
                            //缺少参数或取消参数的响应
                            this.$refs.consoleInfoRef.addConsoleInfo(
                                LOG_ERROR,
                                this.$t("commandInvalidParameter") + data.msg
                            );
                            this.$refs.consoleInfoRef.showConsoleInfo();
                            this.websocket.close();
                        } else if (data.code == WS_COMMAND_BEFORE_REQUEST_TEST) {
                            //提交测试前的测试响应
                            if (data.data == 1) {
                                this.$refs.consoleInfoRef.addConsoleInfo(
                                    LOG_SUCCESS,
                                    this.$t("commandBeforeRequestTestSucceeded")
                                );
                                this.$refs.consoleInfoRef.showConsoleInfo();
                            } else {
                                this.$refs.consoleInfoRef.addConsoleInfo(
                                    LOG_ERROR,
                                    this.$t("commandBeforeRequestTestFailed") + data.msg
                                );
                                this.$refs.consoleInfoRef.showConsoleInfo();
                                this.websocket.close();
                            }
                        } else if (data.code == WS_COMMAND_GC_OVERHEAD_LIMIT) {
                            //服务器超过GC开销限制,无法继续工作
                            this.$refs.consoleInfoRef.addConsoleInfo(LOG_ERROR, this.$t("commandGcOverheadLimit"));
                            this.$refs.consoleInfoRef.showConsoleInfo();
                            this.websocket.close();
                        } else if (data.code == WS_COMMAND_JVM_METRIC) {
                            //服务器性能
                            var rd = data.data;
                            this.serverMetrics.processors = rd.processors;
                            this.serverMetrics.totalMemory = this.toFixed(
                                rd.totalMemory / 1048576,
                                5
                            );
                            this.serverMetrics.maxMemory = this.toFixed(
                                rd.maxMemory / 1048576,
                                5
                            );
                            this.serverMetrics.freeMemory = this.toFixed(
                                rd.freeMemory / 1048576,
                                5
                            );
                        } else if (data.code == WS_COMMAND_TEST_LOG_RESPONSE) {
                            var response;

                            //请求日志响应
                            var resData = data.data;
                            // 请求结果 成功或者失败
                            var state =
                                resData.state == 1 ? this.$t("succee") : this.$t("fail");
                            // 请求批次
                            var responseMsg = {};
                            responseMsg.count = this.$t("commandTestResponseCount").replace(
                                "{count}",
                                resData.count
                            );
                            if (resData.index != 0) {
                                responseMsg.index = this.$t("commandTestResponseIndex").replace(
                                    "{index}",
                                    resData.index
                                );
                            }
                            responseMsg.state = this.$t("commandTestResponseState").replace(
                                "{state}",
                                state
                            );
                            responseMsg.code = this.$t("commandTestResponseCode").replace(
                                "{code}",
                                resData.code
                            );
                            if (resData.body != null) {
                                responseMsg.body = this.$t("commandTestResponseBody").replace(
                                    "{body}",
                                    resData.body
                                );
                            }
                            var content = JSON.stringify(resData.body);

                            var responnseData = {
                                请求批次: resData.count,
                                第几次请求: resData.index,
                                请求状态: resData.state,
                                响应状态码: resData.code,
                                响应内容: content,
                            };
                            console.log("当前消息：" + responnseData);
                            if (this.requestConfig.printResInfo) {
                                this.$refs.consoleInfoRef.addConsoleInfo(LOG_INFO, responnseData, "client");
                                this.$refs.consoleInfoRef.showConsoleInfo();
                            }
                        } else if (data.code == WS_COMMAND_TEST_SUBMIT_PROGRESS) {
                            //显示任务进度
                            var resData = data.data;
                            var msg = this.$t("commandTestSubmitted").replace(
                                "{count}",
                                resData.count
                            );
                            this.$refs.consoleInfoRef.addConsoleInfo(LOG_SUCCESS, msg);
                            this.$refs.consoleInfoRef.showConsoleInfo();
                        } else if (data.code == WS_COMMAND_TEST_RESPONSE) {
                            //测试统计信息响应
                            var resData = data.data;
                            //获取http/ws响应长度数据统计
                            var vhcbr = resData["vertx.http.client.bytesReceived"];
                            if (vhcbr == null) {
                                //获取tcp的响应数据长度
                                vhcbr = resData["vertx.net.client.bytesReceived"];
                            }
                            if (vhcbr != null && vhcbr.length > 0) {
                                var total = 0;
                                for (var i = 0; i < vhcbr.length; i++) {
                                    total += vhcbr[i].total;
                                }
                                this.responseDataLen = total;
                            }
                            //获取http/ws发送数据长度统计
                            var vhcbs = resData["vertx.http.client.bytesSent"];
                            if (vhcbs == null) {
                                //获取tcp发送数据长度统计
                                vhcbs = resData["vertx.net.client.bytesSent"];
                            }
                            if (vhcbs != null && vhcbs.length > 0) {
                                var total = 0;
                                for (var i = 0; i < vhcbs.length; i++) {
                                    total += vhcbs[i].total;
                                }
                                this.requestDataLen = total;
                            }
                            //获取http/ws响应统计
                            var vhcrt = resData["vertx.http.client.responseTime"];
                            if (vhcrt != null && vhcrt.length > 0) {
                                this.responseTimeCount = [];
                                for (var i = 0; i < vhcrt.length; i++) {
                                    var obj = vhcrt[i];
                                    var timeCount = {};
                                    timeCount.code = obj.tags.code;
                                    timeCount.count = obj.count;
                                    timeCount.total = this.toFixed(obj.totalTimeMs, 5);
                                    timeCount.max = this.toFixed(obj.maxMs, 5);
                                    timeCount.mean = this.toFixed(obj.meanMs, 5);
                                    this.responseTimeCount.push(timeCount);
                                }
                            }
                            //获取已成功处理数量
                            this.responseSucceeded = resData.succeeded;
                            //获取处理已失败数量
                            this.responseFailed = resData.failed;
                        } else if (data.code == WS_COMMAND_TEST_COMPLETE) {
                            this.$refs.consoleInfoRef.addConsoleInfo(LOG_SUCCESS, this.$t("commandTestComplete"));
                            this.$refs.consoleInfoRef.showConsoleInfo();
                        }
                    };
                    this.$nextTick(() => {
                        document.documentElement.scrollTop = document.body.scrollHeight;
                    });
                }
            });
        },
        /**
         * 取消执行
         */
        executeCancel() {
            this.isExecuting = false;
            if (this.websocket != null) {
                this.websocket.close();
            }
        },
    },
    watch: {
        currentId(val) {
            // 重置以下几个数组，目的是重新展示归属于每个接口的配置项
            this.configSelectValueArr = [];
            this.SelectConfigArr = [];
            this.inputConfigArr = [];
            let data = null;
            let configList = [];
            for (const v of this.requestInterfaceSelection) {
                if (v.id === this.currentId) {
                    data = v;
                }
            }
            // 数据回显 以及赋值
            if (data != null) {
                this.requestData.body = data.content;
                this.requestData.url = data.url;
                this.requestData.port = data.port;
                this.requestData.method = data.requestMethod;
                this.requestData.protocolType = data.protocolType;
                // 获取当前接口的配置内容
                configList = data.configList;
            }
            if (configList.length !== 0) {
                // 计数，用来记住curSelectValueArr是第几个下拉框的下拉选项
                let index = 0;
                for (const v of configList) {
                    let configType = v.configType;
                    // 遍历配置内容中的数据，是input则添加一个输入框到页面；是select则添加一个下拉框
                    if (configType === "input") {
                        this.isExistInput = true;
                        this.inputConfigArr.push(v);
                    }
                    if (configType === "select") {
                        this.isExistSelect = true;
                        v.index = index;
                        this.SelectConfigArr.push(v);
                        index = index + 1;
                        const configArr = v.configValue.split("；");
                        let i;
                        // 当前下拉框的下拉选项
                        let curSelectValueArr = [];
                        for (i = 0; i < configArr.length; i++) {
                            let obj = {};
                            obj.key = i;
                            obj.label = configArr[i];
                            curSelectValueArr.push(obj);
                        }
                        this.configSelectValueArr.push(curSelectValueArr);
                    }
                }
            }
        },
        "requestData.url"(val) {
            if (
                val.indexOf("https://") != -1 &&
                this.requestData.requestType == REQUEST_TYPE_HTTP
            ) {
                this.requestData.isSSL = true;
            } else if (
                val.indexOf("wss://") != -1 &&
                this.requestData.requestType == REQUEST_TYPE_WEB_SOCKET
            ) {
                this.requestData.isSSL = true;
            } else if (this.requestData.requestType != "TCP") {
                this.requestData.isSSL = false;
            }
        },
        "requestData.requestType"() {
            if (
                this.requestData.url.indexOf("https://") != -1 &&
                this.requestData.requestType == REQUEST_TYPE_HTTP
            ) {
                this.requestData.isSSL = true;
            } else if (
                this.requestData.url.indexOf("wss://") != -1 &&
                this.requestData.requestType == REQUEST_TYPE_WEB_SOCKET
            ) {
                this.requestData.isSSL = true;
            } else if (this.requestData.requestType != REQUEST_TYPE_TCP) {
                this.requestData.isSSL = false;
            }
            this.getAllInterfaceInfo();
            this.currentId = "";
            this.requestData.url = "";
            this.requestData.body = "";
        },
        "requestData.count"() {
            if (
                this.requestData.count * this.requestData.average >
                this.printShowLimit
            ) {
                this.requestConfig.printResInfo = false;
            } else {
                this.requestConfig.printResInfo = true;
            }
            this.isShowStatistics();
        },
        "requestData.average"() {
            if (
                this.requestData.count * this.requestData.average >
                this.printShowLimit
            ) {
                this.requestConfig.printResInfo = false;
            } else {
                this.requestConfig.printResInfo = true;
            }
            this.isShowStatistics();
        },
        "requestData.interval"() {
            this.isShowStatistics();
        },
        "requestConfig.poolSize"() {
            this.isShowStatistics();
        },
    },
    computed: {
        // 计算当前要展示哪些请求形式 具体逻辑看代码注释
        contentFormatOpt() {
            let contentFormatOpt = [
                {
                    value: "0",
                    label: 'JSON'
                }
            ];
            let tempArr = [];
            // 如果当前选择了接口且接口存在配置项，那么可以选择配置形式
            if (this.currentId !== "") {
                let data = null;
                for (const v of this.requestInterfaceSelection) {
                    if (v.id === this.currentId) {
                        data = v;
                    }
                }
                let configList = data.configList;
                if (configList !== null && configList.length !== 0) {
                    tempArr = [
                        {
                            value: "3",
                            label: '配置'
                        },
                    ]
                }
            }
            if (this.requestData.requestType === REQUEST_TYPE_TCP) {
                // 是modbus协议
                if (this.change.protocolType === "modbus") {
                    tempArr = [
                        {
                            value: "4",
                            label: '读取操作参数'
                        },
                        {
                            value: "5",
                            label: '控制命令操作'
                        }
                    ];
                }
            }
            if (tempArr.length !== 0) {
                contentFormatOpt = contentFormatOpt.concat(tempArr);
            }
            return contentFormatOpt;
        },
        watchResponseHeaderColor() {
            // 获取响应状态
            if (this.responseSucceeded > this.responseFailed) {
                return "background-color:#e8f6f0;";
            } else if (this.responseSucceeded < this.responseFailed) {
                return "background-color:#fae7e7;";
            } else {
                return "";
            }
        },
    },
};
