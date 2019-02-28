<template lang="pug">
// プロフィール画像・DMへのリンク
.user-modal-img(:style="profileImgStyle")
  .user-modal-dm(@click="openDirectMessage")
    .user-modal-dm-indicator(v-if="hasUnreadMessages")
    .user-modal-dm-icon-envelope
      IconEnverope(size="100%")
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import IconEnverope from '@/components/Icon/IconEnverope'

export default {
  name: 'UserModalProfileImage',
  components: {
    IconEnverope
  },
  props: {
    expanded: false
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', {
      tags: 'currentUserTagsSorted'
    }),
    directMessageChannel () {
      if (this.data.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.data.userId))
      }
    },
    hasUnreadMessages () {
      if (this.directMessageChannel) {
        return this.$store.getters.getChannelUnreadMessageNum(this.directMessageChannel.channelId) > 0
      } else {
        return false
      }
    },
    profileImgStyle () {
      return {
        backgroundImage: `url(${this.$store.state.baseURL}/api/1.0/users/${this.data.userId}/icon)`
      }
    },
    onlineIndicatorStyle () {
      if (this.data.isOnline) {
        return {
          backgroundColor: '#27ae60'
        }
      } else {
        return {
          border: '1px solid lightgray'
        }
      }
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('modal/close')
      this.expandProfile = false
    },
    openDirectMessage () {
      this.$router.push(`/users/${this.data.name}`)
      this.closeModal()
    }
  }
}
</script>

<style lang="sass">
.user-modal-img
  flex-shrink: 0
  position: relative
  +mq(pc)
    height: 10rem
    width: 10rem
  +mq(sp)
    height: 5rem
    width: 5rem
    margin: 0 1.5rem 0 0
  border-radius: 50%
  border: 3px solid white
  background-size: cover
  background-position: center
  background-color: white
  background-repeat: no-repeat

.user-modal-dm
  position: absolute
  +mq(pc)
    bottom: 0
    right: -0.75rem
  +mq(sp)
    bottom: -0.25rem
    right: -1rem
  height: min-content
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  color: white

  .user-modal-dm-indicator
    =user-modal-dm-indicator-style($indicator-size, $indicator-border-width)
      position: absolute
      height: $indicator-size
      width: $indicator-size
      top: - $indicator-size / 3
      right: - 2 * $indicator-size / 3
      border: $indicator-border-width solid $primary-color
      border-radius: 50%
      background: $notification-color
    +mq(pc)
      +user-modal-dm-indicator-style(0.85rem, 2px)
    +mq(sp)
      +user-modal-dm-indicator-style(0.6rem, 1px)

  .user-modal-dm-icon-envelope
    height: auto
    +mq(pc)
      width: 1.75rem
    +mq(sp)
      width: 1.25rem
</style>
