<template>
  <div class="message-content markdown-body" v-html="render(text)"></div>
</template>

<script>
import md from '@/bin/markdown-it'

export default {
  name: 'MessageContentBody',
  props: {
    text: String
  },
  data() {
    return {
      html: ''
    }
  },
  watch: {
    async text(val) {
      const _md = await md()
      this.html = await _md.render(val)
    }
  }
}
</script>

<style lang="sass"></style>
