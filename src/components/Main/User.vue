<template lang="pug">
div.user
  modal(@close="closeModal" :active="active")
    div.user-modal
      img.user-modal-img(:src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
      p
        | {{model.displayName}}
      small
        | @{{model.name}}
      div.user-modal-button(v-on:click="openDirectMessage")
        | DM
      div.user-modal-tag-container
        input(v-model="tagInput" v-on:keydown="keydown")
        p(v-on:click="addTag")
          | 追加
        div.user-modal-tag-element(v-for="(tag, index) in tags")
          div(v-on:click="openTagModal(tag.tagId)")
            | {{tag.tag}}
          div(v-show="!tag.isLocked" v-on:click="eraseTag(index)")
            i.fas.fa-times
          div(v-show="hasAuth && !tag.isLocked" v-on:click="lockTag(index)")
            i.fas.fa-lock-open
          div(v-show="hasAuth && tag.isLocked" v-on:click="unlockTag(index)")
            i.fas.fa-lock
</template>
<script>
import client from '@/bin/client'
export default {
  name: 'User',
  data () {
    return {
      tagInput: ''
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('closeUserModal')
    },
    openTagModal (tagId) {
      this.$store.dispatch('openTagModal', tagId)
    },
    keydown (event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        this.addTag()
        event.returnValue = false
      }
    },
    addTag () {
      if (this.tagInput === '') {
        return
      }
      client.addUserTag(this.model.userId, this.tagInput)
      .then(() => {
        this.tagInput = ''
      })
    },
    eraseTag (id) {
      client.deleteUserTag(this.model.userId, this.tags[id].tagId)
    },
    lockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, true)
    },
    unlockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, false)
    },
    openDirectMessage () {
      this.$router.push(`/users/${this.model.name}`)
      this.closeModal()
    }
  },
  computed: {
    active () {
      if (this.$store.state.userModal) {
        return true
      } else {
        return false
      }
    },
    model () {
      return this.$store.state.userModal || {}
    },
    tags () {
      return this.$store.state.currentUserTags
    },
    hasAuth () {
      if (this.$store.state.userModal) {
        return this.$store.state.userModal.name === this.$store.state.me.name
      }
      return false
    }
  }
}
</script>
<style lang="sass">
.user-modal
.user-modal-img
  width: 100px
  height: 100px
  background-color: gray
  border-radius: 100%
.user-modal-button
  cursor: pointer
.user-modal-tag-element
  display: inline-block
.user-modal-tag-element > div
  display: inline-block
</style>
