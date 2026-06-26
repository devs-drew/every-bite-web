import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        const auth = useAuthStore()
        if (auth.isAuthenticated) return '/dashboard'
        if (!localStorage.getItem('onboarding_seen')) return '/onboarding'
        return '/login'
      },
    },
    { path: '/onboarding', component: () => import('@/views/OnboardingView.vue') },
    { path: '/login', component: () => import('@/views/AuthView.vue'), meta: { guest: true } },
    { path: '/register', component: () => import('@/views/AuthView.vue'), meta: { guest: true } },
    { path: '/dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/stats', component: () => import('@/views/StatsView.vue'), meta: { requiresAuth: true } },
    { path: '/search', component: () => import('@/views/FoodSearchView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },
    { path: '/forgot-password', component: () => import('@/views/ForgotPasswordView.vue'), meta: { guest: true } },
    { path: '/reset-password', component: () => import('@/views/ResetPasswordView.vue') },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
})

export default router
