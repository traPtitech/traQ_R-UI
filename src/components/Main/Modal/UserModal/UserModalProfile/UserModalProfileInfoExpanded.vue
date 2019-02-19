<template lang="pug">
.user-modal-profile-info-expanded
    .user-modal-profile-info-display-name
      | {{data.displayName}}
    .user-modal-profile-info-name
      | @{{data.name}}
      .user-modal-profile-info-grade
        | {{grade}}
    // .user-modal-profile-real-info
    //   .user-modal-profile-info-real-name
    //     | Real Name
    UserModalProfileOnlineIndicator(:detailed="true")
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
    ...mapState('modal', {
      data: 'data',
      tags: 'currentUserTags'
    }),
    grade () {
      const tag = this.tags.find(tag => /^\d{2}[BMDR]$/.test(tag.tag))
      if (tag) {
        return tag.tag
      } else {
        return '___'
      }
    }
  }
}
</script>

<style lang="sass">
.user-modal-profile-info-expanded
  color: white
  min-width: 10rem

.user-modal-profile-info-display-name
  +mq(pc)
    font-size: 1.5rem
  +mq(sp)
    font-size: 1.2rem
  font-weight: 600
  margin-bottom: .3rem

.user-modal-profile-info-name
  margin-bottom: .5rem
  display: flex

.user-modal-profile-info-grade
  font-size: .9rem
  border: 1px solid rgba(255, 255, 255, 0.7)
  padding: .1rem .4rem
  margin-left: 1rem;

.user-modal-profile-real-info
  display: flex
  align-items: center
  margin-bottom: 1rem
  color: rgba(255, 255, 255, 0.7)
  font-size: .9rem
</style>
