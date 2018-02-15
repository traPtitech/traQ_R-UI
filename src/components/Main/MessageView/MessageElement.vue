<template lang="pug">
div.message
  div.m-icon-wrap
    div.m-icon
  div.m-text-wrap
    div.m-text
      | {{model.content}}
</template>

<script>
export default {
  name: 'MessageElement',
  props: {
    model: Object
  }
}
</script>

<style lang="sass">
</style>
