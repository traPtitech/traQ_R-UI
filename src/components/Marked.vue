<template>
  <div>
    <p> {{ message }} </p>
    <input v-model="input" v-on:keyup.enter="submitRender" />
  </div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'Marked',
  data () {
    return {
      input: '',
      message: ''
    }
  },
  methods: {
    render: function (text) {
      return marked(text)
    },
    submitRender: function () {
      this.message = marked(this.input)
    }
  }
}
</script>

<style scoped>

</style>
