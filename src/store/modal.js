import client from '@/bin/client'

export default {
  namespaced: true,
  state: {
    name: null,
    data: null,
    currentUserTags: []
  },
  getters: {
    isActive: state => !!state.name,
    currentUserTagsSorted: state => {
      const current = state.currentUserTags
      return current.filter(tag => !tag.editable).concat(current.filter(tag => tag.editable))
    }
  },
  mutations: {
    setUserModal (state, user) {
      state.data = user
    },
    setTagModal (state, tag) {
      state.data = tag
    },
    setModalName (state, name) {
      state.name = name
    },
    setModalData (state, data) {
      state.data = data
    },
    setCurrentUserTags (state, tags) {
      tags = tags || []
      state.currentUserTags = tags
    }
  },
  actions: {
    updateCurrentUserTags ({state, commit}) {
      return client.getUserTags(state.data.userId)
      .then(res => {
        commit('setCurrentUserTags', res.data)
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
      handler ({state, rootState, commit, dispatch}, tagId) {
        dispatch('open', {
          name: 'TagModal',
          data: rootState.tagMap[tagId]
        })
      }
    },
    openTopicModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, tagId) {
        dispatch('open', {
          name: 'TopicModal',
          data: rootState.tagMap[tagId]
        })
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
    open ({commit}, {name, data}) {
      commit('setModalName', name)
      commit('setModalData', data)
    },
    close ({commit}) {
      commit('setModalName', null)
      commit('setModalData', null)
    }
  }
}
