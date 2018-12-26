<template lang="pug">
.tag-modal
  .tag-modal-description
    | 「{{data.tag}}」 がつけられているユーザー
  .tag-user-list
    MemberElement.tag-user-element(v-for="member in data.users" :model="member" :key="member.userId")
</template>

<script>
import { mapState } from 'vuex'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
export default {
  components: {
    MemberElement
  },
  methods: {
    closeModal () {
      this.$store.dispatch('modal/close')
    }
  },
  computed: {
    ...mapState('modal', ['data'])
  }
}
</script>

<style lang="sass">
.tag-modal-description
  max-width: calc(80vw - 4rem)
  font-size: 1.3rem
  margin: 1rem 2rem 0.5rem 2rem
  overflow-wrap: break-word
.tag-user-list
  margin: 1rem 2rem 2rem 2rem
  max-height: 50vh
  overflow-y: scroll
  border: 1px solid #eeeeee
  background-color: $primary-color
.tag-user-element
</style>
