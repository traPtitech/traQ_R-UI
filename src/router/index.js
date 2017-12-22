import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Upload from '@/components/Upload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/upload',
      name: 'Upload',
      component: Upload
    }
  ],
  mode: 'history'
})
