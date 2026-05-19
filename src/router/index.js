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

const FrontendRoutes = [
  {
    path: '/',
    component: () => import('@/views/FrontendLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/userHome.vue')
      },
      {
        path: '/consulatation',
        component: () => import('@/views/userConsulatation.vue')
      },
      {
        path: '/emotion-diary',
        component: () => import('@/views/userEmotionDiary.vue')
      },
      {
        path: '/knowledge',
        component: () => import('@/views/userKnowledge.vue')
      },
      {
        path: '/knowledge/article/:id',
        component: () => import('@/views/userArticleDetail.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...backendRoutes, ...FrontendRoutes]
})

// 路由前置守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // 管理员
    if (userInfo.userType === 2) {
      if (to.path.startsWith('/back')) {
        return true
      }
      return '/back/dashboard'
    }
    // 普通用户
    if (userInfo.userType === 1) {
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        return '/'
      }
      return true
    }
  }

  // 未登录访问后台页面，重定向到登录页
  if (to.path.startsWith('/back')) {
    return '/auth/login'
  }
  return true
})

export default router
