<template lang="pug">
div.content-wrap
  div.sticky-container.sticky
    InputUI
  content.message-wrap
    ul
      li
        button(v-on:click="loadMessages")
          | load
      li(v-for="(message, index) in $store.state.messages")
        strong(v-if="index === 0 || date($store.state.messages[index - 1].datetime) !== date(message.datetime)")
          | {{date(message.datetime)}}
        MessageElement(:model="message" v-bind:key="message.messageId")
</template>

<script>
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
export default {
  name: 'MessageContainer',
  components: {
    'InputUI': window.asyncLoadComponents(import('@/components/Main/MessageView/InputUI')),
    'MessageElement': MessageElement
  },
  created () {
    this.$store.commit('loadEndComponent')
  },
  methods: {
    loadMessages () {
      this.$store.dispatch('getMessages')
    },
    date (datetime) {
      const d = new Date(datetime)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    }
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
