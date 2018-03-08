<template lang="pug">
div.message
  div.message-user-icon-wrap
    img.message-user-icon(:src='userIconSrc')
  div.message-detail-wrap
    p.message-user-name
      | {{$store.state.memberMap[model.userId].name}}
    p.message-date
      | {{dateTime(model.datetime)}}
  div.message-content-wrap
    component(v-if="!isEditing" v-bind:is="renderedText" v-bind="$props")
    div(v-if="isEditing")
      textarea(v-model="edited" )
      button(v-on:click="editSubmit" )
        | submit
      button(v-on:click="editCancel" )
        | cancel
    button(v-if="model.userId === $store.getters.getMyId" v-on:click="editMessage")
      | edit
    button(v-on:click="deleteMessage")
      | delete
    button(v-on:click="unpinMessage" v-if="pinned")
      | unpin
    button(v-on:click="pinMessage" v-else)
      | pin
    button(v-on:click="unclipMessage" v-if="cliped")
      | unclip
    button(v-on:click="clipMessage" v-else)
      | clip
  div.message-buttons-wrap
</template>

<script>
import md from '@/bin/markdown-it'
import client from '@/bin/client'
export default {
  name: 'MessageElement',
  props: {
    model: Object
  },
  data () {
    return {
      isEditing: false,
      edited: '',
      pin: null
    }
  },
  methods: {
    editMessage () {
      this.isEditing = true
      this.edited = this.model.content
    },
    editSubmit () {
      if (this.edited === this.model.content) {
        this.isEditing = false
        return
      }
      client.editMessage(this.model.messageId, this.edited)
      this.isEditing = false
      this.model.content = this.edited
    },
    editCancel () {
      this.isEditing = false
    },
    deleteMessage () {
      if (window.confirm('このメッセージを削除してもよろしいですか？')) {
        client.deleteMessage(this.model.messageId)
      }
    },
    async pinMessage () {
      await client.pinMessage(this.$store.state.currentChannel.channelId, this.model.messageId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    async unpinMessage () {
      await client.unpinMessage(this.pin.pinId)
      this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId)
    },
    clipMessage () {
      client.clipMessage(this.model.messageId)
      .then(res => {
        this.$store.commit('setClipedMessages', res.data)
      })
    },
    unclipMessage () {
      client.unclipMessage(this.model.messageId)
      .then(res => {
        this.$store.commit('setClipedMessages', res.data)
      })
    },
    dateTime: function (datetime) {
      const d = new Date(datetime)
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0')
    }
  },
  computed: {
    renderedText () {
      return {
        template: `<div class="message-content">${md.render(this.model.content)}</div>`,
        props: this.$options.props
      }
    },
    cliped () {
      return this.$store.state.clipedMessages[this.model.messageId]
    },
    pinned () {
      this.pin = this.$store.getters.isPinned(this.model.messageId)
      return this.pin
    },
    userIconSrc () {
      return client.getUserIconUrl(this.model.userId)
    }
  }
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-areas: "user-icon detail""user-icon content""... buttons"
  grid-template-rows: 20px 1fr 20px
  grid-template-columns: 40px 1fr
  border-bottom: solid 1px rgba(0, 0, 0, 0.1)
  margin: 10px 0
  padding: 5px 10px
.message-user-icon-wrap
  grid-area: user-icon
.message-user-icon
  width: 40px
  height: 40px
  background-color: gray
  border-radius: 100%
.message-detail-wrap
  grid-area: detail
  display: flex
  justify-content: space-between
.message-user-name
  margin: 0 0 0 10px
  font-weight: bold
.message-date
  font-size: 0.7em
.message-content-wrap
  grid-area: content
  margin: 0 0 0 10px
  padding: 10px 0
  text-align: left
  font-size: 0.9em
  word-break: break-all
.message-buttons-wrap
  grid-area: buttons
</style>
