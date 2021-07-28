import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import i18n from "./lang";
import axios from "./axios";
import stomp from "./stomp";
import cloneDeep from 'lodash/cloneDeep';
import func from './Global'

Vue.prototype.axios = axios; //全局注册，使用方法为:this.$axios
Vue.prototype.stomp = stomp;
Vue.prototype.$cloneDeep = cloneDeep
Vue.config.productionTip = false;

Vue.use(func);

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});

new Vue({
  el: "#app",
  i18n,
  render: (h) => h(App),
});
