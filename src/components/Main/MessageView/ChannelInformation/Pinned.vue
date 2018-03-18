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
    'MessageElement': window.asyncLoadComponents(import('@/components/Main/MessageView/MessageElement/MessageElement'))
  }
}
</script>

<style lang="sass">

</style>
