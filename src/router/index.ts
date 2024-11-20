import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../middlewares/auth.js'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/appointment',
      name: 'appointment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AppointmentView.vue'),
      meta: {
        requiresAuth: true // Add meta field to indicate protected route
      }
    },
    {
      path: '/patient',
      name: 'patient',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PatientView.vue'),
      meta: {
        requiresAuth: true // Add meta field to indicate protected route
      }
    },
    {
      path: '/data',
      name: 'data',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DataView.vue'),
      meta: {
        requiresAuth: true // Add meta field to indicate protected route
      }
    },
    {
      path: '/map',
      name: 'map',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MapView.vue'),
      meta: {
        requiresAuth: true // Add meta field to indicate protected route
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login') // Redirige vers la page de login si non authentifié
  } else {
    next() // Autorise l'accès
  }
})

export default router
