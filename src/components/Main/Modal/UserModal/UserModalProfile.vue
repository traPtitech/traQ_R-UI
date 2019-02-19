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

function paddingNumber (n, k) {
  let ret = `${n}`
  for (let i = 0; i < k; i++) ret = '0' + ret
  return ret.slice(-k)
}
function dateParse (date) {
  return `${date.getFullYear()}/${paddingNumber(date.getMonth(), 2)}/${paddingNumber(date.getDate(), 2)} ${paddingNumber(date.getHours(), 2)}:${paddingNumber(date.getMinutes(), 2)}`
}

export default {
  name: 'UserModalProfile',
  components: {
    UserModalProfileImage,
    UserModalProfileInfo,
    UserModalProfileInfoExpanded
  },
  props: {
    expanded: false
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', {
      tags: 'currentUserTagsSorted'
    }),
    wikiUserPageUrl () {
      return `https://wiki.trapti.tech/user/${this.data.name}`
    },
    twitterProfileUrl () {
      return this.data.twitterId !== '' ? `https://twitter.com/${this.data.twitterId}` : null
    },
    twitterLinkStyle () {
      return {
        color: this.twitterProfileUrl ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.5)'
      }
    },
    lastOnline () {
      return dateParse(new Date(this.data.lastOnline))
    },
    directMessageChannel () {
      if (this.data.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.data.userId))
      }
    }
  },
  methods: {
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
  padding-bottom: 18px
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
