<template lang="pug">
div.member-element(:class="{'is-watched': isWatched}")
  div.member-element-icon-container(v-on:click="openUserModal")
    div.member-element-icon(:style="iconImg" :class="iconClass")
    div.member-element-online-indicator(v-if="!model.bot && model.isOnline" :style="borderStyle")
  div.member-name-container(@click="openDMChannel")
    p.member-display-name.text-ellipsis
      | {{model.displayName}}
    p.member-name.text-ellipsis
      | @{{model.name}}
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'MemberElement',
  props: {
    model: Object,
    backgroundColor: {
      tyle: String,
      default: 'var(--primary-color)'
    }
  },
  methods: {
    openUserModal () {
      this.$store.dispatch('openUserModal', this.model.userId)
    },
    openDMChannel () {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
      if (this.model.bot) {
        return
      }
      this.$router.push(`/users/${this.model.name}`)
    }
  },
  computed: {
    ...mapGetters(['fileUrl']),
    directMessageChannel () {
      if (this.model.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.model.userId))
      }
    },
    userIconSrc () {
      return this.fileUrl(this.model.iconFileId)
    },
    unreadMessagesNum () {
      if (this.directMessageChannel) {
        return this.$store.getters.getChannelUnreadMessageNum(this.directMessageChannel.channelId)
      } else {
        return 0
      }
    },
    iconClass () {
      return {
        'member-element-dm-indicator': this.unreadMessagesNum > 0
      }
    },
    iconImg () {
      return {
        backgroundImage: `url(${this.userIconSrc})`,
        borderColor: this.backgroundColor
      }
    },
    borderStyle () {
      return {
        borderColor: this.isWatched ? 'white' : this.backgroundColor
      }
    },
    isWatched () {
      if (this.$route.params.user) return this.$route.params.user === this.model.name
      else return false
    }
  }
}
</script>

<style lang="sass">
.member-element
  cursor: pointer
  display: flex
  flex-flow: row
  padding: 5px 10px
  &:hover
    background: rgba(0,0,0,0.1)
  
  &.is-watched
    background: white

.member-element-icon-container
  position: relative

.member-element-icon
  min-width: 40px
  width: 40px
  height: 40px
  border:
    radius: 100%
  overflow: hidden
  background:
    size: cover
    repeat: no-repeat
    position: center center
  .member-element-icon-container:hover &::before
    content: ''
    display: block
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    background: rgba(0,0,0,0.3)
    border:
      radius: 100%
      style: none

.member-element-dm-indicator
  box-sizing: border-box
  border:
    width: 2px
    style: solid
    // color: var(--primary-color)
  box-shadow: 0 0 0 3px $notification-color

.member-element-online-indicator
  position: absolute
  width: 12px
  height: 12px
  right: 0px
  bottom: -3px
  border:
    radius: 100%
    style: solid
    width: 2px
  background: $online-color

.member-display-name
  .is-watched &
    color: var(--primary-color)

.member-name
  font:
    size: 0.9em
  opacity: 0.6

  .is-watched &
    color: var(--primary-color)

.member-name-container
  margin: 0 0 0 10px
  min-width: 0
  width: 100%

.member-element > p
  padding-left: 10px
  white-space: nowrap

</style>
