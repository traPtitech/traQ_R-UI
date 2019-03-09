<template lang="pug">
  div.slim-message-element(
    :class="{'is-overflow': isOverflow}" 
    @click.stop.prevent="openModal")
    div
      | {{userName}}
    component(:is="renderedContent")
</template>

<script>
import md from '@/bin/markdown-it'
export default {
  name: 'SlimMessageElement',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      height: 0
    }
  },
  computed: {
    userId() {
      return this.message.userId
    },
    userName() {
      return this.getUserName(this.userId)
    },
    content() {
      return this.message.content
    },
    renderedContent() {
      return {
        template: `<div class="slim-message-content markdown-body" v-pre>${md.render(
          this.content
        )}</div>`
      }
    },
    isOverflow() {
      return this.height >= 110
    }
  },
  methods: {
    getUserName(userId) {
      const user = this.$store.state.memberMap[userId]
      if (user.bot) return user.displayName + '#bot'
      else return user.displayName
    },
    openModal() {
      this.$store.dispatch('openPinnedModal', this.message)
    }
  },
  mounted() {
    this.height = this.$el.offsetHeight
  }
}
</script>

<style lang="sass">
.slim-message-element
  &:first-child
    margin:
      top: 6px

  &:nth-child(n+2)
    margin:
      top: 12px

  border:
    width: 1px
    style: solid
    color: rgba(255,255,255,0.8)
    radius: 3px
  padding: 4px
  overflow:
    x: hidden
    y: hidden
  max-height: 110px
  position: relative
  box-sizing: border-box

  &.is-overflow::before
    content: ''
    display: block
    position: absolute
    bottom: 0
    width: 100%
    height: 20px
    background: linear-gradient(to bottom, transparent, $tertiary-color)

.slim-message-content
  margin:
    top: 6px
  word-break: break-all

  code
    white-space: pre-wrap
</style>
