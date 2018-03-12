<template lang="pug">
div.channel-pinned
  div(@click="showModal")
    div.fa.fa-thumbtack
  modal(@close="active = false" :active="active")
    ul
      li(v-for="pin in $store.state.currentChannelPinnedMessages")
        MessageElement(:model="pin.message" :key="pin.pinId")
</template>

<script>
import MessageElement from '@/components/Main/MessageView/MessageElement'
export default {
  name: 'Pinned',
  data () {
    return {
      active: false
    }
  },
  methods: {
    showModal () {
      this.active = true
    }
  },
  components: {
    'MessageElement': MessageElement
  }
}
</script>

<style lang="sass">

</style>
