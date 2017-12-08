<template>
  <div id="messages">
    <p v-html="message"></p>
    <textarea v-model="input" v-on:keyup.enter="submit($event.ctrlKey)" rows="5" />
  </div>
</template>

<script>
import marked from 'marked'

function escapeBefore (text) {
  let replaced = ''
  text.split(/```/g).forEach((e, i) => {
    if (i % 2 === 0) replaced += e.replace(/</g, '&lt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
    else replaced += e
  })
  return replaced
}

function escapeAfter (text) {
  let rank = 0
  text = text.replace(/$\n/, '')
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '<') rank++
    else if (text[i] === '>' && rank > 0) rank--
    else if (text[i] === '>') text = text.substr(0, i) + '&gt;' + text.substr(i + 1, text.length)
  }
  text = text.replace(/&(?!gt;|lt;|quot;|#39;)/g, '&amp;').replace(/\n+(?!\n)/g, '<br>').replace(/`/g, '&#96;')
  return text
}

export default {
  name: 'Marked',
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
      this.message = escapeAfter(marked(escapeBefore(this.input)))
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
