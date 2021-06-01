<template>
  <div id="console-content"
       ref="consoleContentBody">
    <div id="contentForClear"></div>
  </div>
</template>

<script>
import Vue from "vue";
import JsonConsole from "@/components/common/JsonConsole";

/**普通日志*/
const LOG_INFO = "INFO";
const SERVER_LOG = "SERVER_LOG"
export default {
  name: 'consoleInfo',
  props: ['logType', 'dataMsg'], // jsonData可以为JSON字符串 也可以为对象
  components: {
    JsonConsole,
  },
  data() {
    return {
      contentDom: null,
      //日志输出信息
      consoleInfos: [],
      // 是否为收到消息，false为发送的消息
      isReceive: true,
      // 响应对象元素
      response: null,
    }
  },
  mounted() {
    this.funInit()
  },
  created() {
  },
  computed: {

  },
  watch: {
    // 异步赋值
    dataMsg() {
      this.funInit();
      deep: true
    },
  },
  methods: {
    checkIsJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
      return false;
    },
    funInit() {
      this.addConsoleInfo(this.logType, this.dataMsg);
      this.showConsoleInfo();
    },
    getTime() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
      return new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    },
    appendContent: function (text, data, response) {
      const time = this.getTime();
      const logEl = document.createElement("p");
      logEl.style.marginBottom = "0";
      logEl.innerText = "[" + text + "] " + time;
      const dialogClass = Vue.extend(JsonConsole);
      this.jsonConsoleComp = new dialogClass({
        propsData: {
          jsonData: JSON.stringify(data),
        },
      }).$mount();
      const jsonEl = this.jsonConsoleComp.$el;
      logEl.appendChild(jsonEl);
      response.appendChild(logEl);
    }, /**
     * 添加控制台打印信息
     * @param {信息类型} log 对应LOG_*
     * @param text
     * @param dataMsg
     */
    addConsoleInfo(log, dataMsg) {
      let contentBodyEl = document.createElement("div");
      contentBodyEl.setAttribute('id', 'content-body')
      if (log === "SUCCESS" || log === SERVER_LOG) {
        contentBodyEl.style.color = "#28a745";
      } else if (log === "ERROR") {
        contentBodyEl.style.color = "#dc3545";
      }
      let response = document.createElement("div");
      if (SERVER_LOG === log) {
        if (typeof dataMsg == 'string' && dataMsg) {
          let result = JSON.parse(dataMsg);
          this.appendContent("收到消息", result.input, response);
          this.appendContent("发送消息", result.output, response );
        }
      }
      contentBodyEl.appendChild(response);
      this.consoleInfos.push(contentBodyEl);
    },
    /**
     * 显示控制台信息
     */
    showConsoleInfo() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 1000; i++) {
          if (this.consoleInfos.length === 0) {
            break;
          }
          const el = this.consoleInfos.shift();
          fragment.appendChild(el);
        }
        if (document.getElementById("contentForClear")) {
          this.contentDom = document.getElementById("contentForClear");
        } else {
          this.contentDom = document.createElement("div");
          this.contentDom.setAttribute("id", "contentForClear");
        }
        this.contentDom.appendChild(fragment);
        const contentBodyEl = document.getElementById("console-content");
        this.contentDom.appendChild(fragment);
        contentBodyEl.append(this.contentDom);
        contentBodyEl.scrollTop = contentBodyEl.scrollHeight;
    },
    clearConsoleData(){
     document.getElementById("console-content").innerHTML="";
    },
  },
}
</script>

<style lang="scss">

</style>
