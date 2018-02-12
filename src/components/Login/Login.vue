<template lang="pug">
div.login this is login page
  br
  input(v-model="name" type="text" placeholder="IDまたはメールアドレス")
  br
  input(v-model="pass" type="password" placeholder="パスワード")
  br
  button(v-on:click="loginPost()")
    p login
  br
  p(v-if="status === 'failed'") IDまたはパスワードが異なります
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      name: '',
      pass: '',
      status: 'default'
      /*
       * default: not in progress
       * processing: in progress
       * failed: missed login
       * successed: success login
       */
    }
  },
  methods: {
    loginPost: function () {
      this.status = 'processing'
      let self = this
      axios({
        method: 'post',
        url: self.$store.state.url + '/login',
        data: {
          name: this.name,
          pass: this.pass
        },
        withCredentials: true
      })
      .then(function (res) {
        self.status = 'successed'
        self.$router.push({
          name: 'Index'
        })
      })
      .catch(function (err) {
        self.status = 'failed'
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
</style>
