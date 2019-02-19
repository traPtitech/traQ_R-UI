import client from '@/bin/client'

export default {
  namespaced: true,
  state: {
    name: null,
    data: null,
    currentUserTags: [],
    currentTagUsers: [],
    lastUser: null
  },
  getters: {
    isActive: state => !!state.name,
    currentUserTagsSorted: state => {
      const current = state.currentUserTags
      return current.filter(tag => !tag.editable).concat(current.filter(tag => tag.editable))
    },
    currentTagUsersSorted: state => {
      return state.currentTagUsers
    }
  },
  mutations: {
    setModalName (state, name) {
      state.name = name
    },
    setModalData (state, data) {
      state.data = data
    },
    setLastUser (state, user) {
      state.lastUser = user
    },
    setCurrentUserTags (state, tags) {
      tags = tags || []
      state.currentUserTags = tags
    },
    setCurrentTagUsers (state, users) {
      users = users || []
      state.currentTagUsers = users
    }
  },
  actions: {
    updateCurrentUserTags ({state, commit}) {
      return client.getUserTags(state.data.userId)
      .then(res => {
        commit('setCurrentUserTags', res.data)
      })
    },
    updateCurrentTagUsers ({state, commit}) {
      return client.getTag(state.data.tagId).then(res => {
        commit('setCurrentTagUsers', res.data.users)
      })
    },
    openUserModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, userId) {
        if (/#/.test(rootState.memberMap[userId].name)) return
        dispatch('open', {
          name: 'UserModal',
          data: rootState.memberMap[userId]
        })
        return dispatch('updateCurrentUserTags')
      }
    },
    openTagModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, tag) {
        dispatch('open', {
          name: 'TagModal',
          data: tag
        })
        return dispatch('updateCurrentTagUsers')
      }
    },
    openChannelCreateModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}) {
        dispatch('open', { name: 'ChannelCreateModal' })
      }
    },
    openChannelNotificationModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}) {
        dispatch('open', { name: 'ChannelNotificationModal' })
      }
    },
    openPinnedModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, message) {
        dispatch('open', {
          name: 'PinnedModal',
          data: message
        })
      }
    },
    open ({state, commit}, {name, data}) {
      if (state.name === 'UserModal' && name === 'TagModal') {
        // Transition from user modal to tag modal
        commit('setLastUser', state.data)
      }
      commit('setModalName', name)
      commit('setModalData', data)
    },
    close ({commit}) {
      commit('setModalName', null)
      commit('setLastUser', null)
      commit('setModalData', null)
    }
  }
}
