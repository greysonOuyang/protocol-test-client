<template>
  <el-menu default-active="2"
           class="el-menu-vertical-demo"
           @open="handleOpen"
           @close="handleClose">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>模拟测试</span>
      </template>
      <el-menu-item index="1-1">客户端</el-menu-item>
      <el-menu-item index="1-2">服务端</el-menu-item>
    </el-submenu>

    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>接口管理</span>
      </template>
      <el-menu-item index="2-1">客户端</el-menu-item>
      <el-menu-item index="2-2">服务端</el-menu-item>
    </el-submenu>

    <!-- <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">接口管理</span>
    </el-menu-item> -->
  </el-menu>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>