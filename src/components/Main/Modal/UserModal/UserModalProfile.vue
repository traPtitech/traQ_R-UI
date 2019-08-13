<template lang="pug">
transition(name="fade" mode="out-in")
  content.user-modal-profile(v-if="expanded" key="expand" data-is-expanded)
    UserModalProfileImage
    UserModalProfileInfoExpanded.user-modal-profile-area--info
  content.user-modal-profile(v-else key="brief")
    UserModalProfileImage
    UserModalProfileInfo.user-modal-profile-area--info
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import UserModalProfileImage from '@/components/Main/Modal/UserModal/UserModalProfile/UserModalProfileImage'
import UserModalProfileInfo from '@/components/Main/Modal/UserModal/UserModalProfile/UserModalProfileInfo'
import UserModalProfileInfoExpanded from '@/components/Main/Modal/UserModal/UserModalProfile/UserModalProfileInfoExpanded'

export default {
  name: 'UserModalProfile',
  components: {
    UserModalProfileImage,
    UserModalProfileInfo,
    UserModalProfileInfoExpanded
  },
  props: {
    expanded: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="sass">
.fade-enter-active, .fade-leave-active
  transition: opacity .2s

.fade-enter, .fade-leave-to
  opacity: 0

.user-modal-profile
  height: 100%
  display: flex
  align-items: center
  justify-content: center

.user-modal-profile:not([data-is-expanded])
  +mq(pc)
    flex-direction: column
  +mq(sp)
    flex-direction: row

.user-modal-profile-area--info
  margin: 1rem

.user-modal-profile[data-is-expanded]

.user-modal-profile[data-is-expanded]
  +mq(pc)
    flex-direction: row

    .user-modal-profile-area--info
      margin-left: 2rem

  +mq(sp)
    flex-direction: column
</style>
