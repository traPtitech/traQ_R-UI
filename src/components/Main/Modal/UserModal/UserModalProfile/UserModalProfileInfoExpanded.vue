<template lang="pug">
.user-modal-profile-info-expanded
    .user-modal-profile-info-display-name
      | {{data.displayName}}
    .user-modal-profile-info-name
      | @{{data.name}}
      .user-modal-profile-info-grade(v-if="statusBadge !== undefined")
        | {{statusBadge}}
    UserModalProfileOnlineIndicator(:detailed="true")
    .user-modal-misc-profiles
      a.user-modal-misc-profile(:class="{inactive: !data.twitterId}" :href="twitterUrl" target="_blank" @click.stop="onTwitterLinkClicked")
        .user-modal-misc-profile-icon
          IconTwitter
        | {{ twitterId }}
      a.user-modal-misc-profile(:href="`https://wiki.trapti.tech/user/${data.name}`" target="_blank" @click.stop="")
        .user-modal-misc-profile-icon
          IconBook
        | user/{{ data.name }}
</template>

<script>
import { mapState } from 'vuex'
import UserModalProfileOnlineIndicator from '@/components/Main/Modal/UserModal/UserModalProfile/UserModalProfileOnlineIndicator'
import IconBook from '@/components/Icon/IconBook'
import IconTwitter from '@/components/Icon/IconTwitter'

export default {
  name: 'UserModalProfileInfo',
  components: {
    UserModalProfileOnlineIndicator,
    IconBook,
    IconTwitter
  },
  computed: {
    ...mapState('modal', {
      data: 'data',
      tags: 'currentUserTags'
    }),
    grade() {
      return this.$store.getters.gradeByUserMap[this.data.userId]
    },
    statusBadge() {
      // grade or bot or undefined
      if (this.data.bot) {
        return 'bot'
      } else {
        return this.grade ? this.grade.name : undefined
      }
    },
    twitterId() {
      return this.data.twitterId !== '' ? this.data.twitterId : '-'
    },
    twitterUrl() {
      return this.data.twitterId !== ''
        ? `https://twitter.com/${this.data.twitterId}`
        : ''
    }
  },
  methods: {
    onTwitterLinkClicked(event) {
      if (!this.data.twitterId) event.preventDefault()
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
  align-items: center

.user-modal-profile-info-grade
  font-size: .9rem
  border: 1px solid rgba(255, 255, 255, 0.7)
  border-radius: 4px
  padding: .1rem .4rem
  margin-left: 1rem;

.user-modal-misc-profiles
  margin: 1rem 0
.user-modal-misc-profile
  display: flex
  align-items: center
  margin: 0.5rem 0
  color: white
  font-size: .9rem
  opacity: 0.5
  &:hover
    opacity: 1
  &.inactive
    cursor: default
  &.inactive:hover
    opacity: 0.5

.user-modal-misc-profile-icon
  margin-right: 0.5rem
</style>
