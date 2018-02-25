<template lang="pug">
div.content-wrap
  div.sticky-container.sticky
    InputUI
  content.message-wrap
    ul
      li(v-for="message in $store.state.messages")
        MessageElement(:model="message" v-bind:key="message.messageId")
</template>

<script>
import InputUI from '@/components/Main/MessageView/InputUI'
import MessageMock from '@/components/Main/MessageView/MessageMock'
import MessageElement from '@/components/Main/MessageView/MessageElement'
export default {
  components: {
    'InputUI': InputUI,
    'MessageElement': MessageElement,
    'MessageMock': MessageMock
  },
  mounted () {
    const container = this.$el.querySelector('.message-wrap')
    container.scrollTop = container.scrollHeight
    console.log(container)
  }
}
</script>

<style lang="sass">
.content-wrap
  grid-area: content
  position: relative
  background-color: rgb(249, 249, 249)
  overflow: scroll
.message-wrap
  width: 100%
  height: 100%
  position: absolute
  z-index: 0
  top: 0
  left: 0
.sticky-container
  height: 100%
  width: 100%
  top: 0
  left: 0
  z-index: 1
  pointer-events: none
</style>
