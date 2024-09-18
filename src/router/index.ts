import Test from '@/components/Test.vue'
import MingyLogin3 from '@/components/login/MingyLogin3.vue'
import Workspace from '@/components/workspace/Workspace.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/test',
      component: Test
    },
    {
      path: '/index',
      name: 'jia',
      component: MingyLogin3
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: Workspace
    },

  ]
})
export default router