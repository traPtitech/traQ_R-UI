<template lang="pug">
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
.user-modal-profile-info
  color: white
  max-height: 100%
  max-width: 150px
  word-break: break-all
  overflow: scroll
  -webkit-overflow-scrolling: touch

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
