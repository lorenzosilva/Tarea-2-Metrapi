import { createRouter, createWebHistory } from 'vue-router'
import Metrapi from '@/views/Metrapi.vue'

const routes = [
  {
    path: '/',
    name: 'metrapi',
    component: Metrapi
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
