/**
 * Pinia 仓库初始化配置
 * 导出 createPinia 实例供 main.js 使用
 */

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
export * from '@/stores/admin'
