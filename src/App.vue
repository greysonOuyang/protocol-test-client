<template>
  <el-container id="app">
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
        <img src="./assets/logo.png"
             alt="" />
        <span>Orion-Stress-Tester</span>
      </a>
    </el-header>

    <el-container>
      <!-- 中心栏 -->
      <el-main id="main">
        <el-tabs v-model="activeName"
                 type="card">
          <el-tab-pane label="客户端"
                       name="client">
            <client></client>
          </el-tab-pane>
          <el-tab-pane label="服务端"
                       name="server">
            <el-form v-model="requestData"
                     label-width="100px"
                     label-position="right"
                     ref="requestServerTab">
              <server></server>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="接口配置"
                       name="configInterface">
            <el-form v-model="requestData"
                     label-width="100px"
                     label-position="right"
                     ref="configInterfaceTab">
              <interfacce-config></interfacce-config>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Server from "./components/server";
import Client from "./components/client"

export default {
  name: "App",
  components: {
    Server,
    Client
  },
  data () {
    return {
    }
  }
};
</script>

<style>
@import './assets/css/main.css';
</style>


