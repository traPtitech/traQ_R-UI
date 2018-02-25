<template lang="pug">
div.message
  div.m-icon-wrap
    div.m-icon
  div.m-text-wrap
    div.m-text(v-html="renderedText")
</template>

<script>
import md from '@/bin/markdown-it'
export default {
  name: 'MessageElement',
  props: {
    model: Object
  },
  computed: {
    renderedText () {
      return md.render(this.model.content)
    }
  }}
</script>

<style lang="sass">
</style>
