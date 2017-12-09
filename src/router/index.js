import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Comp from '@/components/Comp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/comp',
      name: 'Comp',
      component: Comp
    }
  ],
  mode: 'history'
})
