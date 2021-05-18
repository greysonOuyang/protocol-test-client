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
        <img src="./assets/logo.png"
             alt="" />
        <span>Orion-Stress-Tester</span>
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
          <el-tab-pane label="客户端"
                       name="client">
            <client></client>
          </el-tab-pane>
          <el-tab-pane label="服务端"
                       name="server">
            <server></server>
          </el-tab-pane>
          <!-- <el-tab-pane label="接口配置"
                       name="configInterface">
            <interface-manage></interface-manage>
          </el-tab-pane> -->
        </el-tabs>

      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Vue from "vue";
import axios from "axios";
import Server from "@/components/Server";
import Client from "@/components/Client"
import NavMenu from '@/components/NavMenu';
import InterfaceManage from '@/components/InterfaceManage';

export default {
  name: "App",
  components: {
    Server,
    Client,
    NavMenu,
    InterfaceManage,
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      activeName: "server",
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


