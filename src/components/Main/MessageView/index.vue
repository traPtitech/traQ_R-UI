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
</style>
