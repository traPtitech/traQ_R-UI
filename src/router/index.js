import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Input from '@/components/Input'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/input',
      name: 'Input',
      component: Input
    }
  ],
  mode: 'history'
})
