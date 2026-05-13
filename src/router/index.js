import { createRouter, createWebHistory } from 'vue-router'

const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
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
  },
  {
    path: '/auth',
    component: () => import('@/components/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/views/AuthLogin.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/AuthRegister.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: backendRoutes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const token = localStorage.getItem('token')
  // 如果是登录页面，并且token存在，则跳转到首页
  if (token) {
    // 判断是用户还是后台
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // 如果是后台
    if (userInfo.userType === 2) {
      // 在后台页面可进行下一步
      if (to.path.startsWith('/back')) {
        next()
      } else {
        // 胡乱输入则跳转到后台页面
        next('/back/dashboard')
      }
      // 如果是用户 还没写
    } else if (userInfo.userType === 1) {
    }
    // 如果是前台
  } else {
    // 如果是后台页面则跳转到登录页面
    if (to.path.startsWith('/back')) {
      next('/auth/login')
    } else {
      // 否则正常进行下一步
      next()
    }
  }
})

export default router
