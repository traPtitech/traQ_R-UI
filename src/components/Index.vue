<template>
  <div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Index',
  data () {
    return {
    }
  },
  created: function () {
    axios.get('https://traq-dev.herokuapp.com/channels', {}).then(function (res) {
      console.log(res)
    }).catch(function (err) {
      console.log(err)
    })
  }
}
</script>

<style scoped>

</style>
