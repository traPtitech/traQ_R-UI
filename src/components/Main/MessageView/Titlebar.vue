<template lang="pug">
header.titlebar
  div.menu-open
  h1.channel-name
    | {{title}}
  p.channel-topic
    | {{topic}}
  div.buttons
    div.star
    div.search
</template>

<script>
export default {
  name: 'Titlebar',
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
      return this.$store.state.currentChannelTopic.text
    }
  }
}
</script>

<style lang="sass">
.menu-open
  width: 50px
  height: 50px
  margin: 0 0 0 10px
  background-color: gray
  @media (min-width: 680px)
    display: none
.titlebar
  // position: fixed
  display: flex
  align-items: center
  justify-content: space-between
  grid-area: titlebar
  background-color: #F5F5F5
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
</style>
