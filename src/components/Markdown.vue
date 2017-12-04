<template>
  <div>
    <vue-markdown :source="text"></vue-markdown>
    <input v-model="message" v-on:keyup.enter="submitMessage">
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'Markdown',
  data () {
    return {
      text: '',
      message: ''
    }
  },
  methods: {
    submitMessage: function () {
      this.text = this.message
      this.message = ''
    }
  },
  components: {
    'vue-markdown': VueMarkdown
  }
}
</script>

<style scoped>

</style>
