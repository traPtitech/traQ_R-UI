<template lang="pug">
div.member-element(v-on:click="openUserModal")
  div.member-element-icon-container
    img.member-element-icon(:style="iconClass" :src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
    div.member-element-online-indicator(v-if="!model.bot && model.isOnline")
  div.member-name-container
    p.member-display-name.text-ellipsis
      | {{model.displayName}}
    p.member-name.text-ellipsis
      | @{{model.name}}
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'MemberElement',
  props: {
    model: Object
  },
  methods: {
    openUserModal () {
      this.$store.dispatch('openUserModal', this.model.userId)
    },
    userIconSrc () {
      return client.getUserIconUrl(this.model.userId)
    }
  },
  computed: {
    directMessageChannel () {
      if (this.model.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.model.userId))
      }
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
        '.member-element-dm-indicator': this.unreadMessagesNum > 0
      }
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
.member-element-icon-container
  position: relative
.member-element-icon
  width: 40px
  height: 40px
  border:
    radius: 100%
.member-element-dm-indicator
  box-sizing: border-box
  border:
    width: 2px
    style: solid
    color: $primary-color
  box-shadow: 0 0 0 3px $notification-color
.member-element-online-indicator
  position: absolute
  width: 9px
  height: 9px
  right: 0px
  bottom: 3px
  border:
    radius: 100%
    color: $primary-color
    style: solid
    width: 2px
  background: $online-color
.member-display-name
.member-name
  font:
    size: 0.9em
  opacity: 0.6
.member-name-container
  margin: 0 0 0 10px
  min-width: 0
.member-element > p
  padding-left: 10px
  white-space: nowrap
</style>
