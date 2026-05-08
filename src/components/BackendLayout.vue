<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <!-- 之前去除了 el-aside，现在要在SiderBar中嵌套 -->
      <!-- <el-aside></el-aside> -->
      <SideBar></SideBar>
      <el-container>
        <el-header>
          <NavBar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import SideBar from './SideBar.vue'
import NavBar from './NavBar.vue'
</script>
<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container {
    height: 100%;
    .content-container {
      background-color: #fff;
      padding: 20px;
      // 视口高度减去导航栏高度和主页面内边距
      min-height: calc(100% - 74px);
    }
  }
}
</style>
