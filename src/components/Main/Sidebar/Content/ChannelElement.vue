<template lang="pug">
div.channel-wrap(v-if="model.visibility")
  div.channel-box(@click="channelLink(model.name)" v-bind:class="{'channel-opened': isOpened, 'channel-watched': isWatched}")
    p.channel-box-name
      | {{model.name}}
    div.channel-status-wrap
      div.channel-notification
      div.channel-toggle(v-if="isFolder" v-on:click.stop="toggle")
  div.channel-children
    transition-group(name="list-complete" tag="div" v-if="model.children" appear)
      div(v-show="isOpened" v-for="child in model.children" v-bind:key="child")
        ChannelElement(:model="$store.state.channelMap[child]" v-bind:curPath="curPath + (curPath!==''?'/':'') + model.name")
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
    },
    isWatched: function () {
      return this.$store.state.currentChannel.channelId === this.model.channelId
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
  margin: 0 0
  cursor: pointer
.channel-box-name
  position: relative
  color: gray
  font-weight: bold
  flex: 1
  margin: 2px 5px
  padding: 1px 10px 1px 5px
  border-radius: 3px
  text-align: left
  transition: all .5s ease-out
  cursor: pointer
  background-color: inherit
  overflow: hidden
  z-index: 1
  .channel-opened &
    color: #4f74d6
  .channel-watched &
    color: white
    background-color: #4f74d6
  &:before
    content: '#'
    margin: 0 3px 0 0
  &:hover, .channel-box:hover &
    color: white
    background-color: #757575
  &:after
    display: block
    position: absolute
    content: ''
    top: 0
    width: 0
    height: 0
    background-color: black
    border-radius: 100%
    z-index: 2
.channel-children
  position: relative
  border-left: solid 5px #4f74d6
  padding: 0 0 0 0
.channel-status-wrap
  width: 50px
  display: flex
.channel-notification
  flex: 1
.channel-toggle
  flex: 1
  right: 0
  margin: 0 4px 0 0
  width: 15px
  height: 15px
  cursor: pointer
  background: url(/static/img/triangle_down.svg) no-repeat center
  background-size: contain
  .channel-opened &
    background: url(/static/img/triangle_up.svg) no-repeat center
    background-size: contain

</style>
