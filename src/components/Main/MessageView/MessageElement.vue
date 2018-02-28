<template lang="pug">
div.message
  div.message-user-icon-wrap
    div.message-user-icon
  div.message-detail-wrap
    p.message-user-name
      | {{$store.state.memberMap[model.userId].name}}
    p.message-date
      | {{dateTime(model.datetime)}}
  div.message-content-wrap
    div.message-content(v-if="!isEditing" v-html="renderedText")
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
      edited: ''
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
    dateTime: function (datetime) {
      const d = new Date(datetime)
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0')
    }
  },
  computed: {
    renderedText () {
      return md.render(this.model.content)
    }
  }
}
</script>

<style lang="sass">
.message
  display: grid
  grid-template-areas: "user-icon detail""... content""... buttons"
  grid-template-rows: 40px 1fr 30px
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
  text-align: left
  font-size: 0.9em
.message-buttons-wrap
  grid-area: buttons
</style>
