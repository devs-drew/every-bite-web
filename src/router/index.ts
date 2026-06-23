import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: () => import('@/views/AuthView.vue'), meta: { guest: true } },
    { path: '/register', component: () => import('@/views/AuthView.vue'), meta: { guest: true } },
    { path: '/dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/log/:date?', component: () => import('@/views/FoodLogView.vue'), meta: { requiresAuth: true } },
    { path: '/search', component: () => import('@/views/FoodSearchView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
})

export default router
