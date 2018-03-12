<template lang="pug">
div.information
  div.channel-online-users
    | {{onlineUsers}}
  Notifications.channel-button
  Pinned.channel-button
  Topic.channel-button
</template>

<script>
import Topic from '@/components/Main/MessageView/ChannelInformation/Topic'
import Pinned from '@/components/Main/MessageView/ChannelInformation/Pinned'
import Notifications from '@/components/Main/MessageView/ChannelInformation/Notifications'
export default {
  components: {
    'Topic': Topic,
    'Pinned': Pinned,
    'Notifications': Notifications
  },
  computed: {
    onlineUsers () {
      return this.$store.state.heartbeatStatus.userStatuses.length
    }
  }
}
</script>

<style lang="sass">
.information
  grid-area: information
  display: flex
  flex-direction: column
  background-color: #c2c2c2
  border-left: 1px solid #B0B0B0
.channel-online-users
  color: white
  width: 80%
  text-align: center
  margin: 10px auto 5px
  padding: 2px 0
  background: #4e73d6
  border-radius: 5px
  user-select: none
  cursor: pointer
.channel-button
  margin: 5px auto
  cursor: pointer
</style>
