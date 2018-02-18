<template lang="pug">
div.channel-wrap
  div.channel-box(@click="channelLink(model.name)")
    p.channel-box-name
      | {{model.name}}
    div.channel-toggle(v-if="isFolder" @click.stop="toggle" :class="{'channel-toggled': isOpened}")
  div.channel-children
    transition-group(name="list-complete" tag="div" v-if="model.children" appear)
      div(v-show="isOpened" v-for="child in model.children" :key="child.channelId")
        ChannelElement(:model="$store.state.channelMap[child]" :curPath="curPath + (curPath!==''?'/':'') + model.name")
</template>

<script>
export default {
  name: 'ChannelElement',
  props: {
    model: Object,
    curPath: String
  },
  data () {
    return {
      isOpened: false
    }
  },
  methods: {
    toggle () {
      this.isOpened = !this.isOpened
    },
    channelLink (name) {
      this.$router.push(`/channels/${this.curPath}${this.curPath !== '' ? '/' : ''}${this.model.name}`)
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children && this.model.children.length > 0
    }
  },
  components: {
  }
}
</script>

<style lang="sass">
.channel-wrap
  display: block
.channel-box
  display: flex
  align-items: center
  justify-content: space-between
  border: solid 1px white
  margin: 10px 0
.channel-box-name
  color: white
  margin: 3px 5px
.channel-children
  position: relative
  border-left: solid 5px white
  padding: 0 0 0 5px
.channel-toggle
  width: 20px
  height: 20px
  margin: 0 4px 0 0
  cursor: pointer
  border: solid 1px white
  transition: all .5s ease
.channel-toggle:active
  transform: scale(1.1)
.channel-toggled
  background-color: white
</style>
