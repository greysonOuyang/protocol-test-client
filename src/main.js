import Vue from "vue";
import App from "./App.vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import i18n from "./lang";
// import router from './router.js'

import axios from "./axios";
// import axios from "axios";
Vue.prototype.$axios = axios; //全局注册，使用方法为:this.$axios

import cloneDeep from 'lodash/cloneDeep';

Vue.prototype.$cloneDeep = cloneDeep


Vue.config.productionTip = false;

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});

new Vue({
  el: "#app",
  i18n,
  render: (h) => h(App),
});
