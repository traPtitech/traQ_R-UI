<template lang="pug">
  .message-view
    message-container
    message-input
</template>

<script>
import MessageContainer from '@/components/Main/MessageView/MessageContainer'
import MessageInput from '@/components/Main/MessageView/MessageInput'

export default {
  name: 'MessageView',
  components: {
    MessageContainer,
    MessageInput
  },
  mounted() {
    if (Date.parse(this.$store.state.me.lastOnline) === 0) {
      this.$store.dispatch('openTourModal')
    }
  }
}
</script>

<style lang="sass">
.message-view
  position: relative
  +mq(pc)
    flex-grow: 1
    display: flex
    flex-flow: column
    height: 100%
  +mq(sp)
    display: flex
    flex-flow: column
    height: 100%
</style>
