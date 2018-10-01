<template lang="pug">
.user-modal-profile-info
    .user-modal-profile-info-display-name
      | {{data.displayName}}
    .user-modal-profile-info-name
      | @{{data.name}}
    .user-modal-profile-info-real-name
      | Real Name
    .user-modal-profile-info-grade
      | {{grade}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserModalProfileInfo',
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
.user-modal-profile-info
  color: white

.user-modal-profile-info-display-name
  @media (orientation: landscape)
    font-size: 1.5rem
  @media (orientation: portrait)
    font-size: 1.2rem
  font-weight: 600
  margin: 0.2rem 0px

</style>
