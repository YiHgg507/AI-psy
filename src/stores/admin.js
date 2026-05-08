import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAdminStore = defineStore('admin', () => {
  //声明数据
  const isCollapsed = ref(false)
  //声明操作数据的方法
  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
  }
  //返回数据
  return { isCollapsed, toggleCollapsed }
})
