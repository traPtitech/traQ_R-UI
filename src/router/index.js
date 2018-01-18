import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import Index from '@/components/Main/Index'
import Login from '@/components/Login/Login'
import NotFound from '@/components/NotFound'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Index',
      component: Index
      // redirect: to => {
      //  return 'Login'
      // }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
