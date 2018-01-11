<template>
  <div>
    <textarea v-model="text" :rows="row" >
    </textarea>
  </div>
</template>

<script>
function countNL (s) {
  return s.split('\n').length
}

export default {
  name: 'Input',
  data () {
    return {
      text: ''
    }
  },
  computed: {
    row: function () {
      return Math.min(3, Math.max(1, countNL(this.text)))
    }
  }
}
</script>

<style scoped>

</style>
