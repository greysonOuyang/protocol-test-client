import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/TheLogin";
import App from "@/App";
import Client from "@/components/Client";
import Server from "@/components/Server";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/home",
      name: "App",
      component: App,
      children: [
        { path: "server", name: "服务端", component: Server },
        { path: "client", name: "客户端", component: Client },
      ],
    },
  ],
});
