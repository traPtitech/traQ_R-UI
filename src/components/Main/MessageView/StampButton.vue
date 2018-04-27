<template lang="pug">
div
  div(@click="showStampPicker")
    icon(name="plus")
</template>

<script>
import client from '@/bin/client'
import StampPicker from '@/components/Main/StampPicker'

export default {
  name: 'StampButton',
  props: {
    model: Object
  },
  data () {
    return {
    }
  },
  methods: {
    showStampPicker () {
      this.$store.commit('setStampPickerModel', this.model)
      this.$store.commit('activeStampPicker')
    },
    addStamp (stampId) {
      client.stampMessage(this.model.messageId, stampId)
    }
  },
  computed: {
  },
  components: {
    'StampPicker': StampPicker
  }
}
</script>

<style lang="sass">
</style>
