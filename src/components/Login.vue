<template>
  <div>
      <input v-model="name" type="text" name="login" placeholder="IDまたはメールアドレス" required/>
      <br>
      <input v-model="pass" type="password" name="password" placeholder="パスワード" required/>
      <button v-on:click="loginPost()" >ログイン</button>
      <p v-if="status === 'failed'" >
        IDまたはパスワードが異なります
      </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      pass: '',
      status: 'default'
    }
  },
  methods: {
    loginPost: function () {
      this.status = 'processing'
      let self = this
      axios({
        method: 'post',
        url: 'https://traq-dev.herokuapp.com/login',
        data: {
          name: this.name,
          pass: this.pass
        }
      }).then(function (res) {
        /*
        self.$router.push({
          name: 'Index'
        })
        */
        axios.get('https://traq-dev.herokuapp.com/channels', {}).then(function (res) {
          console.log(res)
        }).catch(function (err) {
          console.log(err)
        })
        self.status = 'success'
        console.log(res)
      }).catch(function (err) {
        self.status = 'failed'
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
