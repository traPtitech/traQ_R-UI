import client from '@/bin/client'
import { S, G, M, A } from './type'
import { Getters, Mutations, Actions } from 'vuex'

const state = (): S => ({
  name: null,
  data: null,
  currentUserTags: [],
  currentTagUserIds: [],
  currentUserGroupIds: [],
  lastUser: null,
  qrLastLoad: null
})

const getters: Getters<S, G> = {
  isActive: state => !!state.name,
  currentUserTagsSorted: state => {
    return state.currentUserTags
  },
  currentTagUsersSorted: state => {
    return state.currentTagUserIds
  },
  currentUserGroupsSorted: (state, _, rootState) => {
    const currentIds = state.currentUserGroupIds
    const current = currentIds.map(id => rootState.groupMap[id])
    return current
      .filter(group => group.type === 'grade')
      .concat(current.filter(group => group.type !== 'grade'))
  }
}
const mutations: Mutations<S, M> = {
  setQRCodeImage(state) {
    if (
      !state.qrLastLoad ||
      new Date().getTime() - state.qrLastLoad > 1000 * 60 * 10
    ) {
      state.qrLastLoad = new Date().getTime()
    }
  },
  setModalName(state, name) {
    state.name = name
  },
  setModalData(state, data) {
    state.data = data
  },
  setLastUser(state, user) {
    state.lastUser = user
  },
  setCurrentUserTags(state, tags) {
    tags = tags || []
    state.currentUserTags = tags
  },
  setCurrentTagUserIds(state, users) {
    users = users || []
    state.currentTagUserIds = users
  },
  setCurrentUserGroupIds(state, groups) {
    groups = groups || []
    state.currentUserGroupIds = groups
  }
}
const actions: Actions<S, A, G, M> = {
  updateCurrentUserTags({ state, commit }) {
    return client.getUserTags(state.data.userId).then(res => {
      commit('setCurrentUserTags', res.data)
    })
  },
  updateCurrentUserGroupIds({ state, commit }) {
    return client.getUserGroups(state.data.userId).then(res => {
      commit('setCurrentUserGroupIds', res.data)
    })
  },
  updateCurrentTagUserIds({ state, commit }) {
    return client.getTag(state.data.tagId).then(res => {
      commit('setCurrentTagUserIds', res.data.users)
    })
  },
  openUserModal({ rootState, dispatch }, userId) {
    if (/#/.test(rootState.memberMap[userId].name || '')) return
    if (rootState.memberMap[userId].accountStatus === 0) return
    dispatch('open', {
      name: 'UserModal',
      data: rootState.memberMap[userId]
    })
    return Promise.all([
      dispatch('updateCurrentUserTags'),
      dispatch('updateCurrentUserGroupIds')
    ])
  },
  openGroupModal({ rootState, dispatch }, groupId) {
    dispatch('open', {
      name: 'GroupModal',
      data: rootState.groupMap[groupId]
    })
  },
  openTagModal({ dispatch }, tag) {
    dispatch('open', {
      name: 'TagModal',
      data: tag
    })
    return dispatch('updateCurrentTagUserIds')
  },
  openFileModal({ dispatch }, data) {
    dispatch('open', { name: 'FileModal', data })
  },
  openTourModal({ dispatch }, data) {
    dispatch('open', { name: 'TourModal', data })
  },
  openCodeModal({ dispatch }, data) {
    dispatch('open', { name: 'CodeModal', data })
  },
  openChannelCreateModal({ dispatch }) {
    dispatch('open', { name: 'ChannelCreateModal' })
  },
  openChannelNotificationModal({ dispatch }) {
    dispatch('open', { name: 'ChannelNotificationModal' })
  },
  openPinnedModal({ dispatch }, message) {
    dispatch('open', {
      name: 'PinnedModal',
      data: message
    })
  },
  open({ state, commit }, { name, data }) {
    if (state.name === 'UserModal') {
      // Transition from user modal
      commit('setLastUser', state.data)
    }
    commit('setModalName', name)
    commit('setModalData', data)
  },
  close({ commit }) {
    commit('setModalName', null)
    commit('setLastUser', null)
    commit('setModalData', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
