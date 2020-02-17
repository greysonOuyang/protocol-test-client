export default {
	requestType: '请求类型',
	select: '请选择',
	requestUrl: '请求地址',
	requestTips: '请求地址不能为空',
	httpUrlPlaceholder: "请输入请求路径,比如 http://127.0.0.1/test?id=1",
	httpUrlInvalidTips: '无效的请求地址,必须以http://或https://开头,主机不能为空',
	websocketUrlPlaceholder: "请输入WebSocket的路径,比如 ws://127.0.0.1/test?id=1",
	websocketUrlInvalidTips: '无效的请求地址,必须以ws://或wss://开头,主机不能为空',
	tcpHostTips: "请求主机地址不能为空",
	tcpHostPlaceholder: "请输入请求主机地址,比如 test.com 或 127.0.0.1",
	tcpPortPlaceholder: "请输入端口号,默认(80/443)",
	certSetting: '证书设置',
	certDefault: '使用默认证书',
	certPfx: '使用pfx证书',
	certPem: '使用pem证书',
	certJks: '使用jks证书',
	certKey: '请输入证书的key或password',
	certValue: '请输入证书的value',
	btnReadCertKey:'加载key',
	btnReadCertValue:'加载value',
	requestServerNamePlaceholder: '请输入主机名称',
	requestHeaders: 'header内容',
	inputKey: '请输入key',
	inputName: '请输入name',
	inputValue: '请输入value',
	requestBody: '请求内容',
	requestBodyPlaceholder: '请输入需要发送的内容',
	requestCount: '请求设置',
	requestCountPlaceholder: '请求总次数',
	requestTcpCountPlaceholder: '总连接数',
	requestCountTips: '必须大于0',
	requestAveragePlaceholder: '每次请求数量',
	requestTcpAveragePlaceholder: '发送内容次数',
	requestAverageTips: '必须大于0',
	requestIntervalPlaceholder: '每次请求的时间间隔(毫秒)',
	requestTcpIntervalPlaceholder: '发送内容的时间间隔(毫秒)',
	requestIntervalTips: '间隔必须大于1毫秒',
	statisticsInfo: '每{interval}毫秒请求{average}次, 共执行{count}次,最大建立连接{conn}, 累计请求{sum}次',
	requestConfigPrintInfo: '打印响应日志',
	requestConfigPrintInfoTips: '大量的请求打印响应日志,很考验浏览器的性能,请谨慎选择!',
	requestConfigTimeout: '请求超时(ms)',
	requestConfigKeepAlive: '控制台与URL服务器保持连接',
	requestConfigPoolSize: '最大建立连接数,默认为请求总次数',
	btnExecute: '开始执行',
	btnIsExecute: '正在执行中...',
	btnCancel: '取消',
	btnAdd: '添加',
	btnRemove: '删除',
	succee: '成功',
	fail: '失败',
	executeProgress: '执行进度',
	responseFailedCount: '失败数量',
	responseTimesCount: '统计信息',
	responseCode: '状态码',
	responseCount: '数量',
	responseTotalTime: '累计用时',
	responseMaxTime: '最高用时',
	responseMeanTime: '平均用时',
	dataLenInfo: '数据统计',
	requestDataLen: '请求数据长度',
	responseDataLen: '响应数据长度',
	serverMemory: '控制台性能',
	serverProcessors: '处理器数量',
	serverMaxMemory: '最大内存',
	serverTotalMemory: '可用内存',
	serverFreeMemory: '剩余内存',
	consoleConnecting: '正在连接控制台...',
	consoleConnected: '连接控制台成功!',
	consoleConnectFailed: '连接控制台失败,更多信息请查看浏览器控制台!',
	consoleClosed: '控制台已关闭!',
	commandTestResponseCount: '第{count}批请求',
	commandTestResponseIndex: '第{index}次',
	commandTestResponseState: '状态:{state}',
	commandTestResponseCode: '状态码:{code}',
	commandTestResponseConnTime: '连接用时:{connTime} ms',
	commandTestResponseEndTime: '响应用时:{endTime} ms',
	commandTestResponseBody: '响应信息:{body}',
	commandInvalidParameter: '无效的请求参数或缺失必填的参数,控制台响应信息:',
	commandBeforeRequestTestSucceeded: '进行请求前测成功,正在进行测试...',
	commandBeforeRequestTestFailed: '进行请求前测试失败:请检查你的服务是否可用,控制台响应信息:',
	commandTestComplete: '操作已完成!',


}
