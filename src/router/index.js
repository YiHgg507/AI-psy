import { createRouter, createWebHistory } from 'vue-router'

const backendRoutes = [
  {
    path: '/back',
    component: () => import('@/components/BackendLayout.vue'),
    children: [
      {
        path: 'dashboard', //子路由不加/
        component: () => import('@/views/DashBoard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/KnowledgeArticle.vue'),
        meta: {
          title: '用户管理',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consulation',
        component: () => import('@/views/ConsultationRecord.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/EmotionalDiary.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: backendRoutes
})

export default router
