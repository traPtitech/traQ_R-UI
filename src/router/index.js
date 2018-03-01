import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import store from '@/store/index'

import Index from '@/components/Main/Index'
import Login from '@/components/Login/Login'
import NotFound from '@/components/NotFound'
import Register from '@/components/Register/Register'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
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
      path: '/register',
      component: Register
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})

router.beforeEach(async (to, from, next) => {
  // if (!store.me) {
  //   next('/login')
  // }
  //
  if (!store.state.me && to.path === '/login') {
    store.commit('loadEnd')
    next(true)
    return
  }

  if (!store.state.me) {
    await store.dispatch('whoAmI')
    next('/login')
    return
  }

  // ここ以下はログインしている
  if (to.path === '/login') {
    next('/channels/random')
    return
  }

  if (!store.state.isLoaded) {
    await Promise.all([
      store.dispatch('updateChannels'),
      store.dispatch('updateMembers'),
      store.dispatch('updateClipedMessages')
    ])
  }

  if (!to.params.channel) {
    store.commit('loadEnd')
    next(true)
    return
  }

  const nextChannel = store.getters.getChannelByName(to.params.channel)
  if (!nextChannel) {
    next(false)
  } else {
    store.commit('changeChannel', nextChannel)
    store.dispatch('getMessages')
    store.dispatch('getCurrentChannelTopic', nextChannel.channelId)
    store.dispatch('getCurrentChannelPinnedMessages', nextChannel.channelId)
    next(true)
  }
  store.commit('loadEnd')
})

export default router
