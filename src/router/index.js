import { createRouter, createWebHistory } from 'vue-router'
import DayView from '../views/DayView.vue'

const routes = [
  {
    path: '/day/:date',
    name: 'DayView',
    component: DayView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const today = new Date().toISOString().slice(0, 10)
      return `/day/${today}`
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
