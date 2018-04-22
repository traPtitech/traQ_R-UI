import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

Vue.use(Router)

const asyncLoadComponents = component => {
  return () => {
    return component
      .then(data => {
        if (process.env.NODE_ENV) {
          console.log('async load component:', data.default.name)
        }
        store.commit('loadEndComponent')
        return data
      })
  }
}

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: asyncLoadComponents(import('@/components/Login/Login'))
    },
    {
      path: '/setting',
      name: 'Setting',
      component: asyncLoadComponents(import('@/components/Setting/Index'))
    },
    {
      path: '/',
      name: 'Index',
      component: asyncLoadComponents(import('@/components/Main/Index'))
    },
    {
      path: '/channels/:channel(.*)',
      component: asyncLoadComponents(import('@/components/Main/Index'))
    },
    {
      path: '/users/:user',
      component: asyncLoadComponents(import('@/components/Main/Index'))
    },
    {
      path: '/register',
      component: asyncLoadComponents(import('@/components/Register/Register'))
    },
    {
      path: '*',
      name: 'NotFound',
      component: asyncLoadComponents(import('@/components/NotFound'))
    }
  ],
  mode: 'history'
})

router.beforeEach(async (to, from, next) => {
  store.commit('closeUserModal')

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
      store.dispatch('updateMembers'),
      store.dispatch('updateStamps')
    ])

    // 起動後すぐには必要ないもの
    Promise.all([
      store.dispatch('updateClipedMessages'),
      store.dispatch('updateStaredChannels'),
      store.dispatch('updateUnreadMessages'),
      store.dispatch('updateTags')
    ])
  }

  if (to.params.user) {
    const nextUser = store.getters.getUserByName(to.params.user)
    if (nextUser) {
      if (nextUser.name === store.state.me.name && store.getters.getDirectMessageChannels.filter(channel => channel.member && channel.member.length === 1).length > 0) {
        store.commit('changeChannel', store.getters.getDirectMessageChannels.filter(channel => channel.member && channel.member.length === 1)[0])
      } else if (nextUser.name !== store.state.me.name && store.getters.getDirectMessageChannels.filter(channel => channel.member && channel.member.includes(nextUser.userId)).length > 0) {
        store.commit('changeChannel', store.getters.getDirectMessageChannels.filter(channel => channel.member && channel.member.includes(nextUser.userId))[0])
      } else {
        const member = [nextUser.userId]
        if (store.state.me.userId !== nextUser.userId) {
          member.push(store.state.me.userId)
        }
        store.commit('changeChannel', {
          channelId: store.state.directMessageId,
          name: nextUser.name,
          parent: store.state.directMessageId,
          children: [],
          member: member,
          visibility: false
        })
      }
      store.dispatch('getMessages')
      .then(() => {
      })
      store.commit('loadEnd')
      next(true)
      return
    } else {
      next('NotFound')
      return
    }
  }

  if (!to.params.channel) {
    store.commit('loadEnd')
    next(true)
    return
  }

  const nextChannel = store.getters.getChannelByName(to.params.channel)
  if (!nextChannel) {
    next('NotFound')
    return
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
