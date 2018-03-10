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
  if (!store.state.me) {
    await store.dispatch('whoAmI')
  }

  if (!store.state.me && navigator.onLine) {
    store.commit('loadEnd')
    if (to.path === '/login') {
      next(true)
      return
    }
    next('/login')
    return
  }

  // ここ以下はログインしている
  if (to.path === '/login') {
    next('/channels/random')
    return
  }

  if (!store.state.loaded) {
    // 起動後すぐ必要なもの
    await Promise.all([
      store.dispatch('updateChannels'),
      store.dispatch('updateMembers')
    ])

    // 起動後すぐには必要ないもの
    Promise.all([
      store.dispatch('updateClipedMessages'),
      store.dispatch('updateStaredChannels'),
      store.dispatch('updateUnreadMessages'),
      store.dispatch('updateTags'),
      store.dispatch('updateStamps')
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
    // メッセージの取得を優先するため
    store.dispatch('getMessages')
    .then(() => {
      store.dispatch('getCurrentChannelTopic', nextChannel.channelId)
      store.dispatch('getCurrentChannelPinnedMessages', nextChannel.channelId)
      store.dispatch('getCurrentChannelNotifications', nextChannel.channelId)
    })
    next(true)
  }
  store.commit('loadEnd')
})

export default router
