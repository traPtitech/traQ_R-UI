<template lang="pug">
  div.message-view
    message-container
    message-input
</template>

<script>
import MessageContainer from '@/components/Main/MessageView/MessageContainer'

export default {
  name: 'MessageView',
  components: {
    MessageContainer,
    MessageInput: window.asyncLoadComponents(import('@/components/Main/MessageView/MessageInput'))
  }
}
</script>

<style lang="sass">
.message-view
  +mq(pc)
    flex-grow: 1
    display: flex
    flex-flow: column
  +mq(sp)
    display: flex
    flex-flow: column
    height: 100%
    // height: vh(100)
</style>
