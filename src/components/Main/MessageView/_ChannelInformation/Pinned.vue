<template lang="pug">
div.channel-pinned
  div(@click="showModal")
    icon(name="thumbtack")
  ChannelInformationModal(title="ピン" @close="closeModal" :active="isActive")
    ul(v-if="isActiveChannel")
      li(v-for="pin in $store.state.currentChannelPinnedMessages")
        MessageElement(:model="pin.message" :key="pin.pinId")
</template>

<script>
import ChannelInformationModal from '@/components/Main/MessageView/ChannelInformation/ChannelInformationModal'
export default {
  name: 'Pinned',
  data () {
    return {
    }
  },
  methods: {
    showModal () {
      this.$store.commit('setPinnedModal', true)
    },
    closeModal () {
      this.$store.commit('setPinnedModal', false)
    }
  },
  components: {
    ChannelInformationModal,
    'MessageElement': window.asyncLoadComponents(import('@/components/Main/MessageView/MessageElement/MessageElement'))
  },
  computed: {
    isActiveChannel () {
      return this.$store.state.currentChannel.channelId !== this.$store.state.directMessageId
    },
    isActive () {
      return this.$store.state.isActivePinnedModal
    }
  }
}
</script>

<style lang="sass">

</style>
