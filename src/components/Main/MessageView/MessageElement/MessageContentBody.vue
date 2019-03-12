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
  computed: {
    html() {
      return md.render(this.text)
    }
  }
}
</script>

<style lang="sass"></style>
