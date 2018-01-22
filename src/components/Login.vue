<template>
  <div>
      <input v-model="name" type="text" name="login" placeholder="IDまたはメールアドレス" required/>
      <br>
      <input v-model="pass" type="password" name="password" placeholder="パスワード" required/>
      <button v-on:click="loginPost()" >ログイン</button>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      pass: ''
    }
  },
  methods: {
    loginPost: function () {
      Axios.post('/login', {
        name: this.name,
        pass: this.pass
      }).then(function (res) {
        console.log(res)
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
