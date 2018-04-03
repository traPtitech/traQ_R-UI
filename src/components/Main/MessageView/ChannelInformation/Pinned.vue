<template lang="pug">
div.channel-pinned
  div(@click="showModal")
    div.fa.fa-thumbtack
  modal(@close="active = false" :active="active")
    ul(v-if="isActiveChannel")
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
  },
  computed: {
    isActiveChannel () {
      return this.$store.state.currentChannel.channelId !== this.$store.state.directMessageId
    }
  }
}
</script>

<style lang="sass">

</style>
