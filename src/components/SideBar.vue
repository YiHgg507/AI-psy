<template>
  <el-aside :width="isCollapsed ? '64px' : '200px'">
    <el-menu
      default-active="2"
      class="menu-style"
      :collapse="isCollapsed"
      :collapse-transition="false"
    >
      <div class="brand">
        <el-image
          :src="iconUrl"
          alt="logo"
          style="width: 50px; height: 50px; margin-right: 10px; flex-shrink: 0"
        ></el-image>
        <div class="info-card" v-show="!isCollapsed">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item
        @click="selectMenu"
        v-for="item in router.options.routes[0].children"
        :key="item.path"
        :index="item.path"
        class="menu-main"
      >
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'
// 需要加href
const router = useRouter()
const iconUrl = new URL('../assets/机器人.png', import.meta.url).href
const selectMenu = (key) => {
  // router.options.routes[0]就是根路由
  // 包含path根路径和children子路由
  const currentRoute = router.options.routes[0]
  console.log(router)
  console.log(key)
  // 跳转至该路径
  router.push(`${currentRoute.path}/${key.index}`)
}
//直接加计算属性，不用加函数
const isCollapsed = computed(() => useAdminStore().isCollapsed)
</script>
<style lang="scss" scoped>
.menu-style {
  height: 100%;
  .brand {
    // 弹性布局，居中 padding10 白色背景 底部边框1 实线 颜色e5e7eb
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    .info-card {
      .brand-title {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
      }
      .brand-subtitle {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }
}
</style>
