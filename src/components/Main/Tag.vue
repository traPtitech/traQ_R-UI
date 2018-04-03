<template lang="pug">
div.tag
  modal(@close="closeModal" :active="active")
    div.tag-modal
      p
        | {{model.tag}} がつけられているユーザー
      ul.tag-user-list
        li.tag-user(v-for="user in model.users" v-on:click="openUserModal(user.userId)")
          | @{{user.name}}
</template>
<script>
export default {
  name: 'Tag',
  data () {
    return {
      tagInput: ''
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('closeTagModal')
    },
    openUserModal (userId) {
      this.$store.dispatch('openUserModal', userId)
    }
  },
  computed: {
    active () {
      if (this.$store.state.tagModal) {
        return true
      } else {
        return false
      }
    },
    model () {
      return this.$store.state.tagModal || {}
    }
  }
}
</script>
<style lang="sass">
</style>
