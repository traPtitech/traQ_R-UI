<template lang="pug">
.channel-activity
  .channel-activity-under-construction(title="あのねあのね！")
    IconLandscapeUnderConstruction(size="128")
    .channel-activity-under-construction-text
      | この先まだ工事中なんです
//  div.activity-channels
//    div.activity-channel(v-for="message in messages" :key="message.messageId")
//      channel-activity-element(:model="message")
</template>

<script>
import ChannelActivityElement from '@/components/Main/Sidebar/Content/ChannelActivityElement'
import IconLandscapeUnderConstruction from '@/components/Icon/IconLandscapeUnderConstruction'

export default {
  components: {
    ChannelActivityElement,
    IconLandscapeUnderConstruction
  },
  props: {},
  computed: {
    //     messages () {
    //       return this.$store.state.channelRecentMessages
    //         .filter(message => !!this.$store.state.channelMap[message.parentChannelId] &&
    //                            !this.$store.state.channelMap[message.parentChannelId].dm)
    //     }
  }
}
</script>

<style lang="sass">
.activity-channel
  color: white

.channel-activity-under-construction
  display: flex
  flex-direction: column
  align-items: center
  color: white
  padding-top: 5rem
  user-select: none
  opacity: 0.5
.channel-activity-under-construction-text
  padding: 0 1rem
  margin-top: 1rem
  text-align: center
</style>
