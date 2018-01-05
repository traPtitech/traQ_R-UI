<template lang="pug">
div.content
  InputUI
  div.message-wrap
    ul
      li(v-for="i in 6")
        Message
</template>

<script>
import InputUI from '@/components/Main/MessageView/InputUI'
import MessageMock from '@/components/Main/MessageView/MessageMock'
export default {
  components: {
    'InputUI': InputUI,
    'Message': MessageMock
  }
}
</script>

<style lang="sass">
.content
  grid-area: content
  position: relative
  background-color: rgb(249, 249, 249)
  overflow: hidden
.message-wrap
  width: 100%
  height: 100%
  overflow: scroll
</style>
