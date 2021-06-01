import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
    // 是否启用日志 默认启用
    debug:true,
    // 客户端连接信息
    stompClient:{},
    // 初始化
    init(callBack){
        const socket = new SockJS('http://127.0.0.1:7090/wsServer')
        this.stompClient = Stomp.over(socket)
        this.stompClient.hasDebug = this.debug
        this.stompClient.connect({},suce =>{
            this.console("连接成功,信息如下 ↓");
            this.console(this.stompClient);
            if(callBack){
                callBack();
            }
        },err => {
            if(err) {
                this.console("连接失败,信息如下 ↓")
                this.console(err)
            }
        });
    },
    // 订阅
    sub(address,callBack){
        if(!this.stompClient.connected){
            this.console("没有连接,无法订阅");
            return;
        }
        // 生成 id
        let timestamp= new Date().getTime() + address
        this.console("订阅成功 -> "+address)
        this.stompClient.subscribe(address,message => {
            // this.console(address+" 订阅消息通知,信息如下 ↓")
            // this.console(message)
            let data = message.body;
            callBack(data);
        },{
            id: timestamp
        })
    },
    unSub(address){
        if(!this.stompClient.connected){
            this.console("没有连接,无法取消订阅 -> "+address);
            return;
        }
        let id = ""
        for(let item in this.stompClient.subscriptions){
            if(item.endsWith(address)){
                id = item;
                break;
            }
        }
        this.stompClient.unsubscribe(id);
        this.console("取消订阅成功 -> id:"+ id + " address:"+address)
    },
    // 断开连接
    disconnect(callBack){
        if(!this.stompClient.connected){
            this.console("没有连接,无法断开连接");
            return;
        }
        this.stompClient.disconnect(() =>{
            console.log("断开成功")
            if(callBack){
                callBack()
            }
        });
    },
    // 单位 秒
    reconnect(time){
        setInterval(() =>{
            if(!this.stompClient.connected){
                this.console("重新连接中...")
                this.init()
            }
        },time * 1000)
    },
    console(msg){
        if(this.debug){
            console.log(msg);
        }
    }
}