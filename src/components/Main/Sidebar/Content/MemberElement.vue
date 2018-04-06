<template lang="pug">
div.member-element(v-on:click="openUserModal")
  p
    p(v-if="unreadMessagesNum > 0")
      | {{unreadMessagesNum}}
    img.member-element-icon(:src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
    ruby
      | {{model.displayName}}
      rt
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
    }
  }
}
</script>

<style lang="sass">
.member-element
  cursor: pointer
.member-element-icon
  width: 40px
  height: 40px
  background-color: gray
  border-radius: 100%
.member-element > p
  padding-left: 10px
  white-space: nowrap
.member-element > p > ruby
  padding-left: 10px
  display: inline-block
  vertical-align: 40%
</style>
