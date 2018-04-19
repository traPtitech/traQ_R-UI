<template lang="pug">
modal(:active="active" @close="$emit('close')")
  div.channel-information-modal-header
    div.channel-information-modal-header-wrapper
      h1.channel-information-modal-title {{ title }}
      div.channel-information-modal-channel(v-if="showChannel") {{ channelName }}
  div.channelinformation-modal-container
    slot
</template>

<script>
export default {
  name: 'ChannelInformationModal',
  props: {
    active: Boolean,
    title: String,
    showChannel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    channelName () {
      if (this.$route.params.user) return `@${this.$route.params.user}`
      if (!this.$route.params.channel) return ''
      let ret = '#'
      this.$route.params.channel.split('/').slice(0, -1).forEach(e => {
        ret += e.charAt(0) + '/'
      })
      ret += this.$store.state.currentChannel.name
      return ret
    }
  }
}
</script>

<style lang="sass">
.channel-information-modal-header
  display: flex
  flex-wrap: wrap
  align-items: center
  width: 100%
  height: 7rem
  color: white
  background-color: #3a4891
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25)

  .channel-information-modal-header-wrapper
    display: flex
    flex-wrap: wrap
    align-items: center
    height: 5rem
    margin: 0px 2rem

    h1.channel-information-modal-title
      font-size: 1.5rem
      font-weight: 400
      margin-right: 2rem

    .channel-information-modal-channel
      display: flex
      align-items: center
      height: 2rem
      padding-left: 2rem
      border-left: 1px solid white

.channelinformation-modal-container
  max-height: calc(85vh - 7rem)
  overflow-y: scroll
  margin: 1rem 2rem
  text-align: left
  h2
    margin: 0px
    align-self: center
    font-size: 1.2rem
    font-weight: 400
</style>
