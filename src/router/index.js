import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

Vue.use(Router)

const asyncLoadComponents = component => {
  return () => {
    return component.then(data => {
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
      component: asyncLoadComponents(import('@/pages/Login/Login'))
    },
    {
      path: '/consent',
      name: 'Consent',
      component: asyncLoadComponents(import('@/pages/Consent/Consent'))
    },
    {
      path: '/setting',
      name: 'Setting',
      component: asyncLoadComponents(import('@/pages/Setting/Index'))
    },
    {
      path: '/',
      name: 'Index',
      component: asyncLoadComponents(import('@/pages/Main/Main'))
    },
    {
      path: '/channels/:channel(.*)',
      component: asyncLoadComponents(import('@/pages/Main/Main'))
    },
    {
      path: '/users/:user',
      component: asyncLoadComponents(import('@/pages/Main/Main'))
    },
    {
      path: '/register',
      component: asyncLoadComponents(import('@/pages/Register/Register'))
    },
    {
      path: '/pipeline',
      redirect: '/'
    },
    {
      path: '*',
      name: 'NotFound',
      component: asyncLoadComponents(import('@/pages/NotFound'))
    }
  ],
  mode: 'history'
})

router.beforeEach(async (to, from, next) => {
  store.dispatch('modal/close')

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

  if (to.path === '/login' && to.query.redirect) {
    document.location.href = `/pipeline?redirect=${encodeURIComponent(
      to.query.redirect
    )}`
    return
  }

  if (to.path === '/consent') {
    await Promise.all([store.dispatch('updateMembers')]).then(() =>
      store.dispatch('loadSetting')
    )
    store.commit('loadEnd')
    next(true)
    return
  }

  if (!store.state.loaded) {
    // 起動後すぐ必要なもの
    await Promise.all([
      store.dispatch('updateChannels'),
      store.dispatch('updateMembers'),
      store.dispatch('updateStamps')
    ]).then(() => store.dispatch('loadSetting'))

    // 起動後すぐには必要ないもの
    Promise.all([
      store.dispatch('updateClipedMessages'),
      store.dispatch('updateStaredChannels'),
      store.dispatch('updateUnreadMessages'),
      store.dispatch('updateGroups'),
      store.dispatch('updateChannelActivity'),
      store.dispatch('updateMyNotifiedChannels'),
      store.dispatch('updateWebhooks'),
      store.dispatch('getStampHistory')
    ])
  }

  // ここ以下はログインしている
  if (to.path === '/login' || to.path === '/') {
    if (store.state.openMode === 'particular') {
      next(
        `/channels/${store.getters.getChannelPathById(
          store.state.openChannelId
        )}`
      )
    } else if (store.state.openMode === 'lastOpen') {
      next(
        `/channels/${store.getters.getChannelPathById(
          store.state.lastChannelId
        )}`
      )
    } else {
      next('/channels/general')
    }
    return
  }

  store.commit('setMessageModal', false)

  if (to.params.user) {
    const nextUser = store.getters.getUserByName(to.params.user)
    if (nextUser) {
      const member = [nextUser.userId]
      if (store.state.me.userId !== nextUser.userId) {
        member.push(store.state.me.userId)
      }
      let channelId = nextUser.userId
      let channelExists = false
      if (nextUser.userId === store.state.me.userId) {
        const channel = store.getters.getDirectMessageChannels.find(
          c => c.member.length === 1
        )
        if (channel) {
          channelId = channel.channelId
          channelExists = true
        }
      } else {
        const channel = store.getters.getDirectMessageChannels.find(c =>
          c.member.some(userId => userId === nextUser.userId)
        )
        if (channel) {
          channelId = channel.channelId
          channelExists = true
        }
      }
      store.commit('changeChannel', {
        channelId: channelId,
        name: nextUser.name,
        parent: store.state.directMessageId,
        children: [],
        member: member,
        visibility: true,
        private: true,
        dm: true
      })
      store.dispatch('getMessages').then(() => {
        if (channelExists) {
          store.dispatch('getCurrentChannelPinnedMessages', channelId)
        } else {
          store.commit('setCurrentChannelPinnedMessages', [])
        }
      })
      next(true)
      store.commit('loadEnd')
      return
    } else {
      next('/notfound')
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
    next('/notfound')
    return
  } else {
    store.commit('changeChannel', nextChannel)
    store.dispatch('updateLastChannelId', nextChannel.channelId)
    // メッセージの取得を優先するため
    store.dispatch('getMessages').then(() => {
      store.dispatch('getChannelTopic', nextChannel.channelId)
      store.dispatch('getCurrentChannelPinnedMessages', nextChannel.channelId)
      store.dispatch('getCurrentChannelNotifications', nextChannel.channelId)
    })
    next(true)
  }
  store.commit('loadEnd')
})

window.changeChannel = channelPath => {
  router.push(`/channels/${channelPath}`)
}

export default router
