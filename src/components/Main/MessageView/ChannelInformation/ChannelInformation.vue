<template lang="pug">
div.information
  div.channel-online-users
    | 見てる人：{{$store.state.heartbeatStatus.userStatuses.length}}
  div.channel-members
    Notifications
  div.channel-pinned
    Pinned
  div.channel-topic
    Topic
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
  }
}
</script>

<style lang="sass">
.information
  grid-area: information
  display: flex
  flex-direction: column;
  background-color: #c2c2c2
  border-left: 1px solid #B0B0B0
</style>
