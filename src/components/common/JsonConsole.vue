<template>
  <pre class="json-item" v-html="jsonText" v-if="!isString"></pre>
  <div class="json-item string-box" v-html="jsonText" v-else></div>
</template>

<script>
  export default {
    name: 'jsonBox',
    props: ['jsonData'], // jsonData可以为JSON字符串 也可以为对象
    data() {
      return {
        jsonText: '',
        isString: false // 若是无法识别的JSON 直接以字符串的方式展示
      }
    },
    mounted() {
      this.funInit()
    },
    watch: {
      // 异步赋值
      jsonData() {
        this.funInit()
      }
    },
    methods: {
      funInit() {
        if (!this.jsonData) {
          this.jsonText = ''
          this.isString = false
        } else {
          this.jsonText = this.jsonFormat(this.jsonData)
        }
      },
      jsonFormat(jsonTemp) {
        let json = ''
        try {
          // stringify 时需指定缩进否则不会显示换行。为了防止传入的string没有指定 在此统一执行一遍
          if (typeof jsonTemp != 'string') {
            json = JSON.stringify(jsonTemp, undefined, 2);
          } else {
            json = JSON.stringify(JSON.parse(jsonTemp), undefined, 2)
          }
          let jsonObj = JSON.parse(json);
          if (typeof jsonObj === 'object') {
            this.isString = false
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
              let cls = 'number';
              if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  cls = 'key';
                } else {
                  cls = 'string';
                }
              } else if (/true|false/.test(match)) {
                cls = 'boolean';
              } else if (/null/.test(match)) {
                cls = 'null';
              }
              return '<span class="' + cls + '">' + match + '</span>';
            });
          } else {
            this.isString = true
            return jsonTemp
          }
        } catch (e) {
          this.isString = true
          return jsonTemp
        }
      }
    }
  }
</script>

<style lang="scss">
  .json-item {
    width: 100%;
    height: 100%;
    &.string-box {
      height: auto;
      line-height: 20px;
      overflow: hidden;
      word-break: break-all;
    }
    .number {
      color: #2FA0ED;
    }
    .string {
      color: #F16222;
    }
    .boolean {
      color: #00C099;
    }
    .null {
      color: #CC33CC;
    }
    .key {
      color: #424456;
    }
  }
</style>
