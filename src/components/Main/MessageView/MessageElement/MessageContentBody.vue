<template lang="pug">
  .message-content.markdown-body(v-html="renderedContent")
</template>

<script>
import md from '@/bin/markdown-it'

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    renderedContent() {
      return md.render(this.content)
    }
  }
}
</script>
