<template lang="pug">
header.titlebar
  div.sidebar-open(v-on:click="$store.state.sidebarOpened=!$store.state.sidebarOpened")
    div.fas.fa-bars.sidebar-open-icon
  h1.channel-name
    | {{title}}
  p.channel-topic-text
    | {{topic}}
  div.online-member
</template>

<script>
export default {
  name: 'Titlebar',
  data () {
    return {
      isSidebarOpened: false
    }
  },
  computed: {
    title () {
      if (this.$route.params.user) return `@${this.$route.params.user}`
      if (!this.$route.params.channel) return ''
      let ret = '#'
      this.$route.params.channel.split('/').slice(0, -1).forEach(e => {
        ret += e.charAt(0) + '/'
      })
      ret += this.$store.state.currentChannel.name
      return ret
    },
    topic () {
      if (this.$route.params.user) return ''
      return this.$store.state.currentChannelTopic.text
    }
  }
}
</script>

<style lang="sass">
.sidebar-open
  width: 50px
  height: 50px
  margin: 0 0 0 10px
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  @media (min-width: 680px)
    display: none
.sidebar-open-icon
  width: 60%
  height: 60%
  color: gray
.titlebar
  // position: fixed
  display: flex
  align-items: center
  justify-content: flex-start
  grid-area: titlebar
  background-color: #F5F5F5
  color: #656565
  border-bottom: 1px solid rgb(176, 176, 176)
.channel-name
  color: rgba(0, 0, 0, 0.6)
  font-size: 2em
  font-weight: bold
  text-align: left
  margin: 0 0 0 10px
.buttons
  display: flex
  flex-flow: row
  div
    width: 50px
    height: 50px
    // background-color: gray
    margin: 10px
.channel-topic-text
  display: flex
  align-items: center
  height: 60%
  margin: 0 0 0 20px
  padding: 0 0 0 20px
  border-left: solid 1px #b0b0b0
  @media (max-width: 679px)
    display: none
</style>
