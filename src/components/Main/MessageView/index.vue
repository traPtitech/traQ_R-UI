<template lang="pug">
  .message-view
    message-container
    .message-view-input-wrap
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
    height: 100%
  +mq(sp)
    display: flex
    flex-flow: column
    height: 100%

.message-view-input-wrap
  min-height: 50px

</style>
