import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import store from '@/store/index'

import Index from '@/components/Main/Index'
import Login from '@/components/Login/Login'
import NotFound from '@/components/NotFound'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
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
    },
    {
      path: '/channels/:channel(.*)',
      component: Index
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // if (!store.me) {
  //   next('/login')
  // }
  if (to.path === '/login') {
    store.commit('loadEnd')
    next(true)
    return
  }
  console.log('beforeEach')
  if (!store.state.loaded) {
    try {
      await store.dispatch('updateChannels')
        // this.$store.dispatch('updateMembers')
      store.commit('loadEnd')
    } catch (e) {
      store.commit('loadEnd')
      next('/login')
      return
    }
  }
  if (!to.params.channel) {
    next(true)
    return
  }
  const nextChannel = store.getters.getChannelByName(to.params.channel)
  if (!nextChannel) {
    next(false)
  } else {
    store.commit('changeChannel', nextChannel)
    next(true)
  }
})

export default router
