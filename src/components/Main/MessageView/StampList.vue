<template lang="pug">
div
  div(@click="showModal")
    | 😀
  modal(@close="active = false" :active="active")
    input(v-model="search")
    i(v-for="stamp in stamps" class="emoji s32" v-on:click="addStamp(stamp.id)" :style="`background-image: url(${$store.state.baseURL}/api/1.0/files/${$store.state.stampMap[stamp.id].fileId})`" :title="`:${stamp.name}:`")
      | :{{stamp.name}}:
</template>
<script>
import client from '@/bin/client'
export default {
  name: 'StampList',
  props: {
    model: Object
  },
  data () {
    return {
      active: false,
      search: ''
    }
  },
  methods: {
    showModal () {
      this.active = true
    },
    addStamp (stampId) {
      client.stampMessage(this.model.messageId, stampId)
    }
  },
  computed: {
    stamps () {
      if (this.search === '') {
        return this.$store.state.stampData
      }
      return this.$store.state.stampData.filter(stamp => stamp.name.substr(0, this.search.length) === this.search)
    }
  }
}
</script>
<style lang="sass">
.emoji.s16
  width: 16px
  height: 16px
.emoji.s32
  width: 32px
  height: 32px
.emoji
  display: inline-block
  text-indent: 999%
  white-space: nowrap
  overflow: hidden
  color: transparent
  background-size: contain
</style>
