import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Marked from '@/components/Marked'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/marked/',
      name: 'Marked',
      component: Marked
    }, {
      path: '/',
      name: 'Index',
      component: Index
    }
  ],
  mode: 'history'
})
