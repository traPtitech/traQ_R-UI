<template lang="pug">
div.tag
  modal(@close="closeModal" :active="active")
    div.tag-modal
      ModalHeaderCenterAligned.tag-modal-header(:title="model.tag" faIconName="tag")
      div.tag-modal-description
        | 「{{model.tag}}」 がつけられているユーザー
      div.tag-user-list
        MemberElement.tag-user-element(v-for="member in model.users" :model="member" :key="member.userId")

</template>
<script>
import ModalHeaderCenterAligned from '@/components/Util/ModalHeaderCenterAligned'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
export default {
  name: 'Tag',
  components: {
    ModalHeaderCenterAligned,
    MemberElement
  },
  data () {
    return {
      tagInput: ''
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('closeTagModal')
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
.tag-modal
  .tag-modal-header
    @media (min-width: 680px)
      min-height: 5rem
    @media (max-width: 679px)
      min-height: 4rem

  .tag-modal-description
    max-width: calc(80vw - 4rem)
    font-size: 1.3rem
    margin: 1rem 2rem 0.5rem 2rem
    overflow-wrap: break-word
  .tag-user-list
    margin: 0.5rem 2rem 2rem 2rem
    height: 25vh
    overflow-y: scroll
    border: 1px solid #eeeeee
    background-color: #ffffff
  .tag-user-element
    margin: 0.5rem
</style>
