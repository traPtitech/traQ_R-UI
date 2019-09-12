<template lang="pug">
  .message-content.markdown-body(v-html="renderedContent")
</template>

<script>
import { rendererManager } from '@/bin/markdown'

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      renderedContent: ''
    }
  },
  methods: {
    async render() {
      this.renderedContent = await rendererManager.render(
        this.$store.state.currentChannel.channelId,
        this.content
      )
    }
  },
  watch: {
    content() {
      this.render()
    }
  },
  created() {
    this.render()
  }
}
</script>
