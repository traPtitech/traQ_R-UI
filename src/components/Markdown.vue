<template>
  <div id="messages">
    <p v-html="message"></p>
    <textarea v-model="input" v-on:keyup.enter="submit($event.ctrlKey)" rows="5" />
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt({
  breaks: true
})

export default {
  name: 'Markdown',
  data () {
    return {
      input: '',
      message: ''
    }
  },
  methods: {
    submit: function (ctrl) {
      if (!ctrl) return
      this.input.replace(/$\n/, '')
      this.markdownRender()
    },
    markdownRender: function () {
      this.message = md.render(this.input)
      this.input = ''
    }
  }
}
</script>

<style scoped>
#messages {
  text-align: left;
  margin-top: 0px;
}
</style>
