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
      component: asyncLoadComponents(import('@/pages/Login/Login.vue'))
    },
    {
      path: '/consent',
      name: 'Consent',
      component: asyncLoadComponents(import('@/pages/Consent/Consent.vue'))
    },
    {
      path: '/setting',
      name: 'Setting',
      component: asyncLoadComponents(import('@/pages/Setting/Index.vue'))
    },
    {
      path: '/',
      name: 'Index',
      component: asyncLoadComponents(import('@/pages/Main/Main.vue'))
    },
    {
      path: '/channels/:channel(.*)',
      component: asyncLoadComponents(import('@/pages/Main/Main.vue'))
    },
    {
      path: '/users/:user',
      component: asyncLoadComponents(import('@/pages/Main/Main.vue'))
    },
    {
      path: '/register',
      component: asyncLoadComponents(import('@/pages/Register/Register.vue'))
    },
    {
      path: '/pipeline',
      redirect: '/'
    },
    {
      path: '*',
      name: 'NotFound',
      component: asyncLoadComponents(import('@/pages/NotFound.vue'))
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
      next()
      return
    }
    next('/login')
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
      store.dispatch('updateMutedChannels'),
      store.dispatch('updateUnreadMessages'),
      store.dispatch('updateGroups'),
      store.dispatch('updateChannelActivity'),
      store.dispatch('updateMyNotifiedChannels'),
      store.dispatch('updateWebhooks')
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

  store.commit('setPinnedModal', false)

  if (to.params.user) {
    const nextUser = store.getters.getUserByName(to.params.user)
    let channel: Components.Schemas.Channel | undefined
    if (nextUser) {
      const member = [nextUser.userId || '']
      if (store.state.me && store.state.me.userId !== nextUser.userId) {
        member.push(store.state.me.userId || '')
      }
      let channelId = nextUser.userId
      if (store.state.me && nextUser.userId === store.state.me.userId) {
        channel = store.getters.getDirectMessageChannels.find(
          c => !!c.member && c.member.length === 1
        )
        if (channel) {
          channelId = channel.channelId
        }
      } else {
        channel = store.getters.getDirectMessageChannels.find(
          c => !!c.member && c.member.some(userId => userId === nextUser.userId)
        )
        if (channel) {
          channelId = channel.channelId
        }
      }
      if (channel) {
        channel.name = nextUser.name
        channel.parent = store.state.directMessageId
        channel.children = []
        channel.member = member
        channel.visibility = true
        channel.private = true
        channel.dm = true
        store.commit('changeChannel', channel)
      }
      store.commit('setCurrentChannelPinnedMessages', [])
      store.dispatch('getMessages')
      store.commit('loadEnd')
      next()
      return
    } else {
      next('/notfound')
      return
    }
  }

  if (!to.params.channel) {
    store.commit('loadEnd')
    next()
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
    next()
  }
  store.commit('loadEnd')
})

interface Window {
  changeChannel: (channelPath: string) => void
}
declare var window: Window

window.changeChannel = channelPath => {
  router.push(`/channels/${channelPath}`)
}

export default router
