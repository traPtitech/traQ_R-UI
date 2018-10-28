<template lang="pug">
.user-modal-profile-info
    .user-modal-profile-info-display-name
      | {{data.displayName}}
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
  display: grid
  grid-template-rows: auto 1.5rem
  grid-template-columns: 1.5rem auto
  grid-template-areas: "display-name display-name""online-indicator name"

.user-modal-profile-info-area--online-indicator
  grid-area: online-indicator

.user-modal-profile-info-display-name
  grid-area: display-name
  @media (orientation: landscape)
    font-size: 1.5rem
  @media (orientation: portrait)
    font-size: 1.2rem
  font-weight: 600
  margin: 0.2rem 0px

</style>
