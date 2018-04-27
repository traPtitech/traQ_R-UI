<template lang="pug">
div
  div(@click="$store.commit('activeStampPicker')")
    icon(name="plus")
  //- modal(@close="active = false" :active="active")
  //-   input(v-model="search")
  //-   div.emoji-container
  //-     div(v-for="(category, idx) in $store.state.stampCategolized")
  //-       p
  //-         | {{category.category}}
  //-       i(v-for="stamp in stamps(idx)" class="emoji s32" v-on:click="addStamp(stamp.id)" :style="`background-image: url(${$store.state.baseURL}/api/1.0/files/${$store.state.stampMap[stamp.id].fileId})`" :title="`:${stamp.name}:`")
  //-         | :{{stamp.name}}:
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
      active: false
    }
  },
  methods: {
    showModal () {
      this.active = true
    },
    addStamp (stampId) {
      client.stampMessage(this.model.messageId, stampId)
    },
    stamps (index) {
      if (this.search === '') {
        return this.$store.state.stampCategolized[index].stamps
      }
      return this.$store.state.stampCategolized[index].stamps.filter(stamp => stamp.name.substr(0, this.search.length) === this.search)
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
