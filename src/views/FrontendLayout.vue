<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="iconURL1" style="width: 50px; height: 50px" alt="品牌logo"></el-image>
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consulatation" class="nav-link" v-if="isloggedIn">AI咨询</router-link>
        <router-link to="/emotion-diary" class="nav-link" v-if="isloggedIn">情绪日记</router-link>
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button class="logout-btn" v-if="isloggedIn" @click="handleLogout">退出登录</el-button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>2026心理健康AI助手.保留所有权利</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { logout } from '../api/admin'

const iconURL1 = new URL('../assets/机器人.png', import.meta.url).href

const isloggedIn = ref(false)

onMounted(() => {
  isloggedIn.value = localStorage.getItem('token')
})

const handleLogout = async () => {
  await logout()
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isloggedIn.value = false
}
</script>
<style scoped lang="scss">
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
