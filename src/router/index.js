import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Markdown from '@/components/Markdown'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/markdown',
      name: 'Markdown',
      component: Markdown
    }, {
      path: '/index',
      name: 'Index',
      component: Index
    }
  ]
})
