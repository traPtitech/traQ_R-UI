<template lang="pug">
.user-modal-profile-info-wrap
  .user-modal-profile-info
    .user-modal-profile-info-display-name
      | {{data.displayName}}
    .user-modal-profile-info-name-contaner
      UserModalProfileOnlineIndicator.user-modal-profile-info-area--online-indicator
      .user-modal-profile-info-name
        | @{{data.name}}
</template>

<script>
import { mapState } from 'vuex'
import UserModalProfileOnlineIndicator from '@/components/Main/Modal/UserModal/UserModalProfile/UserModalProfileOnlineIndicator'

export default {
  name: 'UserModalProfileInfo',
  components: {
    UserModalProfileOnlineIndicator
  },
  computed: {
    ...mapState('modal', ['data'])
  }
}
</script>

<style lang="sass">
.user-modal-profile-info-wrap
  color: white
  overflow: hidden
  +mq(pc)
    max-width: 250px
  +mq(sp)
    max-width: 150px
    height: 100%
    display: flex
    align-items: center
    padding: 1.5rem 0

.user-modal-profile-info
  height: min-content
  width: 100%
  word-break: break-all
  overflow-y: scroll
  -webkit-overflow-scrolling: touch
  &::-webkit-scrollbar
    display: none
    transform: translateX(-30px)

.user-modal-profile-info-name-contaner
  display: flex
.user-modal-profile-info-area--online-indicator
  margin-right: 0.5rem 

.user-modal-profile-info-display-name
  +mq(pc)
    font-size: 1.5rem
  +mq(sp)
    font-size: 1.2rem
  font-weight: 600
  margin: 0.2rem 0

</style>
