import client from '@/bin/client'

export default {
  namespaced: true,
  state: {
    name: null,
    data: null,
    currentUserTags: [],
    currentTagUserIds: [],
    currentUserGroupIds: [],
    lastUser: null
  },
  getters: {
    isActive: state => !!state.name,
    currentUserTagsSorted: state => {
      const current = state.currentUserTags
      return current.filter(tag => !tag.editable).concat(current.filter(tag => tag.editable))
    },
    currentTagUsersSorted: state => {
      return state.currentTagUserIds
    },
    currentUserGroupsSorted: (state, _, rootState) => {
      const currentIds = state.currentUserGroupIds
      const current = currentIds.map(id => rootState.groupMap[id])
      return current.filter(group => group.type === 'grade').concat(current.filter(group => group.type !== 'grade'))
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
    setCurrentTagUserIds (state, users) {
      users = users || []
      state.currentTagUserIds = users
    },
    setCurrentUserGroupIds (state, groups) {
      groups = groups || []
      state.currentUserGroupIds = groups
    }
  },
  actions: {
    updateCurrentUserTags ({state, commit}) {
      return client.getUserTags(state.data.userId)
      .then(res => {
        commit('setCurrentUserTags', res.data)
      })
    },
    updateCurrentUserGroupIds ({state, commit}) {
      return client.getUserGroups(state.data.userId)
      .then(res => {
        commit('setCurrentUserGroupIds', res.data)
      })
    },
    updateCurrentTagUserIds ({state, commit}) {
      return client.getTag(state.data.tagId).then(res => {
        commit('setCurrentTagUserIds', res.data.users)
      })
    },
    openUserModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, userId) {
        if (/#/.test(rootState.memberMap[userId].name)) return
        if (rootState.memberMap[userId].accountStatus === 0) return
        dispatch('open', {
          name: 'UserModal',
          data: rootState.memberMap[userId]
        })
        return Promise.all([
          dispatch('updateCurrentUserTags'),
          dispatch('updateCurrentUserGroupIds')
        ])
      }
    },
    openGroupModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, groupId) {
        dispatch('open', {
          name: 'GroupModal',
          data: rootState.groupMap[groupId]
        })
      }
    },
    openTagModal: {
      root: true,
      handler ({state, rootState, commit, dispatch}, tag) {
        dispatch('open', {
          name: 'TagModal',
          data: tag
        })
        return dispatch('updateCurrentTagUserIds')
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
      if (state.name === 'UserModal') {
        // Transition from user modal
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
