<template lang="pug">
div.message
  div.m-icon-wrap
    div.m-icon
  div.m-text-wrap
    div.m-text(v-if="!isEditing" v-html="renderedText")
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
</template>

<script>
import md from '@/bin/markdown-it'
import axios from '@/bin/axios'
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
      axios.put('/api/1.0/messages/' + this.model.messageId, {
        text: this.edited
      })
      this.isEditing = false
      this.model.content = this.edited
    },
    editCancel () {
      this.isEditing = false
    },
    deleteMessage () {
      if (window.confirm('このメッセージを削除してもよろしいですか？')) {
        axios.delete('/api/1.0/messages/' + this.model.messageId)
      }
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
</style>
