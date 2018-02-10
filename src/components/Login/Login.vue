<template lang="pug">
  div.login this is login page
    form(method="POST" action="/login")
      input(type="text" name="name" placeholder="ID または メールアドレス" required)
      br
      input(type="password" name="password" placeholder="パスワード" required)
      br
      button
        | ログイン
    router-link(:to="{name: 'Index'}")
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
        url: this.$store.state.url + '/login',
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
