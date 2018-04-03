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
        input(v-model="tagInput" v-on:keydown.enter="addTag(tagInput)")
        p(v-on:click="addTag(tagInput)")
          | 追加
        div.user-modal-tag-element(v-for="(tag, index) in tags")
          div
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
    addTag (tag) {
      if (tag === '') {
        return
      }
      client.addUserTag(this.model.userId, tag)
      .then(() => {
        this.tagInput = ''
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    eraseTag (id) {
      console.log(id)
      client.deleteUserTag(this.model.userId, this.tags[id].tagId)
      .then(() => {
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    lockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, true)
      .then(() => {
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    unlockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, false)
      .then(() => {
        this.$store.dispatch('updateCurrentUserTags')
      })
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
