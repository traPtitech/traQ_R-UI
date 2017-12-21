import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Markdown from '@/components/Markdown'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/markdown',
      name: 'Markdown',
      component: Markdown
    }
  ],
  mode: 'history'
})
