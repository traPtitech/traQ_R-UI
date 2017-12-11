<template lang="pug">
  div.content
    InputUI
</template>

<script>
import InputUI from '@/components/Main/ChannelView/InputUI'
export default {
  components: {
    'InputUI': InputUI
  }
}
</script>

<style lang="sass">
.content
  grid-area: content
  background-color: rgb(249, 249, 249)
</style>
