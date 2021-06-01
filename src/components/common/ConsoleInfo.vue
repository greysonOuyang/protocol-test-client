<template>
  <div id="console-content"
       ref="consoleContentBody">
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
    this.response = document.createElement("div");
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
    appendContent: function (text, data) {
      const time = new Date()
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
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
      this.response.appendChild(logEl);
    }, /**
     * 添加控制台打印信息
     * @param {信息类型} log 对应LOG_*
     * @param text
     * @param dataMsg
     */
    addConsoleInfo: function (log, dataMsg) {
      const el = document.createElement("div");
      if (log === "SUCCESS" || log === SERVER_LOG) {
        el.style.color = "#28a745";
      } else if (log === "ERROR") {
        el.style.color = "#dc3545";
      }
      if (SERVER_LOG === log) {
        if (typeof dataMsg == 'string' && dataMsg) {
          let result = JSON.parse(dataMsg);
          this.appendContent("收到消息", result.input);
          this.appendContent("发送消息", result.output);
        }
      }
      el.appendChild(this.response);
      this.consoleInfos.push(el);
    },
    /**
     * 显示控制台信息
     * @param {Object} all 是否显示完全部,1=显示完全部,其他不显示完全部
     */
    showConsoleInfo(all) {
      if (all == 1) {
        const fragment = document.createDocumentFragment();
        for (var i = 0; i < this.consoleInfos.length; i++) {
          var el = this.consoleInfos.shift();
          fragment.appendChild(el);
        }
        const dom = document.getElementById("console-content");
        dom.appendChild(fragment);
        dom.scrollTop = dom.scrollHeight;
      } else if (this.consoleInfos.length > 0) {
        const fragment = document.createDocumentFragment();
        for (var i = 0; i < 1000; i++) {
          if (this.consoleInfos.length == 0) {
            break;
          }
          var el = this.consoleInfos.shift();
          fragment.appendChild(el);
        }
        const dom = document.getElementById("console-content");
        dom.appendChild(fragment);
        dom.scrollTop = dom.scrollHeight;
      }
    },
    clearConsoleData(){
     document.getElementById("console-content").innerHTML="";
    },
  },
}
</script>

<style lang="scss">

</style>
