<template>
  <div id="console-content"
       ref="consoleContentBody">
    <div id="contentForClear"></div>
  </div>
</template>

<script>
import Vue from "vue";
import JsonConsole from "./JsonConsole";

export default {
  name: 'consoleInfo',
  props: ['logType', 'dataMsg', 'tag'], // jsonData可以为JSON字符串 也可以为对象
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
    // 异步赋值 值未改变传入进来不会触发更新， 用不了
    dataMsg() {
      this.funInit();
      // deep: true
    },
  },
  methods: {
    checkIsJSON(str) {
      if (typeof str == 'string') {
        try {
          const obj = JSON.parse(str);
          return !!(typeof obj == 'object' && obj);
        } catch (e) {
          return false;
        }
      }
      return false;
    },
    getTime() {
      const timezone = 8; //目标时区时间，东八区
      const offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
      const nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
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
     * @param log 对应LOG_*
     * @param dataMsg
     * @param tag 如何解析的标记
     */
    addConsoleInfo(log, dataMsg, tag) {
      // 对顶层的响应元素对象
      let contentBodyEl = document.createElement("div");
      contentBodyEl.setAttribute('id', 'content-body')
      if (log === "SUCCESS" || log === "INFO") {
        contentBodyEl.style.color = "#28a745";
      } else if (log === "ERROR") {
        contentBodyEl.style.color = "#dc3545";
      }
      // 响应元素挂在此处
      let response = document.createElement("div");
      if (log === "SUCCESS") {
        response.style.color = "#28a745";
      } else if (log === "ERROR") {
        response.style.color = "#dc3545";
      }
      if ("INFO" === log) {
        if (typeof dataMsg == 'string' && dataMsg) {
          if (tag === "text") {
            this.appendContent("工具日志", dataMsg, response);
          } else {
            let result = JSON.parse(dataMsg);
            this.appendContent("收到消息", result.input, response);
            this.appendContent("发送消息", result.output, response );
          }
        } else {
          if (tag === "client") {
            this.appendContent("收到消息", dataMsg, response);
          }
        }
      }
      contentBodyEl.appendChild(response);
      this.consoleInfos.push(contentBodyEl);
    },
    /**
     * 显示控制台信息
     * @param {Object} all 是否显示完全部,1=显示完全部,其他不显示完全部
     */
    showConsoleInfo(all) {
      const fragment = document.createDocumentFragment();
      const contentBodyEl = document.getElementById("console-content");
      let length = 1000;
      if (all === 1) {
        length = this.consoleInfos.length;
      }
      for (let i = 0; i < length; i++) {
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
      this.contentDom.appendChild(fragment);
      contentBodyEl.append(this.contentDom);
      contentBodyEl.scrollTop = contentBodyEl.scrollHeight;
    },
    clearContent() {
      const consoleContent = document.getElementById('contentForClear');
      const parent = consoleContent.parentElement;
      parent.removeChild(consoleContent);
    },
  },
}
</script>

<style lang="scss">

</style>
