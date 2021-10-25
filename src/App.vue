<template>
  <el-container id="app">
    <!-- <router-view v-if="isRouterAlive"></router-view> -->
    <!-- 手机导航栏 -->
    <div id="mobile-bar">
      <img src="./assets/logo.png"
           alt=""
           class="menu-button" />
      <div class="logo"><a href="/">Orion-Stress-Tester</a></div>
    </div>
    <!-- 电脑导航栏 -->
    <el-header id="pc-bar">
      <a id="logo"
         href="/">
        <img src="./assets/yuyilogo.png"
             alt="" />
        <span><a href="http://www.yuyisz.com/" >宇翊调测工具</a></span>
      </a>
    </el-header>
    <el-container>
      <!-- 中心栏 -->
      <!-- <el-aside width="200px">
        <nav-menu></nav-menu>
      </el-aside> -->
      <el-main id="main">
        <el-tabs v-model="activeName"
                 type="card">
          <el-tab-pane label="请求测试"
                       name="client">
            <client></client>
          </el-tab-pane>
          <el-tab-pane label="请求管理"
                       name="configInterface">
            <request-config></request-config>
          </el-tab-pane>
          <el-tab-pane label="项目测试"
                       name="server">
            <server></server>
          </el-tab-pane>
          <el-tab-pane label="项目管理"
                       name="projectManage">
            <project-config></project-config>
          </el-tab-pane>
          <el-tab-pane label="综合监控"
                       name="ISCS">
            <iscs-manager></iscs-manager>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Server from "./components/Server";
import Client from "./components/Client"
import ProjectConfig from "./components/ProjectConfig"
import RequestConfig from "./components/RequestConfig";
import IscsManager from "./components/IscsManager";


export default {
  name: "App",
  components: {
    RequestConfig,
    Server,
    Client,
    ProjectConfig,
    IscsManager
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      activeName: "configInterface",
      isCollapse: true,
      isRouterAlive: true,
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => this.isRouterAlive = true)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style>
@import './assets/css/main.css';
</style>


