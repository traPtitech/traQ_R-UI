<template>
  <div>
  </div>
</template>

<script>

import Axios from 'axios'
const axios = Axios.create({
  withCredentials: true
})

export default {
  name: 'Index',
  data () {
    return {
    }
  },
  created: function () {
    let self = this
    axios.get('https://traq-dev.herokuapp.com/channels', {}).then(function (res) {
      console.log(res)
    }).catch(function (err) {
      self.$router.push({
        name: 'Login'
      })
      console.log(err)
    })
  }
}
</script>

<style scoped>

</style>
